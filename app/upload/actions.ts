"use server";
import { createTrack } from "@/db/queries/tracks";
import { createAlbum } from "@/db/queries/albums";
import { createArtistTrack } from "@/db/queries/artists_tracks";
import { getArtist } from "@/db/queries/artists";
import { createClient } from "@/utils/supabase/server";
import { IAudioMetadata } from "music-metadata";
import { AlbumData, AlbumTrackWithMetadata } from "@/components/Upload/AlbumUpload/AlbumUploader";

export async function handleInsertTrack(
  metadata: IAudioMetadata,
  size: number,
) {
  const supabase = await createClient();

  return await createTrack(supabase, metadata, size);
}

export async function handleInsertAlbum(
  albumData: AlbumData,
  tracks: AlbumTrackWithMetadata[],
  albumArtUrl?: string
) {
  const supabase = await createClient();
  const artist = await getArtist(supabase);

  if (!artist) {
    throw new Error("Artist not found");
  }

  // Create the album first
  const album = await createAlbum(supabase, {
    title: albumData.title,
    // Note: The database schema only has id, title, and created_at
    // Additional fields like description, genre, etc. would need to be added to the schema
  });

  // Create tracks and link them to the album
  const createdTracks = [];

  for (const trackData of tracks) {
    const { metadata, file } = trackData;
    const {
      common: { title, artist: trackArtist, genre, year },
      format: {
        codec,
        numberOfChannels,
        sampleRate,
        bitrate,
        duration,
        container,
      },
    } = metadata;

    if (!duration) {
      throw new Error(`Duration is required for track: ${title || file.name}`);
    }

    // Create track with album_id
    const { data: track, error } = await supabase
      .from("tracks")
      .insert({
        codec: codec!,
        channels: numberOfChannels!,
        sample_rate: sampleRate,
        duration,
        size: file.size,
        container,
        bitrate,
        title: title || file.name,
        album_id: album.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating track: ${error.message}`);
    }

    // Link track to artist
    await createArtistTrack(supabase, artist.id, track.id);

    createdTracks.push(track);
  }

  return {
    album,
    tracks: createdTracks
  };
}
