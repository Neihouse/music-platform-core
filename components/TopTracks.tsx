import { Card, Stack, Title } from "@mantine/core";
import * as React from "react";
import { TopTrackItem } from "./TopTrackItem";

export interface ITopTracksProps {
  tracks: any[];
}

export function TopTracks({ tracks }: ITopTracksProps) {
  return (
    <Stack gap="md">
      <Title order={2}>Top Tracks</Title>
      <Card padding="md" radius="md" withBorder>
        <Stack gap="xs">
          {tracks!.map((track) => (
            <TopTrackItem key={track.id} {...track} />
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
