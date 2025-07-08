import { PromoterForm } from "@/components/onboarding/PromoterForm";
import { getUserProfile } from "@/db/queries/user";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { Button, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export interface IPromoterOnboardingPageProps { }

export default async function PromoterOnboardingPage({ }: IPromoterOnboardingPageProps) {
  const supabase = await createClient();
  const user = await getUser(supabase);

  if (!user) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder radius="md" p="lg" shadow="md">
          <Stack gap="md" ta="center">
            <Title order={2} c="red">Access Denied</Title>
            <Text>You must be logged in to create a promoter profile.</Text>
            <Button component={Link} href="/login">
              Go to Login
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Check if user already has a profile
  const userProfile = await getUserProfile(supabase);

  // If user is already a promoter, redirect to their edit page
  if (userProfile.type === 'promoter') {
    return (
      <Container size="md" py="xl">
        <Paper withBorder radius="md" p="lg" shadow="md">
          <Stack gap="md" ta="center">
            <Title order={2} c="blue">Promoter Profile Exists</Title>
            <Text>You already have a promoter profile. You can edit it here.</Text>
            <Button
              component={Link}
              href={`/promoters/${userProfile.name}/edit`}
              leftSection={<IconArrowLeft size={16} />}
            >
              Edit Your Profile
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <div>
      <PromoterForm />
    </div>
  );
}
