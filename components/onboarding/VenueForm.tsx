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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createVenue } from "@/app/venues/create/actions";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocationInput } from "@/components/LocationInput";
import { IconUpload } from "@tabler/icons-react";

export interface IVenueFormProps {}

export function VenueForm(props: IVenueFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      venueName: "",
      description: "",
      address: "",
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

  return (
    <Group justify="center" align="center" mt="xl">
      <Paper p="lg" radius="md" shadow="sm" w={600}>
        <form
          onSubmit={form.onSubmit((values) =>
            submitVenue(
              values.venueName,
              values.description,
              values.address,
              values.capacity,
              values.contactEmail,
              values.contactPhone
            )
          )}
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

              <TextInput
                label="Street Address"
                key={form.key("address")}
                placeholder="123 Music Street"
                {...form.getInputProps("address")}
                mb="md"
              />

              <Title order={4} mb="sm">
                Location
              </Title>
              <LocationInput />

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
    address: string,
    capacity: number,
    contactEmail: string,
    contactPhone: string
  ) {
    setLoading(true);
    console.log(
      "Submitting venue:",
      venueName,
      description,
      address,
      capacity,
      contactEmail,
      contactPhone
    );
    try {
      const venue = await createVenue(
        venueName,
        description,
        address,
        capacity,
        contactEmail,
        contactPhone
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
