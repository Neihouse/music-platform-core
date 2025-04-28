"use server";
import { createClient } from "@/utils/supabase/server";
import { IAudioMetadata } from "music-metadata";
import { getArtist } from "./artists";
import { createArtistTrack } from "./artists_tracks";

export async function createTrack(metadata: IAudioMetadata, size: number) {
  const supabase = await createClient();
  const artist = await getArtist();
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
        length: duration,
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
