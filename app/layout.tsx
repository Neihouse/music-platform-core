import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body style={{ paddingBottom: '72px' }}>
        <MantineProvider theme={theme}>
          <Playback>
            <Notifications />
            <AppShell
              header={{ height: 60 }}
              footer={{ height: 50 }}
              padding="0"

            >
              <AppShellHeader>
                <Header user={user} userProfile={userProfile} />
              </AppShellHeader>

              <AppShellMain>
                <Container size={1200} px="1rem" py="1.5rem">
                  {children}
                </Container>
              </AppShellMain>

              <AppShellFooter h={100}>
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
