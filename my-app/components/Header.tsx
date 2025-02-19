"use client";

import Link from 'next/link';
import {
  Container,
  Group,
  Burger,
  Text,
  Button,
  Menu,
  Avatar,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconUser,
  IconLogout,
  IconSun,
  IconMoonStars,
  IconUpload,
  IconHeart,
  IconSearch,
} from '@tabler/icons-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  user?: {
    id: string;
    email?: string;
    avatar_url?: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const supabase = createClientComponentClient();
  const [avatarError, setAvatarError] = useState(false);

  const menuItems = [
    { href: '/discover', label: 'Discover', icon: IconSearch },
    { href: '/upload', label: 'Upload', icon: IconUpload },
    { href: '/favorites', label: 'Favorites', icon: IconHeart },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
          <Text
            component={Link}
            href="/"
            size="xl"
            fw={700}
            style={{ textDecoration: 'none' }}
          >
            MusicApp
          </Text>

          <Group gap="sm" visibleFrom="sm">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                variant="subtle"
                leftSection={<item.icon size={16} />}
              >
                {item.label}
              </Button>
            ))}
          </Group>
        </Group>

        <Group>
          <ActionIcon
            variant="subtle"
            onClick={() =>
              setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
            }
            size="lg"
          >
            {computedColorScheme === 'light' ? (
              <IconMoonStars size={20} />
            ) : (
              <IconSun size={20} />
            )}
          </ActionIcon>

          {user ? (
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                <Avatar
                  src={avatarUrl}
                  alt={user.email || 'User avatar'}
                  radius="xl"
                  size="md"
                  style={{ cursor: 'pointer' }}
                  onError={() => setAvatarError(true)}
                >
                  {user.email?.[0]?.toUpperCase() || 'U'}
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
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                  color="red"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
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

          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </Group>
    </Container>
  );
}
