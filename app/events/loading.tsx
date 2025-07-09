"use client";

import { AspectRatio, Box, Container, Grid, Skeleton, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

function EventCardSkeleton() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isMedium = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  // Mobile skeleton - just poster
  if (isMobile) {
    return (
      <Grid.Col span={6} p={0}>
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
            width={30} 
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
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
              borderRadius: '0 0 8px 8px',
              padding: '8px',
            }}
          >
            <Skeleton height={12} width="70%" />
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
        <Grid gutter={{ base: "xs", sm: "md", md: "xl" }}>
          {Array.from({ length: 12 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
