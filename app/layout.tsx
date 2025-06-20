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
import { Notifications } from "@mantine/notifications";
import { theme } from "@/lib/theme";
import { Playback } from "@/components/playback";
import { Player } from "@/components/playback/Player";
import { createClient } from "@/utils/supabase/server";

// Metadata needs to be in a separate file for Next.js 14
// Create a new file app/metadata.ts for this configuration

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser(await createClient());
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
              registration.unregister()
            }
          })
        }
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Playback>
            <Notifications />
            <AppShell
              header={{ height: 60 }}
              footer={{ height: 50 }}
              padding="0"

            >
              <AppShellHeader>
                <Header user={user} />
              </AppShellHeader>

              <AppShellMain>
                <Container size={1200} px="1rem" py="1.5rem">
                  {children}
                </Container>
              </AppShellMain>

              <AppShellFooter h={100}>
                <Player />
                <Footer />
              </AppShellFooter>
            </AppShell>
          </Playback>
        </MantineProvider>
      </body>
    </html>
  );
}
