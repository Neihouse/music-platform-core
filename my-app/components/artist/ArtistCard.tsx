"use client"

import { 
  Button, 
  Group, 
  Text, 
  Stack, 
  Avatar, 
  Paper,
  ActionIcon,
  Menu,
  rem
} from '@mantine/core'
import { 
  IconUserPlus, 
  IconUserMinus,
  IconDotsVertical,
  IconMessage,
  IconShare
} from '@tabler/icons-react'

interface ArtistCardProps {
  name: string
  profilePicture: string
  followers: number
  isFollowing?: boolean
  onFollow: () => void
  onUnfollow?: () => void
  onMessage?: () => void
  onShare?: () => void
}

export function ArtistCard({ 
  name, 
  profilePicture, 
  followers, 
  isFollowing = false,
  onFollow,
  onUnfollow,
  onMessage,
  onShare
}: ArtistCardProps) {
  return (
    <Paper shadow="sm" radius="md" withBorder p="md">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md" wrap="nowrap">
          <Avatar
            src={profilePicture}
            alt={`Profile picture of ${name}`}
            size="lg"
            radius="xl"
          />
          <Stack gap={4}>
            <Text fw={600} size="lg" lineClamp={1}>
              {name}
            </Text>
            <Text size="sm" c="dimmed">
              {followers.toLocaleString()} followers
            </Text>
          </Stack>
        </Group>

        <Group gap="xs">
          <Button
            variant={isFollowing ? "light" : "filled"}
            color={isFollowing ? "gray" : "blue"}
            size="sm"
            radius="xl"
            leftSection={isFollowing ? <IconUserMinus size={16} /> : <IconUserPlus size={16} />}
            onClick={isFollowing ? onUnfollow : onFollow}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <ActionIcon 
                variant="subtle" 
                color="gray"
                size="md"
                radius="xl"
              >
                <IconDotsVertical style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {onMessage && (
                <Menu.Item 
                  leftSection={<IconMessage size={14} />}
                  onClick={onMessage}
                >
                  Message
                </Menu.Item>
              )}
              {onShare && (
                <Menu.Item 
                  leftSection={<IconShare size={14} />}
                  onClick={onShare}
                >
                  Share Profile
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Paper>
  )
}

