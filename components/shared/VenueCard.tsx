"use client";

import {
  Box,
  Card,
  Image,
  Text,
  Group,
  Badge,
  Stack,
  rem,
  Button,
  ActionIcon,
} from "@mantine/core";
import { 
  IconMapPin, 
  IconUsers, 
  IconCalendarEvent, 
  IconBuilding,
  IconTicket 
} from "@tabler/icons-react";
import { getBannerUrl } from "@/lib/images/image-utils-client";

interface VenueCardProps {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  capacity?: number;
  location?: string;
  upcomingEvents?: number;
  type?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onViewEvents?: () => void;
}

export function VenueCard({
  id,
  name,
  description,
  imageUrl,
  capacity,
  location,
  upcomingEvents,
  type, 
  size = 'md',
  onClick,
  onViewEvents,
}: VenueCardProps) {
  const cardSize = {
    sm: { minWidth: 200, maxWidth: 240, height: 320 },
    md: { minWidth: 240, maxWidth: 280, height: 360 },
    lg: { minWidth: 280, maxWidth: 320, height: 400 }
  }[size];

  const venueImageUrl = imageUrl ? getBannerUrl(imageUrl) : null;

  return (
    <Card
      p={0}
      radius="xl"
      style={{
        width: '100%',
        minWidth: cardSize.minWidth,
        maxWidth: cardSize.maxWidth,
        height: cardSize.height,
        background: 'var(--mantine-color-dark-8)',
        border: '1px solid var(--mantine-color-dark-6)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
        e.currentTarget.style.borderColor = 'var(--mantine-color-gray-6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = 'var(--mantine-color-dark-6)';
      }}
    >
      {/* Image Section */}
      <Box h={160} pos="relative">
        {venueImageUrl ? (
          <Image
            src={venueImageUrl}
            alt={name}
            h={160}
            style={{ objectFit: 'cover' }}
            fallbackSrc="https://via.placeholder.com/320x160/2C2E33/FFFFFF?text=Venue"
          />
        ) : (
          <Box
            h={160}
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-dark-6), var(--mantine-color-dark-7))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Decorative background pattern */}
            <Box
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.1,
                background: `
                  radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)
                `,
              }}
            />
            <IconBuilding 
              size={48} 
              color="var(--mantine-color-gray-6)" 
              style={{ opacity: 0.6 }}
            />
          </Box>
        )}
        
        {/* Overlay badges */}
        <Box
          style={{
            position: 'absolute',
            top: rem(12),
            left: rem(12),
            right: rem(12),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {type && (
            <Badge
              size="sm"
              variant="filled"
              color="dark"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            >
              {type}
            </Badge>
          )}
          
          {upcomingEvents !== undefined && (
            <Badge
              size="sm"
              variant="filled"
              color="green"
              leftSection={<IconCalendarEvent size={12} />}
            >
              {upcomingEvents}
            </Badge>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box p="lg" h={cardSize.height - 160}>
        <Stack justify="space-between" h="100%">
          <Stack gap="sm">
            <Text fw={700} size="lg" c="white" lineClamp={1}>
              {name}
            </Text>

            {description && (
              <Text size="sm" c="dimmed" lineClamp={2} style={{ lineHeight: 1.4 }}>
                {description}
              </Text>
            )}

            <Stack gap="xs">
              {location && (
                <Group gap="xs" align="center">
                  <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {location}
                  </Text>
                </Group>
              )}

              {capacity !== undefined && (
                <Group gap="xs" align="center">
                  <IconUsers size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="xs" c="dimmed">
                    Capacity: {capacity.toLocaleString()}
                  </Text>
                </Group>
              )}

              {upcomingEvents !== undefined && (
                <Group gap="xs" align="center">
                  <IconTicket size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="xs" c="dimmed">
                    {upcomingEvents} upcoming events
                  </Text>
                </Group>
              )}
            </Stack>
          </Stack>

          <Button
            size="sm"
            variant="gradient"
            gradient={{ from: 'green', to: 'teal' }}
            fullWidth
            radius="xl"
            leftSection={<IconBuilding size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onViewEvents?.();
            }}
          >
            View Events
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
