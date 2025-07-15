import {
    Alert,
    Box,
    Button,
    Container,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import { IconAlertTriangle, IconHome, IconMail, IconRefresh } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Authentication Error - Myuzo",
    description: "There was an issue with your authentication link",
};

interface AuthErrorPageProps {
    searchParams: Promise<{
        type?: string;
        error?: string;
    }>;
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
    const { type, error } = await searchParams;

    // Determine the error message based on the type or error parameter
    const getErrorDetails = () => {
        if (type === "recovery" || error === "invalid_recovery_token") {
            return {
                title: "Invalid Password Reset Link",
                message: "This password reset link is either invalid, expired, or has already been used.",
                suggestion: "Please request a new password reset link to continue.",
                primaryAction: {
                    label: "Request New Password Reset",
                    href: "/login",
                    icon: IconMail
                }
            };
        }

        if (type === "email_verification" || error === "invalid_verification_token") {
            return {
                title: "Invalid Email Verification Link",
                message: "This email verification link is either invalid, expired, or has already been used.",
                suggestion: "Please check your email for a new verification link or sign up again.",
                primaryAction: {
                    label: "Go to Sign Up",
                    href: "/signup",
                    icon: IconRefresh
                }
            };
        }

        if (error === "expired_token") {
            return {
                title: "Expired Authentication Link",
                message: "This authentication link has expired for security reasons.",
                suggestion: "Please request a new link to continue.",
                primaryAction: {
                    label: "Try Again",
                    href: "/login",
                    icon: IconRefresh
                }
            };
        }

        // Generic error
        return {
            title: "Authentication Error",
            message: "There was a problem with your authentication link.",
            suggestion: "Please try the process again or contact support if the problem persists.",
            primaryAction: {
                label: "Go to Login",
                href: "/login",
                icon: IconRefresh
            }
        };
    };

    const errorDetails = getErrorDetails();

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
                maw={{ base: "100%", xs: 500, sm: 450 }}
                mx="auto"
            >
                <Paper
                    radius="lg"
                    p={{ base: "xl", sm: "2xl" }}
                    withBorder
                    shadow="sm"
                    style={(theme) => ({
                        background: `linear-gradient(135deg, ${theme.colors.gray[0]} 0%, ${theme.colors.gray[1]} 100%)`,
                        border: `1px solid ${theme.colors.gray[3]}`,
                    })}
                >
                    <Stack align="center" gap="xl">
                        {/* Error Icon */}
                        <ThemeIcon
                            size={80}
                            radius="xl"
                            variant="light"
                            color="red"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%)',
                                border: '2px solid rgba(255, 107, 107, 0.2)'
                            }}
                        >
                            <IconAlertTriangle size={40} />
                        </ThemeIcon>

                        {/* Title */}
                        <Title
                            order={1}
                            size="h2"
                            ta="center"
                            style={(theme) => ({
                                color: theme.colors.dark[8],
                                fontWeight: 700,
                                letterSpacing: '-0.025em',
                            })}
                        >
                            {errorDetails.title}
                        </Title>

                        {/* Error Message */}
                        <Alert
                            color="red"
                            variant="light"
                            w="100%"
                            radius="md"
                            style={{
                                backgroundColor: 'rgba(255, 107, 107, 0.05)',
                                border: '1px solid rgba(255, 107, 107, 0.2)',
                            }}
                        >
                            <Stack gap="md">
                                <Text size="md" fw={500}>
                                    {errorDetails.message}
                                </Text>
                                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                                    {errorDetails.suggestion}
                                </Text>
                            </Stack>
                        </Alert>

                        <Divider w="100%" color="gray.3" />

                        {/* Action Buttons */}
                        <Stack gap="md" w="100%">
                            <Button
                                component={Link}
                                href={errorDetails.primaryAction.href}
                                variant="filled"
                                size="md"
                                leftSection={<errorDetails.primaryAction.icon size={18} />}
                                fullWidth
                                radius="md"
                                style={{
                                    background: 'linear-gradient(135deg, #339af0 0%, #228be6 100%)',
                                    border: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                {errorDetails.primaryAction.label}
                            </Button>

                            <Button
                                component={Link}
                                href="/"
                                variant="light"
                                size="md"
                                leftSection={<IconHome size={18} />}
                                fullWidth
                                radius="md"
                                color="gray"
                                style={{
                                    fontWeight: 500,
                                }}
                            >
                                Return to Home
                            </Button>
                        </Stack>

                        {/* Support Link */}
                        <Group gap="xs" style={{ marginTop: '1rem' }}>
                            <Text size="sm" c="dimmed">
                                Still having trouble?
                            </Text>
                            <Button
                                component={Link}
                                href="/contact"
                                variant="subtle"
                                size="sm"
                                color="blue"
                                style={{
                                    padding: 0,
                                    height: 'auto',
                                    fontWeight: 500,
                                    textDecoration: 'underline',
                                }}
                            >
                                Contact Support
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );
}
