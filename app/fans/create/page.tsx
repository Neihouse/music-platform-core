import { FanForm } from "@/components/forms/FanForm";

export interface IFanOnboardingPageProps { }

export default async function FanOnboardingPage({ }: IFanOnboardingPageProps) {
  return (
    <div>
      <FanForm />
    </div>
  );
}
