"use client";

import {
  Paper,
  Stack,
  Text,
  Title,
  Button,
  Group,
  rem,
} from "@mantine/core";
import {
  IconDashboard,
  IconSettings,
} from "@tabler/icons-react";
import { ArtistWithLocation } from "@/db/queries/artists";

interface DashboardSectionProps {
  artist: ArtistWithLocation | null;
  promoter: any | null; // TODO: Add proper promoter type
}

export function DashboardSection({ artist, promoter }: DashboardSectionProps) {
  const handleDashboardClick = () => {
    if (artist) {
      window.location.href = '/artist';
    } else if (promoter) {
      window.location.href = '/promoter';
    }
  };

  const handleSettingsClick = () => {
    if (artist) {
      window.location.href = `/artists/${artist.name}/edit`;
    } else if (promoter) {
      window.location.href = `/promoters/${promoter.name}/edit`;
    }
  };

  const entityType = artist ? 'Artist' : 'Promoter';
  const entityName = artist ? artist.name : promoter?.name;

  return (
    <Paper withBorder radius="md" p="lg" shadow="md">
      <Stack gap="md">
        <div>
          <Title order={3} mb="xs">
            {entityType} Dashboard
          </Title>
          <Text size="md" c="dimmed">
            Access your {entityType.toLowerCase()} dashboard and manage your profile
          </Text>
        </div>

        <Group gap="md">
          <Button
            leftSection={<IconDashboard size={rem(16)} />}
            variant="filled"
            onClick={handleDashboardClick}
          >
            Go to Dashboard
          </Button>
          
          <Button
            leftSection={<IconSettings size={rem(16)} />}
            variant="outline"
            onClick={handleSettingsClick}
          >
            Edit {entityType} Profile
          </Button>
        </Group>

        {entityName && (
          <Text size="sm" c="dimmed">
            Logged in as: <strong>{entityName}</strong>
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
