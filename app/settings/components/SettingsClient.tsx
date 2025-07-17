"use client";

import { ArtistWithLocation } from "@/db/queries/artists";
import { Container, Stack, Title } from "@mantine/core";
import { DashboardSection } from "./DashboardSection";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { EmailSection } from "./EmailSection";
import { PasswordSection } from "./PasswordSection";
import { UserTypeOnboarding } from "./UserTypeOnboarding";

interface SettingsClientProps {
    userEmail: string;
    showOnboarding: boolean;
    artist: ArtistWithLocation | null;
    promoter: any | null; // TODO: Add proper promoter type
}

export function SettingsClient({ userEmail, showOnboarding, artist, promoter }: SettingsClientProps) {
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

                {showOnboarding && <UserTypeOnboarding />}

                {(artist || promoter) && <DashboardSection artist={artist} promoter={promoter} />}

                <EmailSection userEmail={userEmail} />
                <PasswordSection />
                <DeleteAccountSection />
            </Stack>
        </Container>
    );
}
