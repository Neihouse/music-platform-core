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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createArtist } from "@/app/onboarding/artist/actions";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface IArtistFormProps {}

export function ArtistForm(props: IArtistFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      bio: "",
    },
    validate: {
      name: (value: string) => (!!value.length ? null : "Name is required"),
    },
  });

  return (
    <Group justify="center" align="center">
      {/* <Stack align="center" justify="center">
        <Container style={{ textAlign: "center" }}>
          <Title>Art</Title>
          <ArtistArtUpload />
        </Container>
      </Stack>
      <Divider orientation="vertical" /> */}
      <form
        onSubmit={form.onSubmit((values) =>
          submitArtist(values.name, values.bio)
        )}
      >
        <Stack>
          <Container>
            <Title>Artist/Group Name</Title>
            <TextInput
              error={form.errors.name}
              key={form.key("name")}
              placeholder="Enter your artist/group name"
              {...form.getInputProps("name")}
            />
          </Container>
          {/* <Container>
            <Title>Bio/Description</Title>
            <Textarea
              key={form.key("bio")}
              placeholder="Enter a short bio or description"
            />
          </Container> */}
          <Button disabled={loading} type="submit">
            Create Artist
          </Button>
        </Stack>
      </form>
    </Group>
  );

  async function submitArtist(name: string, bio: string) {
    setLoading(true);
    console.log("Submitting artist:", name, bio);
    try {
      const artist = await createArtist(name, bio);
      console.log("Artist created:", artist);
      router.push("/onboarding");
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
