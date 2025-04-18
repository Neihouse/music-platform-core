"use server";
import { createClient } from "@/utils/supabase/server";
import { IAudioMetadata } from "music-metadata";

export async function createTrack(metadata: IAudioMetadata, size: number) {
  const supabase = await createClient();

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
    const track = await supabase
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

    return track;
  } catch (error) {
    console.log("Error inserting track metadata");
  }
}
