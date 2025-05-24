
"use client";

import { AlbumUpload } from "@/components/Upload/AlbumUpload";
import {
	Container,
	Title,
	Text,
	Paper,
	Group,
	Box,
	rem,
	Button,
	Divider
} from "@mantine/core";
import {
	IconDisc,
	IconArrowLeft
} from "@tabler/icons-react";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";

export default function UploadAlbumPage() {
	const isMobile = useMediaQuery("(max-width: 48em)");

	return (
		<Container size="xl" py="xl">
			<Paper
				shadow="md"
				p={isMobile ? "md" : "xl"}
				radius="lg"
				withBorder
				style={{
					background: 'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-indigo-0) 100%)',
					borderColor: 'var(--mantine-color-blue-2)',
				}}
			>
				<Box mb={rem(30)}>
					{/* Back Button */}
					<Group mb="lg">
						<Button
							component={Link}
							href="/upload"
							variant="subtle"
							leftSection={<IconArrowLeft size={16} />}
							size={isMobile ? "sm" : "md"}
						>
							Back to Upload Options
						</Button>
					</Group>

					{/* Header */}
					<Group align="center" mb="md" gap="md">
						<Box
							style={{
								background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-indigo-6))',
								borderRadius: '50%',
								padding: rem(12),
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<IconDisc size={isMobile ? 24 : 32} color="white" />
						</Box>
						<div>
							<Title order={isMobile ? 2 : 1} c="blue.8">
								Upload Album
							</Title>
							<Text size={isMobile ? "md" : "lg"} c="dimmed" mt="xs">
								Upload a complete album with multiple tracks and unified artwork.
							</Text>
						</div>
					</Group>

					<Divider mb="xl" />

					<AlbumUpload />

				</Box>
			</Paper>
		</Container>
	);
}