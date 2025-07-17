"use client";

import { requestToJoinPromoter } from "@/app/artist/actions";
import { Alert, Avatar, Button, Group, Loader, Modal, Paper, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconInfoCircle, IconUserPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";

type PromoterData = {
    id: string;
    name: string;
    bio?: string | null;
    user_id: string;
    avatarUrl?: string | null;
};

interface JoinRequestModalProps {
    promoter: PromoterData;
    opened: boolean;
    onClose: () => void;
}

const JoinRequestModal = ({ promoter, opened, onClose }: JoinRequestModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    const handleSubmitRequest = async () => {
        try {
            setIsLoading(true);
            await requestToJoinPromoter(promoter.id, promoter.user_id);

            setRequestSent(true);
            notifications.show({
                title: "Request Sent!",
                message: `Your request to join ${promoter.name} has been sent successfully.`,
                color: "green",
                icon: <IconCheck size={16} />,
            });

            // Close modal after a brief delay
            setTimeout(() => {
                onClose();
                setRequestSent(false); // Reset for next time
            }, 2000);
        } catch (error) {
            console.error("Error submitting join request:", error);

            const errorMessage = error instanceof Error ? error.message : "Failed to send request";

            notifications.show({
                title: "Error",
                message: errorMessage,
                color: "red",
                icon: <IconX size={16} />,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
            setRequestSent(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Request to Join Collective"
            centered
            size="md"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Stack gap="lg">
                {/* Promoter Info */}
                <Paper p="md" radius="lg" withBorder>
                    <Group gap="md">
                        <Avatar
                            src={promoter.avatarUrl}
                            size={60}
                            radius="xl"
                            style={{
                                border: "3px solid var(--mantine-color-orange-3)",
                            }}
                        >
                            {promoter.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                            <Title order={3} size="lg">
                                {promoter.name}
                            </Title>
                            {promoter.bio && (
                                <Text size="sm" c="dimmed" lineClamp={2}>
                                    {promoter.bio}
                                </Text>
                            )}
                        </div>
                    </Group>
                </Paper>

                {/* Request Info */}
                {!requestSent ? (
                    <>
                        <Alert
                            icon={<IconInfoCircle size={16} />}
                            title="Request to Join"
                            color="blue"
                            variant="light"
                        >
                            <Text size="sm">
                                By submitting this request, you're asking to join {promoter.name}'s collective.
                                They will be notified and can choose to accept or decline your request.
                            </Text>
                        </Alert>

                        <Text size="sm" c="dimmed">
                            Once accepted, you'll be able to collaborate on events and performances with this promoter collective.
                        </Text>
                    </>
                ) : (
                    <Alert
                        icon={<IconCheck size={16} />}
                        title="Request Sent Successfully!"
                        color="green"
                    >
                        <Text size="sm">
                            Your request has been sent to {promoter.name}. You'll be notified when they respond to your request.
                        </Text>
                    </Alert>
                )}

                {/* Action Buttons */}
                {!requestSent && (
                    <Group justify="flex-end" gap="md">
                        <Button
                            variant="light"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            leftSection={isLoading ? <Loader size={16} /> : <IconUserPlus size={16} />}
                            onClick={handleSubmitRequest}
                            loading={isLoading}
                            color="orange"
                        >
                            Send Request
                        </Button>
                    </Group>
                )}
            </Stack>
        </Modal>
    );
};

export default JoinRequestModal;
