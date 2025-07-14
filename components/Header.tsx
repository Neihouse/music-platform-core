"use client";

import { UserProfile } from "@/db/queries/user";
import { getAvatarUrl } from "@/lib/images/image-utils-client";
import { createClient } from "@/utils/supabase/client";
import {
  Avatar,
  Button,
  Container,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { User } from "@supabase/auth-js";
import {
  IconCalendar,
  IconLogout,
  IconMusic,
  IconSearch,
  IconSettings,
  IconUpload,
  IconUser
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeaderProps {
  user: User | null;
  userProfile: UserProfile | null;
}

export function Header({ user, userProfile }: HeaderProps) {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  // Treat anonymous users as null
  const [currentUser, setCurrentUser] = useState<User | null>(user && !user.is_anonymous ? user : null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(userProfile);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    const supabase = createClient();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setCurrentUserProfile(null);
        } else if (event === 'SIGNED_IN' && session?.user && !session.user.is_anonymous) {
          setCurrentUser(session.user);
          // Note: We don't fetch userProfile here as it would require server-side call
          // The page will refresh after login anyway
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Update state when props change (useful for SSR)
  useEffect(() => {
    setCurrentUser(user && !user.is_anonymous ? user : null);
    setCurrentUserProfile(userProfile);
  }, [user, userProfile]);

  // Use the client-side function to get avatar URL
  const avatarUrl = currentUserProfile?.avatar_img ? getAvatarUrl(currentUserProfile.avatar_img) : null;

  // Get display name
  const displayName = currentUserProfile?.name || currentUser?.user_metadata?.name || currentUser?.email || "User";

  // Get profile URL based on user type
  const profileUrl = currentUserProfile?.type === 'artist'
    ? '/artist'
    : currentUserProfile?.type === 'promoter'
      ? '/promoter'
      : '/profile'; // fallback for users without a specific profile type

  return (
    <Container
      size="xl"
      h={60}
      px={{ base: "xs", sm: "md" }}
      style={{
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      <Group justify="space-between" h="100%" style={{ width: '100%' }}>
        <UnstyledButton component={Link} href="/discover">
          <Group gap="xs">
            <IconMusic
              size={24}
              style={{ color: "var(--mantine-color-blue-6)" }}
            />
            <Text
              size="lg"
              fw={700}
              visibleFrom="xs"
            >
              Myuzo
            </Text>
          </Group>
        </UnstyledButton>

        {currentUser && (
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
              href="/events"
              variant="subtle"
              leftSection={<IconCalendar size={16} />}
              size="sm"
            >
              Events
            </Button>

            <Button
              component={Link}
              href="/upload/tracks"
              variant="subtle"
              leftSection={<IconUpload size={16} />}
              size="sm"
            >
              Upload
            </Button>
          </Group>
        )}

        <Group gap="md">
          {currentUser ? (
            <>
              {/* Desktop Avatar Menu */}
              <Menu position="bottom-end" shadow="sm" width={200}>
                <Menu.Target>
                  <Avatar
                    src={avatarUrl}
                    style={{ cursor: "pointer" }}
                    alt={displayName}
                    radius="xl"
                    size="sm"
                    visibleFrom="sm"
                  >
                    {!avatarUrl && displayName[0]?.toUpperCase()}
                  </Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconUser size={14} />}
                    component={Link}
                    href={profileUrl}
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

              {/* Mobile Avatar (clickable to open drawer) */}
              <Avatar
                src={avatarUrl}
                alt={displayName}
                radius="xl"
                size="sm"
                hiddenFrom="sm"
                style={{ cursor: "pointer" }}
                onClick={() => setMobileMenuOpened(!mobileMenuOpened)}
              >
                {!avatarUrl && displayName[0]?.toUpperCase()}
              </Avatar>
            </>
          ) : (
            <Group gap="xs">
              <Button
                variant="subtle"
                component={Link}
                href="/login"
                size="compact-sm"
              >
                Login
              </Button>
              <Button
                component={Link}
                href="/signup"
                size="compact-sm"
              >
                Sign Up
              </Button>
            </Group>
          )}
        </Group>
      </Group>

      {/* Mobile Navigation Drawer */}
      {currentUser && (
        <Drawer
          opened={mobileMenuOpened}
          onClose={() => setMobileMenuOpened(false)}
          hiddenFrom="sm"
          position="right"
          size="xs"
        >
          <Stack gap="md">
            <Button
              component={Link}
              href="/discover"
              variant="subtle"
              leftSection={<IconSearch size={16} />}
              fullWidth
              justify="flex-start"
              onClick={() => setMobileMenuOpened(false)}
            >
              Discover
            </Button>

            <Button
              component={Link}
              href="/events"
              variant="subtle"
              leftSection={<IconCalendar size={16} />}
              fullWidth
              justify="flex-start"
              onClick={() => setMobileMenuOpened(false)}
            >
              Events
            </Button>

            <Button
              component={Link}
              href="/upload/tracks"
              variant="subtle"
              leftSection={<IconUpload size={16} />}
              fullWidth
              justify="flex-start"
              onClick={() => setMobileMenuOpened(false)}
            >
              Upload
            </Button>

            <Button
              component={Link}
              href={profileUrl}
              variant="subtle"
              leftSection={<IconUser size={16} />}
              fullWidth
              justify="flex-start"
              onClick={() => setMobileMenuOpened(false)}
            >
              Profile
            </Button>

            <Button
              component={Link}
              href="/settings"
              variant="subtle"
              leftSection={<IconSettings size={16} />}
              fullWidth
              justify="flex-start"
              onClick={() => setMobileMenuOpened(false)}
            >
              Settings
            </Button>

            <Button
              onClick={() => {
                handleLogout();
                setMobileMenuOpened(false);
              }}
              variant="subtle"
              leftSection={<IconLogout size={16} />}
              fullWidth
              justify="flex-start"
              color="red"
            >
              Logout
            </Button>
          </Stack>
        </Drawer>
      )}
    </Container>
  );
}
