import { VenueForm } from "@/components/forms/VenueForm";

export interface IVenueOnboardingPageProps { }

export default async function VenueOnboardingPage({ }: IVenueOnboardingPageProps) {
  return (
    <div>
      <VenueForm />
    </div>
  );
}
