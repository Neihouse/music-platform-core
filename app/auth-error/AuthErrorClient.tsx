'use client';

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
    useMantineColorScheme,
} from "@mantine/core";
import { IconAlertTriangle, IconHome, IconMail, IconRefresh } from "@tabler/icons-react";
import Link from "next/link";

interface AuthErrorDetails {
    title: string;
    message: string;
    suggestion: string;
    primaryAction: {
        label: string;
        href: string;
        iconType: string;
    };
}

interface AuthErrorClientProps {
    errorDetails: AuthErrorDetails;
}

export default function AuthErrorClient({ errorDetails }: AuthErrorClientProps) {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    // Helper function to render the correct icon
    const renderIcon = (iconType: string) => {
        switch (iconType) {
            case "mail":
                return <IconMail size={18} />;
            case "refresh":
                return <IconRefresh size={18} />;
            case "home":
                return <IconHome size={18} />;
            default:
                return <IconRefresh size={18} />;
        }
    };

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
                        background: isDark 
                            ? `linear-gradient(135deg, ${theme.colors.dark[7]} 0%, ${theme.colors.dark[6]} 100%)`
                            : `linear-gradient(135deg, ${theme.colors.gray[0]} 0%, ${theme.colors.gray[1]} 100%)`,
                        border: isDark 
                            ? `1px solid ${theme.colors.dark[4]}`
                            : `1px solid ${theme.colors.gray[3]}`,
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
                                color: isDark ? theme.colors.gray[0] : theme.colors.dark[8],
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
                                backgroundColor: isDark 
                                    ? 'rgba(255, 107, 107, 0.15)' 
                                    : 'rgba(255, 107, 107, 0.05)',
                                border: isDark 
                                    ? '1px solid rgba(255, 107, 107, 0.3)' 
                                    : '1px solid rgba(255, 107, 107, 0.2)',
                            }}
                        >
                            <Stack gap="md" align="center">
                                <Text size="md" fw={500} ta="center">
                                    {errorDetails.message}
                                </Text>
                                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }} ta="center">
                                    {errorDetails.suggestion}
                                </Text>
                            </Stack>
                        </Alert>

                        <Divider w="100%" color={isDark ? "dark.4" : "gray.3"} />

                        {/* Action Buttons */}
                        <Stack gap="md" w="100%">
                            <Button
                                component={Link}
                                href={errorDetails.primaryAction.href}
                                variant="filled"
                                size="md"
                                leftSection={renderIcon(errorDetails.primaryAction.iconType)}
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
                                leftSection={renderIcon("home")}
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
