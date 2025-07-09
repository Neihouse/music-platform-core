"use client";

import { Autocomplete, Avatar, Group, Loader, Text } from "@mantine/core";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { IconSearch, IconUser } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { ArtistSearchResult, getAllArtistsAction, searchArtists } from "./actions";

export interface IArtistSearchInputProps {
    onArtistSelect: (artist: ArtistSearchResult) => void;
    placeholder?: string;
    disabled?: boolean;
    selectedArtists?: ArtistSearchResult[];
}

export function ArtistSearchInput({
    onArtistSelect,
    placeholder = "Search for artists...",
    disabled = false,
    selectedArtists = [],
}: IArtistSearchInputProps) {
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch] = useDebouncedValue(searchValue, 300);
    const [artists, setArtists] = useState<ArtistSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAllArtists, setShowAllArtists] = useState(false);

    // Mobile responsive hooks
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isSmallMobile = useMediaQuery('(max-width: 480px)');

    // Load all artists when component mounts and search is empty
    useEffect(() => {
        const loadAllArtists = async () => {
            if (debouncedSearch.trim() === "" && !showAllArtists) {
                setLoading(true);
                try {
                    const allArtists = await getAllArtistsAction();
                    setArtists(allArtists);
                    setShowAllArtists(true);
                } catch (error) {
                    console.error("Error loading artists:", error);
                    setArtists([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadAllArtists();
    }, [debouncedSearch, showAllArtists]);

    // Search for artists when search value changes
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearch.trim() === "") {
                return; // Don't search for empty string, keep showing all artists
            }

            setLoading(true);
            try {
                const searchResults = await searchArtists(debouncedSearch);
                setArtists(searchResults);
                setShowAllArtists(false);
            } catch (error) {
                console.error("Error searching artists:", error);
                setArtists([]);
            } finally {
                setLoading(false);
            }
        };

        if (debouncedSearch.trim() !== "") {
            performSearch();
        }
    }, [debouncedSearch]);

    // Convert artists to autocomplete data format, filtering out already selected artists
    const autocompleteData = useMemo(() => {
        const selectedArtistIds = selectedArtists.map(artist => artist.id);
        const filteredArtists = artists.filter(artist => !selectedArtistIds.includes(artist.id));

        return filteredArtists.map(artist => ({
            value: artist.name,
            label: artist.name,
            artist: artist,
        }));
    }, [artists, selectedArtists]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Prevent form submission when Enter is pressed in the artist search
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const handleSelect = (value: string) => {
        const selectedData = autocompleteData.find(item => item.value === value);
        if (selectedData) {
            onArtistSelect(selectedData.artist);
            console.log("Selected artist:", selectedData.artist);
            setSearchValue(""); // Clear search input after selection
        }
    };



    return (
        <Autocomplete
            value={searchValue}
            onChange={setSearchValue}
            onOptionSubmit={handleSelect}
            data={autocompleteData}
            placeholder={placeholder}
            leftSection={loading ? <Loader size={16} /> : <IconSearch size={16} />}
            size={isSmallMobile ? "sm" : "md"}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            style={{
                width: '100%',
                maxWidth: isMobile ? '100%' : '400px'
            }}
            renderOption={({ option }) => {
                const artistData = autocompleteData.find(item => item.value === option.value);
                const artist = artistData?.artist;

                if (!artist) return <Text>{option.value}</Text>;

                return (
                    <Group gap="sm">
                        <Avatar
                            src={artist.avatarUrl}
                            size="sm"
                            radius="xl"
                        >
                            <IconUser size={16} />
                        </Avatar>
                        <div>
                            <Text size="sm" fw={500}>
                                {artist.name}
                            </Text>
                            {artist.bio && (
                                <Text size="xs" c="dimmed" truncate>
                                    {artist.bio.length > 50 ? `${artist.bio.substring(0, 50)}...` : artist.bio}
                                </Text>
                            )}
                        </div>
                    </Group>
                );
            }}
            maxDropdownHeight={300}
            limit={10}
            comboboxProps={{
                transitionProps: { transition: 'pop', duration: 200 },
            }}
        />
    );
}
