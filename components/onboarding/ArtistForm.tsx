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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationInput } from "../LocationInput";
import { ArtistArtUpload } from "../ArtistArtUpload/index";
import { createArtist } from "@/app/artists/create/actions";
import { IconCheck, IconMusic, IconInfoCircle } from "@tabler/icons-react";

export interface IArtistFormProps {}

export function ArtistForm(props: IArtistFormProps) {
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
  const [avatarImageUrl, setAvatarImageUrl] = useState<string>("");
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

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p={{ base: "md", sm: "xl" }} radius="md" withBorder>
        <form
          onSubmit={form.onSubmit((values) => {
            submitArtist(values.name, values.bio, selectedPlace);
          })}
          style={{ position: "relative" }}
        >
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
              around the world. Upload your artwork, add your bio, and set your
              location.
            </Text>
          </Flex>

          <Grid gutter="xl">
            <GridCol span={{ base: 12, md: 6 }}>
              <Stack gap="xl">
                <Card withBorder p="md" radius="md" shadow="sm">
                  <Group mb="md" gap="xs">
                    <IconInfoCircle size={20} color={theme.colors.blue[6]} />
                    <Title order={4} style={{ color: theme.colors.blue[7] }}>
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
              </Stack>
            </GridCol>

            <GridCol span={{ base: 12, md: 6 }}>
              <Card withBorder p="md" radius="md" shadow="sm" h="100%">
                <Title
                  order={4}
                  mb="lg"
                  style={{ color: theme.colors.blue[7] }}
                >
                  Artist Artwork
                </Title>
                <ArtistArtUpload
                  onBannerUploaded={handleBannerUploaded}
                  onAvatarUploaded={handleAvatarUploaded}
                />
              </Card>
            </GridCol>
          </Grid>

          <Divider my="xl" />

          <Group justify="center" mt="xl">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              radius="md"
              leftSection={<IconCheck size={rem(18)} />}
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
              variant="gradient"
            >
              Create Artist Profile
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );

  async function submitArtist(
    name: string,
    bio: string,
    place: google.maps.places.PlaceResult | null
  ) {
    setLoading(true);
    console.log("Submitting artist:", {
      name,
      bio,
      place,
      bannerImageUrl,
      avatarImageUrl,
    });

    try {
      // Extract location information
      const administrativeArea = place?.address_components?.find((component) =>
        component.types.includes("administrative_area_level_1")
      )?.long_name;

      const locality = place?.address_components?.find((component) =>
        component.types.includes("locality")
      )?.long_name;

      if (!administrativeArea || !locality) {
        throw new Error(
          "Administrative area and locality are required for location."
        );
      }

      const artist = await createArtist(
        name,
        bio,
        administrativeArea,
        locality,
        avatarImageUrl,
        bannerImageUrl
      );

      console.log("Artist created:", artist);

      notifications.show({
        title: "Success",
        message: "Artist profile created successfully!",
        color: "green",
      });

      router.push(`/artists/${encodeURIComponent(name.toLowerCase())}`);
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
