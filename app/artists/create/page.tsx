import { ArtistForm } from "@/components/onboarding/ArtistForm";
import { getArtist } from "@/db/queries/artists";
import { getUser } from "@/db/queries/users";
import { canCreateProfile } from "@/db/queries/user";
import { createClient } from "@/utils/supabase/server";
import { Container, Paper, Title, Text, Button, Stack } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";

export interface IArtistCreatePageProps { }

export default async function ArtistCreatePage({ }: IArtistCreatePageProps) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  
  if (!user) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder radius="md" p="lg" shadow="md">
          <Stack gap="md" ta="center">
            <Title order={2} c="red">Access Denied</Title>
            <Text>You must be logged in to create an artist profile.</Text>
            <Button component={Link} href="/login">
              Go to Login
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const { canCreate, reason } = await canCreateProfile(supabase);
  
  if (!canCreate) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder radius="md" p="lg" shadow="md">
          <Stack gap="md" ta="center">
            <Title order={2} c="red">Cannot Create Artist Profile</Title>
            <Text>{reason}</Text>
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

  const artist = await getArtist(supabase);

  return (
    <div>
      <ArtistForm artist={artist || undefined} />
    </div>
  );
}
