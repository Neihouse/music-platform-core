"use client";

import {
  Card,
  Badge,
  ThemeIcon,
  Box,
  Button,
  Group,
  Text,
  Avatar,
  rem,
} from "@mantine/core";
import { 
  IconBuilding, 
  IconUsers, 
  IconCalendarEvent,
} from "@tabler/icons-react";
import { StyledTitle } from "@/components/StyledTitle";
import { LocalVenue } from "@/app/discover/actions";
import { getAvatarUrl, getBannerUrl } from "@/lib/images/image-utils-client";

interface VenueCardProps {
  venue: LocalVenue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const bannerUrl = venue.banner_img ? getBannerUrl(venue.banner_img) : null;
  const avatarUrl = venue.avatar_img ? getAvatarUrl(venue.avatar_img) : null;

  return (
    <Card 
      radius="xl" 
      shadow="lg" 
      padding={0}
      withBorder
      style={{
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid var(--mantine-color-gray-2)',
      }}
      className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Banner Section */}
      <Card.Section
        style={{
          height: 120,
          background: bannerUrl 
            ? `linear-gradient(135deg, rgba(0,128,0,0.3), rgba(0,128,0,0.1)), url(${bannerUrl})`
            : 'linear-gradient(135deg, var(--mantine-color-green-6), var(--mantine-color-teal-6))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          padding: rem(16),
        }}
      >
      </Card.Section>
      
      {/* Content Section */}
      <Box p="lg" style={{ position: 'relative' }}>
        {/* Avatar positioned to overlap banner */}
        <Avatar
          src={avatarUrl}
          alt={venue.name}
          size={60}
          radius="xl"
          style={{
            position: 'absolute',
            top: -30,
            left: 20,
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10,
          }}
        >
          <IconBuilding size={28} />
        </Avatar>

        {/* Title positioned horizontally aligned with avatar */}
        <Group justify="space-between" align="center" mb="sm" style={{ 
          marginTop: -30, 
          paddingLeft: 90,
        }}>
          <StyledTitle
            selectedFont={venue.selectedFont}
            as="h3"
            style={{
              fontSize: rem(18),
              fontWeight: 700,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {venue.name}
          </StyledTitle>
          {venue.capacity && (
            <Badge
              size="sm"
              variant="light"
              color="green"
              leftSection={<IconUsers size={14} />}
            >
              {venue.capacity.toLocaleString()}
            </Badge>
          )}
        </Group>

        {/* Description and Actions with proper spacing */}
        <Box mt="md">
          {venue.description && (
            <Text size="sm" c="dimmed" lineClamp={2} mb="md" style={{ lineHeight: 1.5 }}>
              {venue.description}
            </Text>
          )}
          
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color="green" radius="xl">
                <IconCalendarEvent size={12} />
              </ThemeIcon>
              <Text size="sm" c="green.7" fw={600}>
                {venue.upcomingEvents || 0} events
              </Text>
            </Group>
            <Button 
              variant="gradient"
              gradient={{ from: 'green', to: 'teal' }}
              size="sm"
              radius="xl"
              style={{ fontWeight: 600 }}
            >
              View Events
            </Button>
          </Group>
        </Box>
      </Box>
    </Card>
  );
}
