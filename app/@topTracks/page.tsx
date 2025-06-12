import { getTracks } from "@/db/queries/tracks";
import { createClient } from "@/utils/supabase/server";
import * as React from "react";

export interface ITopTracksPageProps {}

export default async function TopTracksPage(props: ITopTracksPageProps) {
  const tracks = await getTracks(await createClient());


  return <div></div>;
  //   return (
  //     <Stack gap="md">
  //       <Title order={2}>Top Tracks</Title>
  //       {tracks?.map((track) => (
  //         <TopTrackItem
  //           key={track.id}
  //           track={track}
  //           artists={[{ name: "Test" }] as Artist[]}
  //         />
  //       ))}
  //     </Stack>
  //   );
}
