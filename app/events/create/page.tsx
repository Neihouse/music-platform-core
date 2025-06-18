import { EventCreateForm } from "@/components/events/EventCreateForm";
import { createClient } from "@/utils/supabase/server";
import * as React from "react";

export interface IEventCreatePageProps {}

export default async function EventCreatePage({}: IEventCreatePageProps) {
  const supabase = await createClient();
  
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
