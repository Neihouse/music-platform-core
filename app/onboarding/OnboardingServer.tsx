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
              href={userProfile.type === 'artist' ? '/artist' : userProfile.type === 'promoter' ? '/promoter' : '/discover'}
              leftSection={<IconArrowLeft size={16} />}
            >
              {userProfile.type === 'artist' ? 'Go to Artist Dashboard' : userProfile.type === 'promoter' ? 'Go to Promoter Dashboard' : 'Go to Discover'}
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return <OnboardingClient />;
}
