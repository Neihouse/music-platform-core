import { TopTrackItem } from "@/components/TopTrackItem";
import { getTracks } from "@/db/queries/tracks";
import { Artist } from "@/utils/supabase/global.types";
import { Stack, Title } from "@mantine/core";
import * as React from "react";

export interface ITopTracksPageProps {}

export default async function TopTracksPage(props: ITopTracksPageProps) {
  const tracks = await getTracks();

  console.log("tracks: ", tracks);

  return (
    <Stack gap="md">
      <Title order={2}>Top Tracks</Title>
      {tracks?.map((track) => (
        <TopTrackItem track={track} artist={{ title: "Test" } as Artist} />
      ))}
    </Stack>
  );
}
