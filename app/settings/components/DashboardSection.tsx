"use client";

import { ArtistWithLocation } from "@/db/queries/artists";
import { Promoter } from "@/utils/supabase/global.types";
import {
    Avatar,
    Button,
    Group,
    Paper,
    rem,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import {
    IconDashboard,
    IconSettings,
    IconUser,
} from "@tabler/icons-react";

interface DashboardSectionProps {
    artist: (ArtistWithLocation & { avatarUrl?: string | null }) | null;
    promoter: (Promoter & { avatarUrl?: string | null }) | null;
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
                        Go to Profile
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
                    <Group gap="sm" align="center">
                        <Avatar
                            src={artist ? artist.avatarUrl : promoter?.avatarUrl}
                            size={40}
                            radius="xl"
                        >
                            <IconUser size={20} />
                        </Avatar>
                        <Text size="sm" c="dimmed">
                            Logged in as: <strong>{entityName}</strong>
                        </Text>
                    </Group>
                )}
            </Stack>
        </Paper>
    );
}
