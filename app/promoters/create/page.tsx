import { PromoterForm } from "@/components/onboarding/PromoterForm";
import * as React from "react";

export interface IPromoterOnboardingPageProps {}

export default async function PromoterOnboardingPage({}: IPromoterOnboardingPageProps) {
  return (
    <div>
      <PromoterForm />
    </div>
  );
}
