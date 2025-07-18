"use client";

import { AspectRatio, Box, Container, Grid, Skeleton, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

function EventCardSkeleton() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isMedium = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash during hydration - show adaptive skeleton based on likely viewport
  if (!mounted) {
    // Use a more adaptive fallback based on common screen sizes
    // Default to tablet layout (span=6) as a middle ground
    return (
      <Grid.Col span={{ base: 4, sm: 6, md: 4, lg: 3 }}>
        <Box pos="relative">
          <AspectRatio ratio={3 / 4}>
            <Skeleton
              height="100%"
              radius="md"
              animate={true}
              style={{ width: '100%', height: '100%' }}
            />
          </AspectRatio>
          {/* Date badge skeleton */}
          <Skeleton
            height={20}
            width={40}
            radius="sm"
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
            }}
          />
          {/* Venue overlay skeleton */}
          <Box
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <Skeleton height={12} width="60%" radius="xl" />
          </Box>
        </Box>
      </Grid.Col>
    );
  }

  // Mobile skeleton - just poster
  if (isMobile) {
    return (
      <Grid.Col span={{ base: 4, sm: 6, md: 4, lg: 3 }}>
        <Box pos="relative">
          <AspectRatio ratio={3 / 4}>
            <Skeleton
              height="100%"
              radius="md"
              animate={true}
              style={{ width: '100%', height: '100%' }}
            />
          </AspectRatio>
          {/* Date badge skeleton */}
          <Skeleton
            height={20}
            width={40}
            radius="sm"
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
            }}
          />
          {/* Venue overlay skeleton */}
          <Box
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
            }}
          >
            <Skeleton height={12} width="60%" radius="xl" />
          </Box>
        </Box>
      </Grid.Col>
    );
  }

  // Medium screens skeleton
  if (isMedium) {
    return (
      <Grid.Col span={4}>
        <Box
          style={{
            borderRadius: '8px',
            padding: '12px',
            height: '100%',
          }}
        >
          <Stack gap="xs" h="100%">
            {/* Poster skeleton */}
            <Box pos="relative" mb="xs">
              <AspectRatio ratio={3 / 4}>
                <Skeleton height="100%" radius="md" />
              </AspectRatio>
              <Skeleton
                height={24}
                width={50}
                radius="sm"
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                }}
              />
            </Box>

            {/* Event details skeleton */}
            <Stack gap="xs" style={{ flex: 1 }}>
              <div>
                <Skeleton height={18} width="85%" mb={4} />
                <Skeleton height={14} width="65%" />
              </div>

              {/* Button skeleton */}
              <Skeleton height={32} mt="auto" radius="sm" />
            </Stack>
          </Stack>
        </Box>
      </Grid.Col>
    );
  }

  // Desktop skeleton
  return (
    <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
      <Box
        style={{
          borderRadius: '8px',
          padding: '12px',
          height: '100%',
        }}
      >
        <Stack gap={0} h="100%">
          {/* Poster skeleton */}
          <Box pos="relative" mb="xs">
            <AspectRatio ratio={3 / 4}>
              <Skeleton height="100%" radius="md" />
            </AspectRatio>
            <Skeleton
              height={28}
              width={60}
              radius="sm"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
              }}
            />
          </Box>

          {/* Event details skeleton */}
          <Stack gap="xs" style={{ flex: 1 }}>
            <div>
              <Skeleton height={20} width="90%" mb={4} />
              <Skeleton height={14} width="70%" mb={4} />
              <Skeleton height={14} width="80%" />
            </div>

            {/* Action buttons skeleton */}
            <Stack gap="xs" mt="auto" pt="xs">
              <Grid gutter="xs">
                <Grid.Col span={6}>
                  <Skeleton height={28} radius="sm" />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Skeleton height={28} radius="sm" />
                </Grid.Col>
              </Grid>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Grid.Col>
  );
}

export default function Loading() {
  return (
    <Container size="xl" py={{ base: "md", sm: "xl" }}>
      <Stack gap="xl">
        {/* Header Section Skeleton */}
        <Stack gap="md">
          <Skeleton height={40} width={300} />
          <Skeleton height={20} width={500} />
        </Stack>

        {/* Events Grid Skeleton */}
        <Grid gutter={{ base: "sm", sm: "md", md: "xl" }}>
          {Array.from({ length: 12 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
