import { ArtistForm } from "@/components/onboarding/ArtistForm";

import * as React from "react";

export interface IArtistOnboardingPageProps {}

export default async function ArtistOnboardingPage({}: IArtistOnboardingPageProps) {
  return (
    <div>
      <ArtistForm />
    </div>
  );
}
