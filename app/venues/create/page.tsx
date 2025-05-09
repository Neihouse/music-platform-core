import { VenueForm } from "@/components/onboarding/VenueForm";
import * as React from "react";

export interface IVenueOnboardingPageProps {}

export default async function VenueOnboardingPage({}: IVenueOnboardingPageProps) {
  return (
    <div>
      <VenueForm />
    </div>
  );
}
