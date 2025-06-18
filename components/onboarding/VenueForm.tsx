"use client";

import {
  Button,
  Container,
  Group,
  Stack,
  TextInput,
  Title,
  Textarea,
  Paper,
  FileInput,
  NumberInput,
  Switch,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createVenue } from "@/app/venues/create/actions";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationInput } from "@/components/LocationInput";
import { StoredLocality } from "@/utils/supabase/global.types";
import { IconUpload } from "@tabler/icons-react";

export interface IVenueFormProps { }

export function VenueForm(props: IVenueFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<StoredLocality | undefined>();
  
  const form = useForm({
    initialValues: {
      venueName: "",
      description: "",
      capacity: 0,
      contactEmail: "",
      contactPhone: "",
      venueImages: null,
    },
    validate: {
      venueName: (value: string) =>
        !!value.length ? null : "Venue name is required",
      contactEmail: (value: string) =>
        !value || /^\S+@\S+$/.test(value) ? null : "Invalid email address",
    },
  });

  // Custom validation for location
  const validateForm = () => {
    const formErrors = form.validate();
    if (!selectedPlace) {
      notifications.show({
        title: "Error",
        message: "Please select a location for your venue",
        color: "red",
      });
      return false;
    }
    return !formErrors.hasErrors;
  };

  async function handleRemoveLocation() {
    setSelectedPlace(undefined);
  }

  return (
    <Group justify="center" align="center" mt="xl">
      <Paper p="lg" radius="md" shadow="sm" w={600}>
        <form
          onSubmit={form.onSubmit((values) => {
            if (!validateForm()) {
              return;
            }
            return submitVenue(
              values.venueName,
              values.description,
              selectedPlace!,
              values.capacity,
              values.contactEmail,
              values.contactPhone,
            );
          })}
        >
          <Stack gap="md">
            <Container>
              <Title order={2} mb="md">
                Venue Information
              </Title>

              <TextInput
                label="Venue Name"
                error={form.errors.venueName}
                key={form.key("venueName")}
                placeholder="Enter your venue name"
                {...form.getInputProps("venueName")}
                mb="md"
              />

              <Textarea
                label="Description"
                key={form.key("description")}
                placeholder="Tell us about your venue"
                minRows={3}
                {...form.getInputProps("description")}
                mb="md"
              />

              <Title order={4} mb="sm">
                Venue Location & Address
              </Title>
              <Text size="sm" c="dimmed" mb="md">
                Enter the full address of your venue. This will help fans find your location.
              </Text>
              
              <LocationInput
                onPlaceSelect={setSelectedPlace}
                onRemovePlace={handleRemoveLocation}
                storedLocality={selectedPlace}
                searchFullAddress={true}
              />

              <NumberInput
                label="Capacity"
                key={form.key("capacity")}
                placeholder="Maximum venue capacity"
                min={0}
                {...form.getInputProps("capacity")}
                mb="md"
              />

              <TextInput
                label="Contact Email"
                error={form.errors.contactEmail}
                key={form.key("contactEmail")}
                placeholder="contact@yourvenue.com"
                {...form.getInputProps("contactEmail")}
                mb="md"
              />

              <TextInput
                label="Contact Phone"
                key={form.key("contactPhone")}
                placeholder="(555) 123-4567"
                {...form.getInputProps("contactPhone")}
                mb="md"
              />

              <FileInput
                label="Venue Images"
                placeholder="Upload venue images"
                leftSection={<IconUpload size={16} />}
                accept="image/png,image/jpeg"
                mb="md"
                multiple
              />
            </Container>

            <Button disabled={loading} type="submit" mt="md">
              Register Venue
            </Button>
          </Stack>
        </form>
      </Paper>
    </Group>
  );

  async function submitVenue(
    venueName: string,
    description: string,
    location: StoredLocality,
    capacity: number,
    contactEmail: string,
    contactPhone: string,
  ) {
    setLoading(true);
    console.log(
      "Submitting venue:",
      venueName,
      description,
      location,
      capacity,
      contactEmail,
      contactPhone,
    );
    try {
      const venue = await createVenue(
        venueName,
        description,
        location,
        capacity,
        contactEmail,
        contactPhone,
      );
      console.log("Venue created:", venue);
      router.push("/");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `${error}`,
        color: "red",
      });

      console.error("Error creating venue:", error);
    } finally {
      setLoading(false);
    }
  }
}
