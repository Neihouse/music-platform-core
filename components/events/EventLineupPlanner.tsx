"use client";

import {
	assignArtistToStageAction,
	createEventStageAction,
	getEventStageArtistsAction,
	getEventStagesAction,
	removeArtistFromStageAction,
	updateArtistStageAssignmentAction
} from "@/app/events/[eventHash]/lineup/actions";
import StyledTitle from "@/components/StyledTitle";
import { VenueSearch } from "@/components/VenueSearch";
import { Database } from "@/utils/supabase/database.types";
import { Artist, Event, Venue } from "@/utils/supabase/global.types";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Card,
	Container,
	Group,
	Modal,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Title
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconClock, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

// Use database-first types as per TYPE_USAGE_GUIDE.md
type EventBasic = Pick<Event, 'id' | 'name' | 'start' | 'venue'>;

type ArtistBasic = Pick<Artist, 'id' | 'name' | 'avatar_img'>;

type VenueBasic = Pick<Venue, 'id' | 'name' | 'address'> & {
  capacity?: number | null;
};

type EventStage = Pick<Database['public']['Tables']['event_stage']['Row'], 'id' | 'name' | 'venue'>;

type StageAssignmentWithArtist = Pick<Database['public']['Tables']['event_stage_artists']['Row'], 'id' | 'artist' | 'stage' | 'set_start' | 'set_end'> & {
  artists: ArtistBasic;
};

interface EventLineupPlannerProps {
	event: EventBasic;
	availableArtists: ArtistBasic[];
	availableVenues?: VenueBasic[];
}

export function EventLineupPlanner({ event, availableArtists, availableVenues = [] }: EventLineupPlannerProps) {
	const [stages, setStages] = useState<EventStage[]>([]);
	const [assignments, setAssignments] = useState<{ [stageId: string]: StageAssignmentWithArtist[] }>({});
	const [newStageName, setNewStageName] = useState("");
	const [selectedVenue, setSelectedVenue] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);

	useEffect(() => {
		loadEventData();
	}, [event.id]);

	const handleStageVenueSelect = (venue: VenueBasic | null) => {
		setSelectedVenue(venue?.id || "");
	};

	const loadEventData = async () => {
		try {
			setIsLoading(true);
			const eventStages = await getEventStagesAction(event.id);
			setStages(eventStages);

			// Load assignments for each stage
			const allAssignments = await getEventStageArtistsAction(event.id);
			const assignmentsByStage: { [stageId: string]: StageAssignmentWithArtist[] } = {};

			allAssignments.forEach((assignment: StageAssignmentWithArtist) => {
				if (!assignmentsByStage[assignment.stage!]) {
					assignmentsByStage[assignment.stage!] = [];
				}
				assignmentsByStage[assignment.stage!].push(assignment);
			});

			setAssignments(assignmentsByStage);
		} catch (error) {
			console.error("Failed to load event data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddStage = async () => {
		if (!newStageName.trim()) return;

		try {
			const newStage = await createEventStageAction(
				event.id,
				newStageName,
				selectedVenue || event.venue
			);

			setStages(prev => [...prev, newStage]);
			setAssignments(prev => ({ ...prev, [newStage.id]: [] }));
			setNewStageName("");
			setSelectedVenue("");
			close();
		} catch (error) {
			console.error("Failed to create stage:", error);
			alert(`Failed to create stage: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	const handleDragEnd = async (result: DropResult) => {
		const { destination, source, draggableId } = result;

		if (!destination) return;

		// If dropping in the same position, do nothing
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const sourceStageId = source.droppableId;
		const destStageId = destination.droppableId;

		// Handle moving from available artists to a stage
		if (sourceStageId === "available-artists") {
			const artist = availableArtists.find(a => a.id === draggableId);
			if (!artist) return;

			try {
				const assignment = await assignArtistToStageAction({
					artist: artist.id,
					event: event.id,
					stage: destStageId,
					set_start: null,
					set_end: null,
				});

				setAssignments(prev => ({
					...prev,
					[destStageId]: [...(prev[destStageId] || []), assignment],
				}));
			} catch (error) {
				console.error("Failed to assign artist:", error);
				alert("Failed to assign artist");
			}
			return;
		}

		// Handle moving between stages or within a stage
		const sourceAssignments = [...(assignments[sourceStageId] || [])];
		const destAssignments = sourceStageId === destStageId
			? sourceAssignments
			: [...(assignments[destStageId] || [])];

		const [movedAssignment] = sourceAssignments.splice(source.index, 1);

		if (sourceStageId !== destStageId) {
			// Moving to different stage
			destAssignments.splice(destination.index, 0, movedAssignment);

			try {
				await updateArtistStageAssignmentAction(movedAssignment.id, {
					stage: destStageId,
				});

				setAssignments(prev => ({
					...prev,
					[sourceStageId]: sourceAssignments,
					[destStageId]: destAssignments,
				}));
			} catch (error) {
				console.error("Failed to update assignment:", error);
				alert("Failed to move artist");
			}
		} else {
			// Reordering within same stage
			destAssignments.splice(destination.index, 0, movedAssignment);
			setAssignments(prev => ({
				...prev,
				[sourceStageId]: destAssignments,
			}));
		}
	};

	const handleRemoveArtist = async (assignmentId: string, stageId: string) => {
		try {
			await removeArtistFromStageAction(assignmentId);
			setAssignments(prev => ({
				...prev,
				[stageId]: prev[stageId]?.filter(a => a.id !== assignmentId) || [],
			}));
		} catch (error) {
			console.error("Failed to remove artist:", error);
			alert("Failed to remove artist");
		}
	};

	const getAssignedArtistIds = () => {
		const assigned = new Set<string>();
		Object.values(assignments).forEach(stageAssignments => {
			stageAssignments.forEach(assignment => {
				assigned.add(assignment.artist);
			});
		});
		return assigned;
	};

	const availableUnassignedArtists = availableArtists.filter(
		artist => !getAssignedArtistIds().has(artist.id)
	);

	return (
		<Container size="xl">
			<Stack gap="lg">
				<Paper shadow="sm" p="md">
					<Group justify="space-between" align="center">
						<div>
							<StyledTitle
								selectedFont="Inter"
							>
								{event.name}
							</StyledTitle>
							{event.start && <Text c="dimmed">Event Date: {new Date(event.start).toLocaleDateString()}</Text>}
						</div>
						<Button leftSection={<IconPlus size={16} />} onClick={open}>
							Add Stage
						</Button>
					</Group>
				</Paper>

				<DragDropContext onDragEnd={handleDragEnd}>
					<SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
						{/* Available Artists */}
						<Paper shadow="sm" p="md">
							<Title order={3} mb="md">Available Artists</Title>
							<Droppable droppableId="available-artists" isDropDisabled>
								{(provided) => (
									<div {...provided.droppableProps} ref={provided.innerRef}>
										<Stack gap="xs">
											{availableUnassignedArtists.map((artist, index) => (
												<Draggable key={artist.id} draggableId={artist.id} index={index}>
													{(provided, snapshot) => (
														<Card
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															shadow={snapshot.isDragging ? "lg" : "xs"}
															p="xs"
															style={{
																...provided.draggableProps.style,
																opacity: snapshot.isDragging ? 0.8 : 1,
															}}
														>
															<Group gap="xs">
																<Avatar
																	src={artist.avatar_img}
																	alt={artist.name}
																	size="sm"
																>
																	{artist.name[0]}
																</Avatar>
																<Text size="sm" fw={500}>{artist.name}</Text>
															</Group>
														</Card>
													)}
												</Draggable>
											))}
										</Stack>
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</Paper>

						{/* Stages */}
						{stages.map((stage) => (
							<Paper key={stage.id} shadow="sm" p="md">
								<Title order={3} mb="md">{stage.name}</Title>
								<Droppable droppableId={stage.id}>
									{(provided, snapshot) => (
										<Box
											{...provided.droppableProps}
											ref={provided.innerRef}
											style={{
												backgroundColor: snapshot.isDraggingOver ? "#f8f9fa" : "transparent",
												minHeight: 200,
												borderRadius: 4,
												border: snapshot.isDraggingOver ? "2px dashed #868e96" : "2px dashed transparent",
											}}
										>
											<Stack gap="xs">
												{(assignments[stage.id] || []).map((assignment, index) => (
													<Draggable
														key={assignment.id}
														draggableId={assignment.id}
														index={index}
													>
														{(provided, snapshot) => (
															<Card
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																shadow={snapshot.isDragging ? "lg" : "xs"}
																p="xs"
																style={{
																	...provided.draggableProps.style,
																	opacity: snapshot.isDragging ? 0.8 : 1,
																}}
															>
																<Group justify="space-between">
																	<Group gap="xs">
																		<Avatar
																			src={assignment.artists.avatar_img}
																			alt={assignment.artists.name}
																			size="sm"
																		>
																			{assignment.artists.name[0]}
																		</Avatar>
																		<div>
																			<Text size="sm" fw={500}>{assignment.artists.name}</Text>
																			{assignment.set_start && (
																				<Text size="xs" c="dimmed">
																					<IconClock size={12} style={{ marginRight: 4 }} />
																					{assignment.set_start}
																					{assignment.set_end && ` - ${assignment.set_end}`}
																				</Text>
																			)}
																		</div>
																	</Group>
																	<ActionIcon
																		size="sm"
																		variant="light"
																		color="red"
																		onClick={() => handleRemoveArtist(assignment.id, stage.id)}
																	>
																		<IconTrash size={14} />
																	</ActionIcon>
																</Group>
															</Card>
														)}
													</Draggable>
												))}
											</Stack>
											{provided.placeholder}
										</Box>
									)}
								</Droppable>
							</Paper>
						))}
					</SimpleGrid>
				</DragDropContext>

				{/* Add Stage Modal */}
				<Modal opened={opened} onClose={close} title="Add New Stage">
					<Stack gap="md">
						<TextInput
							label="Stage Name"
							placeholder="Enter stage name"
							value={newStageName}
							onChange={(e) => setNewStageName(e.currentTarget.value)}
						/>

						{availableVenues.length > 0 && (
							<div>
								<label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
									Venue (optional)
								</label>
								<VenueSearch
									venues={availableVenues}
									selectedVenueId={selectedVenue}
									onSelect={handleStageVenueSelect}
									placeholder="Search venue for this stage..."
								/>
							</div>
						)}

						<Text size="sm" c="dimmed">
							{event.venue ?
								"If no venue is selected, the event's main venue will be used." :
								"Please ensure the event has a venue assigned, or select one for this stage."
							}
						</Text>

						<Group justify="flex-end">
							<Button variant="outline" onClick={close}>
								Cancel
							</Button>
							<Button onClick={handleAddStage} disabled={!newStageName.trim()}>
								Add Stage
							</Button>
						</Group>
					</Stack>
				</Modal>
			</Stack>
		</Container>
	);
}
