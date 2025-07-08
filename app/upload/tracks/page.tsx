"use client";

import { TrackUpload } from "@/components/Upload/TrackUpload";
import {
	Box,
	Button,
	Container,
	Divider,
	Group,
	Paper,
	rem,
	Text,
	ThemeIcon,
	Title
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
	IconArrowLeft,
	IconMusic
} from "@tabler/icons-react";
import Link from "next/link";

export default function UploadTrackPage() {
	const isMobile = useMediaQuery("(max-width: 48em)");

	return (
		<Container size="lg" py={isMobile ? "md" : "xl"}>
			<Group mb={isMobile ? rem(30) : rem(40)} align="center" wrap="nowrap" style={{ overflow: 'auto' }}>
				<Button
					component={Link}
					href="/dashboard"
					variant="subtle"
					leftSection={<IconArrowLeft size={16} />}
					size={isMobile ? "sm" : "md"}
					px={isMobile ? "xs" : "md"}
				>
					Back to dashboard
				</Button>

				<Divider orientation="vertical" />

				<Group gap="xs">
					<ThemeIcon size={isMobile ? "md" : "lg"} radius="md" color="violet" variant="light">
						<IconMusic size={isMobile ? 16 : 18} />
					</ThemeIcon>
					<Title order={isMobile ? 3 : 2}>Upload Tracks</Title>
				</Group>
			</Group>

			<Paper
				p={isMobile ? "md" : "xl"}
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
					<ThemeIcon size={isMobile ? 180 : 220} radius={isMobile ? 90 : 110} color="violet.4">
						<IconMusic size={isMobile ? 110 : 140} stroke={1} />
					</ThemeIcon>
				</Box>

				<Box style={{ position: 'relative', zIndex: 1 }}>
					<Text size={isMobile ? "md" : "lg"} mb={isMobile ? "md" : "xl"}>
						Upload individual tracks with custom artwork and metadata.
					</Text>

					<TrackUpload />

				</Box>
			</Paper>
		</Container>
	);
}