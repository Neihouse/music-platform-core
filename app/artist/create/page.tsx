import { ArtistForm } from "@/components/onboarding/ArtistForm";
import * as React from "react";

export interface IArtistCreatePageProps {}

export default async function ArtistCreatePage({}: IArtistCreatePageProps) {
  return (
    <div>
      <ArtistForm />
    </div>
  );
}