import { LocationInput } from "@/components/LocationInput/LocationInput";
import { PlacesApiProvider } from "@/components/LocationInput/Provider";
import { createClient } from "@/utils/supabase/server";
import { Button, Collapse, Group, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import * as React from "react";

export interface IOnboardingPageProps {}

export default async function OnboardingPage({}: IOnboardingPageProps) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }
  const { data: artist } = await supabase
    .from("artists")
    .select()
    .eq("user_id", user.user.id)
    .single();

  return (
    <div>
      <Stack>
        <Group>
          <Title>Where are you located?</Title>
          <PlacesApiProvider>
            <LocationInput />
          </PlacesApiProvider>
        </Group>
        <Collapse in={!artist}>
          <Stack>
            <Title>Are you an Artist?</Title>
            <Text>
              <em>
                Artists can upload music and play at venues through Promoters
              </em>
            </Text>
            <Group>
              <Button href="/onboarding/artist" component={Link}>
                Yes
              </Button>
              <Button>No</Button>
            </Group>
          </Stack>
        </Collapse>

        {/* <Stack>
          <Title>Are you a Promoter?</Title>
          <Text>
            <em>Promoters can book artists and venues</em>
          </Text>
          <Group>
            <Button href="/onboarding/promoter" component={Link}>
              Yes
            </Button>
            <Button>No</Button>
          </Group>
        </Stack> */}
      </Stack>
    </div>
  );
}
