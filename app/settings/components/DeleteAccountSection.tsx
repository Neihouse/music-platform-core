"use client";

import { ThemedPaper } from "@/components/shared/ThemedPaper";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { deleteAccount } from "../actions";

export function DeleteAccountSection() {
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        setLoading(true);

        try {
            const result = await deleteAccount();

            if (result?.error) {
                notifications.show({
                    title: "Error",
                    message: result.error,
                    color: "red",
                    icon: <IconAlertTriangle size={16} />,
                });
            }
            // If successful, the action will redirect automatically
        } finally {
            setLoading(false);
            closeDeleteModal();
        }
    };

    return (
        <>
            <ThemedPaper variant="danger">
                <Stack gap="md">
                    <Group gap="xs" align="center">
                        <IconTrash size={20} color="var(--mantine-color-red-4)" />
                        <Text
                            fz={{ base: "lg", sm: "xl" }}
                            fw={600}
                            c="red.4"
                        >
                            Delete Account
                        </Text>
                    </Group>

                    <Text
                        fz={{ base: "sm", sm: "md" }}
                        c="gray.4"
                    >
                        This action cannot be undone. All your data will be permanently deleted.
                    </Text>

                    <Button
                        color="red"
                        variant="outline"
                        onClick={openDeleteModal}
                        size="md"
                        w={{ base: "100%", sm: "auto" }}
                        leftSection={<IconTrash size={16} />}
                    >
                        Delete Account
                    </Button>
                </Stack>
            </ThemedPaper>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={deleteModalOpened}
                onClose={closeDeleteModal}
                title="Delete Account"
                centered
                size="md"
                styles={{
                    content: {
                        backgroundColor: "var(--mantine-color-dark-8)",
                    },
                    header: {
                        backgroundColor: "var(--mantine-color-dark-8)",
                        color: "var(--mantine-color-gray-0)",
                    },
                    title: {
                        fontWeight: 600,
                        fontSize: "var(--mantine-font-size-lg)",
                    },
                }}
            >
                <Stack gap="md">
                    <Text c="gray.2">
                        Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
                    </Text>

                    <Group
                        justify="flex-end"
                        mt="md"
                        gap="sm"
                    >
                        <Button
                            variant="default"
                            onClick={closeDeleteModal}
                            size="sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            onClick={handleDeleteAccount}
                            loading={loading}
                            size="sm"
                        >
                            Delete Account
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
