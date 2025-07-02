import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import {
  MantineProvider,
  AppShell,
  ColorSchemeScript,
  Group,
  ScrollArea,
  AppShellHeader,
  AppShellFooter,
  AppShellMain,
  mantineHtmlProps,
  Container,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import { getUser } from "@/db/queries/users";
import { getUserProfile } from "@/db/queries/user";
import { Notifications } from "@mantine/notifications";
import { theme } from "@/lib/theme";
import { Playback } from "@/components/playback";
import { GlobalPlayer } from "@/components/playback/GlobalPlayer";
import { createClient } from "@/utils/supabase/server";

// Metadata needs to be in a separate file for Next.js 14
// Create a new file app/metadata.ts for this configuration

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  const userProfile = user ? await getUserProfile(supabase) : null;
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister()
      }
    })
  }
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body style={{ 
        paddingBottom: '80px', // Account for GlobalPlayer + some spacing
        backgroundColor: 'var(--mantine-color-dark-9)',
        color: 'var(--mantine-color-gray-0)',
        margin: 0,
        padding: 0,
        overflowX: 'hidden', // Prevent horizontal scroll
        width: '100%',
        maxWidth: '100vw'
      }}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Playback>
            <Notifications />
            <AppShell
              header={{ height: 60 }}
              footer={{ height: 60 }}
              padding="0"
              styles={{
                main: {
                  backgroundColor: 'var(--mantine-color-dark-9)',
                  color: 'var(--mantine-color-gray-0)',
                  overflowX: 'hidden', // Prevent horizontal scroll
                  width: '100%',
                  maxWidth: '100vw'
                },
                header: {
                  backgroundColor: 'var(--mantine-color-dark-8)',
                  borderBottom: '1px solid var(--mantine-color-dark-4)',
                },
                footer: {
                  backgroundColor: 'var(--mantine-color-dark-8)',
                  borderTop: '1px solid var(--mantine-color-dark-4)',
                }
              }}
            >
              <AppShellHeader>
                <Header user={user} userProfile={userProfile} />
              </AppShellHeader>

              <AppShellMain style={{ 
                backgroundColor: 'var(--mantine-color-dark-9)',
                padding: 0,
                overflowX: 'hidden', // Prevent horizontal scroll
                width: '100%',
                maxWidth: '100vw'
              }}>
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
              </AppShellMain>

              <AppShellFooter h={60}>
                <Footer />
              </AppShellFooter>
            </AppShell>
            
            {/* Global Player - positioned outside AppShell */}
            <GlobalPlayer />
          </Playback>
        </MantineProvider>
      </body>
    </html>
  );
}
