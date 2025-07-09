"use client";

import { ActionIcon, Avatar, Box, Group, Loader, Stack, Text, useMantineColorScheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconUser, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { ArtistSearchInput } from "./ArtistSearchInput";
import { ArtistSearchResult } from "./actions";

interface IArtistSearchProps {
	onArtistsChange: (artists: ArtistSearchResult[]) => void;
	selectedArtists?: ArtistSearchResult[];
	maxArtists?: number;
	placeholder?: string;
	disabled?: boolean;
	allowDuplicates?: boolean;
}

export function ArtistSearch({
	onArtistsChange,
	selectedArtists = [],
	maxArtists = 10,
	placeholder = "Search and add artists...",
	disabled = false,
	allowDuplicates = false
}: IArtistSearchProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { colorScheme } = useMantineColorScheme();

	// Mobile responsive hooks
	const isMobile = useMediaQuery('(max-width: 768px)');
	const isSmallMobile = useMediaQuery('(max-width: 480px)');

	const handleArtistSelect = async (artist: ArtistSearchResult) => {
		// Check if we've reached the maximum number of artists
		if (selectedArtists.length >= maxArtists) {
			notifications.show({
				title: "Maximum reached",
				message: `You can only add up to ${maxArtists} artists`,
				color: "orange",
			});
			return;
		}

		// Check for duplicates if not allowed
		if (!allowDuplicates && selectedArtists.some(a => a.id === artist.id)) {
			notifications.show({
				title: "Artist already added",
				message: `${artist.name} is already in your list`,
				color: "orange",
			});
			return;
		}

		setIsLoading(true);
		try {
			const updatedArtists = [...selectedArtists, artist];
			onArtistsChange(updatedArtists);

			notifications.show({
				title: "Artist added",
				message: `${artist.name} has been added to your event`,
				color: "green",
			});
		} catch (error) {
			notifications.show({
				title: "Error",
				message: "Failed to add artist",
				color: "red",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemoveArtist = async (artistId: string) => {
		const artistToRemove = selectedArtists.find(a => a.id === artistId);

		if (!artistToRemove) {
			notifications.show({
				title: "Error",
				message: "Artist not found",
				color: "red",
			});
			return;
		}

		setIsLoading(true);
		try {
			const updatedArtists = selectedArtists.filter(a => a.id !== artistId);
			onArtistsChange(updatedArtists);

			notifications.show({
				title: "Artist removed",
				message: `${artistToRemove.name} has been removed`,
				color: "blue",
			});
		} catch (error) {
			notifications.show({
				title: "Error",
				message: "Failed to remove artist",
				color: "red",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<Box style={{ display: 'flex', justifyContent: 'center', padding: isSmallMobile ? '8px' : '12px' }}>
				<Loader type="dots" size={isSmallMobile ? "sm" : "md"} />
			</Box>
		);
	}

	return (
		<Box>
			{/* Search Input */}
			<ArtistSearchInput
				onArtistSelect={handleArtistSelect}
				placeholder={placeholder}
				disabled={disabled || selectedArtists.length >= maxArtists}
				selectedArtists={selectedArtists}
			/>

			{/* Selected Artists List */}
			{selectedArtists.length > 0 && (
				<Stack gap={isSmallMobile ? "xs" : "sm"} mt="md">
					<Text
						size={isSmallMobile ? "sm" : "md"}
						fw={500}
						c="dimmed"
					>
						Selected Artists ({selectedArtists.length}/{maxArtists})
					</Text>

					<Stack gap={isSmallMobile ? "xs" : "sm"}>
						{selectedArtists.map((artist) => (
							<Group
								key={artist.id}
								justify="space-between"
								p={isSmallMobile ? "xs" : "sm"}
								style={{
									backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-blue-0)',
									borderRadius: 'var(--mantine-radius-md)',
									border: `1px solid ${colorScheme === 'dark' ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-blue-2)'}`,
								}}
							>
								<Group gap={isSmallMobile ? "xs" : "sm"}>
									<Avatar
										src={artist.avatarUrl}
										size={isSmallMobile ? "sm" : "md"}
										radius="xl"
									>
										<IconUser size={isSmallMobile ? 14 : 16} />
									</Avatar>
									<Box>
										<Text
											size={isSmallMobile ? "sm" : "md"}
											fw={500}
											style={{ lineHeight: 1.2 }}
										>
											{artist.name}
										</Text>
										{artist.bio && (
											<Text
												size="xs"
												c="dimmed"
												style={{
													lineHeight: 1.2,
													maxWidth: isSmallMobile ? '200px' : '300px',
												}}
												truncate
											>
												{artist.bio}
											</Text>
										)}
									</Box>
								</Group>

								<ActionIcon
									onClick={() => handleRemoveArtist(artist.id)}
									size={isSmallMobile ? "sm" : "md"}
									color="red"
									variant="light"
									radius="xl"
								>
									<IconX size={isSmallMobile ? 12 : 14} />
								</ActionIcon>
							</Group>
						))}
					</Stack>
				</Stack>
			)}

			{/* Helper text */}
			{selectedArtists.length === 0 && (
				<Text
					size="xs"
					c="dimmed"
					mt="xs"
					ta="center"
				>
					Search and select artists to add to your event
				</Text>
			)}
		</Box>
	);
}
