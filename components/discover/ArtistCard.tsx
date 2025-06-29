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
  IconMicrophone, 
  IconUsers, 
  IconPlayerPlay,
} from "@tabler/icons-react";
import { StyledTitle } from "@/components/StyledTitle";
import { getAvatarUrl, getBannerUrl } from "@/lib/images/image-utils-client";
import { LocalArtist } from "@/app/discover/actions";

interface ArtistCardProps {
  artist: LocalArtist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const bannerUrl = artist.banner_img ? getBannerUrl(artist.banner_img) : null;
  const avatarUrl = artist.avatar_img ? getAvatarUrl(artist.avatar_img) : null;

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
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid var(--mantine-color-violet-2)',
        }
      }}
      className="group hover:shadow-2xl transition-all duration-300"
    >
      {/* Banner Section */}
      <Card.Section
        style={{
          height: 120,
          background: bannerUrl 
            ? `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${bannerUrl})`
            : 'linear-gradient(135deg, var(--mantine-color-violet-6), var(--mantine-color-indigo-6))',
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
          alt={artist.name}
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
          <IconMicrophone size={28} />
        </Avatar>

        {/* Title positioned horizontally aligned with avatar */}
        <Group justify="space-between" align="center" mb="sm" style={{ 
          marginTop: -30, 
          paddingLeft: 90,
        }}>
          <StyledTitle
            selectedFont={artist.selectedFont}
            as="h3"
            style={{
              fontSize: rem(18),
              fontWeight: 700,
              lineHeight: 1.2,
              margin: 0,
              right: "30px"
            }}
          >
            {artist.name}
          </StyledTitle>
          {artist.genre && (
            <Badge size="sm" variant="light" color="violet">
              {artist.genre}
            </Badge>
          )}
        </Group>

        {/* Bio and Actions with proper spacing */}
        <Box mt="md">
          <Text size="sm" c="dimmed" lineClamp={2} mb="md">
            {artist.bio}
          </Text>
          
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color="violet" radius="xl">
                <IconUsers size={12} />
              </ThemeIcon>
              <Text size="xs" c="dimmed" fw={500}>
                {artist.followerCount?.toLocaleString() || 0}
              </Text>
            </Group>
            <Button 
              size="xs" 
              variant="gradient"
              gradient={{ from: 'violet', to: 'indigo' }}
              leftSection={<IconPlayerPlay size={12} />}
              radius="xl"
            >
              Listen
            </Button>
          </Group>
        </Box>
      </Box>
    </Card>
  );
}
