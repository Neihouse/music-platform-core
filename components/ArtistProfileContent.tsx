"use client";

import {
  Box,
  Container,
  Group,
  Stack,
  Title,
  Text,
  Image,
  Button,
  Tabs,
  Grid,
  GridCol,
  Card,
  ActionIcon,
  Avatar,
  Badge,
  Skeleton,
} from "@mantine/core";
import { IconEdit, IconMapPin, IconPlayerPlay, IconBell, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TrackList } from "@/components/Tracks/TrackList";
import { ExternalLinksDisplay } from "@/components/ExternalLinksDisplay";
import { nameToUrl } from "@/lib/utils";
import { Artist, StoredLocality } from "@/utils/supabase/global.types";
import { ArtistTrackWithPlayCount } from "@/db/queries/tracks";
import StyledTitle from "@/components/StyledTitle";

interface ArtistProfileContentProps {
  artist: Artist;
  storedLocality?: StoredLocality;
  canEdit: boolean;
  tracksWithPlayCounts: ArtistTrackWithPlayCount[];
  avatarUrl: string | null;
  bannerUrl: string | null;
}

const ArtistProfileContent = ({
  artist,
  storedLocality,
  canEdit,
  tracksWithPlayCounts,
  avatarUrl,
  bannerUrl,
}: ArtistProfileContentProps) => {
  const { name, bio, external_links } = artist;
  const [activeTab, setActiveTab] = useState<string | null>("about");

  // Load the artist's selected font - simplified approach
  useEffect(() => {
    const selectedFont = (artist as any).selectedFont;
    if (selectedFont) {
      const fontName = selectedFont.replace(/ /g, '+');
      
      // Check if font is already loaded
      const existingLink = document.querySelector(`link[href*="${fontName}"]`);
      if (!existingLink) {
        const fontLink = document.createElement('link');
        fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
    }
  }, [artist]);

  // Mock data for the demo - replace with real data from your database
  const mockTracks = [
    {
      id: "1",
      title: "Echoes in the Night",
      artist: name,
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBoDbgVIb0dASOoNd5TjwPTv6yAwUxedBG8JryBF7kdaDp5r_dVgtgHcqS1nzKqUiN5R7HywNojZt_hkqrGdsv7GyAAMRelXiH7hto2423z2fblbw_RethajEcDN2D_YDp9MyDJJ6rlC7JdRb4AjJuIwVyrA7Gij4FVUCd_dLVmojz0f1sl6r0yKoQv-8Q_EqP1oBk7ICCm2AZxbWRGhlQGWhDNbeGhpD9_Rm9rkgI3N4yAaoXibCZnT5uvz6MSflk9bTYAEuiiTE"
    },
    {
      id: "2", 
      title: "Whispers of Dawn",
      artist: name,
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRd7RIso_ahxWYHLVvPbcTL2oiKYGHwcB7EvugUUqkCaIYsT4IEmH4O_hqi--fKxmdyBsro5QgXSBsGoa_YYv7b0TmkPJ_MmXJcjlmIJFzK2CBtd-_FtNejWKFt6hwgMn3UyVQdFMZFIIG9sdQ-Bxcbs4fyFMx5wYTbSW2waxgWGwqxZm4XAfyb9tvCjA7deSVW3dI5C7rmmTXIMbVSH3_nvrTj0N4BCjxyyA1qbDOpxTx1tsa7v6rPTtoJ6D_eL9vrAc4faxVBLQ"
    },
    {
      id: "3",
      title: "Journey Within", 
      artist: name,
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQgcCSImDeB-jV_OiYNQgmnd88Yq3ipBqHoyFZyU6ZkHHNPjMtPUFn5PEj3B1LRN8SH-gYnaGp7Rwl2FTKLnL6O4wi8z96Yvs4LRWxp-MQJlhrNPlFb1y6SjgVS5WXPXKB4fGFO5axjQ-EwI2v1Fg6ftHRteAOqDw4FiXPiJDK_i3YnWSOMfmdd35hw-Y7wBA5vjUAusBcjy39Ywqrj_ZQmOsvaiVYOTOYzeb3rdIoWjEjbu82N136vaudXNCN5wJf3HIgNYUFGjA"
    }
  ];

  const mockCollaborations = [
    { name: "The Harmony Collective", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdzRSDB5SRYEkV5xiIEloxEO38TlSqPcDPIV02zv79CQ0wINcpYaDOC4nIkTbG7PbprOPlYYSJStKrA6m2wR5Ix2Yh-mXi_d72F6105a_IeoKo7Zbt6KY2LG8YBNHRrDwuiJKQJcU3WVvoj3k4aIWNOV0gLN1FBL-Aw6sy-_CuC7CTdie5FgtCLvN1srcpzGBWG2ArN1yJMRqPfV-XOnnl6PLkohWI2EWRcfetw3STedkrtUbhrB2tyqHDbns-CuqU_WSH7wVuHrU" },
    { name: "Rhythm & Rhyme Sessions", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARLYoSKk-rt3Z0-x5W7jJKvroXPkWB3o0_fIaRvirarqP08K2gut3vSnJoBaIVKkCae_dhO64coxjUstMnecXFia4x1uDJVyNS8oK80Ui8wtQlPl236mMXRKPOH4PAuXLitpw8QDz-TENp6K5ExrtChi9KNtwqMn81isacSsJdzD8N60GJgBM9eVL0sYpgke5e3zWLlpUIffR2tG3bvHzXrV3vlAvC8ZvOwuXnkVdhHnUQ3fEIY9RWbVjsW3BgDlvPjL9AQsK4vCE" },
    { name: "Sonic Canvas Project", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwHP4lpnD9o9mXgCVOlQoUWqsRCHXi6tG5LmRXXKIUbmKEZF19bkQ5GeQgE3ZOKgrN_477o6mJBoKhTcNrwEC3q2XAgF6uH2r2KPW1KdnCZl6emWDja1_VjktRCx8Sy1Ekodfon4b1KMUNdKcGbv990GrfGu-v0yr4-xYKMDv9ZXcz5qICXOo0ftLF_4Fu1-LVK-BlqHMTju26RoHEtLSk1Wqs7ctuAubQGrSTDgiH4K0MjEMpW7mOg0BnU3_u7JzjXMubV6A2jc" }
  ];

  return (
    <Box 
      style={{
        background: 'var(--mantine-color-dark-9)',
        minHeight: '100vh',
        color: 'var(--mantine-color-gray-0)',
        margin: '-1.5rem -1rem', // Remove container padding
        width: 'calc(100% + 2rem)', // Compensate for removed margins
        position: 'relative',
      }}
    >
      {/* Hero Section with Banner and Artist Info */}
      <Box style={{ position: 'relative', height: '400px', marginBottom: '-120px' }}>
        <Image
          src={bannerUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDqANvJwje3Oa6X49BIDf5y4Her6lRMCQQBGrwoxzTNq1djLqd9GKSt-uGltF10PcD8IV11HBuzFu3mCkHNNgDtGCyh7SMZWflPZEJ6waNjNgnd-USEihrBX5GA1Kc3L3HSSCfP7AWWmcg__cqnWQXucXNS_cTz8JItRkvGBAiXXM9Gpyr03EJ4JVK-MF2DC1rVH43iKhkf6n1rpOrm60QLH7HnhIy-4z-s6DzoHoaqgmx71ik4s3TwUWOixkDv65WidK3cAHYJEK8"}
          alt={`${name} banner`}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--mantine-color-dark-9) 0%, rgba(22, 17, 34, 0.5) 50%, transparent 100%)',
          }}
        />
      </Box>

      {/* Artist Profile Section */}
      <Container size="lg" style={{ position: 'relative', zIndex: 10 }}>
        <Stack align="center" gap="md" style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <Avatar
            src={avatarUrl}
            alt={`${name} avatar`}
            size={192}
            style={{
              border: '4px solid var(--mantine-color-dark-9)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          />
          <Stack align="center" gap="xs">
            <StyledTitle 
              style={{ 
                color: 'var(--mantine-color-gray-0)',
                fontSize: '2.5rem',
                fontWeight: 700,
              }}
              selectedFont={artist.selectedFont}
            >
              {name}
            </StyledTitle>
            <Text size="lg" c="dimmed">Singer-songwriter | Indie Pop</Text>
            <Group gap="xs" align="center">
              <IconMapPin size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
              <Text size="sm" c="dimmed">
                Based in {storedLocality ? `${storedLocality.locality.name}, ${storedLocality.administrativeArea.name}` : 'Austin, TX'}
              </Text>
            </Group>
          </Stack>
        </Stack>

        {/* Navigation Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={setActiveTab} 
          mt="xl"
          styles={{
            root: {
              borderBottom: '1px solid var(--mantine-color-dark-4)',
            },
            tab: {
              color: 'var(--mantine-color-dimmed)',
              borderBottom: '3px solid transparent',
              '&[data-active]': {
                color: 'var(--mantine-color-gray-0)',
                borderBottomColor: 'var(--mantine-color-blue-6)',
                backgroundColor: 'transparent',
              },
              '&:hover': {
                color: 'var(--mantine-color-gray-0)',
                borderBottomColor: 'var(--mantine-color-dark-4)',
                backgroundColor: 'transparent',
              }
            }
          }}
        >
          <Tabs.List justify="center" style={{ borderBottom: 'none' }}>
            <Tabs.Tab value="about">About</Tabs.Tab>
            <Tabs.Tab value="music">Music</Tabs.Tab>
            <Tabs.Tab value="events">Events</Tabs.Tab>
            <Tabs.Tab value="collaborations">Collaborations</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="about" pt="xl">
            <Container size="md">
              <Stack gap="lg">
                <Box>
                  <Title order={2} mb="md" c="gray.0">About</Title>
                  <Text c="dimmed" size="md" style={{ lineHeight: 1.6 }}>
                    {bio || `${name} is an indie pop singer-songwriter based in Austin, Texas. Known for their soulful voice and introspective lyrics, ${name}'s music blends catchy melodies with heartfelt storytelling. Their influences range from classic folk to modern pop, creating a unique sound that resonates with listeners of all ages. ${name} has performed at numerous local venues and festivals, building a dedicated fanbase with their captivating stage presence and authentic connection with the audience.`}
                  </Text>
                </Box>
                
                {external_links && external_links.length > 0 && (
                  <Box>
                    <Title order={3} mb="md" c="gray.0">Links</Title>
                    <ExternalLinksDisplay links={external_links} />
                  </Box>
                )}

                {canEdit && (
                  <Group justify="center" mt="xl">
                    <Button 
                      component={Link} 
                      href={`/artists/${nameToUrl(name)}/edit`}
                      leftSection={<IconEdit size={16} />}
                      variant="outline"
                    >
                      Edit Profile
                    </Button>
                  </Group>
                )}
              </Stack>
            </Container>
          </Tabs.Panel>

          <Tabs.Panel value="music" pt="xl">
            <Container size="md">
              <Title order={2} mb="md" c="gray.0">Featured Music</Title>
              <Grid gutter="lg">
                {mockTracks.map((track) => (
                  <GridCol key={track.id} span={{ base: 6, sm: 4, md: 3 }}>
                    <Card 
                      padding="0" 
                      style={{ 
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Box style={{ position: 'relative' }}>
                        <Image
                          src={track.cover}
                          alt={track.title}
                          style={{ aspectRatio: '1', borderRadius: '8px' }}
                        />
                        <Box
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(2px)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                          }}
                          className="play-overlay"
                        >
                          <ActionIcon
                            size="xl"
                            color="white"
                            variant="filled"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                          >
                            <IconPlayerPlay size={24} style={{ color: 'black' }} />
                          </ActionIcon>
                        </Box>
                      </Box>
                      <Stack gap="xs" mt="sm">
                        <Text size="sm" fw={500} c="gray.0" style={{ textAlign: 'center' }}>
                          {track.title}
                        </Text>
                        <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
                          {track.artist}
                        </Text>
                      </Stack>
                    </Card>
                  </GridCol>
                ))}
              </Grid>
              
              {/* Real tracks from database */}
              {tracksWithPlayCounts.length > 0 && (
                <Box mt="xl">
                  <Title order={3} mb="md" c="gray.0">Your Tracks</Title>
                  <TrackList
                    tracks={tracksWithPlayCounts}
                    artist={artist}
                    canDelete={canEdit}
                  />
                </Box>
              )}
            </Container>
          </Tabs.Panel>

          <Tabs.Panel value="events" pt="xl">
            <Container size="md">
              <Title order={2} mb="md" c="gray.0">Upcoming Events</Title>
              <Card 
                style={{ 
                  backgroundColor: 'rgba(46, 35, 72, 0.5)',
                  border: '1px solid var(--mantine-color-dark-4)',
                }}
                radius="lg"
                p="xl"
              >
                <Grid align="stretch">
                  <GridCol span={{ base: 12, md: 8 }}>
                    <Stack gap="md">
                      <Badge color="blue" size="sm" style={{ width: 'fit-content' }}>
                        LIVE PERFORMANCE
                      </Badge>
                      <Title order={3} c="gray.0">The Blue Note</Title>
                      <Text c="dimmed" size="sm">
                        Join {name} for an intimate evening of music at The Blue Note. Experience their latest songs and fan favorites in a cozy setting.
                      </Text>
                      <Button 
                        style={{ width: 'fit-content', marginTop: 'auto' }}
                        size="sm"
                      >
                        Get Tickets
                      </Button>
                    </Stack>
                  </GridCol>
                  <GridCol span={{ base: 12, md: 4 }}>
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv3EiSMWOv9Io9sTcAHcW1V6hOx6x2XvrREmdEMknb0y_n5v6ojQB1YX3fGkEAST4NbeirvraX5lWmbZAvQU7JNdlYc-U0Husyh4TNkuPIk1X9CEg-zb9rAM4aG1g4X6a63BUy-uOAUpo4REDg7TsRQekIibeI2hNmTbwJpBkKgYFJhNi1S9fLBYM4mcq8F6ZnmjeB4FVT8RGxqibAOpNARwjuFoe4pkzzbTjY2zGklvAu-A4RDN2Fc6BOnKBIVN3DFvlk8VE2Ylk"
                      alt="The Blue Note venue"
                      style={{ height: '100%', borderRadius: '8px' }}
                    />
                  </GridCol>
                </Grid>
              </Card>
            </Container>
          </Tabs.Panel>

          <Tabs.Panel value="collaborations" pt="xl">
            <Container size="md">
              <Title order={2} mb="md" c="gray.0">Collaborations</Title>
              <Grid gutter="lg">
                {mockCollaborations.map((collab, index) => (
                  <GridCol key={index} span={{ base: 6, sm: 4, md: 4 }}>
                    <Card 
                      padding="0" 
                      style={{ 
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Image
                        src={collab.image}
                        alt={collab.name}
                        style={{ aspectRatio: '1', borderRadius: '8px' }}
                      />
                      <Text 
                        size="sm" 
                        fw={500} 
                        c="gray.0" 
                        mt="sm" 
                        style={{ 
                          textAlign: 'center',
                          transition: 'color 0.3s ease',
                        }}
                        className="collab-name"
                      >
                        {collab.name}
                      </Text>
                    </Card>
                  </GridCol>
                ))}
              </Grid>
            </Container>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  );
};

export default ArtistProfileContent;
