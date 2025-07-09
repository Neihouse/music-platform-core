import { EventForm } from "@/components/events/EventCreateForm";
import { getUserProfile } from "@/db/queries/user";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { Button, Center, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreateEventPage() {
    const supabase = await createClient();
    const user = await getUser(supabase);

    // Redirect if not authenticated
    if (!user) {
        redirect('/login');
    }

    // Check if user has a promoter profile
    const userProfile = await getUserProfile(supabase);

    if (userProfile.type !== 'promoter') {
        return (
            <Container size="md" py="xl">
                <Paper withBorder radius="md" p="lg" shadow="md">
                    <Stack gap="md" ta="center">
                        <Center>
                            <IconUser size={48} stroke={1.5} color="gray" />
                        </Center>
                        <Title order={2} size="h3">
                            Promoter Access Required
                        </Title>
                        <Text c="dimmed" size="sm">
                            Only promoters can create events. Please create a promoter profile to access this feature.
                        </Text>
                        <Button component={Link} href="/onboarding" variant="light">
                            Create Promoter Profile
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    return (
        <EventForm />
    );
}