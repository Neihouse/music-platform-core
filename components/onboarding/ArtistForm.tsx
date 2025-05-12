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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationInput } from "../LocationInput";
import { ArtistArtUpload } from "../ArtistArtUpload/index";
import { createArtist } from "@/app/artists/create/actions";
import {
  IconCheck,
  IconMusic,
  IconInfoCircle,
  IconArrowRight,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { Artist } from "@/utils/supabase/global.types";

export interface IArtistFormProps {
  artist?: Artist
}

export function ArtistForm({ artist }: IArtistFormProps) {
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [createdArtistId, setCreatedArtistId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const router = useRouter();

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
      if (createdArtistId) {
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
              Create Your Artist Profile
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
                    {selectedPlace ? (
                      <Pill
                        w="min-content"
                        size="xl" withRemoveButton color="green"
                        onRemove={() => setSelectedPlace(null)}
                      >
                        {selectedPlace.formatted_address}
                      </Pill>) : (
                      <LocationInput onPlaceSelect={handlePlaceSelect} />
                    )}
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
                        artistId={createdArtistId || undefined}
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

  async function submitArtistBasics() {
    setLoading(true);
    console.log("Submitting artist basics:", {
      name: form.values.name,
      bio: form.values.bio,
      place: selectedPlace,
    });

    try {
      // Extract location information
      const administrativeArea = selectedPlace?.address_components?.find(
        (component) => component.types.includes("administrative_area_level_1")
      )?.long_name;

      const locality = selectedPlace?.address_components?.find((component) =>
        component.types.includes("locality")
      )?.long_name;

      const country = selectedPlace?.address_components?.find((component) =>
        component.types.includes("country")
      )?.long_name;

      if (!administrativeArea || !locality) {
        throw new Error(
          "Administrative area and locality are required for location."
        );
      }

      const artist = await createArtist(
        form.values.name,
        form.values.bio,
        administrativeArea,
        locality

      );

      setCreatedArtistId(artist.id);

      // Move to next step
      setActiveStep(1);

      notifications.show({
        title: "Success",
        message: "Artist profile created! Now you can add your artwork.",
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
