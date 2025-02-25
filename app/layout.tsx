"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Inter } from "next/font/google";
import { 
  MantineProvider, 
  createTheme, 
  AppShell,
  ColorSchemeScript,
  Burger,
  Group,
  Drawer,
  ScrollArea,
} from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useState, useEffect } from 'react';
import { Notifications } from '@mantine/notifications';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { NavLinks } from '@/components/NavLinks';

const inter = Inter({ subsets: ["latin"] });

// Metadata needs to be in a separate file for Next.js 14
// Create a new file app/metadata.ts for this configuration
const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: inter.style.fontFamily,
  defaultRadius: 'md',
  colors: {
    // Custom color palette
    brand: [
      '#E7F5FF',
      '#D0EBFF',
      '#A5D8FF',
      '#74C0FC',
      '#4DABF7',
      '#339AF0',
      '#228BE6',
      '#1C7ED6',
      '#1971C2',
      '#1864AB',
    ],
  },
  shadows: {
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)',
    xl: '0 12px 24px rgba(0,0,0,0.1)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  components: {
    Button: {
      defaultProps: {
        size: 'md',
        variant: 'filled',
      },
    },
    Input: {
      defaultProps: {
        size: 'md',
      },
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        padding: 'md',
        radius: 'md',
      },
    },
    Container: {
      defaultProps: {
        size: 'lg',
      },
    },
  },
  other: {
    transitionDuration: 200,
    headerHeight: 60,
    footerHeight: 60,
  },
  breakpoints: {
    xs: '36em',     // 576px
    sm: '48em',     // 768px
    md: '62em',     // 992px
    lg: '75em',     // 1200px
    xl: '88em',     // 1408px
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 48em)');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <ColorSchemeScript defaultColorScheme="auto" />
        </head>
        <body>
          <MantineProvider theme={theme}>
            <div style={{ visibility: 'hidden' }}>{children}</div>
          </MantineProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <ErrorBoundary>
            <AppShell
              header={{ height: { base: 60, md: 70 } }}
              footer={{ height: 60 }}
              padding={{ base: 'md', md: 'lg' }}
              navbar={{
                width: { base: 0, md: 250 },
                breakpoint: 'md',
                collapsed: { mobile: !opened }
              }}
              styles={(theme) => ({
                footer: {
                  background: theme.colors.dark[8]
                }
              })}
            >
              <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                  <Group>
                    {isMobile && (
                      <Burger 
                        opened={opened} 
                        onClick={toggle} 
                        hiddenFrom="md" 
                        size="sm"
                      />
                    )}
                    <Header />
                  </Group>
                </Group>
              </AppShell.Header>

              <AppShell.Navbar py="md" px={4}>
                <ScrollArea h="100%" type="hover">
                  <NavLinks />
                </ScrollArea>
              </AppShell.Navbar>

              <AppShell.Main>
                {children}
              </AppShell.Main>

              <AppShell.Footer>
                <Footer />
              </AppShell.Footer>
            </AppShell>

            {isMobile && (
              <Drawer
                opened={opened}
                onClose={close}
                size="100%"
                padding="md"
                hiddenFrom="md"
                zIndex={1000}
              >
                <NavLinks onLinkClick={close} />
              </Drawer>
            )}
          </ErrorBoundary>
        </MantineProvider>
      </body>
    </html>
  );
}
