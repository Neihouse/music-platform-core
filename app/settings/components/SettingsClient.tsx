"use client";

import { Container, Stack, Title } from "@mantine/core";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { EmailSection } from "./EmailSection";
import { PasswordSection } from "./PasswordSection";

interface SettingsClientProps {
    userEmail: string;
}

export function SettingsClient({ userEmail }: SettingsClientProps) {
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

                <EmailSection userEmail={userEmail} />
                <PasswordSection />
                <DeleteAccountSection />
            </Stack>
        </Container>
    );
}
