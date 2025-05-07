import { FanForm } from "@/components/onboarding/FanForm";
import * as React from "react";

export interface IFanOnboardingPageProps {}

export default async function FanOnboardingPage({}: IFanOnboardingPageProps) {
  return (
    <div>
      <FanForm />
    </div>
  );
}
