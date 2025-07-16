"use client";

import { validateEmail } from "@/components/auth/validation";
import { ThemedPaper } from "@/components/shared/ThemedPaper";
import { Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck, IconMail } from "@tabler/icons-react";
import { useState } from "react";
import { updateEmail } from "../actions";

interface EmailSectionProps {
    userEmail: string;
}

export function EmailSection({ userEmail }: EmailSectionProps) {
    const [emailInput, setEmailInput] = useState(userEmail);
    const [loading, setLoading] = useState(false);

    // Check if email update should be enabled
    const isEmailUpdateEnabled = !validateEmail(emailInput) && emailInput !== userEmail;

    const handleEmailUpdate = async (formData: FormData) => {
        setLoading(true);

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
            setLoading(false);
        }
    };

    return (
        <ThemedPaper>
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

                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleEmailUpdate(formData);
                }}>
                    <Stack gap="md">
                        <TextInput
                            name="email"
                            placeholder="Enter new email address"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.currentTarget.value)}
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
                            loading={loading}
                            disabled={!isEmailUpdateEnabled}
                            size="md"
                            w={{ base: "100%", sm: "auto" }}
                        >
                            Update Email
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </ThemedPaper>
    );
}
