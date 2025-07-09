import { getEvents } from "@/db/queries/events";
import { getUserProfile } from "@/db/queries/user";
import { createClient } from "@/utils/supabase/server";
import { Button, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import Link from "next/link";
import EventsGrid from "@/components/events/EventsGrid";
import EventsHeader from "@/components/events/EventsHeader";

export default async function EventsPage() {
  const supabase = await createClient();
  const userProfile = await getUserProfile(supabase);
  const events = await getEvents(supabase);

  return (
    <Container size="xl" py={{ base: "md", sm: "xl" }}>
      <Stack gap={{ base: "md", sm: "xl" }}>
        {/* Header Section */}
        <EventsHeader events={events} />

        {events.length === 0 ? (
          <Paper shadow="sm" p="xl" style={{ textAlign: "center" }}>
            <Stack gap="md" align="center">
              <IconCalendar size={48} stroke={1} color="#868e96" />
              <Title order={3} c="dimmed">No events yet</Title>
              {userProfile?.type === 'promoter' ? (
                <>
                  <Text c="dimmed">Create your first event to get started with lineup planning</Text>
                  <Button
                    component={Link}
                    href="/promoter/events/create"
                  >
                    Create Your First Event
                  </Button>
                </>
              ) : (
                <Text c="dimmed">
                  {userProfile?.type === 'artist'
                    ? "Events will appear here once collectives start creating them"
                    : "Only collectives can create events. Sign up as a collective to start planning events."
                  }
                </Text>
              )}
            </Stack>
          </Paper>
        ) : (
          <EventsGrid events={events} />
        )}
      </Stack>
    </Container>
  );
}
