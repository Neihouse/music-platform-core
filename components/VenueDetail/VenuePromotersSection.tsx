"use client";

import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Button,
  SimpleGrid,
  Center,
  ThemeIcon,
  Avatar,
  Paper,
} from "@mantine/core";
import {
  IconUsers,
  IconMail,
  IconUser,
  IconUserOff,
} from "@tabler/icons-react";
import { Promoter } from "@/utils/supabase/global.types";

interface VenuePromotersSectionProps {
  promoters: Promoter[];
  venueId: string;
}

export function VenuePromotersSection({
  promoters,
  venueId,
}: VenuePromotersSectionProps) {
  if (promoters.length === 0) {
    return (
      <Paper p="xl" radius="lg" withBorder style={{ background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" }}>
        <Center py="xl">
          <Stack align="center" gap="lg">
            <ThemeIcon size={80} variant="light" color="orange" radius="xl">
              <IconUserOff size={40} />
            </ThemeIcon>
            <div style={{ textAlign: "center" }}>
              <Text size="xl" fw={600} mb="sm">
                No promoters yet
              </Text>
              <Text size="md" c="dimmed" mb="lg">
                Connect with promoters to bring amazing events to your venue
              </Text>
            </div>
            <Button size="lg" gradient={{ from: "orange", to: "red" }}>
              Find Promoters
            </Button>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <div>
          <Title order={3} mb="xs">Working Promoters</Title>
          <Text c="dimmed">Our trusted event partners</Text>
        </div>
        <Button 
          size="md" 
          gradient={{ from: "teal", to: "blue" }}
          leftSection={<IconUsers size={18} />}
        >
          Invite Promoter
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
        {promoters.map((promoter) => (
          <PromoterCard key={promoter.id} promoter={promoter} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}

interface PromoterCardProps {
  promoter: any;
}

function PromoterCard({ promoter }: PromoterCardProps) {
  return (
    <Card 
      shadow="lg" 
      p="xl" 
      radius="xl" 
      withBorder 
      h="100%"
      style={{
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        transition: "transform 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Stack gap="lg" h="100%">
        <Group>
          <Avatar 
            size="xl" 
            radius="xl"
            gradient={{ from: "teal", to: "blue" }}
          >
            <IconUser size={32} />
          </Avatar>
          <div style={{ flex: 1 }}>
            <Title order={4} lineClamp={1} mb="xs">
              {promoter.name}
            </Title>
            <Badge 
              variant="light" 
              size="sm"
              gradient={{ from: "teal", to: "blue" }}
            >
              Active Promoter
            </Badge>
          </div>
        </Group>

        {promoter.bio && (
          <Text size="sm" c="dimmed" lineClamp={3} style={{ flexGrow: 1 }}>
            {promoter.bio}
          </Text>
        )}

        {promoter.contact_email && (
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="blue">
              <IconMail size={14} />
            </ThemeIcon>
            <Text size="sm" lineClamp={1} style={{ flex: 1 }}>
              {promoter.contact_email}
            </Text>
          </Group>
        )}

        <Group justify="space-between" mt="auto">
          <Button 
            variant="light" 
            size="sm"
            gradient={{ from: "teal", to: "blue" }}
          >
            View Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            color="teal"
          >
            Contact
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
