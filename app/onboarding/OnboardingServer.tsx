import { getUserProfile, userHasProfile } from "@/db/queries/user";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { Container, Paper, Title, Text, Button, Stack } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  
  if (!user) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder radius="md" p="lg" shadow="md">
          <Stack gap="md" ta="center">
            <Title order={2} c="red">Access Denied</Title>
            <Text>You must be logged in to access the onboarding process.</Text>
            <Button component={Link} href="/login">
              Go to Login
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const hasProfile = await userHasProfile(supabase);
  const userProfile = await getUserProfile(supabase);
  
  if (hasProfile) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder radius="md" p="lg" shadow="md">
          <Stack gap="md" ta="center">
            <Title order={2} c="blue">Profile Already Created</Title>
            <Text>
              You already have a {userProfile.type} profile. Each user can only have one profile type.
            </Text>
            <Button 
              component={Link} 
              href="/dashboard"
              leftSection={<IconArrowLeft size={16} />}
            >
              Go to Dashboard
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return <OnboardingClient />;
}
