import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  MantineProvider,
  AppShell,
  ColorSchemeScript,
  Group,
  ScrollArea,
  AppShellHeader,
  AppShellNavbar,
  AppShellFooter,
  AppShellMain,
  mantineHtmlProps,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import { getUser } from "@/db/queries/users";
import { Notifications } from "@mantine/notifications";
import { theme } from "@/lib/theme";
import { Playback } from "@/components/playback";
import { Player } from "@/components/playback/Player";

// Metadata needs to be in a separate file for Next.js 14
// Create a new file app/metadata.ts for this configuration

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userResponse = await getUser();

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
              header={{ height: { base: 60, md: 70 } }}
              footer={{ height: 60 }}
              padding={{ base: "md", md: "lg" }}
              navbar={{
                width: { base: 0, md: 250 },
                breakpoint: "md",
                collapsed: { desktop: true },
              }}
              // styles={(theme) => ({
              //   footer: {
              //     background: theme.colors.dark[8],
              //   },
              // })}
            >
              <AppShellHeader>
                <Group h="100%" px="md" justify="space-between">
                  <Group>
                    {/* {isMobile && (
                    <Burger
                      opened={opened}
                      onClick={toggle}
                      hiddenFrom="md"
                      size="sm"
                    />
                  )} */}
                    <Header user={userResponse.data.user} />
                  </Group>
                </Group>
              </AppShellHeader>

              <AppShellNavbar py="md" px={4}>
                <ScrollArea h="100%" type="hover">
                  {/* <NavLinks /> */}
                </ScrollArea>
              </AppShellNavbar>

              <AppShellMain>
                {children}
                <Player />
              </AppShellMain>

              <AppShellFooter>
                <Footer />
              </AppShellFooter>
            </AppShell>

            {/* {isMobile && (
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
          )} */}
          </Playback>
        </MantineProvider>
      </body>
    </html>
  );
}
