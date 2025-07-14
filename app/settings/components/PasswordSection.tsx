"use client";

import { ThemedPaper } from "@/components/shared/ThemedPaper";
import { Button, PasswordInput, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { updatePassword } from "../actions";

export function PasswordSection() {
    const [loading, setLoading] = useState(false);

    const handlePasswordUpdate = async (formData: FormData) => {
        setLoading(true);

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
            setLoading(false);
        }
    };

    return (
        <ThemedPaper>
            <Stack gap="md">
                <Text
                    fz={{ base: "lg", sm: "xl" }}
                    fw={600}
                    c="gray.0"
                >
                    Password
                </Text>

                <form id="password-form" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handlePasswordUpdate(formData);
                }}>
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
                            loading={loading}
                            size="md"
                            w={{ base: "100%", sm: "auto" }}
                        >
                            Update Password
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </ThemedPaper>
    );
}
