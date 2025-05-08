"use server";
import { IAudioMetadata } from "music-metadata";
import { getArtist } from "./artists";
import { createArtistTrack } from "./artists_tracks";
import { TypedClient } from "@/utils/supabase/global.types";

export async function createTrack(
  supabase: TypedClient,
  metadata: IAudioMetadata,
  size: number
) {
  const artist = await getArtist(supabase);
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

    await createArtistTrack(artist.id, track.id);

    return track;
  } catch (error) {
    throw new Error("Error inserting track");
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
      `
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
