import { Container, Skeleton, Stack, Group, Box, rem } from "@mantine/core";

export default function Loading() {
  return (
    <Container size="xl" py="xl">
      {/* Hero Section Skeleton */}
      <Box mb={rem(40)}>
        <Skeleton height={300} radius="lg" />
      </Box>
      
      {/* Results Section Skeleton */}
      <Stack gap="xl">
        {/* City Stats Skeleton */}
        <Group justify="center">
          <Skeleton height={40} width={300} />
        </Group>
        
        {/* Stats Cards Skeleton */}
        <Group justify="center" gap="md">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={120} width={200} radius="lg" />
          ))}
        </Group>
        
        {/* Content Cards Skeleton */}
        <Box>
          <Skeleton height={30} width={200} mb="lg" />
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: rem(20) }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} height={350} radius="xl" />
            ))}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}
