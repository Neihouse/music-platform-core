"use client";

import { createTag, searchTags } from "@/db/queries/tags";
import { Tag as TagType } from "@/utils/supabase/global.types";
import {
	Badge,
	Box,
	Combobox,
	Group,
	Input,
	Pill,
	PillsInput,
	Text,
	useCombobox
} from "@mantine/core";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";

export interface TagGridProps {
	/**
	 * Array of tag objects to display in the grid
	 */
	tags: TagType[];

	/**
	 * Function called when a tag is selected (either from the list or created new)
	 * @param tag The tag object that was selected
	 */
	onTagSelected?: (tag: TagType) => void;

	/**
	 * Function called when a tag is removed from the grid
	 * @param tag The tag object that was removed
	 */
	onTagRemove?: (tag: TagType) => void;

	/**
	 * Whether to allow creating new tags
	 * @default true
	 */
	allowCreating?: boolean;

	/**
	 * Label for the tag input
	 * @default "Tags"
	 */
	label?: string;

	/**
	 * Placeholder text for the tag input
	 * @default "Search or add tags"
	 */
	placeholder?: string;

	/**
	 * Maximum number of tags to display
	 * @default undefined (no limit)
	 */
	maxTags?: number;

	/**
	 * Custom class name for the component
	 */
	className?: string;

	/**
	 * The type of entity the tags are being associated with
	 * This is for informational purposes only and doesn't affect functionality
	 */
	entityType?: 'artists' | 'tracks' | 'venues' | 'promoters';
}

/**
 * A responsive grid of tags with the ability to search, add, and remove tags
 */
export default function TagGrid({
	tags,
	onTagSelected,
	onTagRemove,
	allowCreating = true,
	label = "Tags",
	placeholder = "Search or add tags",
	maxTags,
	className
}: TagGridProps) {
	const [value, setValue] = useState<string>("");
	const [searchResults, setSearchResults] = useState<TagType[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const supabase = createClient();

	// When the input value changes, search for matching tags
	const handleSearchChange = useCallback(async (query: string) => {
		setValue(query);

		if (query.trim() === "") {
			setSearchResults([]);
			return;
		}

		setLoading(true);
		try {
			const results = await searchTags(supabase, query);
			// Filter out tags that are already selected
			const filteredResults = results.filter(
				(result) => !tags.some((tag) => tag.id === result.id)
			);
			setSearchResults(filteredResults);
		} catch (error) {
			console.error("Error searching tags:", error);
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	}, [supabase, tags]);

	// Create a new tag and add it
	const handleCreateTag = async (tagName: string) => {
		try {
			setLoading(true);
			// Create the tag in the database
			const newTag = await createTag(supabase, tagName);

			// Call the onTagSelected callback with the new tag
			if (onTagSelected) {
				onTagSelected(newTag);
			}

			// Reset the input value
			setValue("");
			setSearchResults([]);
		} catch (error) {
			console.error("Error creating tag:", error);
		} finally {
			setLoading(false);
			combobox.closeDropdown();
		}
	};

	// When a tag is selected from the dropdown
	const handleTagSelect = (tagId: string) => {
		if (tagId === "create" && value.trim() !== "") {
			handleCreateTag(value.trim());
			return;
		}

		const selectedTag = searchResults.find((tag) => tag.id === tagId);
		if (selectedTag && onTagSelected) {
			onTagSelected(selectedTag);
		}

		// Reset the input state
		setValue("");
		setSearchResults([]);
		combobox.closeDropdown();
	};

	// Allow creating a new tag when pressing Enter
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && value.trim() !== "" && allowCreating) {
			// Check if the tag already exists in search results
			const existingTag = searchResults.find(
				(tag) => tag.name.toLowerCase() === value.toLowerCase()
			);

			if (existingTag) {
				// If it exists, select it
				handleTagSelect(existingTag.id);
			} else {
				// Otherwise create a new tag
				handleCreateTag(value.trim());
			}

			event.preventDefault();
		}
	};

	// Render the dropdown options
	const options = searchResults.map((tag) => (
		<Combobox.Option value={tag.id} key={tag.id}>
			<Group gap="xs">
				<Text>{tag.name}</Text>
			</Group>
		</Combobox.Option>
	));

	// Show "Create" option if allowCreating is true and there's a value
	const shouldShowCreate =
		allowCreating &&
		value.trim() !== "" &&
		!searchResults.some((tag) => tag.name.toLowerCase() === value.toLowerCase()) &&
		!tags.some((tag) => tag.name.toLowerCase() === value.toLowerCase());

	return (
		<Box className={className}>
			<Combobox
				store={combobox}
				onOptionSubmit={handleTagSelect}
				withinPortal={true}
			>
				<Combobox.Target>
					<PillsInput
						label={label}
						description="Click a tag to remove it"
					>
						<Pill.Group>
							{tags.map((tag) => (
								<Pill
									key={tag.id}
									withRemoveButton
									onRemove={() => onTagRemove && onTagRemove(tag)}
								>
									{tag.name}
								</Pill>
							))}

							<Combobox.EventsTarget>
								<PillsInput.Field
									placeholder={placeholder}
									value={value}
									onChange={(e) => handleSearchChange(e.currentTarget.value)}
									onFocus={() => combobox.openDropdown()}
									onBlur={() => combobox.closeDropdown()}
									onKeyDown={handleKeyDown}
								/>
							</Combobox.EventsTarget>

							{loading ? (
								<div role="status">
									<svg
										aria-hidden="true"
										className="w-4 h-4 mr-2 text-gray-200 animate-spin fill-blue-600"
										viewBox="0 0 100 101"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
											fill="currentColor"
										/>
										<path
											d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
											fill="currentFill"
										/>
									</svg>
									<span className="sr-only">Loading...</span>
								</div>
							) : (
								<IconSearch size="1rem" style={{ opacity: 0.5 }} />
							)}
						</Pill.Group>
					</PillsInput>
				</Combobox.Target>

				<Combobox.Dropdown>
					<Combobox.Options>
						{searchResults.length > 0 ? (
							options
						) : (
							<Combobox.Empty>No results found</Combobox.Empty>
						)}

						{shouldShowCreate && (
							<Combobox.Option value="create">
								<Group gap="xs">
									<IconPlus size="1rem" />
									<Text>Create tag "{value}"</Text>
								</Group>
							</Combobox.Option>
						)}
					</Combobox.Options>
				</Combobox.Dropdown>
			</Combobox>
		</Box>
	);
}
