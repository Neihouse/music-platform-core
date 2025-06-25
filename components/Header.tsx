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
import { User } from "@supabase/auth-js";
import { UserProfile } from "@/db/queries/user";

interface HeaderProps {
  user: User | null;
  userProfile: UserProfile | null;
}

export function Header({ user, userProfile }: HeaderProps) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  // Use the avatarUrl from the server-side getUserProfile function
  const avatarUrl = userProfile?.avatarUrl;

  // Get display name
  const displayName = userProfile?.name || user?.user_metadata?.name || user?.email || "User";

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
                  src={avatarUrl}
                  style={{ cursor: "pointer" }}
                  alt={displayName}
                  radius="xl"
                  size="sm"
                >
                  {!avatarUrl && displayName[0]?.toUpperCase()}
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
