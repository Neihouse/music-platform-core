import {
  Button,
  Container,
  Title,
  Text,
  Center,
  Stack,
  Group,
  Image,
} from "@mantine/core";
import Link from "next/link";

export default function ArtistNotFound() {
  return (
    <Container size="lg" style={{ height: "100vh", padding: 0 }}>
      <Center style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <Stack
          align="center"
          justify="center"
          gap="clamp(1rem, 3vh, 2rem)"
          style={{
            maxHeight: "90vh",
            width: "100%",
            padding: "clamp(1rem, 5vw, 3rem)",
          }}
        >
          <Image
            src="/artist-not-found.svg"
            alt="Artist not found"
            style={{
              width: "clamp(80px, 20vw, 150px)",
              height: "clamp(80px, 20vw, 150px)",
              maxHeight: "25vh",
            }}
            fallbackSrc="https://placehold.co/150x150?text=404"
          />
          <Title
            order={1}
            ta="center"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
          >
            Artist Not Found
          </Title>
          <Text
            c="dimmed"
            ta="center"
            style={{
              fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
              maxWidth: "min(500px, 90vw)",
            }}
          >
            Sorry, we couldn't find the artist you're looking for. They may have
            changed their name or removed their profile.
          </Text>
          <Group
            style={{
              marginTop: "clamp(0.5rem, 2vh, 1.5rem)",
              gap: "clamp(0.5rem, 2vw, 1rem)",
            }}
          >
            <Button
              component={Link}
              href="/"
              style={{
                fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                padding:
                  "clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem)",
              }}
              radius="md"
              variant="filled"
            >
              Return to Home
            </Button>
            <Button
              component={Link}
              href="/artists"
              style={{
                fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                padding:
                  "clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem)",
              }}
              radius="md"
              variant="outline"
            >
              Browse Artists
            </Button>
          </Group>
        </Stack>
      </Center>
    </Container>
  );
}
