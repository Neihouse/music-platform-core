"use client";

import { getUser } from "@/db/queries/users";
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
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
    }
  }, [router]);

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
              onClick={() => router.push("/upload")}
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
              onClick={() => router.push("/my-tracks")}
            >
              View Tracks
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}
