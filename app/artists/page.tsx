import * as React from "react";

export interface IArtistsPageProps {}

export default async function ArtistsPage(props: IArtistsPageProps) {
  const artist = await getArtist();
  return <div></div>;
}
