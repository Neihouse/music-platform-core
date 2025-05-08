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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationInput } from "../LocationInput";
import { createArtist } from "@/app/artist/create/actions";
import { getAdministrativeAreaByName } from "@/db/queries/administrative_areas";

export interface IArtistFormProps {}

export function ArtistForm(props: IArtistFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      bio: "",
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Name is required"),
    },
  });

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    console.log("Selected place:", place);
  };

  return (
    <Group justify="center">
      <form
        onSubmit={form.onSubmit((values) => {
          submitArtist(values.name, values.bio, selectedPlace);
        })}
        style={{ width: "100%", maxWidth: "600px", position: "relative" }}
      >
        <LoadingOverlay visible={loading} />
        <Stack spacing="xl">
          <Title order={2}>Create Artist Profile</Title>
          <Container p={0}>
            <Title order={4}>Artist Name</Title>
            <TextInput
              placeholder="Enter your artist name"
              {...form.getInputProps("name")}
            />
          </Container>

          <Container p={0}>
            <Title order={4}>Bio/Description</Title>
            <Textarea
              placeholder="Enter a short bio or description"
              minRows={4}
              {...form.getInputProps("bio")}
            />
          </Container>

          <Container p={0}>
            <Title order={4}>Location</Title>
            <Text size="sm" c="dimmed" mb="xs">
              Where are you based? This helps fans find local artists.
            </Text>
            <LocationInput onPlaceSelect={handlePlaceSelect} />
            {selectedPlace && (
              <Text size="sm" mt="xs" c="dimmed">
                Selected: {selectedPlace.formatted_address}
              </Text>
            )}
          </Container>
          <Divider />
          <Button type="submit" disabled={loading}>
            Create Artist
          </Button>
        </Stack>
      </form>
    </Group>
  );

  async function submitArtist(
    name: string,
    bio: string,
    place: google.maps.places.PlaceResult | null
  ) {
    setLoading(true);
    console.log("Submitting artist:", { name, bio, place });

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
        locality
      );

      console.log("Artist created:", artist);

      notifications.show({
        title: "Success",
        message: "Artist profile created successfully!",
        color: "green",
      });

      router.push(`/artist/${encodeURIComponent(name.toLowerCase())}`);
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
