import { Box, Container, Group, Paper, Skeleton, Stack } from "@mantine/core";

export default function EventDetailLoading() {
    return (
        <Container size="lg" pt="xl">
            {/* Desktop Layout */}
            <Box display={{ base: 'none', md: 'block' }}>
                <Group align="flex-start" gap="xl" style={{ minHeight: '100vh' }}>
                    {/* Left Column - Portrait Poster Skeleton */}
                    <Box style={{ flex: '0 0 400px', position: 'sticky', top: '20px' }}>
                        <Stack gap="lg">
                            {/* Poster Skeleton */}
                            <Skeleton height={533} radius="md" style={{ aspectRatio: '3/4' }} />

                            {/* Photo Upload Section Skeleton */}
                            <Paper shadow="sm" p="lg" radius="md">
                                <Stack gap="md">
                                    <Skeleton height={24} width="60%" />
                                    <Skeleton height={120} radius="md" />
                                    <Skeleton height={36} width="40%" />
                                </Stack>
                            </Paper>
                        </Stack>
                    </Box>

                    {/* Right Column - Event Details Skeleton */}
                    <Box style={{ flex: 1, minWidth: 0 }}>
                        <Stack gap="lg">
                            {/* Event Header Skeleton */}
                            <Paper shadow="sm" p="xl" radius="md">
                                <Stack gap="md">
                                    {/* Event Title */}
                                    <Skeleton height={40} width="70%" />

                                    {/* Date and Location */}
                                    <Group gap="xl" wrap="wrap">
                                        <Group gap="xs">
                                            <Skeleton height={20} width={20} radius="sm" />
                                            <Stack gap={4}>
                                                <Skeleton height={24} width={200} />
                                                <Skeleton height={16} width={80} />
                                            </Stack>
                                        </Group>

                                        <Group gap="xs">
                                            <Skeleton height={20} width={20} radius="sm" />
                                            <Stack gap={4}>
                                                <Skeleton height={24} width={180} />
                                                <Skeleton height={16} width={120} />
                                            </Stack>
                                        </Group>
                                    </Group>
                                </Stack>
                            </Paper>

                            {/* Venue Selection Skeleton */}
                            <Paper shadow="sm" p="xl" radius="md">
                                <Stack gap="md">
                                    <Skeleton height={24} width="30%" />
                                    <Skeleton height={40} radius="md" />
                                </Stack>
                            </Paper>

                            {/* Photo Gallery Skeleton */}
                            <Paper shadow="sm" p="xl" radius="md">
                                <Stack gap="md">
                                    <Skeleton height={28} width="40%" />
                                    <Group gap="md">
                                        <Skeleton height={120} width={120} radius="md" />
                                        <Skeleton height={120} width={120} radius="md" />
                                        <Skeleton height={120} width={120} radius="md" />
                                        <Skeleton height={120} width={120} radius="md" />
                                    </Group>
                                </Stack>
                            </Paper>

                            {/* Event Management Skeleton */}
                            <Paper shadow="sm" p="xl" radius="md">
                                <Stack gap="lg">
                                    <Stack gap="sm">
                                        <Skeleton height={32} width="50%" />
                                        <Skeleton height={16} width="80%" />
                                        <Skeleton height={16} width="60%" />
                                    </Stack>
                                    <Group>
                                        <Skeleton height={48} width={200} radius="md" />
                                    </Group>
                                </Stack>
                            </Paper>

                            {/* Event Details Skeleton */}
                            <Paper shadow="sm" p="xl" radius="md">
                                <Stack gap="md">
                                    <Skeleton height={28} width="40%" />
                                    <Group gap="xl">
                                        <Stack gap={4}>
                                            <Skeleton height={14} width={80} />
                                            <Skeleton height={20} width={60} />
                                        </Stack>
                                        <Stack gap={4}>
                                            <Skeleton height={14} width={100} />
                                            <Skeleton height={20} width={120} />
                                        </Stack>
                                        <Stack gap={4}>
                                            <Skeleton height={14} width={60} />
                                            <Skeleton height={20} width={80} />
                                        </Stack>
                                    </Group>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Box>
                </Group>
            </Box>

            {/* Mobile Layout */}
            <Box display={{ base: 'block', md: 'none' }} pt="sm">
                <Stack gap="lg">
                    {/* Mobile Poster Skeleton */}
                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                        <Skeleton height={507} width={380} radius="md" style={{ aspectRatio: '3/4' }} />
                    </Box>

                    {/* Mobile Photo Upload Skeleton */}
                    <Paper shadow="sm" p="lg" radius="md">
                        <Stack gap="md">
                            <Skeleton height={20} width="50%" />
                            <Skeleton height={100} radius="md" />
                            <Skeleton height={32} width="35%" />
                        </Stack>
                    </Paper>

                    {/* Mobile Event Header Skeleton */}
                    <Paper shadow="sm" p="lg" radius="md">
                        <Stack gap="md">
                            {/* Event Title */}
                            <Skeleton height={32} width="85%" />

                            {/* Date and Location */}
                            <Stack gap="md">
                                <Group gap="xs" align="center">
                                    <Skeleton height={18} width={18} radius="sm" />
                                    <Skeleton height={20} width="70%" />
                                </Group>

                                <Group gap="xs" align="center">
                                    <Skeleton height={18} width={18} radius="sm" />
                                    <Stack gap={4} style={{ flex: 1 }}>
                                        <Skeleton height={20} width="60%" />
                                        <Skeleton height={16} width="80%" />
                                    </Stack>
                                </Group>
                            </Stack>
                        </Stack>
                    </Paper>

                    {/* Mobile Venue Selection Skeleton */}
                    <Paper shadow="sm" p="lg" radius="md">
                        <Stack gap="md">
                            <Skeleton height={20} width="40%" />
                            <Skeleton height={36} radius="md" />
                        </Stack>
                    </Paper>

                    {/* Mobile Photo Gallery Skeleton */}
                    <Paper shadow="sm" p="lg" radius="md">
                        <Stack gap="md">
                            <Skeleton height={24} width="50%" />
                            <Group gap="sm">
                                <Skeleton height={100} width={100} radius="md" />
                                <Skeleton height={100} width={100} radius="md" />
                                <Skeleton height={100} width={100} radius="md" />
                            </Group>
                        </Stack>
                    </Paper>

                    {/* Mobile Event Management Skeleton */}
                    <Paper shadow="sm" p="lg" radius="md">
                        <Stack gap="md">
                            <Stack gap="sm">
                                <Skeleton height={28} width="60%" />
                                <Skeleton height={14} width="90%" />
                                <Skeleton height={14} width="70%" />
                            </Stack>
                            <Skeleton height={44} radius="md" />
                        </Stack>
                    </Paper>

                    {/* Mobile Event Details Skeleton */}
                    <Paper shadow="sm" p="lg" radius="md">
                        <Stack gap="md">
                            <Skeleton height={24} width="50%" />
                            <Stack gap="md">
                                <Group justify="space-between">
                                    <Skeleton height={14} width={80} />
                                    <Skeleton height={16} width={60} />
                                </Group>
                                <Group justify="space-between">
                                    <Skeleton height={14} width={100} />
                                    <Skeleton height={16} width={120} />
                                </Group>
                                <Group justify="space-between">
                                    <Skeleton height={14} width={60} />
                                    <Skeleton height={16} width={80} />
                                </Group>
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
        </Container>
    );
}
