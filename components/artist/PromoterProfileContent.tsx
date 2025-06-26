"use client";

import {
  Container,
  Grid,
  GridCol,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  Button,
  Card,
  Avatar,
  Paper,
  Center,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconUsers,
  IconCalendarEvent,
  IconMusic,
  IconMapPin,
  IconMail,
  IconPhone,
  IconSparkles,
  IconBolt,
  IconUserPlus,
} from "@tabler/icons-react";
import { nameToUrl } from "@/lib/utils";
import Link from "next/link";
import { Promoter } from "@/utils/supabase/global.types";

// Extended promoter type with additional properties needed for the profile
type PromoterWithProfile = Promoter & {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  promoters_localities?: Array<{
    localities: {
      id: string;
      name: string;
      administrative_areas: {
        id: string;
        name: string;
        countries: {
          id: string;
          name: string;
        };
      };
    };
  }>;
};

interface PromoterProfileContentProps {
  promoter: PromoterWithProfile;
}

export function PromoterProfileContent({ promoter }: PromoterProfileContentProps) {
  return (
    <Container size="xl" py="xl">
      {/* Hero Section */}
      <Paper
        radius="xl"
        p="xl"
        mb="xl"
        style={{
          background: promoter.bannerUrl 
            ? `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%), url(${promoter.bannerUrl}) center/cover`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          minHeight: "300px",
        }}
      >
        {/* Decorative elements */}
        <Box
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "150px",
            height: "150px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
            transform: "translate(-50%, 50%)",
          }}
        />
        
        <Grid align="center" style={{ position: "relative", zIndex: 1 }}>
          <GridCol span={{ base: 12, md: 8 }}>
            <Group gap="xl">
              <Avatar
                src={promoter.avatarUrl}
                size={120}
                radius="xl"
                style={{
                  border: "4px solid rgba(255,255,255,0.3)",
                  background: promoter.avatarUrl ? "transparent" : "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                }}
              >
                {!promoter.avatarUrl && <IconSparkles size={48} />}
              </Avatar>
              <Stack gap="md">
                <Group gap="md">
                  <Title order={1} size="3rem" fw={900}>
                    {promoter.name}
                  </Title>
                  <Badge
                    size="lg"
                    variant="light"
                    color="yellow"
                    leftSection={<IconBolt size={16} />}
                  >
                    COLLECTIVE
                  </Badge>
                </Group>
                <Group gap="lg">
                  <Text size="lg" fw={500}>
                    🎉 Promoting Events
                  </Text>
                  <Text size="lg" fw={500}>
                    🎵 Supporting Artists
                  </Text>
                  {promoter.promoters_localities && promoter.promoters_localities.length > 0 && (
                    <Text size="lg" fw={500}>
                      📍 {promoter.promoters_localities.length} Location{promoter.promoters_localities.length > 1 ? 's' : ''}
                    </Text>
                  )}
                </Group>
                {promoter.bio && (
                  <Text size="md" style={{ maxWidth: "600px" }}>
                    {promoter.bio}
                  </Text>
                )}
              </Stack>
            </Group>
          </GridCol>
          <GridCol span={{ base: 12, md: 4 }}>
            <Stack gap="md" align="center">
              <Button
                size="xl"
                variant="white"
                color="dark"
                leftSection={<IconUserPlus size={24} />}
                style={{
                  background: "linear-gradient(45deg, #ff6b35, #f7931e)",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "18px",
                  padding: "16px 32px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                Request to Join!
              </Button>
            </Stack>
          </GridCol>
        </Grid>
      </Paper>

      {/* Details Section */}
      <Grid gutter="xl">
        {/* Contact Information */}
        <GridCol span={{ base: 12, md: 6 }}>
          <Card p="xl" radius="xl" withBorder>
            <Group justify="space-between" mb="lg">
              <Title order={3} fw={700}>
                📞 Contact Information
              </Title>
            </Group>
            <Stack gap="md">
              {promoter.email && (
                <Group gap="md">
                  <ThemeIcon size="lg" variant="light" color="blue" radius="xl">
                    <IconMail size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" c="dimmed">Email</Text>
                    <Text fw={600}>{promoter.email}</Text>
                  </div>
                </Group>
              )}
              {promoter.phone && (
                <Group gap="md">
                  <ThemeIcon size="lg" variant="light" color="green" radius="xl">
                    <IconPhone size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" c="dimmed">Phone</Text>
                    <Text fw={600}>{promoter.phone}</Text>
                  </div>
                </Group>
              )}
              {promoter.promoters_localities && promoter.promoters_localities.length > 0 && (
                <Group gap="md">
                  <ThemeIcon size="lg" variant="light" color="orange" radius="xl">
                    <IconMapPin size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" c="dimmed">Operating Locations</Text>
                    <Stack gap="xs">
                      {promoter.promoters_localities.slice(0, 3).map((location: any) => (
                        <Text key={location.localities.id} fw={600} size="sm">
                          {location.localities.name}
                        </Text>
                      ))}
                      {promoter.promoters_localities.length > 3 && (
                        <Text size="sm" c="dimmed">
                          +{promoter.promoters_localities.length - 3} more locations
                        </Text>
                      )}
                    </Stack>
                  </div>
                </Group>
              )}
            </Stack>
          </Card>
        </GridCol>

        {/* Statistics */}
        <GridCol span={{ base: 12, md: 6 }}>
          <Card p="xl" radius="xl" withBorder>
            <Group justify="space-between" mb="lg">
              <Title order={3} fw={700}>
                📊 Collective Stats
              </Title>
            </Group>
            <Stack gap="md">
              <Group justify="space-between">
                <Group gap="md">
                  <ThemeIcon size="lg" variant="light" color="blue" radius="xl">
                    <IconUsers size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" c="dimmed">Artists</Text>
                    <Text fw={700} size="lg">Building Network</Text>
                  </div>
                </Group>
              </Group>
              <Group justify="space-between">
                <Group gap="md">
                  <ThemeIcon size="lg" variant="light" color="green" radius="xl">
                    <IconCalendarEvent size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" c="dimmed">Events</Text>
                    <Text fw={700} size="lg">Organizing Shows</Text>
                  </div>
                </Group>
              </Group>
              <Group justify="space-between">
                <Group gap="md">
                  <ThemeIcon size="lg" variant="light" color="purple" radius="xl">
                    <IconMusic size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="sm" c="dimmed">Music</Text>
                    <Text fw={700} size="lg">Curating Sounds</Text>
                  </div>
                </Group>
              </Group>
            </Stack>
          </Card>
        </GridCol>
      </Grid>

      {/* Call to Action */}
      <Card p="xl" radius="xl" withBorder mt="xl" style={{ background: "linear-gradient(45deg, #667eea, #764ba2)", color: "white" }}>
        <Stack align="center" gap="md">
          <ThemeIcon size={60} radius="xl" variant="white" color="blue">
            <IconUserPlus size={30} />
          </ThemeIcon>
          <Title order={2} ta="center">Ready to Join This Collective?</Title>
          <Text ta="center" size="lg" opacity={0.9}>
            Connect with {promoter.name} and become part of their artist network. Submit a request to join their collective and start collaborating on amazing events!
          </Text>
          <Group gap="md">
            <Button 
              size="lg" 
              variant="white" 
              color="dark"
              leftSection={<IconUserPlus size={20} />}
            >
              Request to Join Collective
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              color="white"
              component={Link}
              href={`/promoters/${nameToUrl(promoter.name)}`}
            >
              View Full Profile
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}
