"use client";

import {
	assignArtistToStageAction,
	createEventStageAction,
	getEventStageArtistsAction,
	getEventStagesAction,
	removeArtistFromStageAction
} from "@/app/events/[eventHash]/lineup/actions";
import StyledTitle from "@/components/StyledTitle";
import { createClient } from "@/utils/supabase/client";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import {
	Avatar,
	Button,
	Container,
	Group,
	Modal,
	NumberInput,
	Paper,
	ScrollArea,
	Select,
	Stack,
	Switch,
	Text,
	TextInput,
	Title
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconDeviceFloppy,
	IconDownload,
	IconLock,
	IconMail,
	IconPlus,
	IconRefresh,
	IconTrash
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface Artist {
	id: string;
	name: string;
	avatar_img?: string | null;
	genre?: string;
}

interface Event {
	id: string;
	name: string;
	start?: string | null;
	venue?: string | null;
}

interface Stage {
	id: string;
	name: string;
	venue: string;
}

interface TimeSlot {
	time: string;
	hour: number;
	minute: number;
}

interface ScheduledSlot {
	id: string;
	artist: Artist;
	stage: string;
	startTime: string;
	endTime: string;
	duration: number; // in minutes
}

interface SlotDetails {
	id: string;
	artist: Artist;
	stage: string;
	startTime: string;
	endTime: string;
	notes?: string;
}

interface TimeBasedLineupPlannerProps {
	event: Event;
	availableArtists: Artist[];
	availableVenues?: Array<{
		id: string;
		name: string;
		address?: string | null;
		capacity?: number | null;
	}>;
}

// Generate time slots for the day (18:00 to 06:00 next day)
const generateTimeSlots = (): TimeSlot[] => {
	const slots: TimeSlot[] = [];

	// Evening slots (18:00 - 23:45)
	for (let hour = 18; hour < 24; hour++) {
		for (let minute = 0; minute < 60; minute += 15) {
			slots.push({
				time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
				hour,
				minute
			});
		}
	}

	// Early morning slots (00:00 - 06:00)
	for (let hour = 0; hour < 7; hour++) {
		for (let minute = 0; minute < 60; minute += 15) {
			slots.push({
				time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
				hour,
				minute
			});
		}
	}

	return slots;
};

export function TimeBasedLineupPlanner({ event, availableArtists, availableVenues = [] }: TimeBasedLineupPlannerProps) {
	const [stages, setStages] = useState<Stage[]>([]);
	const [scheduledSlots, setScheduledSlots] = useState<ScheduledSlot[]>([]);
	const [selectedSlot, setSelectedSlot] = useState<SlotDetails | null>(null);
	const [isLocked, setIsLocked] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date>(new Date());
	const [isLoading, setIsLoading] = useState(false);
	const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());
	const [newStageName, setNewStageName] = useState("");
	const [selectedVenue, setSelectedVenue] = useState<string>("");
	const [opened, { open, close }] = useDisclosure(false);
	const [slotDetailsOpened, { open: openSlotDetails, close: closeSlotDetails }] = useDisclosure(false);
	const [newSlotModal, { open: openNewSlot, close: closeNewSlot }] = useDisclosure(false);
	const [newSlotData, setNewSlotData] = useState({
		artistId: '',
		stageId: '',
		startTime: '',
		duration: 60
	});

	useEffect(() => {
		loadEventData();
	}, [event.id]);

	const loadEventData = async () => {
		try {
			setIsLoading(true);
			const eventStages = await getEventStagesAction(event.id);
			setStages(eventStages);

			// Load assignments and convert to scheduled slots
			const allAssignments = await getEventStageArtistsAction(event.id);
			const slots: ScheduledSlot[] = allAssignments
				.filter((assignment: any) => assignment.set_start && assignment.set_end)
				.map((assignment: any) => ({
					id: assignment.id,
					artist: assignment.artists,
					stage: assignment.stage,
					startTime: extractTimeFromTimestamp(assignment.set_start),
					endTime: extractTimeFromTimestamp(assignment.set_end),
					duration: calculateDuration(
						extractTimeFromTimestamp(assignment.set_start),
						extractTimeFromTimestamp(assignment.set_end)
					)
				}));

			setScheduledSlots(slots);
		} catch (error) {
			console.error("Failed to load event data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const calculateDuration = (startTime: string, endTime: string): number => {
		const start = new Date(`2000-01-01 ${startTime}`);
		const end = new Date(`2000-01-01 ${endTime}`);
		if (end < start) {
			// Handle overnight slots
			end.setDate(end.getDate() + 1);
		}
		return (end.getTime() - start.getTime()) / (1000 * 60); // minutes
	};

	const formatTimeForDisplay = (time: string): string => {
		return time;
	};

	const getSlotForStageAndTime = (stageId: string, time: string): ScheduledSlot | null => {
		return scheduledSlots.find(slot => {
			if (slot.stage !== stageId) return false;

			const slotStart = slot.startTime;
			const slotEnd = slot.endTime;

			// Check if the current time falls within this slot
			return time >= slotStart && time < slotEnd;
		}) || null;
	};

	const getSlotHeightInRows = (slot: ScheduledSlot): number => {
		// Each row represents 15 minutes
		return Math.max(1, Math.floor(slot.duration / 15));
	};

	const shouldShowSlot = (slot: ScheduledSlot, time: string): boolean => {
		return slot.startTime === time;
	};

	const handleSlotClick = (slot: ScheduledSlot) => {
		if (isLocked) return;

		setSelectedSlot({
			id: slot.id,
			artist: slot.artist,
			stage: slot.stage,
			startTime: slot.startTime,
			endTime: slot.endTime,
		});
		openSlotDetails();
	};

	const handleEmptySlotClick = (stageId: string, time: string) => {
		if (isLocked) return;

		setNewSlotData({
			artistId: '',
			stageId,
			startTime: time,
			duration: 60
		});
		openNewSlot();
	};

	const handleDragEnd = async (result: DropResult) => {
		const { destination, source, draggableId } = result;

		if (!destination || isLocked) return;

		// If dropping in the same position, do nothing
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		// Handle dropping artist from available pool to timeline
		if (source.droppableId === "available-artists") {
			const dropParts = destination.droppableId.split("__");
			if (dropParts.length !== 2) {
				console.error('Invalid droppable ID format:', destination.droppableId);
				return;
			}

			const stageId = dropParts[0];
			const time = dropParts[1];
			const artist = availableUnassignedArtists.find((a: Artist) => a.id === draggableId);

			if (!artist || !stageId || !time) {
				console.error('Missing required data:', { artist: !!artist, stageId, time });
				return;
			}

			// Validate time format
			if (!time.match(/^\d{2}:\d{2}$/)) {
				console.error('Invalid time format:', time);
				return;
			}

			// Create a new scheduled slot
			const endTime = addMinutesToTime(time, 60); // Default 1 hour
			const startTimestamp = convertTimeToTimestamp(time);
			const endTimestamp = convertTimeToTimestamp(endTime);

			console.log('Assigning artist:', {
				artistId: artist.id,
				eventId: event.id,
				stageId,
				startTime: time,
				endTime,
				startTimestamp,
				endTimestamp
			});

			try {
				const assignment = await assignArtistToStageAction({
					artist: artist.id,
					event: event.id,
					stage: stageId,
					set_start: startTimestamp,
					set_end: endTimestamp,
				});

				const newSlot: ScheduledSlot = {
					id: assignment.id,
					artist,
					stage: stageId,
					startTime: time,
					endTime,
					duration: 60
				};

				setScheduledSlots(prev => [...prev, newSlot]);
			} catch (error) {
				console.error("Failed to assign artist:", error);
				alert("Failed to assign artist");
			}
		}
	};

	const addMinutesToTime = (time: string, minutes: number): string => {
		if (!time || !time.includes(':')) {
			console.error('Invalid time format:', time);
			return '00:00';
		}

		const timeParts = time.split(':');
		if (timeParts.length !== 2) {
			console.error('Invalid time format:', time);
			return '00:00';
		}

		const [hours, mins] = timeParts.map(Number);

		if (isNaN(hours) || isNaN(mins)) {
			console.error('Invalid time values:', time, 'parsed as:', hours, mins);
			return '00:00';
		}

		const totalMinutes = hours * 60 + mins + minutes;
		const newHours = Math.floor(totalMinutes / 60) % 24;
		const newMins = totalMinutes % 60;
		return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
	};

	const getAvatarUrl = (artist: Artist): string | undefined => {
		if (!artist.avatar_img) return undefined;

		const supabase = createClient();
		const { data } = supabase.storage
			.from("avatars")
			.getPublicUrl(artist.avatar_img);

		return data.publicUrl;
	};

	const convertTimeToTimestamp = (time: string): string => {
		if (!event.start) {
			// If no event date, use today's date
			const today = new Date().toISOString().split('T')[0];
			return `${today}T${time}:00`;
		}

		// Use the event's date
		const eventDate = new Date(event.start).toISOString().split('T')[0];
		return `${eventDate}T${time}:00`;
	};

	const extractTimeFromTimestamp = (timestamp: string): string => {
		if (!timestamp) return '00:00';

		// Handle both full timestamps and just time strings
		if (timestamp.includes('T')) {
			const timePart = timestamp.split('T')[1];
			return timePart.substring(0, 5); // HH:MM format
		}

		// If it's already just a time string, return as is
		return timestamp.substring(0, 5);
	};

	const handleAddSlot = async () => {
		if (!newSlotData.artistId || !newSlotData.stageId || !newSlotData.startTime) return;

		const artist = availableUnassignedArtists.find((a: Artist) => a.id === newSlotData.artistId);
		if (!artist) return;

		const endTime = addMinutesToTime(newSlotData.startTime, newSlotData.duration);
		const startTimestamp = convertTimeToTimestamp(newSlotData.startTime);
		const endTimestamp = convertTimeToTimestamp(endTime);

		try {
			const assignment = await assignArtistToStageAction({
				artist: artist.id,
				event: event.id,
				stage: newSlotData.stageId,
				set_start: startTimestamp,
				set_end: endTimestamp,
			});

			const newSlot: ScheduledSlot = {
				id: assignment.id,
				artist,
				stage: newSlotData.stageId,
				startTime: newSlotData.startTime,
				endTime,
				duration: newSlotData.duration
			};

			setScheduledSlots(prev => [...prev, newSlot]);
			closeNewSlot();
			setNewSlotData({ artistId: '', stageId: '', startTime: '', duration: 60 });
		} catch (error) {
			console.error("Failed to create slot:", error);
			alert("Failed to create slot");
		}
	};

	const handleRemoveSlot = async (slotId: string) => {
		try {
			await removeArtistFromStageAction(slotId);
			setScheduledSlots(prev => prev.filter(slot => slot.id !== slotId));
			closeSlotDetails();
		} catch (error) {
			console.error("Failed to remove slot:", error);
			alert("Failed to remove slot");
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
			setNewStageName("");
			setSelectedVenue("");
			close();
		} catch (error) {
			console.error("Failed to create stage:", error);
			alert(`Failed to create stage: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	const handleSave = () => {
		setLastSaved(new Date());
		// TODO: Implement save functionality
	};

	const handleUndo = () => {
		// TODO: Implement undo functionality
	};

	const handleRedo = () => {
		// TODO: Implement redo functionality
	};

	const handleReset = () => {
		// TODO: Implement reset functionality
	};

	const handleExport = () => {
		// TODO: Implement export functionality
	};

	const handleEmailArtists = () => {
		// TODO: Implement email functionality
	};

	const getAssignedArtistIds = (): Set<string> => {
		return new Set(scheduledSlots.map(slot => slot.artist.id));
	};

	const availableUnassignedArtists = availableArtists.filter(
		artist => !getAssignedArtistIds().has(artist.id)
	);

	const scheduledSlotsCount = scheduledSlots.length;

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Container size="100%" px={0}>
				<Stack gap="lg">
					{/* Header */}
					<Paper shadow="sm" p="xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
						<Group justify="space-between" align="center">
							<div style={{ color: 'white' }}>
								<StyledTitle
									selectedFont="Inter"
									style={{ color: 'white' }}
								>
									{event.name}
								</StyledTitle>
								{event.start && (
									<Text size="lg" c="white" opacity={0.9}>
										{new Date(event.start).toLocaleDateString('en-US', {
											year: 'numeric',
											month: '2-digit',
											day: '2-digit'
										})}
									</Text>
								)}
							</div>
							<Group gap="md">
								<Switch
									label="Lock"
									checked={isLocked}
									onChange={(e) => setIsLocked(e.currentTarget.checked)}
									size="md"
									color="yellow"
									thumbIcon={isLocked ? <IconLock size={12} /> : undefined}
									styles={{
										label: { color: 'white' },
										track: { backgroundColor: isLocked ? '#ffd43b' : 'rgba(255,255,255,0.3)' }
									}}
								/>
								<Text size="sm" c="white" opacity={0.8}>
									Autosaved <IconDeviceFloppy size={14} style={{ marginLeft: 4 }} />
								</Text>
							</Group>
						</Group>
					</Paper>

					{/* Controls */}
					<Paper shadow="sm" p="md">
						<Group justify="space-between">
							<Group gap="xs">
								<Button
									leftSection={<IconPlus size={16} />}
									onClick={open}
									disabled={isLocked}
									variant="filled"
								>
									Add Stage
								</Button>
								<Button variant="outline" leftSection={<IconRefresh size={16} />} onClick={handleUndo}>
									Undo
								</Button>
								<Button variant="outline" onClick={handleRedo}>
									Redo
								</Button>
								<Button variant="outline" onClick={handleReset}>
									Reset
								</Button>
								<Button variant="outline" leftSection={<IconDownload size={16} />} onClick={handleExport}>
									Export
								</Button>
								<Button variant="outline" leftSection={<IconMail size={16} />} onClick={handleEmailArtists}>
									Email Artists
								</Button>
							</Group>
							<Text size="sm" c="dimmed">
								{scheduledSlotsCount} slots scheduled
							</Text>
						</Group>
					</Paper>

					{/* Artist Pool */}
					<Paper shadow="sm" p="md">
						<Title order={4} mb="md">Available Artists</Title>
						<Droppable droppableId="available-artists" direction="horizontal" isDropDisabled>
							{(provided) => (
								<div {...provided.droppableProps} ref={provided.innerRef}>
									<ScrollArea>
										<Group gap="xs">
											{availableUnassignedArtists.map((artist, index) => (
												<Draggable key={artist.id} draggableId={artist.id} index={index}>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={{
																...provided.draggableProps.style,
																cursor: isLocked ? 'default' : 'grab',
																opacity: snapshot.isDragging ? 0.5 : 1,
																display: 'inline-flex',
																alignItems: 'center',
																gap: '6px',
																padding: '6px 12px',
																borderRadius: '20px',
																backgroundColor: '#f1f3f4',
																border: '1px solid #e0e0e0',
																fontSize: '14px',
																fontWeight: 500,
															}}
														>
															<Avatar src={getAvatarUrl(artist)} size={20}>
																{artist.name.charAt(0)}
															</Avatar>
															<span>
																{artist.name.substring(0, 2).toUpperCase()} {artist.name} {artist.genre || ''}
															</span>
														</div>
													)}
												</Draggable>
											))}
										</Group>
									</ScrollArea>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</Paper>

					{/* Schedule Grid */}
					<Paper shadow="sm" p="md">
						<ScrollArea h={600}>
							<div style={{ minWidth: '100%' }}>
								{/* Header row with stage names */}
								<div style={{
									display: 'grid',
									gridTemplateColumns: `80px repeat(${stages.length}, 1fr)`,
									gap: '1px',
									backgroundColor: '#f8f9fa',
									marginBottom: '1px'
								}}>
									<div style={{
										padding: '12px 8px',
										backgroundColor: 'white',
										fontWeight: 600,
										fontSize: '14px',
										borderRight: '1px solid #dee2e6'
									}}>
										Time
									</div>
									{stages.map((stage) => (
										<div
											key={stage.id}
											style={{
												padding: '12px 8px',
												backgroundColor: 'white',
												fontWeight: 600,
												fontSize: '14px',
												textAlign: 'center',
												borderRight: '1px solid #dee2e6'
											}}
										>
											{stage.name}
										</div>
									))}
								</div>

								{/* Time slots grid */}
								{timeSlots.map((timeSlot, index) => (
									<div
										key={timeSlot.time}
										style={{
											display: 'grid',
											gridTemplateColumns: `80px repeat(${stages.length}, 1fr)`,
											gap: '1px',
											backgroundColor: '#f8f9fa',
											marginBottom: '1px'
										}}
									>
										{/* Time column */}
										<div style={{
											padding: '8px',
											backgroundColor: 'white',
											fontSize: '12px',
											fontWeight: 500,
											color: '#666',
											borderRight: '1px solid #dee2e6',
											display: 'flex',
											alignItems: 'center'
										}}>
											{timeSlot.time}
										</div>

										{/* Stage columns */}
										{stages.map((stage) => {
											const slot = getSlotForStageAndTime(stage.id, timeSlot.time);
											const shouldShow = slot && shouldShowSlot(slot, timeSlot.time);
											const dropId = `${stage.id}__${timeSlot.time}`;

											return (
												<Droppable key={dropId} droppableId={dropId}>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.droppableProps}
															style={{
																minHeight: '32px',
																backgroundColor: snapshot.isDraggingOver
																	? '#e3f2fd'
																	: slot ? '#f5f5f5' : 'white',
																borderRight: '1px solid #dee2e6',
																position: 'relative',
																cursor: slot && !isLocked ? 'pointer' : 'default'
															}}
															onClick={() => {
																if (slot) {
																	handleSlotClick(slot);
																} else if (!isLocked) {
																	handleEmptySlotClick(stage.id, timeSlot.time);
																}
															}}
														>
															{shouldShow && (
																<div
																	style={{
																		position: 'absolute',
																		top: 0,
																		left: 0,
																		right: 0,
																		height: `${getSlotHeightInRows(slot) * 33}px`, // 32px + 1px gap
																		backgroundColor: '#e3f2fd',
																		border: '2px solid #2196f3',
																		borderRadius: '4px',
																		padding: '4px 8px',
																		zIndex: 1,
																		overflow: 'hidden',
																		display: 'flex',
																		alignItems: 'center',
																		gap: '4px'
																	}}
																>
																	<Avatar src={getAvatarUrl(slot.artist)} size={20}>
																		{slot.artist.name.charAt(0)}
																	</Avatar>
																	<div style={{ flex: 1, minWidth: 0 }}>
																		<Text size="xs" fw={600} truncate>
																			{slot.artist.name.substring(0, 2).toUpperCase()} {slot.artist.name}
																		</Text>
																		<Text size="xs" c="dimmed" truncate>
																			{slot.startTime} - {slot.endTime}
																		</Text>
																	</div>
																</div>
															)}
															{provided.placeholder}
														</div>
													)}
												</Droppable>
											);
										})}
									</div>
								))}
							</div>
						</ScrollArea>
					</Paper>

					{/* Slot Details Panel */}
					<Paper shadow="sm" p="md">
						<Title order={4} mb="md">Slot Details</Title>
						{selectedSlot ? (
							<Group align="flex-start">
								<Avatar src={getAvatarUrl(selectedSlot.artist)} size={40}>
									{selectedSlot.artist.name.charAt(0)}
								</Avatar>
								<div>
									<Text fw={600}>{selectedSlot.artist.name}</Text>
									<Text size="sm" c="dimmed">
										{selectedSlot.startTime} - {selectedSlot.endTime}
									</Text>
									<Text size="sm" c="dimmed">
										Stage: {stages.find(s => s.id === selectedSlot.stage)?.name}
									</Text>
								</div>
							</Group>
						) : (
							<Text c="dimmed" style={{ fontStyle: 'italic' }}>
								Click on a scheduled slot to edit details
							</Text>
						)}
					</Paper>

					{/* Add Stage Modal */}
					<Modal opened={opened} onClose={close} title="Add New Stage">
						<Stack gap="md">
							<TextInput
								label="Stage Name"
								placeholder="Enter stage name"
								value={newStageName}
								onChange={(e) => setNewStageName(e.currentTarget.value)}
							/>

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

					{/* Slot Details Modal */}
					<Modal opened={slotDetailsOpened} onClose={closeSlotDetails} title="Edit Slot Details">
						{selectedSlot && (
							<Stack gap="md">
								<Group>
									<Avatar src={getAvatarUrl(selectedSlot.artist)} size={40}>
										{selectedSlot.artist.name.charAt(0)}
									</Avatar>
									<div>
										<Text fw={600}>{selectedSlot.artist.name}</Text>
										<Text size="sm" c="dimmed">
											{selectedSlot.startTime} - {selectedSlot.endTime}
										</Text>
									</div>
								</Group>

								<TextInput
									label="Start Time"
									value={selectedSlot.startTime}
									onChange={(e) => setSelectedSlot(prev => prev ? {
										...prev,
										startTime: e.currentTarget.value
									} : null)}
								/>

								<TextInput
									label="End Time"
									value={selectedSlot.endTime}
									onChange={(e) => setSelectedSlot(prev => prev ? {
										...prev,
										endTime: e.currentTarget.value
									} : null)}
								/>

								<Group justify="space-between">
									<Button
										variant="light"
										color="red"
										leftSection={<IconTrash size={16} />}
										onClick={() => handleRemoveSlot(selectedSlot.id)}
									>
										Remove Slot
									</Button>
									<Group>
										<Button variant="outline" onClick={closeSlotDetails}>
											Cancel
										</Button>
										<Button onClick={() => {
											// TODO: Save changes
											closeSlotDetails();
										}}>
											Save Changes
										</Button>
									</Group>
								</Group>
							</Stack>
						)}
					</Modal>

					{/* New Slot Modal */}
					<Modal opened={newSlotModal} onClose={closeNewSlot} title="Schedule Artist">
						<Stack gap="md">
							<Select
								label="Artist"
								placeholder="Select an artist"
								value={newSlotData.artistId}
								onChange={(value) => setNewSlotData(prev => ({ ...prev, artistId: value || '' }))}
								data={availableUnassignedArtists.map(artist => ({
									value: artist.id,
									label: artist.name
								}))}
								searchable
							/>

							<Select
								label="Stage"
								placeholder="Select a stage"
								value={newSlotData.stageId}
								onChange={(value) => setNewSlotData(prev => ({ ...prev, stageId: value || '' }))}
								data={stages.map(stage => ({
									value: stage.id,
									label: stage.name
								}))}
							/>

							<TextInput
								label="Start Time"
								value={newSlotData.startTime}
								onChange={(e) => setNewSlotData(prev => ({ ...prev, startTime: e.currentTarget.value }))}
								placeholder="HH:MM"
							/>

							<NumberInput
								label="Duration (minutes)"
								value={newSlotData.duration}
								onChange={(value) => setNewSlotData(prev => ({ ...prev, duration: Number(value) || 60 }))}
								min={15}
								max={480}
								step={15}
							/>

							<Group justify="flex-end">
								<Button variant="outline" onClick={closeNewSlot}>
									Cancel
								</Button>
								<Button
									onClick={handleAddSlot}
									disabled={!newSlotData.artistId || !newSlotData.stageId || !newSlotData.startTime}
								>
									Schedule Artist
								</Button>
							</Group>
						</Stack>
					</Modal>
				</Stack>
			</Container>
		</DragDropContext>
	);
}
