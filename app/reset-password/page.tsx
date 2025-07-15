"use client";
import { createClient } from "@/utils/supabase/client";
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validToken, setValidToken] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

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

    useEffect(() => {
        // Check if we have the necessary URL parameters from the password reset email
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const type = searchParams.get("type");

        if (type === "recovery" && accessToken && refreshToken) {
            // Set the session with the tokens from the URL
            supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            }).then(({ error }) => {
                if (error) {
                    setError("Invalid or expired reset link. Please request a new password reset.");
                } else {
                    setValidToken(true);
                }
            });
        } else {
            setError("Invalid reset link. Please request a new password reset.");
        }
    }, [searchParams, supabase.auth]);

    const handleResetPassword = async (values: { password: string }) => {
        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: values.password,
            });

            if (updateError) {
                if (updateError.message.includes("New password should be different")) {
                    setError("New password must be different from your current password.");
                } else if (updateError.message.includes("Password should be")) {
                    setError("Password does not meet security requirements.");
                } else {
                    setError("Failed to update password. Please try again.");
                }
                return;
            }

            setSuccess(true);

            // Redirect to login page after successful password reset
            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (err) {
            console.error("Password reset error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRequestNewReset = () => {
        router.push("/login");
    };

    if (!validToken && !error) {
        return (
            <Container size="sm" py="xl">
                <Paper radius="md" p="xl" withBorder>
                    <Text>Verifying reset link...</Text>
                </Paper>
            </Container>
        );
    }

    return (
        <Container
            size="sm"
            px={{ base: "md", sm: "xl" }}
            py={{ base: "xl", sm: "3xl" }}
            style={{
                minHeight: 'calc(100vh - 60px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box
                w="100%"
                maw={{ base: "100%", xs: 480, sm: 400 }}
                mx="auto"
            >
                <Paper radius="md" p={{ base: "md", sm: "xl" }} withBorder>
                    <Title order={2} size="h3" mb="md">
                        Reset Your Password
                    </Title>

                    {error ? (
                        <Stack>
                            <Alert color="red">
                                {error}
                            </Alert>
                            <Button onClick={handleRequestNewReset} fullWidth>
                                Back to Login
                            </Button>
                        </Stack>
                    ) : success ? (
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
                    ) : (
                        <form onSubmit={form.onSubmit(handleResetPassword)}>
                            <Stack>
                                <Text size="sm" c="dimmed">
                                    Enter your new password below.
                                </Text>

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

                                <Button type="submit" loading={loading} fullWidth>
                                    Update Password
                                </Button>
                            </Stack>
                        </form>
                    )}
                </Paper>
            </Box>
        </Container>
    );
}
