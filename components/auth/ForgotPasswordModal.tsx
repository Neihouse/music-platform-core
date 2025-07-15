"use client";
import { createClient } from "@/utils/supabase/client";
import {
    Alert,
    Button,
    Group,
    Modal,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { validateEmail } from "./validation";

interface ForgotPasswordModalProps {
    opened: boolean;
    onClose: () => void;
}

export function ForgotPasswordModal({ opened, onClose }: ForgotPasswordModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    const form = useForm({
        initialValues: {
            email: "",
        },
        validate: {
            email: (val: string) => validateEmail(val),
        },
    });

    const handleResetPassword = async (values: { email: string }) => {
        setLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(
                values.email,
                {
                    redirectTo: `${window.location.origin}/reset-password`,
                }
            );

            if (resetError) {
                if (resetError.message.includes("rate limit")) {
                    setError("Too many reset requests. Please wait before trying again.");
                } else if (resetError.message.includes("Invalid email")) {
                    setError("Please enter a valid email address.");
                } else {
                    setError("Failed to send reset email. Please try again.");
                }
                return;
            }

            setSuccess(true);
            form.reset();
        } catch (err) {
            console.error("Password reset error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        setSuccess(false);
        form.reset();
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Reset Password"
            centered
            size="sm"
        >
            {success ? (
                <Stack>
                    <Alert color="green">
                        <Text size="sm">
                            Password reset instructions have been sent to your email address.
                            Please check your inbox and follow the link to reset your password.
                        </Text>
                    </Alert>
                    <Button onClick={handleClose} fullWidth>
                        Close
                    </Button>
                </Stack>
            ) : (
                <form onSubmit={form.onSubmit(handleResetPassword)}>
                    <Stack>
                        <Text size="sm" c="dimmed">
                            Enter your email address and we'll send you a link to reset your password.
                        </Text>

                        <TextInput
                            label="Email"
                            placeholder="your-email@example.com"
                            required
                            {...form.getInputProps("email")}
                        />

                        {error && (
                            <Alert color="red">
                                {error}
                            </Alert>
                        )}

                        <Group justify="flex-end">
                            <Button variant="light" onClick={handleClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" loading={loading}>
                                Send Reset Link
                            </Button>
                        </Group>
                    </Stack>
                </form>
            )}
        </Modal>
    );
}
