import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import {
  Container,
  Title,
  Button,
  Group,
  Card,
  Text,
  Stack,
} from "@mantine/core";
import { IconUpload, IconMusic } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUser(await createClient());
  if (!user) {
    redirect("/login");
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        Dashboard
      </Title>

      <Stack gap="xl">
        <Card withBorder shadow="sm" padding="xl" radius="md">
          <Group justify="space-between" align="center">
            <div>
              <Text fw={500} size="lg" mb={8}>
                Upload New Track
              </Text>
              <Text c="dimmed" size="sm">
                Share your music with the world
              </Text>
            </div>
            <Button
              leftSection={<IconUpload size={20} />}
              component={Link}
              href="/upload"
            >
              Upload Track
            </Button>
          </Group>
        </Card>

        <Card withBorder shadow="sm" padding="xl" radius="md">
          <Group justify="space-between" align="center">
            <div>
              <Text fw={500} size="lg" mb={8}>
                My Tracks
              </Text>
              <Text c="dimmed" size="sm">
                Manage your uploaded tracks
              </Text>
            </div>
            <Button
              variant="light"
              leftSection={<IconMusic size={20} />}
              component={Link}
              href="/my-tracks"
            >
              View Tracks
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}
