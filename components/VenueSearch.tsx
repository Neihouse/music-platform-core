"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  TextInput, 
  Paper, 
  Stack, 
  Group, 
  Text, 
  UnstyledButton,
  Highlight,
  ScrollArea,
  Loader,
  Badge,
  ActionIcon
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch, IconMapPin, IconX } from "@tabler/icons-react";

interface Venue {
  id: string;
  name: string;
  address?: string | null;
  capacity?: number | null;
}

interface VenueSearchProps {
  venues: Venue[];
  onSelect: (venue: Venue | null) => void;
  selectedVenueId?: string | null;
  placeholder?: string;
  clearable?: boolean;
}

export function VenueSearch({ 
  venues, 
  onSelect, 
  selectedVenueId, 
  placeholder = "Search venues...",
  clearable = true 
}: VenueSearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  // Find selected venue
  const selectedVenue = venues.find(venue => venue.id === selectedVenueId);

  // Filter venues based on search
  const filteredVenues = useMemo(() => {
    if (!debouncedSearch) return venues;
    
    const searchLower = debouncedSearch.toLowerCase();
    return venues.filter(venue => 
      venue.name.toLowerCase().includes(searchLower) ||
      venue.address?.toLowerCase().includes(searchLower)
    );
  }, [venues, debouncedSearch]);

  // Update search value when venue is selected
  useEffect(() => {
    if (selectedVenue && !isOpen) {
      setSearchValue(selectedVenue.name);
    }
  }, [selectedVenue, isOpen]);

  const handleSelect = (venue: Venue) => {
    onSelect(venue);
    setSearchValue(venue.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    onSelect(null);
    setSearchValue("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchValue(value);
    setIsOpen(true);
    setHighlightedIndex(-1);
    
    // If cleared, notify parent
    if (!value && selectedVenueId) {
      onSelect(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen || filteredVenues.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredVenues.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredVenues.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && filteredVenues[highlightedIndex]) {
          handleSelect(filteredVenues[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (selectedVenue) {
      setSearchValue("");
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicks on items
    setTimeout(() => {
      setIsOpen(false);
      // Restore selected venue name if no new selection was made
      if (selectedVenue && searchValue !== selectedVenue.name) {
        setSearchValue(selectedVenue.name);
      }
    }, 200);
  };

  return (
    <div style={{ position: "relative" }}>
      <TextInput
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        leftSection={<IconSearch size={16} />}
        rightSection={
          clearable && selectedVenueId ? (
            <ActionIcon 
              size="sm" 
              variant="subtle" 
              onClick={handleClear}
              style={{ cursor: "pointer" }}
            >
              <IconX size={14} />
            </ActionIcon>
          ) : null
        }
      />

      {isOpen && (
        <Paper
          shadow="md"
          p={0}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: 4,
            maxHeight: 300,
            overflow: "hidden"
          }}
        >
          <ScrollArea style={{ maxHeight: 300 }}>
            {filteredVenues.length === 0 ? (
              <Text p="md" c="dimmed" ta="center">
                {debouncedSearch ? "No venues found" : "No venues available"}
              </Text>
            ) : (
              <Stack gap={0}>
                {filteredVenues.map((venue, index) => (
                  <UnstyledButton
                    key={venue.id}
                    p="sm"
                    onClick={() => handleSelect(venue)}
                    style={{
                      display: "block",
                      width: "100%",
                      borderBottom: "1px solid var(--mantine-color-gray-2)",
                      backgroundColor: 
                        venue.id === selectedVenueId ? "var(--mantine-color-blue-0)" :
                        index === highlightedIndex ? "var(--mantine-color-gray-0)" :
                        "transparent"
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={2} style={{ flex: 1 }}>
                        <Group gap="xs">
                          <IconMapPin size={16} />
                          <Text fw={500}>
                            <Highlight 
                              highlight={debouncedSearch}
                              highlightStyles={{ backgroundColor: "yellow" }}
                            >
                              {venue.name}
                            </Highlight>
                          </Text>
                        </Group>
                        
                        {venue.address && (
                          <Text size="sm" c="dimmed" pl={24}>
                            <Highlight 
                              highlight={debouncedSearch}
                              highlightStyles={{ backgroundColor: "yellow" }}
                            >
                              {venue.address}
                            </Highlight>
                          </Text>
                        )}
                      </Stack>
                      
                      {venue.capacity && (
                        <Badge size="sm" variant="light">
                          {venue.capacity.toLocaleString()} cap
                        </Badge>
                      )}
                    </Group>
                  </UnstyledButton>
                ))}
              </Stack>
            )}
          </ScrollArea>
        </Paper>
      )}
    </div>
  );
}
