"use client";

import { nameToUrl } from "@/lib/utils";
import { Avatar, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconMapPin, IconUser, IconUserPlus, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { PromoterWithLocation } from "./hooks/useArtistPromoters";

interface PromoterCardProps {
    promoter: PromoterWithLocation;
    getLocationText: (promoter: PromoterWithLocation) => string;
    onJoinRequest: (promoter: PromoterWithLocation) => void;
    onCancelRequest: (requestId: string) => Promise<void>;
    pendingRequest?: { id: string; status: string } | undefined;
}

export default function PromoterCard({
    promoter,
    getLocationText,
    onJoinRequest,
    onCancelRequest,
    pendingRequest
}: PromoterCardProps) {
    return (
        <Card
            p={{ base: "sm", sm: "md", lg: "lg" }}
            radius="xl"
            withBorder
            h="100%"
            style={{
                transition: "all 0.2s ease",
                cursor: "pointer",
            }}
            styles={{
                root: {
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                    },
                },
            }}
        >
            <Stack gap="md" h="100%" justify="space-between">
                {/* Header with Avatar and Info */}
                <Stack gap="sm">
                    <Group gap="md" wrap="nowrap">
                        <Avatar
                            src={promoter.avatarUrl}
                            alt={promoter.name}
                            size={60}
                            radius="xl"
                            style={{ flexShrink: 0 }}
                        />
                        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                            <Title
                                order={4}
                                size="lg"
                                lineClamp={1}
                                style={{ lineHeight: 1.2 }}
                            >
                                {promoter.name}
                            </Title>
                            <Group gap={4} wrap="nowrap">
                                <IconMapPin size={14} style={{ color: "var(--mantine-color-gray-6)", flexShrink: 0 }} />
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    lineClamp={1}
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    {getLocationText(promoter)}
                                </Text>
                            </Group>
                        </Stack>
                    </Group>

                    {/* Bio */}
                    {promoter.bio && (
                        <Text
                            size="sm"
                            c="dimmed"
                            lineClamp={3}
                            style={{
                                fontSize: "0.8rem",
                                lineHeight: 1.4,
                            }}
                        >
                            {promoter.bio}
                        </Text>
                    )}
                </Stack>

                {/* Action Buttons */}
                <Stack gap="xs" w="100%">
                    <Button
                        variant="light"
                        size="sm"
                        fullWidth
                        leftSection={<IconUser size={16} />}
                        component={Link}
                        href={`/promoters/${nameToUrl(promoter.name)}`}
                    >
                        View Profile
                    </Button>
                    <Button
                        size="sm"
                        fullWidth
                        leftSection={pendingRequest ? <IconX size={16} /> : <IconUserPlus size={16} />}
                        color={pendingRequest ? "red" : "orange"}
                        onClick={async () => {
                            if (pendingRequest) {
                                // Cancel existing request using the handler from parent
                                await onCancelRequest(pendingRequest.id);
                            } else {
                                // Create new request
                                onJoinRequest(promoter);
                            }
                        }}
                    >
                        {pendingRequest ? "Cancel Request" : "Request to Join"}
                    </Button>
                </Stack>
            </Stack>
        </Card>
    );
}
