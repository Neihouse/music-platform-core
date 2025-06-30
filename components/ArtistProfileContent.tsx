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
  promoters?: Array<{
    id: string;
    name: string;
    bio?: string | null;
    avatar_img?: string | null;
    banner_img?: string | null;
    selectedFont?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
  }>;
}

const ArtistProfileContent = ({
  artist,
  storedLocality,
  canEdit,
  tracksWithPlayCounts,
  avatarUrl,
  bannerUrl,
  promoters = [],
}: ArtistProfileContentProps) => {
  const { name, bio, external_links } = artist;
  const [activeTab, setActiveTab] = useState<string | null>("music");
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Handle scroll for smooth transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrollStart = 200; // When to start the transition
      const scrollEnd = 400; // When to complete the transition
      const scrollY = window.scrollY;
      
      // Calculate progress from 0 to 1
      const progress = Math.min(Math.max((scrollY - scrollStart) / (scrollEnd - scrollStart), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <Box style={{ position: 'relative', height: '400px', marginBottom: '-180px', marginTop: '60px' }}>
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
            background: 'linear-gradient(to top, var(--mantine-color-dark-9) 0%, rgba(22, 17, 34, 0.5) 30%, transparent 70%)',
          }}
        />
      </Box>

      {/* Artist Profile Section */}
      <Container size="lg" style={{ position: 'relative', zIndex: 10 }}>
        <Stack align="center" gap="md" style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
          {/* Placeholder for avatar when it becomes fixed */}
          {scrollProgress > 0 && (
            <div style={{ width: '192px', height: '192px' }} />
          )}
          <Avatar
            src={avatarUrl}
            alt={`${name} avatar`}
            size={192}
            style={{
              border: '4px solid var(--mantine-color-dark-9)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              position: scrollProgress > 0 ? 'fixed' : 'static',
              top: scrollProgress > 0 ? `${80 + (1 - scrollProgress) * 200}px` : 'auto',
              left: scrollProgress > 0 ? `${2 + (1 - scrollProgress) * 20}rem` : 'auto',
              zIndex: scrollProgress > 0 ? 101 : 'auto',
              transform: `scale(${1 - scrollProgress * 0.65})`,
              transformOrigin: 'top left',
              transition: scrollProgress === 0 ? 'all 0.3s ease-in-out' : 'none',
            }}
          />
          <Stack align="center" gap="xs">
            {/* Placeholder for title when it becomes fixed */}
            {scrollProgress > 0 && (
              <div style={{ height: '3rem', width: '100%' }} />
            )}
            <div style={{ 
              textAlign: 'center',
              position: scrollProgress > 0 ? 'fixed' : 'static',
              top: scrollProgress > 0 ? `${85 + (1 - scrollProgress) * 200}px` : 'auto',
              left: scrollProgress > 0 ? `${120 + (1 - scrollProgress) * 200}px` : 'auto',
              zIndex: scrollProgress > 0 ? 101 : 'auto',
              transform: `scale(${1 - scrollProgress * 0.4})`,
              transformOrigin: 'top left',
              transition: scrollProgress === 0 ? 'all 0.3s ease-in-out' : 'none',
            }}>
              <StyledTitle 
                style={{ 
                  color: 'var(--mantine-color-gray-0)',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  margin: 0,
                  whiteSpace: 'nowrap',
                }}
                selectedFont={artist.selectedFont}
              >
                {name}
              </StyledTitle>
            </div>
            <Text size="lg" c="dimmed">Singer-songwriter | Indie Pop</Text>
            <Group gap="xs" align="center">
              <IconMapPin size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
              <Text size="sm" c="dimmed">
                {storedLocality 
                  ? `Based in ${storedLocality.locality.name}, ${storedLocality.administrativeArea.name}, ${storedLocality.country.name}`
                  : 'Location not specified'
                }
              </Text>
            </Group>
            
            {/* Bio section - no title, just content */}
            {bio && (
              <Text c="dimmed" size="md" style={{ lineHeight: 1.6, textAlign: 'center', maxWidth: '600px' }}>
                {bio}
              </Text>
            )}
            
            {/* External Links - no title, just icons */}
            {external_links && external_links.length > 0 && (
              <Group justify="center" gap="md">
                <ExternalLinksDisplay links={external_links} />
              </Group>
            )}
            
            {canEdit && (
              <Group justify="center" mt="md">
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
            <Tabs.Tab value="music">Music</Tabs.Tab>
            <Tabs.Tab value="events">Events</Tabs.Tab>
            <Tabs.Tab value="collaborations">Collectives</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="music" pt="xl" style={{ minHeight: '600px' }}>
            <Container size="md">
              <Title order={2} mb="md" c="gray.0">Featured Music</Title>
              {tracksWithPlayCounts.length > 0 ? (
                <Grid gutter="lg">
                  {tracksWithPlayCounts.slice(0, 8).map((track) => (
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
                      >                      <Box style={{ position: 'relative' }}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/tracks/${track.id}`}
                          alt={track.title}
                          style={{ aspectRatio: '1', borderRadius: '8px' }}
                          fallbackSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBBoDbgVIb0dASOoNd5TjwPTv6yAwUxedBG8JryBF7kdaDp5r_dVgtgHcqS1nzKqUiN5R7HywNojZt_hkqrGdsv7GyAAMRelXiH7hto2423z2fblbw_RethajEcDN2D_YDp9MyDJJ6rlC7JdRb4AjJuIwVyrA7Gij4FVUCd_dLVmojz0f1sl6r0yKoQv-8Q_EqP1oBk7ICCm2AZxbWRGhlQGWhDNbeGhpD9_Rm9rkgI3N4yAaoXibCZnT5uvz6MSflk9bTYAEuiiTE"
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
                            {name} • {track.plays} plays
                          </Text>
                        </Stack>
                      </Card>
                    </GridCol>
                  ))}
                </Grid>
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  No tracks available yet.
                </Text>
              )}
            </Container>
          </Tabs.Panel>

          <Tabs.Panel value="events" pt="xl" style={{ minHeight: '600px' }}>
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

          <Tabs.Panel value="collaborations" pt="xl" style={{ minHeight: '600px' }}>
            <Container size="md">
              <Title order={2} mb="md" c="gray.0">Promoters & Collectives</Title>
              {promoters.length > 0 ? (
                <Grid gutter="lg">
                  {promoters.map((promoter) => {
                    
                    return (
                      <GridCol key={promoter.id} span={{ base: 6, sm: 4, md: 4 }}>
                        <Card 
                          padding="0" 
                          style={{ 
                            backgroundColor: 'rgba(46, 35, 72, 0.3)',
                            border: '1px solid var(--mantine-color-dark-4)',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            borderRadius: '12px',
                            overflow: 'hidden',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          component={Link}
                          href={`/promoters/${nameToUrl(promoter.name)}`}
                        >
                          {/* Banner Image */}
                          <Box style={{ 
                            height: '120px', 
                            position: 'relative',
                            background: promoter.bannerUrl 
                              ? `url(${promoter.bannerUrl})` 
                              : 'linear-gradient(135deg, var(--mantine-color-violet-6), var(--mantine-color-indigo-6))',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}>
                            {/* Avatar positioned to overlap banner */}
                            <Avatar
                              src={promoter.avatarUrl}
                              alt={promoter.name}
                              size={60}
                              radius="xl"
                              style={{
                                position: 'absolute',
                                bottom: -30,
                                left: 16,
                                border: '3px solid var(--mantine-color-dark-7)',
                                zIndex: 10,
                              }}
                            >
                              {promoter.name.charAt(0)}
                            </Avatar>
                          </Box>
                          
                          {/* Content Section */}
                          <Box p="md" pt="xl">
                            <Text 
                              size="md" 
                              fw={600} 
                              c="gray.0" 
                              mb="xs"
                              lineClamp={1}
                            >
                              {promoter.name}
                            </Text>
                            {promoter.bio && (
                              <Text 
                                size="sm" 
                                c="dimmed" 
                                lineClamp={2}
                                mb="sm"
                              >
                                {promoter.bio}
                              </Text>
                            )}
                            <Badge 
                              variant="light" 
                              color="blue" 
                              size="sm"
                              style={{ width: 'fit-content' }}
                            >
                              Promoter
                            </Badge>
                          </Box>
                        </Card>
                      </GridCol>
                    );
                  })}
                </Grid>
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  No promoters or collectives found yet.
                </Text>
              )}
            </Container>
          </Tabs.Panel>
        </Tabs>
      </Container>

      {/* Add bottom spacing */}
      <div style={{ height: '4rem' }} />
    </Box>
  );
};

export default ArtistProfileContent;
