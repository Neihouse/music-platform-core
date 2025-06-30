"use client";

import {
  Card,
  Grid,
  GridCol,
  Stack,
  Title,
  Text,
  Button,
  Badge,
  Image,
  Group,
} from "@mantine/core";
import { IconCalendar, IconMapPin, IconClock } from "@tabler/icons-react";
import Link from "next/link";

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  venue?: {
    name: string;
    location?: string;
  };
  imageUrl?: string;
  ticketUrl?: string;
  category?: string;
  artistName?: string;
}

export default function EventCard({
  id,
  title,
  description,
  date,
  time,
  venue,
  imageUrl,
  ticketUrl,
  category = "LIVE PERFORMANCE",
  artistName,
}: EventCardProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card
      style={{
        backgroundColor: 'rgba(46, 35, 72, 0.5)',
        border: '1px solid var(--mantine-color-dark-4)',
      }}
      radius="lg"
      p="xl"
    >
      <Grid align="stretch">
        <GridCol span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <Badge color="blue" size="sm" style={{ width: 'fit-content' }}>
              {category}
            </Badge>
            
            <Title order={3} c="gray.0">
              {title}
            </Title>

            {description && (
              <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                {description}
              </Text>
            )}

            <Stack gap="xs">
              {/* Date and Time */}
              <Group gap="xs" align="center">
                <IconCalendar size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
                <Text size="sm" c="dimmed">
                  {formatDate(date)}
                  {time && ` at ${time}`}
                </Text>
              </Group>

              {/* Venue */}
              {venue && (
                <Group gap="xs" align="center">
                  <IconMapPin size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
                  <Text size="sm" c="dimmed">
                    {venue.name}
                    {venue.location && `, ${venue.location}`}
                  </Text>
                </Group>
              )}

              {/* Artist */}
              {artistName && (
                <Text size="sm" c="dimmed">
                  Featuring {artistName}
                </Text>
              )}
            </Stack>

            {ticketUrl ? (
              <Button
                component="a"
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: 'fit-content', marginTop: 'auto' }}
                size="sm"
              >
                Get Tickets
              </Button>
            ) : (
              <Button
                component={Link}
                href={`/events/${id}`}
                style={{ width: 'fit-content', marginTop: 'auto' }}
                size="sm"
                variant="outline"
              >
                View Details
              </Button>
            )}
          </Stack>
        </GridCol>
        
        <GridCol span={{ base: 12, md: 4 }}>
          <Image
            src={imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDv3EiSMWOv9Io9sTcAHcW1V6hOx6x2XvrREmdEMknb0y_n5v6ojQB1YX3fGkEAST4NbeirvraX5lWmbZAvQU7JNdlYc-U0Husyh4TNkuPIk1X9CEg-zb9rAM4aG1g4X6a63BUy-uOAUpo4REDg7TsRQekIibeI2hNmTbwJpBkKgYFJhNi1S9fLBYM4mcq8F6ZnmjeB4FVT8RGxqibAOpNARwjuFoe4pkzzbTjY2zGklvAu-A4RDN2Fc6BOnKBIVN3DFvlk8VE2Ylk"}
            alt={title}
            style={{ height: '100%', borderRadius: '8px', minHeight: '200px' }}
          />
        </GridCol>
      </Grid>
    </Card>
  );
}
