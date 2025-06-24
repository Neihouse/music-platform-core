"use client";

import Link from "next/link";
import {
  Container,
  Group,
  Text,
  Button,
  Menu,
  Avatar,
  ActionIcon,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconUser,
  IconLogout,
  IconSun,
  IconMoonStars,
  IconUpload,
  IconHeart,
  IconSearch,
  IconMusic,
  IconSettings,
  IconCalendar,
  IconUsers,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { User } from "@supabase/auth-js";

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const [avatarError, setAvatarError] = useState(false);
  const [
    notificationsOpened,
    { toggle: toggleNotifications, close: closeNotifications },
  ] = useDisclosure(false);
  const notificationsRef = useClickOutside(() => closeNotifications());

  // Mock notifications for demo
  const mockNotifications = [
    {
      id: 1,
      title: "New follower",
      message: "DJ Cool started following you",
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Track liked",
      message: 'Someone liked your track "Summer Vibes"',
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "New comment",
      message: 'New comment on your track "Night Drive"',
      time: "3 hours ago",
    },
  ];

  // // Function to validate URL
  // const isValidUrl = (urlString: string | undefined): boolean => {
  //   if (!urlString) return false;
  //   try {
  //     new URL(urlString);
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // };

  // Get valid avatar URL or fallback
  // const avatarUrl =
  //   isValidUrl(user.user_metadata) && !avatarError ? user?.avatar_url : undefined;

  return (
    <Container size="xl" h={60}>
      <Group justify="space-between" h="100%">
        <UnstyledButton component={Link} href="/">
          <Group gap="xs">
            <IconMusic
              size={24}
              style={{ color: "var(--mantine-color-blue-6)" }}
            />
            <Text size="lg" fw={700}>
              MusicApp
            </Text>
          </Group>
        </UnstyledButton>

        {user && (
          <Group gap="md" visibleFrom="sm">
            <Button
              component={Link}
              href="/discover"
              variant="subtle"
              leftSection={<IconSearch size={16} />}
              size="sm"
            >
              Discover
            </Button>

            <Button
              component={Link}
              href="/promoters"
              variant="subtle"
              leftSection={<IconUsers size={16} />}
              size="sm"
            >
              Promoters
            </Button>

            <Button
              component={Link}
              href="/events"
              variant="subtle"
              leftSection={<IconCalendar size={16} />}
              size="sm"
            >
              Events
            </Button>

            <Button
              component={Link}
              href="/upload"
              variant="subtle"
              leftSection={<IconUpload size={16} />}
              size="sm"
            >
              Upload
            </Button>

            <Button
              component={Link}
              href="/favorites"
              variant="subtle"
              leftSection={<IconHeart size={16} />}
              size="sm"
            >
              Favorites
            </Button>
          </Group>
        )}

        <Group gap="md">
          <ActionIcon
            variant="subtle"
            onClick={() =>
              setColorScheme(colorScheme === "light" ? "dark" : "light")
            }
            size="md"
            aria-label="Toggle color scheme"
          >
            {colorScheme === "light" ? (
              <IconMoonStars size={18} />
            ) : (
              <IconSun size={18} />
            )}
          </ActionIcon>

          {user ? (
            <Menu position="bottom-end" shadow="sm" width={200}>
              <Menu.Target>
                <Avatar
                  style={{ cursor: "pointer" }}
                  alt={user.email || "User avatar"}
                  radius="xl"
                  size="sm"
                  onError={() => setAvatarError(true)}
                >
                  {user.user_metadata.name?.[0]?.toUpperCase() ||
                    user.email?.[0]?.toUpperCase() ||
                    "U"}
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  component={Link}
                  href="/profile"
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconSettings size={14} />}
                  component={Link}
                  href="/settings"
                >
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  component={Link}
                  href="/logout"
                  color="red"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Group gap="sm">
              <Button variant="subtle" component={Link} href="/login" size="sm">
                Login
              </Button>
              <Button component={Link} href="/signup" size="sm">
                Sign Up
              </Button>
            </Group>
          )}
        </Group>
      </Group>
    </Container>
  );
}
