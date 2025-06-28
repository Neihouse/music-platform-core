"use client";

import {
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Textarea,
  TextInput,
  Title,
  Text,
  LoadingOverlay,
  Paper,
  Grid,
  GridCol,
  Box,
  Card,
  Flex,
  useMantineTheme,
  Stepper,
  Center,
  em,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocationInput } from "../LocationInput";
import { ArtistArtUpload } from "../Upload/ArtistArtUpload/index";
import FontSelect from "../FontSelect";
import { onDeleteArtistLocation, submitArtist } from "@/app/artists/[artistName]/actions";
import { nameToUrl } from "@/lib/utils";
import {
  IconCheck,
  IconMusic,
  IconInfoCircle,
  IconArrowRight,
  IconPhoto,
  IconTypography,
} from "@tabler/icons-react";
import { ArtistWithLocation } from "@/db/queries/artists";
import { StoredLocality } from "@/utils/supabase/global.types";

export interface IArtistFormProps {
  artist?: ArtistWithLocation
}

export function ArtistForm({ artist: _artist }: IArtistFormProps) {
  const theme = useMantineTheme();
  const [artist, setArtist] = useState<ArtistWithLocation | null>(_artist || null);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] =
    useState<StoredLocality | undefined>(_artist?.storedLocality || undefined);

  const [activeStep, setActiveStep] = useState(0);

  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: artist?.name || "",
      bio: artist?.bio || "",
      fontFamily: (artist as any)?.selectedFont || "", // Initialize with existing selected font
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
    // Validate form for step 1
    if (activeStep === 0) {
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
    } else if (activeStep === 1) {
      // Finish the process
      if (artist?.id) {
        router.push(
          `/artists/${nameToUrl(form.values.name)}`
        );
      }
    }
  };


  return (
    <Container>
      <Paper shadow="md" p={{ base: "md", sm: "xl" }} radius="md" withBorder>
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={loading} />

          <Flex
            gap="md"
            justify="center"
            align="center"
            direction="column"
          >
            <Title
              order={2}
              ta="center"
              style={{ color: theme.colors.blue[7] }}
            >
              {!!artist ? "Edit" : "Create"} Your Artist Profile
            </Title>
            <Text c="dimmed" size="sm" ta="center" maw={600}>
              Complete your artist profile to start sharing your music with fans
              around the world.
            </Text>
          </Flex>

          <Stepper active={activeStep} onStepClick={setActiveStep} mb="xl">
            <Stepper.Step
              label="Basic Information"
              description="Profile details"
              icon={<IconInfoCircle size={18} />}
            >
              <Grid gutter="xl">
                <GridCol span={{ base: 12, md: 6 }}>
                  <Stack gap="xl">
                    <Card withBorder p="md" radius="md" shadow="sm">
                      <Group mb="md" gap="xs">
                        <IconInfoCircle
                          size={20}
                          color={theme.colors.blue[6]}
                        />
                        <Title
                          order={4}
                          style={{ color: theme.colors.blue[7] }}
                        >
                          Basic Information
                        </Title>
                      </Group>

                      <Stack gap="md">
                        <Box>
                          <Text fw={500} mb="xs">
                            Artist Name
                          </Text>
                          <TextInput
                            placeholder="Enter your artist name"
                            size="md"
                            radius="md"
                            {...form.getInputProps("name")}
                          />
                        </Box>

                        <Box>
                          <Text fw={500} mb="xs">
                            Bio/Description
                          </Text>
                          <Textarea
                            placeholder="Tell fans about yourself and your music"
                            minRows={5}
                            size="md"
                            radius="md"
                            autosize
                            maxRows={10}
                            {...form.getInputProps("bio")}
                          />
                        </Box>

                        <Box>
                          <Group gap="xs" mb="xs">
                            <IconTypography size={16} color={theme.colors.blue[6]} />
                            <Text fw={500}>
                              Brand Font
                            </Text>
                          </Group>
                          <FontSelect
                            placeholder="Choose a font for your brand..."
                            description="This font will be used for your artist name and branding"
                            size="md"
                            {...form.getInputProps("fontFamily")}
                          />
                          {form.values.fontFamily && form.values.name && (
                            <Paper mt="sm" p="md" radius="md" withBorder>
                              <Text size="xs" c="dimmed" mb="xs">
                                Preview: {form.values.fontFamily}
                              </Text>
                              <Text 
                                size="xl" 
                                fw={600}
                                style={{ 
                                  fontFamily: `"${form.values.fontFamily}", "Inter", sans-serif`,
                                }}
                              >
                                {form.values.name}
                              </Text>
                              <Text size="xs" c="dimmed" mt="xs" style={{ fontFamily: 'monospace' }}>
                                CSS: font-family: "{form.values.fontFamily}", sans-serif
                              </Text>
                            </Paper>
                          )}
                        </Box>
                      </Stack>
                    </Card>
                  </Stack>
                </GridCol>
                <GridCol span={{ base: 12, md: 6 }}>
                  <Card withBorder p="md" radius="md" shadow="sm">
                    <Group mb="md" gap="xs">
                      <IconMusic size={20} color={theme.colors.blue[6]} />
                      <Title order={4} style={{ color: theme.colors.blue[7] }}>
                        Location
                      </Title>
                    </Group>
                    <Text size="sm" c="dimmed" mb="md">
                      Where are you based? This helps fans find local artists.
                    </Text>
                    <LocationInput
                      onPlaceSelect={setSelectedPlace}
                      onRemovePlace={handleDeleteLocation}
                      storedLocality={selectedPlace}
                    />
                  </Card>
                </GridCol>
              </Grid>
            </Stepper.Step>

            <Stepper.Step
              label="Artist Artwork"
              description="Profile pictures"
              icon={<IconPhoto size={18} />}
            >
              <Center>
                <Box maw={800} w="100%">
                  <Stack gap="xl">
                    <Card withBorder p="md" radius="md" shadow="sm">
                      <Title
                        order={4}
                        mb="lg"
                        style={{ color: theme.colors.blue[7] }}
                      >
                        Artist Artwork
                      </Title>
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
                </Box>
              </Center>
            </Stepper.Step>
          </Stepper>

          <Divider my="xl" />

          <Group justify="center" mt="xl">
            {activeStep === 0 ? (
              <Button
                onClick={handleNextStep}
                disabled={loading}
                size="lg"
                radius="md"
                rightSection={<IconArrowRight size={em(18)} />}
                gradient={{ from: "blue", to: "cyan", deg: 90 }}
                variant="gradient"
              >
                Continue to Artwork
              </Button>
            ) : (
              <Button
                onClick={handleNextStep}
                disabled={loading}
                size="lg"
                radius="md"
                leftSection={<IconCheck size={em(18)} />}
                gradient={{ from: "green", to: "teal", deg: 90 }}
                variant="gradient"
              >
                Complete Profile
              </Button>
            )}
          </Group>
        </div>
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
          form.values.fontFamily || null // Pass the selected font family
        )
      )


      setActiveStep(1);

      notifications.show({
        title: "Success",
        message: "Profile updated!",
        color: "green",
      });
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
