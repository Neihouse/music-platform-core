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
  IconCalendarEvent, 
  IconMapPin, 
  IconTicket,
  IconUsers,
  IconClock,
  IconMusic
} from "@tabler/icons-react";
import { getBannerUrl } from "@/lib/images/image-utils-client";

interface EventCardProps {
  id: string;
  name: string;
  date: string;
  venue: string;
  venueLocation?: string;
  artists: string[];
  imageUrl?: string;
  price?: string;
  ticketsLeft?: number;
  genre?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onGetTickets?: () => void;
}

export function EventCard({
  id,
  name,
  date,
  venue,
  venueLocation,
  artists,
  imageUrl,
  price,
  ticketsLeft,
  genre,
  size = 'md',
  onClick,
  onGetTickets,
}: EventCardProps) {
  const cardSize = {
    sm: { minWidth: 220, maxWidth: 260, height: 340 },
    md: { minWidth: 260, maxWidth: 300, height: 380 },
    lg: { minWidth: 300, maxWidth: 340, height: 420 }
  }[size];

  const eventImageUrl = imageUrl ? getBannerUrl(imageUrl) : null;

  // Validate and parse the date
  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime())) {
    console.warn(`Invalid date provided to EventCard: ${date}`);
    // Return a simple error state or fallback
    return (
      <Card p="md" style={{ border: '1px solid red' }}>
        <Text c="red">Invalid event date: {date}</Text>
      </Card>
    );
  }

  const isUpcoming = eventDate > new Date();
  const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const formatDate = (date: Date) => {
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const dateInfo = formatDate(eventDate);

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
        position: 'relative',
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
      {/* Date Badge */}
      <Box
        style={{
          position: 'absolute',
          top: rem(12),
          left: rem(12),
          zIndex: 10,
          background: 'var(--mantine-color-white)',
          borderRadius: rem(12),
          padding: `${rem(8)} ${rem(12)}`,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          minWidth: rem(60),
        }}
      >
        <Text size="xs" fw={700} c="dark" style={{ lineHeight: 1 }}>
          {dateInfo.month.toUpperCase()}
        </Text>
        <Text size="lg" fw={900} c="dark" style={{ lineHeight: 1 }}>
          {dateInfo.day}
        </Text>
        <Text size="xs" c="dimmed" style={{ lineHeight: 1 }}>
          {dateInfo.weekday}
        </Text>
      </Box>

      {/* Urgent badge for soon events */}
      {isUpcoming && daysUntil <= 3 && (
        <Badge
          size="sm"
          variant="filled"
          color="red"
          style={{
            position: 'absolute',
            top: rem(12),
            right: rem(12),
            zIndex: 10,
          }}
        >
          {daysUntil === 0 ? 'Today!' : `${daysUntil}d left`}
        </Badge>
      )}

      {/* Image Section */}
      <Box h={180} pos="relative">
        {eventImageUrl ? (
          <Image
            src={eventImageUrl}
            alt={name}
            h={180}
            style={{ objectFit: 'cover' }}
            fallbackSrc="https://via.placeholder.com/340x180/2C2E33/FFFFFF?text=Event"
          />
        ) : (
          <Box
            h={180}
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-orange-8), var(--mantine-color-red-8))',
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
                opacity: 0.2,
                background: `
                  radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)
                `,
              }}
            />
            <IconTicket 
              size={56} 
              color="rgba(255, 255, 255, 0.8)" 
              style={{ opacity: 0.8 }}
            />
          </Box>
        )}
        
        {/* Gradient overlay */}
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: rem(60),
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
          }}
        />

        {/* Price badge */}
        {price && (
          <Badge
            size="lg"
            variant="filled"
            color="green"
            style={{
              position: 'absolute',
              bottom: rem(12),
              right: rem(12),
              fontWeight: 700,
            }}
          >
            {price}
          </Badge>
        )}
      </Box>

      {/* Content */}
      <Box p="lg" h={cardSize.height - 180}>
        <Stack justify="space-between" h="100%">
          <Stack gap="sm">
            <Group justify="space-between" align="flex-start">
              <Text fw={700} size="lg" c="white" lineClamp={1} style={{ flex: 1 }}>
                {name}
              </Text>
              {genre && (
                <Badge size="sm" variant="light" color="violet">
                  {genre}
                </Badge>
              )}
            </Group>

            <Stack gap="xs">
              <Group gap="xs" align="center">
                <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {venue}
                  {venueLocation && ` • ${venueLocation}`}
                </Text>
              </Group>

              <Group gap="xs" align="center">
                <IconClock size={14} color="var(--mantine-color-dimmed)" />
                <Text size="sm" c="dimmed">
                  {dateInfo.time}
                </Text>
              </Group>

              {artists.length > 0 && (
                <Group gap="xs" align="center">
                  <IconMusic size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="sm" c="dimmed" lineClamp={1}>
                    {artists.slice(0, 2).join(', ')}
                    {artists.length > 2 && ` +${artists.length - 2} more`}
                  </Text>
                </Group>
              )}

              {ticketsLeft !== undefined && ticketsLeft < 50 && (
                <Group gap="xs" align="center">
                  <IconUsers size={14} color="var(--mantine-color-red-6)" />
                  <Text size="sm" c="red.6" fw={600}>
                    Only {ticketsLeft} tickets left!
                  </Text>
                </Group>
              )}
            </Stack>
          </Stack>

          <Button
            size="sm"
            variant="gradient"
            gradient={{ from: 'orange', to: 'red' }}
            fullWidth
            radius="xl"
            leftSection={<IconTicket size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onGetTickets?.();
            }}
          >
            Get Tickets
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
