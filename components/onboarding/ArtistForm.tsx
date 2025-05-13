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
  Pill,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocationInput } from "../LocationInput";
import { ArtistArtUpload } from "../ArtistArtUpload/index";
import { onDeleteArtistLocation, submitArtist } from "@/app/artists/[artistName]/actions";
import {
  IconCheck,
  IconMusic,
  IconInfoCircle,
  IconArrowRight,
  IconPhoto,
  IconTag,
} from "@tabler/icons-react";
import { ArtistWithLocation } from "@/db/queries/artists";
import TagGrid from "../Tags/TagGrid";
import { addTagToEntity, getTagsForEntity, removeTagFromEntity } from "@/db/queries/tags";
import { Tag } from "@/utils/supabase/global.types";
import { createClient } from "@/utils/supabase/client";

export interface IArtistFormProps {
  artist?: ArtistWithLocation
}

export function ArtistForm({ artist: _artist }: IArtistFormProps) {
  const theme = useMantineTheme();
  const [artist, setArtist] = useState<ArtistWithLocation | null>(_artist || null);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState<boolean>(false);

  const [activeStep, setActiveStep] = useState(0);
  const supabase = createClient();

  const router = useRouter();

  // Fetch tags when artist is set
  useEffect(() => {
    if (artist?.id) {
      fetchArtistTags(artist.id);
    }
  }, [artist?.id]);

  // Function to fetch tags for an artist
  const fetchArtistTags = async (artistId: string) => {
    setLoadingTags(true);
    try {
      const artistTags = await getTagsForEntity(supabase, 'artists', artistId);
      setTags(artistTags);
    } catch (error) {
      console.error("Error fetching artist tags:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load artist tags",
        color: "red",
      });
    } finally {
      setLoadingTags(false);
    }
  };

  // Handle tag selection
  const handleTagSelected = async (tag: Tag) => {
    if (!artist?.id) return;

    try {
      setLoadingTags(true);
      await addTagToEntity(supabase, 'artists', artist.id, tag.id);
      setTags((prevTags) => [...prevTags, tag]);
      notifications.show({
        title: "Success",
        message: `Added tag: ${tag.name}`,
        color: "green",
      });
    } catch (error) {
      console.error("Error adding tag:", error);
      notifications.show({
        title: "Error",
        message: `Failed to add tag: ${tag.name}`,
        color: "red",
      });
    } finally {
      setLoadingTags(false);
    }
  };

  // Handle tag removal
  const handleTagRemove = async (tag: Tag) => {
    if (!artist?.id) return;

    try {
      setLoadingTags(true);
      await removeTagFromEntity(supabase, 'artists', artist.id, tag.id);
      setTags((prevTags) => prevTags.filter((t) => t.id !== tag.id));
      notifications.show({
        title: "Success",
        message: `Removed tag: ${tag.name}`,
        color: "blue",
      });
    } catch (error) {
      console.error("Error removing tag:", error);
      notifications.show({
        title: "Error",
        message: `Failed to remove tag: ${tag.name}`,
        color: "red",
      });
    } finally {
      setLoadingTags(false);
    }
  };

  const form = useForm({
    initialValues: {
      name: artist?.name || "",
      bio: artist?.bio || "",
    },
    validate: {
      name: (value: string) =>
        value.trim().length > 0 ? null : "Name is required",
    },
  });

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    console.log("Selected place:", place);
  };

  const handleNextStep = () => {
    // Validate form for step 1
    if (activeStep === 0) {
      form.validate();
      if (!form.isValid()) return;
      if (!selectedPlace && !artist?.formattedAddress) {
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
      // Move to artwork step
      setActiveStep(2);
    } else if (activeStep === 2) {
      // Finish the process
      if (artist?.id) {
        router.push(
          `/artists/${encodeURIComponent(form.values.name.toLowerCase())}`
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
                    {artist?.formattedAddress ? (
                      <Pill
                        w="min-content"
                        size="xl" withRemoveButton color="green"
                        onRemove={handleDeleteLocation}
                      >
                        {artist.formattedAddress}
                      </Pill>) : (
                      <LocationInput onPlaceSelect={handlePlaceSelect} />
                    )}
                  </Card>
                </GridCol>
              </Grid>
            </Stepper.Step>

            <Stepper.Step
              label="Genre Tags"
              description="Add genres and tags"
              icon={<IconTag size={18} />}
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
                        Artist Genres & Tags
                      </Title>
                      <Text size="sm" c="dimmed" mb="xl">
                        Add genres and tags to help fans discover your music. Tags help categorize your music and make it more discoverable.
                      </Text>
                      {artist?.id ? (
                        <TagGrid
                          tags={tags}
                          onTagSelected={handleTagSelected}
                          onTagRemove={handleTagRemove}
                          entityType="artists"
                          label="Genres & Tags"
                          placeholder="Search or add genres/tags"
                        />
                      ) : (
                        <Text c="dimmed">Save your artist profile first to add tags.</Text>
                      )}
                    </Card>
                  </Stack>
                </Box>
              </Center>
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
                Continue to Tags
              </Button>
            ) : activeStep === 1 ? (
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
    setSelectedPlace(null);
    if (artist) {
      setArtist(await onDeleteArtistLocation(artist.id))
    }

  }

  async function submitArtistBasics() {
    setLoading(true);
    console.log("Submitting artist basics:", {
      name: form.values.name,
      bio: form.values.bio,
      place: selectedPlace,
    });

    try {
      // Extract location information

      if (!selectedPlace?.address_components) {
        throw new Error("No address components found");
      }

      const artist = await submitArtist(
        form.values.name,
        form.values.bio,
        selectedPlace.address_components
      );

      setArtist(artist);

      // Move to next step
      setActiveStep(1);

      notifications.show({
        title: "Success",
        message: "Artist profile created! Now you can add genre tags.",
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
