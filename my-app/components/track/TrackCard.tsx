"use client";

import { 
  Card, 
  Image, 
  Text, 
  Group, 
  Stack, 
  ActionIcon, 
  Badge,
  Tooltip,
  AspectRatio,
  Box,
  Transition,
  rem
} from '@mantine/core';
import { 
  IconPlayerPlay, 
  IconHeart,
  IconHeartFilled,
  IconShare
} from '@tabler/icons-react';
import { useHover } from '@mantine/hooks';

interface TrackCardProps {
  title: string;
  artist: string;
  coverArt: string;
  likes: number;
  isLiked?: boolean;
  onPlay: () => void;
  onLike: () => void;
  onShare?: () => void;
}

export function TrackCard({
  title,
  artist,
  coverArt,
  likes,
  isLiked = false,
  onPlay,
  onLike,
  onShare
}: TrackCardProps) {
  const { hovered, ref } = useHover();

  return (
    <Card 
      ref={ref}
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{
        transition: 'all 150ms ease',
        transform: hovered ? 'translateY(-5px)' : 'none',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <Card.Section>
        <AspectRatio ratio={16/9} style={{ position: 'relative' }}>
          <Image
            src={coverArt}
            alt={`Cover art for ${title}`}
            fallbackSrc="/placeholder-cover.jpg"
          />
          <Transition mounted={hovered} transition="fade" duration={200}>
            {(styles) => (
              <Box
                style={{
                  ...styles,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActionIcon
                  variant="filled"
                  color="blue"
                  size="xl"
                  radius="xl"
                  onClick={onPlay}
                  style={{
                    transform: 'scale(1.2)',
                    transition: 'transform 150ms ease',
                  }}
                >
                  <IconPlayerPlay style={{ width: rem(24), height: rem(24) }} />
                </ActionIcon>
              </Box>
            )}
          </Transition>
        </AspectRatio>
      </Card.Section>

      <Stack gap="xs" mt="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Text fw={500} size="lg" lineClamp={1}>
              {title}
            </Text>
            <Text size="sm" c="dimmed" lineClamp={1}>
              {artist}
            </Text>
          </Stack>
          <Badge 
            size="sm" 
            variant="light"
            radius="xl"
            px="sm"
          >
            {likes.toLocaleString()} likes
          </Badge>
        </Group>

        <Group gap="xs">
          <Tooltip label={isLiked ? "Unlike track" : "Like track"}>
            <ActionIcon
              variant={isLiked ? "filled" : "light"}
              color="red"
              size="lg"
              radius="md"
              onClick={onLike}
              style={{
                transition: 'transform 150ms ease',
              }}
              className="hover:scale-110"
            >
              <Transition mounted={isLiked} transition="pop" duration={200}>
                {(styles) => (
                  <IconHeartFilled 
                    style={{ ...styles, width: rem(18), height: rem(18) }} 
                  />
                )}
              </Transition>
              <Transition mounted={!isLiked} transition="pop" duration={200}>
                {(styles) => (
                  <IconHeart 
                    style={{ 
                      ...styles, 
                      width: rem(18), 
                      height: rem(18), 
                      position: 'absolute' 
                    }} 
                  />
                )}
              </Transition>
            </ActionIcon>
          </Tooltip>
          
          {onShare && (
            <Tooltip label="Share track">
              <ActionIcon
                variant="light"
                color="gray"
                size="lg"
                radius="md"
                onClick={onShare}
                style={{
                  transition: 'transform 150ms ease',
                }}
                className="hover:scale-110"
              >
                <IconShare style={{ width: rem(18), height: rem(18) }} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
