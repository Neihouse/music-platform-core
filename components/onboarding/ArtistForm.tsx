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
  rem,
  Image,
  Flex,
  useMantineTheme,
  Stepper,
  Center,
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
} from "@tabler/icons-react";

export interface IArtistFormProps {}

export function ArtistForm(props: IArtistFormProps) {
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
  const [avatarImageUrl, setAvatarImageUrl] = useState<string>("");
  const [createdArtistId, setCreatedArtistId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      bio: "",
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

  const handleBannerUploaded = (url: string) => {
    setBannerImageUrl(url);
    console.log("Banner image uploaded:", url);
  };

  const handleAvatarUploaded = (url: string) => {
    setAvatarImageUrl(url);
    console.log("Avatar image uploaded:", url);
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
    <Container size="lg" py="xl">
      <Paper shadow="md" p={{ base: "md", sm: "xl" }} radius="md" withBorder>
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={loading} />

          <Flex
            gap="md"
            justify="center"
            align="center"
            direction="column"
            mb="xl"
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
                    <LocationInput onPlaceSelect={handlePlaceSelect} />
                    {selectedPlace && (
                      <Text size="sm" mt="md" c="dimmed" fw={500}>
                        Selected: {selectedPlace.formatted_address}
                      </Text>
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
                        onBannerUploaded={handleBannerUploaded}
                        onAvatarUploaded={handleAvatarUploaded}
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
                rightSection={<IconArrowRight size={rem(18)} />}
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
                leftSection={<IconCheck size={rem(18)} />}
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

      console.log("Artist created:", artist);
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
