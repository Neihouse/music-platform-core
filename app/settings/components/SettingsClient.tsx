"use client";

import {
    Button,
    Container,
    Group,
    Modal,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck, IconMail, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { deleteAccount, updateEmail, updatePassword } from "../actions";

interface SettingsClientProps {
    userEmail: string;
    userId: string;
}

export function SettingsClient({ userEmail, userId }: SettingsClientProps) {
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [loading, setLoading] = useState<{
        email: boolean;
        password: boolean;
        delete: boolean;
    }>({
        email: false,
        password: false,
        delete: false,
    });

    const handleEmailUpdate = async (formData: FormData) => {
        setLoading(prev => ({ ...prev, email: true }));

        try {
            const result = await updateEmail(formData);

            if (result.error) {
                notifications.show({
                    title: "Error",
                    message: result.error,
                    color: "red",
                    icon: <IconAlertTriangle size={16} />,
                });
            } else {
                notifications.show({
                    title: "Success",
                    message: result.success,
                    color: "green",
                    icon: <IconCheck size={16} />,
                });
            }
        } finally {
            setLoading(prev => ({ ...prev, email: false }));
        }
    };

    const handlePasswordUpdate = async (formData: FormData) => {
        setLoading(prev => ({ ...prev, password: true }));

        try {
            const result = await updatePassword(formData);

            if (result.error) {
                notifications.show({
                    title: "Error",
                    message: result.error,
                    color: "red",
                    icon: <IconAlertTriangle size={16} />,
                });
            } else {
                notifications.show({
                    title: "Success",
                    message: result.success,
                    color: "green",
                    icon: <IconCheck size={16} />,
                });
                // Reset form
                const form = document.getElementById("password-form") as HTMLFormElement;
                form?.reset();
            }
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(prev => ({ ...prev, delete: true }));

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
            setLoading(prev => ({ ...prev, delete: false }));
            closeDeleteModal();
        }
    };

    return (
        <Container
            size="md"
            py={{ base: "md", sm: "lg", md: "xl" }}
            px={{ base: "sm", sm: "md" }}
        >
            <Stack gap="xl">
                <Title
                    order={1}
                    fw={600}
                    c="gray.0"
                    fz={{ base: "xl", sm: "2xl", md: "3xl" }}
                >
                    Settings
                </Title>

                {/* Email Section */}
                <Paper
                    p={{ base: "md", sm: "lg" }}
                    radius="md"
                    bg="dark.8"
                    withBorder
                    style={{ borderColor: "var(--mantine-color-dark-6)" }}
                >
                    <Stack gap="md">
                        <Group gap="xs" align="center">
                            <IconMail size={20} color="var(--mantine-color-blue-4)" />
                            <Text
                                fz={{ base: "lg", sm: "xl" }}
                                fw={600}
                                c="gray.0"
                            >
                                Email
                            </Text>
                        </Group>

                        <form action={handleEmailUpdate}>
                            <Stack gap="md">
                                <TextInput
                                    name="email"
                                    placeholder="Enter new email address"
                                    defaultValue={userEmail}
                                    size="md"
                                    styles={{
                                        input: {
                                            backgroundColor: "var(--mantine-color-dark-7)",
                                            borderColor: "var(--mantine-color-dark-5)",
                                            color: "var(--mantine-color-gray-0)",
                                            "&:focus": {
                                                borderColor: "var(--mantine-color-blue-4)",
                                            },
                                        },
                                    }}
                                />
                                <Button
                                    type="submit"
                                    loading={loading.email}
                                    size="md"
                                    w={{ base: "100%", sm: "auto" }}
                                >
                                    Update Email
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>

                {/* Password Section */}
                <Paper
                    p={{ base: "md", sm: "lg" }}
                    radius="md"
                    bg="dark.8"
                    withBorder
                    style={{ borderColor: "var(--mantine-color-dark-6)" }}
                >
                    <Stack gap="md">
                        <Text
                            fz={{ base: "lg", sm: "xl" }}
                            fw={600}
                            c="gray.0"
                        >
                            Password
                        </Text>

                        <form id="password-form" action={handlePasswordUpdate}>
                            <Stack gap="md">
                                <PasswordInput
                                    name="currentPassword"
                                    placeholder="Current password"
                                    size="md"
                                    required
                                    styles={{
                                        input: {
                                            backgroundColor: "var(--mantine-color-dark-7)",
                                            borderColor: "var(--mantine-color-dark-5)",
                                            color: "var(--mantine-color-gray-0)",
                                            "&:focus": {
                                                borderColor: "var(--mantine-color-blue-4)",
                                            },
                                        },
                                    }}
                                />
                                <PasswordInput
                                    name="newPassword"
                                    placeholder="New password"
                                    size="md"
                                    required
                                    styles={{
                                        input: {
                                            backgroundColor: "var(--mantine-color-dark-7)",
                                            borderColor: "var(--mantine-color-dark-5)",
                                            color: "var(--mantine-color-gray-0)",
                                            "&:focus": {
                                                borderColor: "var(--mantine-color-blue-4)",
                                            },
                                        },
                                    }}
                                />
                                <PasswordInput
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    size="md"
                                    required
                                    styles={{
                                        input: {
                                            backgroundColor: "var(--mantine-color-dark-7)",
                                            borderColor: "var(--mantine-color-dark-5)",
                                            color: "var(--mantine-color-gray-0)",
                                            "&:focus": {
                                                borderColor: "var(--mantine-color-blue-4)",
                                            },
                                        },
                                    }}
                                />
                                <Button
                                    type="submit"
                                    loading={loading.password}
                                    size="md"
                                    w={{ base: "100%", sm: "auto" }}
                                >
                                    Update Password
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>

                {/* Delete Account Section */}
                <Paper
                    p={{ base: "md", sm: "lg" }}
                    radius="md"
                    bg="dark.8"
                    withBorder
                    style={{ borderColor: "var(--mantine-color-red-9)" }}
                >
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
                </Paper>
            </Stack>

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
                            loading={loading.delete}
                            size="sm"
                        >
                            Delete Account
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}
