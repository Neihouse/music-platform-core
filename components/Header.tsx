"use client";

import Link from 'next/link';
import {
  Container,
  Group,
  Text,
  Button,
  Menu,
  Avatar,
  ActionIcon,
  UnstyledButton,
  rem,
  Tooltip,
  Badge,
  Transition,
  Paper,
  Stack,
  Title,
  useMantineColorScheme
} from '@mantine/core';
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
  IconPlayerPlay,
  IconBell
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUser, logout, User } from '@/utils/auth';
import { notifications } from '@mantine/notifications';
import { useClickOutside, useDisclosure } from '@mantine/hooks';

interface HeaderProps {
  user?: User | null;
}

export function Header({ user: initialUser }: HeaderProps) {
  const router = useRouter();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const [avatarError, setAvatarError] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [notificationsOpened, { toggle: toggleNotifications, close: closeNotifications }] = useDisclosure(false);
  const notificationsRef = useClickOutside(() => closeNotifications());

  // Mock notifications for demo
  const mockNotifications = [
    { id: 1, title: 'New follower', message: 'DJ Cool started following you', time: '2 min ago' },
    { id: 2, title: 'Track liked', message: 'Someone liked your track "Summer Vibes"', time: '1 hour ago' },
    { id: 3, title: 'New comment', message: 'New comment on your track "Night Drive"', time: '3 hours ago' },
  ];

  useEffect(() => {
    // Update user state from localStorage
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    try {
      logout();
      setUser(null);
      notifications.show({
        title: 'Success',
        message: 'Logged out successfully',
        color: 'green',
      });
      router.push('/login');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to log out',
        color: 'red',
      });
    }
  };

  // Function to validate URL
  const isValidUrl = (urlString: string | undefined): boolean => {
    if (!urlString) return false;
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  // Get valid avatar URL or fallback
  const avatarUrl = isValidUrl(user?.avatar_url) && !avatarError ? user?.avatar_url : undefined;

  return (
    <Container size="xl" h={60}>
      <Group justify="space-between" h="100%">
        <Group gap={40}>
          <UnstyledButton component={Link} href="/">
            <Group gap="xs">
              <IconMusic size={24} style={{ color: 'var(--mantine-color-blue-6)' }} />
              <Text size="xl" fw={700}>
                MusicApp
              </Text>
            </Group>
          </UnstyledButton>

          {user && (
            <Group gap="sm" visibleFrom="sm">
              <Tooltip label="Discover new music">
                <Button
                  component={Link}
                  href="/discover"
                  variant="subtle"
                  leftSection={<IconSearch size={16} />}
                >
                  Discover
                </Button>
              </Tooltip>

              <Tooltip label="Upload your tracks">
                <Button
                  component={Link}
                  href="/upload"
                  variant="subtle"
                  leftSection={<IconUpload size={16} />}
                >
                  Upload
                </Button>
              </Tooltip>

              <Tooltip label="Your favorites">
                <Button
                  component={Link}
                  href="/favorites"
                  variant="subtle"
                  leftSection={<IconHeart size={16} />}
                >
                  Favorites
                </Button>
              </Tooltip>
            </Group>
          )}
        </Group>

        <Group>
          <Tooltip label={colorScheme === 'light' ? 'Dark mode' : 'Light mode'}>
            <ActionIcon
              variant="subtle"
              onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
              size="lg"
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoonStars size={20} />}
            </ActionIcon>
          </Tooltip>

          {user ? (
            <Group gap="xs">
              <Tooltip label="Notifications">
                <div ref={notificationsRef}>
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={toggleNotifications}
                    pos="relative"
                  >
                    <IconBell size={20} />
                    <Badge 
                      size="xs" 
                      variant="filled" 
                      pos="absolute" 
                      top={2} 
                      right={2}
                      radius="xl"
                    >
                      3
                    </Badge>
                  </ActionIcon>
                  
                  <Transition mounted={notificationsOpened} transition="pop-top-right" duration={200}>
                    {(styles) => (
                      <Paper
                        shadow="md"
                        radius="md"
                        withBorder
                        pos="absolute"
                        top={50}
                        right={0}
                        style={{ width: 320, ...styles }}
                        p="md"
                      >
                        <Stack gap="sm">
                          <Text fw={500}>Notifications</Text>
                          {mockNotifications.map((notification) => (
                            <Paper key={notification.id} p="xs" radius="md" withBorder>
                              <Text size="sm" fw={500}>{notification.title}</Text>
                              <Text size="xs" c="dimmed">{notification.message}</Text>
                              <Text size="xs" c="dimmed" mt={4}>{notification.time}</Text>
                            </Paper>
                          ))}
                        </Stack>
                      </Paper>
                    )}
                  </Transition>
                </div>
              </Tooltip>

              <Menu position="bottom-end" shadow="md" width={200}>
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap="xs">
                      <Avatar
                        src={avatarUrl}
                        alt={user.email || 'User avatar'}
                        radius="xl"
                        size="md"
                        onError={() => setAvatarError(true)}
                      >
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {user.name || 'User'}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {user.email}
                        </Text>
                      </div>
                    </Group>
                  </UnstyledButton>
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
                    onClick={handleLogout}
                    color="red"
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ) : (
            <Group gap="sm">
              <Button variant="subtle" component={Link} href="/login">
                Login
              </Button>
              <Button component={Link} href="/signup">
                Sign Up
              </Button>
            </Group>
          )}
        </Group>
      </Group>
    </Container>
  );
}
