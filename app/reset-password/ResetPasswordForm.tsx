"use client";

import {
    Alert,
    Button,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { resetPassword } from "./actions";

interface ResetPasswordFormProps {
    accessToken: string;
    refreshToken: string;
}

export default function ResetPasswordForm({ accessToken, refreshToken }: ResetPasswordFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validate: {
            password: (val: string) => {
                if (!val.length) return "Password is required";
                if (val.length < 6) return "Password must be at least 6 characters";
                return null;
            },
            confirmPassword: (val: string, values: { password: string; confirmPassword: string }) => {
                if (!val.length) return "Please confirm your password";
                if (val !== values.password) return "Passwords do not match";
                return null;
            },
        },
    });

    const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
        setError(null);

        startTransition(async () => {
            const result = await resetPassword(accessToken, refreshToken, values.password);

            if (result.error) {
                setError(result.error);
            } else if (result.success) {
                setSuccess(true);
                // Redirect to login page after successful password reset
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            }
        });
    };

    if (success) {
        return (
            <Stack>
                <Alert color="green">
                    <Text size="sm">
                        Password reset successful! You will be redirected to the login page in a few seconds.
                    </Text>
                </Alert>
                <Button onClick={() => router.push("/login")} fullWidth>
                    Go to Login
                </Button>
            </Stack>
        );
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <Text size="sm" c="dimmed">
                    Enter your new password below.
                </Text>

                {error && (
                    <Alert color="red">
                        {error}
                    </Alert>
                )}

                <TextInput
                    label="New Password"
                    placeholder="Enter your new password"
                    type="password"
                    required
                    {...form.getInputProps("password")}
                />

                <TextInput
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    type="password"
                    required
                    {...form.getInputProps("confirmPassword")}
                />

                <Button type="submit" loading={isPending} fullWidth>
                    Update Password
                </Button>
            </Stack>
        </form>
    );
}
