"use client";

import { createFan } from "@/app/fans/create/actions";
import {
  Button,
  Container,
  Group,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface IFanFormProps { }

export function FanForm(props: IFanFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      displayName: "",
      preferredGenres: "",
    },
    validate: {
      displayName: (value: string) =>
        !!value.length ? null : "Display name is required",
    },
  });

  return (
    <Group justify="center" align="center" mt="xl">
      <Paper p="lg" radius="md" shadow="sm">
        <form
          onSubmit={form.onSubmit((values) =>
            submitFan(values.displayName, values.preferredGenres),
          )}
        >
          <Stack gap="md">
            <Container>
              <Title order={2} mb="md">
                Fan Profile
              </Title>
              <TextInput
                label="Display Name"
                error={form.errors.displayName}
                key={form.key("displayName")}
                placeholder="Enter your display name"
                {...form.getInputProps("displayName")}
                mb="md"
              />

              <Select
                label="Preferred Genre"
                key={form.key("preferredGenres")}
                placeholder="Select your favorite genre"
                data={[
                  { value: "rock", label: "Rock" },
                  { value: "pop", label: "Pop" },
                  { value: "hip-hop", label: "Hip Hop" },
                  { value: "electronic", label: "Electronic" },
                  { value: "jazz", label: "Jazz" },
                  { value: "classical", label: "Classical" },
                ]}
                {...form.getInputProps("preferredGenres")}
                mb="md"
              />

              <Title order={4} mb="sm">
                Your Location
              </Title>
            </Container>

            <Button disabled={loading} type="submit" mt="md">
              Create Fan Profile
            </Button>
          </Stack>
        </form>
      </Paper>
    </Group>
  );

  async function submitFan(displayName: string, preferredGenres: string) {
    setLoading(true);
    console.log("Submitting fan:", displayName, preferredGenres);
    try {
      const fan = await createFan(displayName, preferredGenres);
      console.log("Fan profile created:", fan);
      // Fans don't have a specific dashboard, redirect to discover page
      router.push("/discover");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `${error}`,
        color: "red",
      });

      console.error("Error creating fan profile:", error);
    } finally {
      setLoading(false);
    }
  }
}
