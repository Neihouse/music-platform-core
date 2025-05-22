"use client";

import { TrackUpload } from "@/components/Upload/TrackUpload";
import {
	Container,
	Title,
	Text,
	Paper,
	Group,
	ThemeIcon,
	Box,
	rem,
	Button,
	Divider
} from "@mantine/core";
import { Dropzone } from '@mantine/dropzone';
import {
	IconMusic,
	IconArrowLeft,
	IconUpload,
	IconX,
	IconFileMusic
} from "@tabler/icons-react";
import Link from "next/link";

export default function UploadTrackPage() {
	return (
		<Container size="lg" py="xl">
			<Group mb={rem(40)} align="center">
				<Button
					component={Link}
					href="/upload"
					variant="subtle"
					leftSection={<IconArrowLeft size={16} />}
				>
					Back to upload options
				</Button>

				<Divider orientation="vertical" />

				<Group gap="xs">
					<ThemeIcon size="lg" radius="md" color="violet" variant="light">
						<IconMusic size={18} />
					</ThemeIcon>
					<Title order={2}>Upload Tracks</Title>
				</Group>
			</Group>

			<Paper
				p="xl"
				radius="md"
				withBorder
				style={{
					borderColor: 'var(--mantine-color-violet-2)',
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				<Box
					style={{
						position: 'absolute',
						top: '-30px',
						right: '-10px',
						opacity: 0.04,
						zIndex: 0,
					}}
				>
					<ThemeIcon size={220} radius={110} color="violet.4">
						<IconMusic size={140} stroke={1} />
					</ThemeIcon>
				</Box>

				<Box style={{ position: 'relative', zIndex: 1 }}>
					<Text size="lg" mb="xl">
						Upload individual tracks with custom artwork and metadata.
					</Text>

					<TrackUpload />

					<Group justify="center" mt="xl">
						<Button
							leftSection={<IconUpload size={18} />}
							size="lg"
							variant="gradient"
							gradient={{ from: 'violet.6', to: 'indigo.6', deg: 90 }}
						>
							Select Tracks to Upload
						</Button>
					</Group>
				</Box>
			</Paper>
		</Container>
	);
}