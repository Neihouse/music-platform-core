import { EventCreateForm } from "@/components/events/EventCreateForm";
import { getUserProfile } from "@/db/queries/user";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export interface IEventCreatePageProps { }

export default async function EventCreatePage({ }: IEventCreatePageProps) {
  const supabase = await createClient();
  const userProfile = await getUserProfile(supabase);

  // Only allow promoters (collectives) to create events
  if (userProfile?.type !== 'promoter') {
    redirect('/events');
  }

  // Fetch venues for the form
  const { data: venues } = await supabase
    .from("venues")
    .select("id, name, address, capacity")
    .order("name");

  return (
    <div>
      <EventCreateForm venues={venues || []} />
    </div>
  );
}
