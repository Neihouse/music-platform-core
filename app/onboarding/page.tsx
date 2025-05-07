import { createClient } from "@/utils/supabase/server";
import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  SimpleGrid,
  rem,
  Card,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconMicrophone,
  IconUsers,
  IconTicket,
  IconBuilding,
  IconArrowRight,
  IconCalendarEvent,
} from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";

export interface IOnboardingPageProps {}

export default async function OnboardingPage({}: IOnboardingPageProps) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }
  const { data: artist } = await supabase
    .from("artists")
    .select()
    .eq("user_id", user.user.id)
    .single();

  // Define the user type options with their details
  const userTypes = [
    {
      title: "Fan",
      icon: IconUsers,
      description: "Discover and enjoy new music",
      href: "/fan/create",
      color: "green",
    },
    {
      title: "Artist",
      icon: IconMicrophone,
      description: "Upload and share your music with fans",
      href: "/artist/create",
      color: "blue",
    },
    {
      title: "Promoter",
      icon: IconTicket,
      description: "Promote events and artists",
      href: "/fan/create",
      color: "orange",
    },
    {
      title: "Venue",
      icon: IconBuilding,
      description: "Host events and performances",
      href: "/venue/create",
      color: "violet",
    },
    // {
    //   title: "Event",
    //   icon: IconCalendarEvent,
    //   description: "Weddings, parties, and more",
    //   href: "/event/create",
    //   color: "pink",
    // },
  ];

  return (
    <Container size="md" py={rem(40)}>
      <Paper withBorder radius="md" p="lg" shadow="md">
        <Stack gap="md">
          <div>
            <Title order={2} ta="center" mb="xs">
              Welcome to MusicApp
            </Title>
            <Text ta="center" size="md" c="dimmed">
              Tell us how you want to use our platform
            </Text>
          </div>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {userTypes.map((type) => (
              <Card
                key={type.title}
                padding="md"
                radius="md"
                withBorder
                component={Link}
                href={type.href}
                style={{
                  textDecoration: "none",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                className="hover:shadow-lg hover:-translate-y-1"
              >
                <Group wrap="nowrap" align="flex-start" gap="xs">
                  <ThemeIcon
                    size={rem(36)}
                    radius="md"
                    color={type.color}
                    variant="light"
                  >
                    <type.icon size={rem(20)} stroke={1.5} />
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={500} size="md">
                      {type.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {type.description}
                    </Text>
                  </Box>
                  <Button
                    variant="subtle"
                    color={type.color}
                    size="compact-sm"
                    rightSection={<IconArrowRight size={14} />}
                  >
                    Go
                  </Button>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Paper>
    </Container>
  );
}
