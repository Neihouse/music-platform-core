import { getAllPromotersWithMetrics } from "@/db/queries/promoters";
import { createClient } from "@/utils/supabase/server";
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  Stack,
  Badge,
  Avatar,
  Box,
  Center,
  Button,
  Paper,
  Divider,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import {
  IconUsers,
  IconMusic,
  IconSparkles,
  IconCalendarEvent,
  IconArrowRight,
  IconPlus,
  IconTrendingUp,
  IconEye,
} from "@tabler/icons-react";
import Link from "next/link";
import { nameToUrl } from "@/lib/utils";

interface PromoterCardProps {
  promoter: {
    id: string;
    name: string;
    bio: string | null;
    banner_img: string | null;
    artistCount: number;
    sampleArtists: any[];
    trackMetrics: { total: number; recent: number };
    showMetrics: { total: number; upcoming: number; past: number };
  };
  index: number;
}

function PromoterCard({ promoter, index }: PromoterCardProps) {
  // Use the actual banner image URL if available
  const bannerImageUrl = promoter.banner_img 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/banners/${promoter.banner_img}`
    : null;
  
  return (
    <Card
      padding={0}
      radius="xl"
      style={{
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        minHeight: "400px",
        background: bannerImageUrl 
          ? `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%), url(${bannerImageUrl})`
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
      styles={{
        root: {
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
        },
      }}
    >
      {/* Rank badge */}
      <Box
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 2,
        }}
      >
        <Badge
          variant="filled"
          color="dark"
          size="lg"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          #{index + 1}
        </Badge>
      </Box>

      <Stack gap="md" p="xl" style={{ position: "relative", zIndex: 1, height: "100%" }}>
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs" flex={1}>
            <Title
              order={3}
              c="white"
              style={{ 
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                fontWeight: 700,
              }}
            >
              {promoter.name}
            </Title>
            <Badge
              variant="light"
              color="white"
              size="sm"
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                alignSelf: "flex-start",
              }}
            >
              Music Collective
            </Badge>
          </Stack>
        </Group>

        {/* Bio */}
        {promoter.bio && (
          <Text
            size="sm"
            c="rgba(255,255,255,0.9)"
            lineClamp={2}
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {promoter.bio}
          </Text>
        )}

        {/* Metrics Grid */}
        <SimpleGrid cols={3} spacing="md" mt="auto">
          <Paper
            p="md"
            radius="lg"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              textAlign: "center",
            }}
          >
            <Stack gap="xs" align="center">
              <IconUsers size={24} color="white" />
              <Text size="lg" fw={700} c="white">
                {promoter.artistCount}
              </Text>
              <Text size="xs" c="rgba(255,255,255,0.8)" fw={500}>
                Artists
              </Text>
            </Stack>
          </Paper>

          <Paper
            p="md"
            radius="lg"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              textAlign: "center",
            }}
          >
            <Stack gap="xs" align="center">
              <IconMusic size={24} color="white" />
              <Text size="lg" fw={700} c="white">
                {promoter.trackMetrics.recent}
              </Text>
              <Text size="xs" c="rgba(255,255,255,0.8)" fw={500}>
                Recent Tracks
              </Text>
            </Stack>
          </Paper>

          <Paper
            p="md"
            radius="lg"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              textAlign: "center",
            }}
          >
            <Stack gap="xs" align="center">
              <IconCalendarEvent size={24} color="white" />
              <Text size="lg" fw={700} c="white">
                {promoter.showMetrics.total}
              </Text>
              <Text size="xs" c="rgba(255,255,255,0.8)" fw={500}>
                Shows
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>

        {/* Featured Artists */}
        {promoter.sampleArtists.length > 0 && (
          <Box>
            <Text size="xs" c="rgba(255,255,255,0.8)" fw={600} mb="xs">
              Featured Artists:
            </Text>
            <Group gap="xs">
              {promoter.sampleArtists.slice(0, 2).map((artist: any, idx: number) => (
                <Badge
                  key={artist.id}
                  variant="light"
                  size="sm"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {artist.name}
                </Badge>
              ))}
              {promoter.sampleArtists.length > 2 && (
                <Badge
                  variant="light"
                  size="sm"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  +{promoter.sampleArtists.length - 2} more
                </Badge>
              )}
            </Group>
          </Box>
        )}

        {/* Action Buttons */}
        <Group gap="sm" justify="center">
          <Button
            component={Link}
            href={`/promoters/${nameToUrl(promoter.name)}`}
            variant="white"
            size="sm"
            radius="lg"
            leftSection={<IconEye size={16} />}
            style={{
              background: "rgba(255,255,255,0.9)",
              color: "#1a1a1a",
              fontWeight: 600,
              flex: 1,
            }}
            styles={{
              root: {
                "&:hover": {
                  background: "white",
                  transform: "translateY(-1px)",
                },
              },
            }}
          >
            View Details
          </Button>
          
          <Button
            component={Link}
            href="/events/create"
            variant="filled"
            size="sm"
            radius="lg"
            leftSection={<IconPlus size={16} />}
            style={{
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              border: "none",
              fontWeight: 600,
              flex: 1,
            }}
            styles={{
              root: {
                "&:hover": {
                  opacity: 0.9,
                  transform: "translateY(-1px)",
                },
              },
            }}
          >
            Plan Event
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}

export default async function PromotersPage() {
  const supabase = await createClient();
  const promoters = await getAllPromotersWithMetrics(supabase);
  
  return (
    <Container size="xl" py="xl">
      {/* Hero Section */}
      <Box mb="xl" style={{ textAlign: "center" }}>
        <Group justify="center" mb="md">
          <IconSparkles size={40} style={{ color: "var(--mantine-color-yellow-5)" }} />
          <IconMusic size={48} style={{ color: "var(--mantine-color-blue-6)" }} />
          <IconUsers size={40} style={{ color: "var(--mantine-color-green-6)" }} />
        </Group>
        <Title
          order={1}
          size="h1"
          mb="sm"
          style={{
            background: "linear-gradient(45deg, var(--mantine-color-blue-6), var(--mantine-color-purple-6))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Music Collectives 🎭
        </Title>
        <Text size="lg" c="dimmed" maw={600} mx="auto" mb="md">
          Discover the creative collectives shaping the music scene. Connect with artists, 
          explore their latest releases, and plan your next event.
        </Text>
        <Group justify="center" gap="xs">
          <Badge variant="light" color="blue" size="lg">
            {promoters.length} Active Collectives
          </Badge>
          <Badge variant="light" color="green" size="lg">
            Local & Global
          </Badge>
          <Badge variant="light" color="purple" size="lg">
            Join the Movement
          </Badge>
        </Group>
      </Box>

      {/* Promoter Cards Grid */}
      {promoters.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
          {promoters.map((promoter, index) => (
            <PromoterCard
              key={promoter.id}
              promoter={promoter}
              index={index}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Center py="xl">
          <Stack align="center" gap="md">
            <IconUsers size={64} color="var(--mantine-color-gray-4)" />
            <Title order={3} c="dimmed">
              No Collectives Found
            </Title>
            <Text c="dimmed" ta="center">
              Be the first to create a music collective in your area!
            </Text>
            <Button
              component={Link}
              href="/promoters/create"
              variant="light"
              leftSection={<IconSparkles size={16} />}
            >
              Create Collective
            </Button>
          </Stack>
        </Center>
      )}

      {/* Call to action */}
      {promoters.length > 0 && (
        <Center mt="xl" pt="xl">
          <Paper p="xl" radius="xl" withBorder style={{ textAlign: "center" }}>
            <Stack gap="md">
              <Title order={3}>Ready to Join the Movement?</Title>
              <Text c="dimmed">
                Create your own collective and connect with artists, venues, and music lovers.
              </Text>
              <Button
                component={Link}
                href="/promoters/create"
                size="lg"
                leftSection={<IconSparkles size={20} />}
                style={{
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                }}
              >
                Start Your Collective
              </Button>
            </Stack>
          </Paper>
        </Center>
      )}
    </Container>
  );
}
