"use server";
import { formatDuration } from "@/lib/formatting";
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
    const track = await supabase
      .from("tracks")
      .insert({
        codec: codec!,
        channels: numberOfChannels,
        sample_rate: sampleRate,
        length: formatDuration(duration!),
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

export async function getTrackPlayURL(trackId: string) {
  const supabase = await createClient();

  const {
    data: { publicUrl },
  } = supabase.storage.from("tracks").getPublicUrl(trackId);

  const { data, error } = await supabase.rpc("increment_plays", {
    row_id: trackId,
  });

  console.log("Play increment result, error: ", data, error);

  return publicUrl;
}

export async function getTracks(includeArtists = false) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("tracks").select(`*`).limit(5);

  if (error) {
    console.log("error getting tracks");
  }

  return data;
}

export async function getTopTracks() {
  const supabase = await createClient();
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const timestamptzString = oneWeekAgo.toISOString();

  console.log("One week ago: ", timestamptzString);
  const { data, error } = await supabase
    .from("tracks")
    .select()
    .gte("created_at", timestamptzString)
    .order("plays", {
      ascending: false,
    });

  if (error) {
    console.error("Error getting top tracks: ", error);
  }

  if (!data || !data.length) {
    throw new Error("No data");
  }

  console.log("getTopTracks data: ", data);

  return data;
}
