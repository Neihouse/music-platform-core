import { Header } from "@/components/Header";
import { Playback } from "@/components/playback";
import { GlobalPlayer } from "@/components/playback/GlobalPlayer";
import { getUserProfile } from "@/db/queries/user";
import { getUser } from "@/db/queries/users";
import { theme } from "@/lib/theme";
import { createClient } from "@/utils/supabase/server";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";


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
        backgroundColor: 'var(--mantine-color-dark-9)',
        color: 'var(--mantine-color-gray-0)',
        margin: 0,
        padding: 0,
        width: '100%',
        maxWidth: '100vw'
      }}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Playback>
            <Notifications />
            <AppShell
              header={{ height: { base: 64, sm: 60 } }}
              footer={{ height: 0 }}
              padding="0"
              styles={{
                main: {
                  backgroundColor: 'var(--mantine-color-dark-9)',
                  color: 'var(--mantine-color-gray-0)',
                  overflowX: 'hidden',
                  width: '100%',
                  maxWidth: '100vw',
                  minHeight: '100vh',
                },
                header: {
                  backgroundColor: 'var(--mantine-color-dark-8)',
                  borderBottom: '1px solid var(--mantine-color-dark-4)',
                  zIndex: 200,
                },
              }}
            >
              <AppShellHeader>
                <Header user={user} userProfile={userProfile} />
              </AppShellHeader>

              <AppShellMain>
                {children}
              </AppShellMain>
            </AppShell>

            <GlobalPlayer />
          </Playback>
        </MantineProvider>
      </body>
    </html>
  );
}
