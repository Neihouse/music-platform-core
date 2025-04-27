import { ArtistForm } from "@/components/onboarding/ArtistForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import * as React from "react";

export interface IArtistOnboardingPageProps {}

export default async function ArtistOnboardingPage(
  props: IArtistOnboardingPageProps
) {
  return (
    <div>
      <ArtistForm />
    </div>
  );
}
