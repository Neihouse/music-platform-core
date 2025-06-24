"use client";

import {
  Container,
  Grid,
  GridCol,
  Title,
  Text,
  Group,
  Stack,
  Card,
  Badge,
  Button,
  Box,
  Paper,
  BackgroundImage,
  Overlay,
  Center,
  Space,
  Divider,
  ActionIcon,
  SimpleGrid,
  ThemeIcon,
} from "@mantine/core";
import Link from "next/link";
import {
  IconMapPin,
  IconUsers,
  IconCalendarEvent,
  IconPhone,
  IconMail,
  IconCamera,
  IconHistory,
  IconClock,
  IconStar,
  IconShare,
  IconHeart,
  IconEdit,
  IconMusic,
  IconTicket,
} from "@tabler/icons-react";
import { VenueEventsSection } from "./VenueEventsSection";
import { VenueGallerySection } from "./VenueGallerySection";
import { VenuePromotersSection } from "./VenuePromotersSection";
import { nameToUrl } from "@/lib/utils";

interface VenueDetailViewProps {
  venue: {
    id: string;
    name: string;
    description: string | null;
    address: string | null;
    capacity: number | null;
    contact_email: string | null;
    contact_phone: string | null;
    created_at: string;
  };
  upcomingEvents: any[];
  pastEvents: any[];
  promoters: any[];
  gallery: any[];
  isOwner?: boolean;
}

export function VenueDetailView({
  venue,
  upcomingEvents,
  pastEvents,
  promoters,
  gallery,
  isOwner = false,
}: VenueDetailViewProps) {
  return (
    <Box>
      {/* Modern Hero Section */}
      <Box
        style={{
          position: "relative",
          minHeight: "70vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Glass morphism container */}
        <Container size="xl" h="100%" style={{ position: "relative", zIndex: 2 }}>
          <Stack justify="center" h="70vh" gap="2rem">
            {/* Venue name with modern typography */}
            <Box ta="center">
              <Text
                size="1.2rem"
                fw={500}
                c="rgba(255, 255, 255, 0.8)"
                tt="uppercase"
                mb="md"
                style={{ letterSpacing: "2px" }}
              >
                Live Music Venue
              </Text>
              <Title
                order={1}
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 5rem)",
                  fontWeight: 300,
                  color: "white",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {venue.name}
              </Title>
            </Box>

            {/* Description with better styling */}
            {venue.description && (
              <Text
                size="1.25rem"
                ta="center"
                c="rgba(255, 255, 255, 0.9)"
                maw={700}
                mx="auto"
                lh={1.6}
                style={{
                  fontWeight: 300,
                }}
              >
                {venue.description}
              </Text>
            )}

            {/* Key venue details in a sleek format */}
            <Group justify="center" gap="3rem" mt="2rem">
              {venue.address && (
                <Group gap="xs" style={{ opacity: 0.9 }}>
                  <IconMapPin size={20} color="rgba(255, 255, 255, 0.8)" />
                  <Text c="white" size="sm" fw={500}>
                    {venue.address.split(',')[0]} {/* Show only first part of address */}
                  </Text>
                </Group>
              )}
              {venue.capacity && (
                <Group gap="xs" style={{ opacity: 0.9 }}>
                  <IconUsers size={20} color="rgba(255, 255, 255, 0.8)" />
                  <Text c="white" size="sm" fw={500}>
                    {venue.capacity.toLocaleString()} capacity
                  </Text>
                </Group>
              )}
            </Group>

            {/* Floating action buttons */}
            <Group justify="center" gap="md" mt="3rem">
              <Button
                size="lg"
                radius="xl"
                variant="white"
                color="dark"
                leftSection={<IconCalendarEvent size={20} />}
                style={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                }}
                px="xl"
              >
                Book Event
              </Button>
              
              {/* Edit button - only show for venue owner */}
              {isOwner && (
                <Button
                  component={Link}
                  href={`/venues/${nameToUrl(venue.name)}/edit`}
                  size="lg"
                  radius="xl"
                  variant="light"
                  color="yellow"
                  leftSection={<IconEdit size={20} />}
                  style={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    transition: "all 0.3s ease",
                  }}
                  px="xl"
                >
                  Edit Venue
                </Button>
              )}
              
              <ActionIcon
                size="xl"
                radius="xl"
                variant="light"
                color="white"
                style={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <IconHeart size={24} />
              </ActionIcon>
              <ActionIcon
                size="xl"
                radius="xl"
                variant="light"
                color="white"
                style={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <IconShare size={24} />
              </ActionIcon>
            </Group>
          </Stack>
        </Container>

        {/* Scroll indicator */}
        <Box
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.7,
          }}
        >
          <Stack align="center" gap="xs">
            <Text c="white" size="sm" fw={300}>
              Scroll to explore
            </Text>
            <Box
              style={{
                width: 2,
                height: 30,
                background: "rgba(255, 255, 255, 0.6)",
                borderRadius: 1,
                animation: "pulse 2s infinite",
              }}
            />
          </Stack>
        </Box>
      </Box>

      {/* Venue Info Section */}
      <Container size="xl" py="xl">
        <Space h="xl" />

        {/* Content Sections */}
        <Stack gap="3xl">
          {/* Upcoming Events */}
          <Box>
            <Group mb="xl">
              <ThemeIcon size="xl" color="blue" variant="light">
                <IconCalendarEvent size={28} />
              </ThemeIcon>
              <div>
                <Title order={2}>Upcoming Events</Title>
                <Text c="dimmed">Don't miss these amazing shows</Text>
              </div>
            </Group>
            <VenueEventsSection
              events={upcomingEvents}
              type="upcoming"
              emptyMessage="No upcoming events scheduled for this venue."
            />
          </Box>

          <Divider size="md" />

          {/* Gallery */}
          <Box>
            <Group mb="xl">
              <ThemeIcon size="xl" color="violet" variant="light">
                <IconCamera size={28} />
              </ThemeIcon>
              <div>
                <Title order={2}>Venue Gallery</Title>
                <Text c="dimmed">See the space come alive</Text>
              </div>
            </Group>
            <VenueGallerySection gallery={gallery} venueId={venue.id} />
          </Box>

          <Divider size="md" />

          {/* Promoters */}
          <Box>
            <Group mb="xl">
              <ThemeIcon size="xl" color="green" variant="light">
                <IconUsers size={28} />
              </ThemeIcon>
              <div>
                <Title order={2}>Our Promoters</Title>
                <Text c="dimmed">The people who make the magic happen</Text>
              </div>
            </Group>
            <VenuePromotersSection promoters={promoters} venueId={venue.id} />
          </Box>

          <Divider size="md" />

          {/* Past Events */}
          <Box>
            <Group mb="xl">
              <ThemeIcon size="xl" color="gray" variant="light">
                <IconHistory size={28} />
              </ThemeIcon>
              <div>
                <Title order={2}>Past Events</Title>
                <Text c="dimmed">Memories from amazing nights</Text>
              </div>
            </Group>
            <VenueEventsSection
              events={pastEvents}
              type="past"
              emptyMessage="No past events found for this venue."
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
