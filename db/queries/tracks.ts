import { IAudioMetadata } from "music-metadata";
import { getArtist } from "./artists";
import { createArtistTrack } from "./artists_tracks";
import { TypedClient } from "@/utils/supabase/global.types";

export async function createTrack(
  supabase: TypedClient,
  metadata: IAudioMetadata,
  size: number,
) {
  const artist = await getArtist(supabase);

  if (!artist) {
    throw new Error("Artist not found");
  }

  const {
    common: { title },
    format: {
      codec,
      numberOfChannels,
      sampleRate,
      bitrate,
      duration,
      container,
    },
  } = metadata;

  try {
    // TODO: Validation functions!!!!
    if (!duration) {
      throw new Error("Duration is required");
    }
    const { data: track, error } = await supabase
      .from("tracks")
      .insert({
        codec: codec!,
        channels: numberOfChannels!,
        sample_rate: sampleRate,
        duration,
        size,
        container,
        bitrate,
        title: title!,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    await createArtistTrack(supabase, artist.id, track.id);

    return track;
  } catch (error) {
    throw new Error("Error inserting track: " + error);
  }
}

export async function getTrackPlayURL(supabase: TypedClient, trackId: string) {
  if (!trackId) {
    throw new Error("Track ID is required");
  }
  const user = await supabase.auth.getUser();

  if (!user || !user.data.user) {
    throw new Error("User not authenticated");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("tracks").getPublicUrl(trackId);

  const { data, error } = await supabase.from("track_plays").insert({
    track: trackId,
    user: user.data.user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  return publicUrl;
}

export async function getTracks(supabase: TypedClient) {
  const { data: topTracks, error } = await supabase
    .from("tracks")
    .select(
      `
      *,
      play_count:track_plays!inner(count),
      artists_tracks (
        id,
        artist_id,
        artists (
          id,
          name
        )
      )
      `,
    )
    .limit(5);

  if (error) {
    console.log("error getting tracks: ", error);
  }

  const tracksWithArtists = topTracks?.map((track) => {
    const artists = track.artists_tracks.map((artistTrack) => {
      return artistTrack.artists;
    });

    return {
      ...track,
      plays: track.play_count[0].count,
      artists: artists.flat(),
    };
  });

  return tracksWithArtists;
}

export async function getTopTracks(supabase: TypedClient) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const timestamptzString = oneWeekAgo.toISOString();

  const { data, error } = await supabase
    .from("tracks")
    .select()
    .gte("created_at", timestamptzString)
    .order("plays", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !data.length) {
    throw new Error("No data");
  }

  return data;
}

export async function deleteTrack(supabase: TypedClient, trackId: string) {
  if (!trackId) {
    throw new Error("Track ID is required");
  }

  const user = await supabase.auth.getUser();
  if (!user || !user.data.user) {
    throw new Error("User not authenticated");
  }

  const userId = user.data.user.id;

  // Check if the user owns this track (through artist ownership)
  const { data: trackOwnership, error: ownershipError } = await supabase
    .from("tracks")
    .select(`
      id,
      artists_tracks (
        artist_id,
        artists (
          user_id
        )
      )
    `)
    .eq("id", trackId)
    .single();

  if (ownershipError) {
    throw new Error("Error checking track ownership: " + ownershipError.message);
  }

  // Verify the user owns this track through artist ownership
  const userOwnsTrack = trackOwnership?.artists_tracks?.some(
    (artistTrack: any) => artistTrack.artists?.user_id === userId
  );

  if (!userOwnsTrack) {
    throw new Error("You don't have permission to delete this track");
  }

  // Delete the track (this will cascade to delete related records)
  const { error: deleteError } = await supabase
    .from("tracks")
    .delete()
    .eq("id", trackId);

  if (deleteError) {
    throw new Error("Error deleting track: " + deleteError.message);
  }

  // Also delete the track file from storage
  const { error: storageError } = await supabase.storage
    .from("tracks")
    .remove([trackId]);

  if (storageError) {
    console.warn("Warning: Could not delete track file from storage:", storageError.message);
  }

  // Also delete the track image from storage if it exists
  const { error: imageError } = await supabase.storage
    .from("images")
    .remove([`tracks/${trackId}`]);

  if (imageError) {
    console.warn("Warning: Could not delete track image from storage:", imageError.message);
  }

  return { success: true };
}

export async function checkTrackOwnership(supabase: TypedClient, trackId: string): Promise<boolean> {
  if (!trackId) {
    return false;
  }

  const user = await supabase.auth.getUser();
  if (!user || !user.data.user) {
    return false;
  }

  const userId = user.data.user.id;

  try {
    const { data: trackOwnership, error } = await supabase
      .from("tracks")
      .select(`
        id,
        artists_tracks (
          artist_id,
          artists (
            user_id
          )
        )
      `)
      .eq("id", trackId)
      .single();

    if (error || !trackOwnership) {
      return false;
    }

    // Check if the user owns this track through artist ownership
    const userOwnsTrack = trackOwnership.artists_tracks?.some(
      (artistTrack: any) => artistTrack.artists?.user_id === userId
    );

    return Boolean(userOwnsTrack);
  } catch {
    return false;
  }
}

export async function getTrackWithPlayCount(supabase: TypedClient, trackId: string) {
  const { data, error } = await supabase
    .from("tracks")
    .select(`
      *,
      play_count:track_plays(count)
    `)
    .eq("id", trackId)
    .single();

  if (error) {
    throw new Error("Error fetching track: " + error.message);
  }

  return {
    ...data,
    plays: data.play_count?.length ? data.play_count[0].count : 0
  };
}

export async function getArtistTracksWithPlayCounts(supabase: TypedClient, artistId: string) {
  const { data, error } = await supabase
    .from("artists_tracks")
    .select(`
      track_id,
      tracks (
        *,
        play_count:track_plays(count)
      )
    `)
    .eq("artist_id", artistId);

  if (error) {
    throw new Error("Error fetching artist tracks: " + error.message);
  }

  return data?.map(item => {
    const track = item.tracks as any;
    if (!track) return null;
    
    return {
      ...track,
      plays: track.play_count?.length ? track.play_count[0].count || 0 : 0
    };
  }).filter(Boolean) || [];
}

export async function getPromoterPopularTracks(supabase: TypedClient, promoterId: string) {
  const { data, error } = await supabase
    .from("promoters_artists")
    .select(`
      artists (
        id,
        name,
        avatar_img,
        artists_tracks (
          tracks (
            *,
            play_count:track_plays(count)
          )
        )
      )
    `)
    .eq("promoter_id", promoterId)
    .limit(10);

  if (error) {
    console.error("Error fetching promoter popular tracks:", error);
    return [];
  }

  // Flatten and sort tracks by play count
  const allTracks: any[] = [];
  data?.forEach(pa => {
    pa.artists?.artists_tracks?.forEach(at => {
      if (at.tracks) {
        const track = at.tracks as any;
        allTracks.push({
          ...track,
          plays: track.play_count?.length ? track.play_count[0].count || 0 : 0,
          artist: pa.artists
        });
      }
    });
  });

  // Sort by play count and return top tracks
  return allTracks
    .sort((a, b) => (b.plays || 0) - (a.plays || 0))
    .slice(0, 6);
}
