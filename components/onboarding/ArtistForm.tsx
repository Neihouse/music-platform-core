"use client";

import { onDeleteArtistLocation, submitArtist } from "@/app/artists/[artistName]/actions";
import { ArtistWithLocation } from "@/db/queries/artists";
import { nameToUrl } from "@/lib/utils";
import { StoredLocality } from "@/utils/supabase/global.types";
import {
  Button,
  Card,
  Container,
  em,
  Grid,
  GridCol,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Transition,
  useMantineColorScheme,
  useMantineTheme
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconPhoto
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FontSelect from "../FontSelect";
import { LocationInput } from "../LocationInput";
import { ArtistArtUpload } from "../Upload/ArtistArtUpload/index";

export interface IArtistFormProps {
  artist?: ArtistWithLocation
}

export function ArtistForm({ artist: _artist }: IArtistFormProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [artist, setArtist] = useState<ArtistWithLocation | null>(_artist || null);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] =
    useState<StoredLocality | undefined>(_artist?.storedLocality || undefined);
  const [showUploadSections, setShowUploadSections] = useState(false);

  const router = useRouter();

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  const form = useForm({
    initialValues: {
      name: artist?.name || "",
      bio: artist?.bio || "",
      fontFamily: artist?.selectedFont || "", // Initialize with existing selected font
    },
    validate: {
      name: (value: string) =>
        value.trim().length > 0 ? null : "Name is required",
    },
  });

  // Simple font loading for preview - load font when selected
  useEffect(() => {
    if (form.values.fontFamily) {
      const fontName = form.values.fontFamily.replace(/ /g, '+');

      // Check if font is already loaded
      const existingLink = document.querySelector(`link[href*="${fontName}"]`);
      if (!existingLink) {
        const fontLink = document.createElement('link');
        fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
    }
  }, [form.values.fontFamily]);



  const handleNextStep = () => {
    // Validate form
    form.validate();
    if (!form.isValid()) return;
    if (!selectedPlace) {
      notifications.show({
        title: "Location Required",
        message: "Please select a location for your artist profile",
        color: "red",
      });
      return;
    }

    // Save the artist profile
    submitArtistBasics();
  };


  return (
    <Container
      size="lg"
      px={isMobile ? "sm" : isTablet ? "md" : "xl"}
      py={isMobile ? "md" : "xl"}
    >
      <Paper
        p={isMobile ? "md" : isTablet ? "lg" : "xl"}
        radius={isMobile ? "md" : "lg"}
        shadow={isMobile ? "xs" : isTablet ? "sm" : "md"}
        maw={isMobile ? "100%" : isTablet ? 600 : isSmallScreen ? 700 : 800}
        mx="auto"
        bg={colorScheme === 'dark' ? 'dark.7' : 'white'}
        withBorder
      >
        <form
          onSubmit={form.onSubmit(async (values) => {
            if (!selectedPlace) {
              notifications.show({
                title: "Location Required",
                message: "Please select a location for your artist profile",
                color: "red",
              });
              return;
            }
            await submitArtistBasics();
          })}
        >
          <Stack gap={isMobile ? "md" : isTablet ? "lg" : "xl"}>
            {/* Header Section */}
            <Group justify="center" mb={isMobile ? "md" : "lg"}>
              <Title
                order={isMobile ? 2 : 1}
                size={isMobile ? "1.5rem" : isTablet ? "1.8rem" : "2.2rem"}
                ta="center"
                c="blue.7"
                fw={isMobile ? 600 : 700}
              >
                {showUploadSections ? "Upload Your Images" : (!!artist ? "Edit" : "Create") + " Your Artist Profile"}
              </Title>
            </Group>

            {/* Basic Information Section - Hidden when showing uploads */}
            <Transition
              mounted={!showUploadSections}
              transition="fade"
              duration={400}
              timingFunction="ease-out"
            >
              {(styles) => (
                <div style={styles}>
                  <Stack gap={isMobile ? "md" : isTablet ? "lg" : "xl"}>
                    {/* Basic Information Section */}
                    <Stack gap={isMobile ? "sm" : "md"}>
                      <TextInput
                        label="Artist Name"
                        placeholder="Enter your artist name"
                        size={isMobile ? "sm" : "md"}
                        radius={isMobile ? "sm" : "md"}
                        {...form.getInputProps("name")}
                        styles={{
                          label: {
                            fontSize: "var(--mantine-font-size-sm)",
                            fontWeight: 500,
                            marginBottom: "0.25rem"
                          }
                        }}
                      />

                      <Textarea
                        label="Bio/Description"
                        placeholder="Tell fans about yourself and your music"
                        minRows={isMobile ? 3 : 4}
                        maxRows={isMobile ? 6 : 8}
                        size={isMobile ? "sm" : "md"}
                        radius={isMobile ? "sm" : "md"}
                        autosize
                        {...form.getInputProps("bio")}
                        styles={{
                          label: {
                            fontSize: "var(--mantine-font-size-sm)",
                            fontWeight: 500,
                            marginBottom: "0.25rem"
                          }
                        }}
                      />
                    </Stack>

                    {/* Location Section */}
                    <Paper
                      p={isMobile ? "sm" : "md"}
                      bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'}
                      radius={isMobile ? "sm" : "md"}
                      withBorder
                    >
                      <Stack gap={isMobile ? "sm" : "md"}>
                        <Text
                          size={isMobile ? "sm" : "md"}
                          fw={500}
                          c={colorScheme === 'dark' ? 'white' : 'dark.8'}
                        >
                          Location
                        </Text>
                        <Text size="sm" c="dimmed" mb="md">
                          Where are you based? This helps fans find local artists.
                        </Text>
                        <LocationInput
                          onPlaceSelect={setSelectedPlace}
                          onRemovePlace={handleDeleteLocation}
                          storedLocality={selectedPlace}
                        />
                      </Stack>
                    </Paper>

                    {/* Font Selection Section */}
                    <Paper
                      p={isMobile ? "sm" : "md"}
                      bg={colorScheme === 'dark' ? 'dark.6' : 'blue.0'}
                      radius={isMobile ? "sm" : "md"}
                      withBorder
                    >
                      <Stack gap={isMobile ? "sm" : "md"}>
                        <FontSelect
                          label="Brand Font"
                          placeholder="Choose a font for your brand..."
                          description="This font will be used for your artist name and branding"
                          size={isMobile ? "sm" : "md"}
                          {...form.getInputProps("fontFamily")}
                        />

                        {form.values.fontFamily && form.values.name && (
                          <Paper
                            p={isMobile ? "sm" : "md"}
                            bg={colorScheme === 'dark' ? 'dark.7' : 'white'}
                            radius={isMobile ? "sm" : "md"}
                            withBorder
                          >
                            <Stack gap="xs">
                              <Text
                                size={isMobile ? "xs" : "sm"}
                                c="dimmed"
                                fw={500}
                              >
                                Preview: {form.values.fontFamily}
                              </Text>
                              <Text
                                size={isMobile ? "lg" : isTablet ? "xl" : "2rem"}
                                fw={600}
                                ta="center"
                                style={{
                                  fontFamily: `"${form.values.fontFamily}", "Inter", sans-serif`,
                                }}
                                c={colorScheme === 'dark' ? 'white' : 'dark.8'}
                              >
                                {form.values.name}
                              </Text>
                              {!isMobile && (
                                <Text
                                  size="xs"
                                  c="dimmed"
                                  ta="center"
                                  style={{ fontFamily: 'monospace' }}
                                >
                                  CSS: font-family: "{form.values.fontFamily}", sans-serif
                                </Text>
                              )}
                            </Stack>
                          </Paper>
                        )}
                      </Stack>
                    </Paper>

                    {/* Submit Button - Only show when not showing upload sections */}
                    <Group justify="center" mt={isMobile ? "md" : "lg"}>
                      <Button
                        disabled={loading}
                        type="submit"
                        size={isMobile ? "md" : "lg"}
                        radius={isMobile ? "md" : "lg"}
                        w={isMobile ? "100%" : "auto"}
                        px={isMobile ? "xl" : "3rem"}
                        loading={loading}
                        gradient={{ from: "blue", to: "cyan", deg: 45 }}
                        variant="gradient"
                        style={{
                          minHeight: isMobile ? '44px' : '48px',
                        }}
                      >
                        {artist ? "Update Profile" : "Create Profile"}
                      </Button>
                    </Group>
                  </Stack>
                </div>
              )}
            </Transition>

            {/* Upload Sections - Show with transition after artist is created */}
            <Transition
              mounted={showUploadSections && !!artist?.id}
              transition="fade-up"
              duration={600}
              timingFunction="ease-out"
            >
              {(styles) => (
                <div style={styles}>
                  <Grid gutter="xl" mt="xl" justify="center">
                    <GridCol span={{ base: 12, sm: 10, md: 8, lg: 6, xl: 5 }}>
                      <Stack gap="xl">
                        <Card withBorder p="md" radius="md" shadow="sm">
                          <Group mb="md" gap="xs">
                            <IconPhoto size={20} color={theme.colors.blue[6]} />
                            <Title
                              order={4}
                              style={{ color: theme.colors.blue[7] }}
                            >
                              Artist Artwork
                            </Title>
                          </Group>
                          <Text size="sm" c="dimmed" mb="xl">
                            Upload your artist avatar and banner to make your
                            profile stand out. These images will be displayed on
                            your artist profile page.
                          </Text>
                          <ArtistArtUpload
                            artistId={artist?.id}
                          />
                        </Card>
                      </Stack>
                    </GridCol>
                  </Grid>
                </div>
              )}
            </Transition>

            {/* Complete Button - Show when in upload sections */}
            <Transition
              mounted={showUploadSections}
              transition="fade"
              duration={400}
              timingFunction="ease-out"
            >
              {(styles) => (
                <div style={styles}>
                  <Group justify="center" mt="xl">
                    <Button
                      onClick={() => {
                        router.push(`/artists/${nameToUrl(form.values.name)}`);
                      }}
                      size="lg"
                      radius="md"
                      leftSection={<IconCheck size={em(18)} />}
                      gradient={{ from: "green", to: "teal", deg: 90 }}
                      variant="gradient"
                    >
                      Complete Setup
                    </Button>
                  </Group>
                </div>
              )}
            </Transition>
          </Stack>
        </form>
      </Paper>
    </Container>
  );

  async function handleDeleteLocation() {
    setSelectedPlace(undefined);
    if (artist) {
      setArtist(await onDeleteArtistLocation(artist.id))
    }

  }

  async function submitArtistBasics() {
    setLoading(true);

    try {
      if (!selectedPlace) {
        throw new Error("No address components found");
      }

      setArtist(
        await submitArtist(
          form.values.name,
          form.values.bio,
          selectedPlace,
          form.values.fontFamily || null
        )
      )

      notifications.show({
        title: "Success",
        message: artist ? "Profile updated successfully!" : "Profile created successfully!",
        color: "green",
      });

      // If this is a new artist, trigger the transition to upload sections
      if (!artist) {
        setTimeout(() => {
          setShowUploadSections(true);
        }, 800);
      } else {
        // Navigate to the artist profile for existing artists
        router.push(`/artists/${nameToUrl(form.values.name)}`);
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `${error}`,
        color: "red",
      });

      console.error("Error creating artist:", error);
    } finally {
      setLoading(false);
    }
  }
}
