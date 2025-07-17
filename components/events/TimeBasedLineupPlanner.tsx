"use client";

import {
	assignArtistToStageAction,
	createEventStageAction,
	deleteEventStageAction,
	getEventStageArtistsAction,
	getEventStagesAction,
	removeArtistFromStageAction
} from "@/app/events/[eventHash]/lineup/actions";
import { createClient } from "@/utils/supabase/client";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import {
	ActionIcon,
	Avatar,
	Button,
	Group,
	Modal,
	Notification,
	Stack,
	TextInput
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconAlertTriangle,
	IconCheck,
	IconDeviceFloppy,
	IconLock,
	IconMusic,
	IconPlus,
	IconTrash,
	IconUsers
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import classes from "./TimeBasedLineupPlanner.module.css";

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
	duration: number;
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

// Generate simplified time slots for better UX
const generateEventTimeSlots = (): TimeSlot[] => {
	const slots: TimeSlot[] = [];

	// 6 PM to 3 AM (30-minute intervals for cleaner UI)
	for (let hour = 18; hour < 24; hour++) {
		for (let minute = 0; minute < 60; minute += 30) {
			slots.push({
				time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
				hour,
				minute
			});
		}
	}

	// 12 AM to 3 AM
	for (let hour = 0; hour < 4; hour++) {
		for (let minute = 0; minute < 60; minute += 30) {
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
	const [isLocked, setIsLocked] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [timeSlots] = useState<TimeSlot[]>(generateEventTimeSlots());
	const [newStageName, setNewStageName] = useState("");
	const [opened, { open, close }] = useDisclosure(false);
	const [conflicts, setConflicts] = useState<string[]>([]);
	const [savingState, setSavingState] = useState<'saved' | 'saving' | 'error'>('saved');
	const [isSubmittingStage, setIsSubmittingStage] = useState(false);
	const [stageToDelete, setStageToDelete] = useState<string | null>(null);
	const [deleteConfirmOpened, { open: openDeleteConfirm, close: closeDeleteConfirm }] = useDisclosure(false);
	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
	const [draggedItem, setDraggedItem] = useState<{ artist: Artist; offset: { x: number; y: number } } | null>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		// Create a portal container for drag clones to avoid parent transform interference
		const portal = document.createElement('div');
		portal.id = 'dnd-portal';
		portal.style.position = 'absolute';
		portal.style.top = '0';
		portal.style.left = '0';
		portal.style.zIndex = '9999';
		portal.style.pointerEvents = 'none';
		document.body.appendChild(portal);
		setPortalContainer(portal);

		// Track mouse position for custom drag preview
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				setMousePosition({ x: e.clientX, y: e.clientY });
			}
		};

		document.addEventListener('mousemove', handleMouseMove, { passive: true });

		return () => {
			if (document.body.contains(portal)) {
				document.body.removeChild(portal);
			}
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, [isDragging]);

	useEffect(() => {
		loadEventData();
	}, [event.id]);

	useEffect(() => {
		checkForConflicts();
	}, [scheduledSlots]);

	const loadEventData = async () => {
		try {
			setIsLoading(true);
			const eventStages = await getEventStagesAction(event.id);
			setStages(eventStages);

			const allAssignments = await getEventStageArtistsAction(event.id);
			const slots: ScheduledSlot[] = allAssignments
				.filter((assignment: any) => assignment.start && assignment.end)
				.map((assignment: any) => ({
					id: assignment.id,
					artist: assignment.artists,
					stage: assignment.stage,
					startTime: extractTimeFromTimestamp(assignment.start),
					endTime: extractTimeFromTimestamp(assignment.end),
					duration: calculateDuration(
						extractTimeFromTimestamp(assignment.start),
						extractTimeFromTimestamp(assignment.end)
					)
				}));

			setScheduledSlots(slots);
		} catch (error) {
			console.error("Failed to load event data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const checkForConflicts = () => {
		const conflictedArtists: string[] = [];

		scheduledSlots.forEach((slot1, index) => {
			scheduledSlots.slice(index + 1).forEach((slot2) => {
				if (slot1.artist.id === slot2.artist.id) {
					// Check for time overlap
					const start1 = new Date(`2000-01-01 ${slot1.startTime}`);
					const end1 = new Date(`2000-01-01 ${slot1.endTime}`);
					const start2 = new Date(`2000-01-01 ${slot2.startTime}`);
					const end2 = new Date(`2000-01-01 ${slot2.endTime}`);

					if (start1 < end2 && start2 < end1) {
						conflictedArtists.push(slot1.artist.id);
					}
				}
			});
		});

		setConflicts(conflictedArtists);
	};

	const calculateDuration = (startTime: string, endTime: string): number => {
		const start = new Date(`2000-01-01 ${startTime}`);
		const end = new Date(`2000-01-01 ${endTime}`);
		if (end < start) {
			end.setDate(end.getDate() + 1);
		}
		return (end.getTime() - start.getTime()) / (1000 * 60);
	};

	const handleDragStart = (result: any) => {
		const artist = availableUnassignedArtists.find(a => a.id === result.draggableId);
		if (artist) {
			setIsDragging(true);
			setDraggedItem({ 
				artist, 
				offset: { x: 20, y: -10 } // Better offset positioning
			});
		}
	};

	const handleDragEnd = async (result: DropResult) => {
		// Always clear drag state first, regardless of the result
		setIsDragging(false);
		setDraggedItem(null);

		const { destination, source, draggableId } = result;

		// For unsuccessful drops (no destination or locked), just return
		if (!destination || isLocked) {
			return;
		}

		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			return;
		}

		// Handle dropping artist from pool to stage
		if (source.droppableId === "artist-pool") {
			const [stageId, timeSlot] = destination.droppableId.split("__");
			const artist = availableUnassignedArtists.find(a => a.id === draggableId);

			if (!artist || !stageId || !timeSlot) return;

			// Check for conflicts before scheduling
			const endTime = addMinutesToTime(timeSlot, 60);
			const wouldConflict = scheduledSlots.some(slot =>
				slot.artist.id === artist.id &&
				timesOverlap(timeSlot, endTime, slot.startTime, slot.endTime)
			);

			if (wouldConflict) {
				alert(`${artist.name} is already scheduled during this time!`);
				return;
			}

			// Optimistically create the slot with a temporary ID
			const optimisticSlot: ScheduledSlot = {
				id: `temp-${Date.now()}`, // Temporary ID
				artist,
				stage: stageId,
				startTime: timeSlot,
				endTime,
				duration: 60
			};

			// Optimistically update the UI
			setScheduledSlots(prev => [...prev, optimisticSlot]);
			setSavingState('saving');

			try {
				const startTimestamp = convertTimeToTimestamp(timeSlot);
				const endTimestamp = convertTimeToTimestamp(endTime);

				const assignment = await assignArtistToStageAction({
					artist: artist.id,
					event: event.id,
					stage: stageId,
					start: startTimestamp,
					end: endTimestamp,
				});

				// Replace the optimistic slot with the real one
				setScheduledSlots(prev => 
					prev.map(slot => 
						slot.id === optimisticSlot.id 
							? { ...slot, id: assignment.id }
							: slot
					)
				);

				setSavingState('saved');
				setTimeout(() => setSavingState('saved'), 2000); // Keep saved state visible
			} catch (error) {
				console.error("Failed to assign artist:", error);
				
				// Revert the optimistic update
				setScheduledSlots(prev => prev.filter(slot => slot.id !== optimisticSlot.id));
				setSavingState('error');
				setTimeout(() => setSavingState('saved'), 3000);
				
				alert("Failed to assign artist - reverted to original position");
			}
		}
	};

	const timesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
		const s1 = new Date(`2000-01-01 ${start1}`);
		const e1 = new Date(`2000-01-01 ${end1}`);
		const s2 = new Date(`2000-01-01 ${start2}`);
		const e2 = new Date(`2000-01-01 ${end2}`);

		return s1 < e2 && s2 < e1;
	};

	const addMinutesToTime = (time: string, minutes: number): string => {
		const [hours, mins] = time.split(':').map(Number);
		const totalMinutes = hours * 60 + mins + minutes;
		const newHours = Math.floor(totalMinutes / 60) % 24;
		const newMins = totalMinutes % 60;
		return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
	};

	const getAvatarUrl = (artist: Artist): string | undefined => {
		if (!artist.avatar_img) return undefined;
		const supabase = createClient();
		const { data } = supabase.storage.from("avatars").getPublicUrl(artist.avatar_img);
		return data.publicUrl;
	};

	const convertTimeToTimestamp = (time: string): string => {
		const eventDate = event.start ? new Date(event.start).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
		return `${eventDate}T${time}:00`;
	};

	const extractTimeFromTimestamp = (timestamp: string): string => {
		if (!timestamp) return '00:00';
		if (timestamp.includes('T')) {
			return timestamp.split('T')[1].substring(0, 5);
		}
		return timestamp.substring(0, 5);
	};

	const handleAddStage = async () => {
		if (!newStageName.trim() || isSubmittingStage) return;

		try {
			setIsSubmittingStage(true);
			setSavingState('saving');
			
			const newStage = await createEventStageAction(
				event.id,
				newStageName,
				event.venue
			);

			setStages(prev => [...prev, newStage]);
			setNewStageName("");
			close();
			setSavingState('saved');
			setTimeout(() => setSavingState('saved'), 2000); // Keep saved state visible
		} catch (error) {
			console.error("Failed to create stage:", error);
			setSavingState('error');
			setTimeout(() => setSavingState('saved'), 3000);
			alert(`Failed to create stage: ${error instanceof Error ? error.message : 'Unknown error'}`);
		} finally {
			setIsSubmittingStage(false);
		}
	};

	const handleRemoveSlot = async (slotId: string) => {
		// Find the slot to remove for potential restoration
		const slotToRemove = scheduledSlots.find(slot => slot.id === slotId);
		if (!slotToRemove) return;

		// Optimistically remove the slot
		setScheduledSlots(prev => prev.filter(slot => slot.id !== slotId));
		setSavingState('saving');

		try {
			await removeArtistFromStageAction(slotId);
			setSavingState('saved');
			setTimeout(() => setSavingState('saved'), 2000); // Keep saved state visible
		} catch (error) {
			console.error("Failed to remove slot:", error);
			
			// Revert the optimistic update by restoring the slot
			setScheduledSlots(prev => [...prev, slotToRemove]);
			setSavingState('error');
			setTimeout(() => setSavingState('saved'), 3000);
			
			alert("Failed to remove artist - reverted to original position");
		}
	};

	const handleDeleteStage = (stageId: string) => {
		setStageToDelete(stageId);
		openDeleteConfirm();
	};

	const confirmDeleteStage = async () => {
		if (!stageToDelete) return;

		// Find the stage and its associated slots for potential restoration
		const stageToRemove = stages.find(stage => stage.id === stageToDelete);
		const slotsToRemove = scheduledSlots.filter(slot => slot.stage === stageToDelete);
		
		if (!stageToRemove) return;

		// Optimistically remove the stage and its slots
		setStages(prev => prev.filter(stage => stage.id !== stageToDelete));
		setScheduledSlots(prev => prev.filter(slot => slot.stage !== stageToDelete));
		setSavingState('saving');

		try {
			await deleteEventStageAction(stageToDelete);
			
			setSavingState('saved');
			setTimeout(() => setSavingState('saved'), 2000); // Keep saved state visible
		} catch (error) {
			console.error("Failed to delete stage:", error);
			
			// Revert the optimistic updates
			setStages(prev => [...prev, stageToRemove]);
			setScheduledSlots(prev => [...prev, ...slotsToRemove]);
			setSavingState('error');
			setTimeout(() => setSavingState('saved'), 3000);
			
			alert(`Failed to delete stage - reverted to original position: ${error instanceof Error ? error.message : 'Unknown error'}`);
		} finally {
			setStageToDelete(null);
			closeDeleteConfirm();
		}
	};

	const getAssignedArtistIds = (): Set<string> => {
		return new Set(scheduledSlots.map(slot => slot.artist.id));
	};

	const availableUnassignedArtists = useMemo(() =>
		availableArtists.filter(artist => !getAssignedArtistIds().has(artist.id)),
		[availableArtists, scheduledSlots]
	);

	const getSlotForStageAndTime = (stageId: string, time: string): ScheduledSlot | null => {
		return scheduledSlots.find(slot =>
			slot.stage === stageId && slot.startTime === time
		) || null;
	};

	return (
		<>
			{/* Custom drag preview rendered through portal */}
			{draggedItem && isDragging && portalContainer && createPortal(
				<div style={{
					position: 'fixed',
					left: mousePosition.x + draggedItem.offset.x,
					top: mousePosition.y + draggedItem.offset.y,
					zIndex: 10000,
					background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(99, 102, 241, 0.95) 100%)',
					border: '2px solid rgba(255, 255, 255, 0.4)',
					borderRadius: '12px',
					padding: '0.75rem',
					color: 'white',
					boxShadow: '0 15px 35px rgba(139, 92, 246, 0.5), 0 5px 15px rgba(0, 0, 0, 0.2)',
					transform: 'rotate(3deg) scale(1.02)',
					pointerEvents: 'none',
					minWidth: '180px',
					maxWidth: '250px',
					backdropFilter: 'blur(8px)',
					transition: 'none', // Remove transitions to prevent lag
				}}>
					<div style={{ 
						display: 'flex', 
						alignItems: 'center', 
						gap: '0.75rem',
						fontSize: '0.9rem'
					}}>
						<div style={{
							width: '32px',
							height: '32px',
							borderRadius: '6px',
							background: 'rgba(255, 255, 255, 0.25)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 'bold',
							fontSize: '0.8rem'
						}}>
							{draggedItem.artist.name.charAt(0).toUpperCase()}
						</div>
						<div style={{ minWidth: 0, flex: 1 }}>
							<div style={{ 
								fontWeight: '600', 
								fontSize: '0.85rem',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis'
							}}>
								{draggedItem.artist.name}
							</div>
							{draggedItem.artist.genre && (
								<div style={{ 
									color: 'rgba(255, 255, 255, 0.8)', 
									fontSize: '0.7rem',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis'
								}}>
									{draggedItem.artist.genre}
								</div>
							)}
						</div>
					</div>
				</div>,
				portalContainer
			)}

			{/* Hide the default drag clone completely */}
			<style dangerouslySetInnerHTML={{
				__html: `
					/* Hide the default drag clone */
					[data-react-beautiful-dnd-draggable][style*="position: fixed"] {
						opacity: 0 !important;
						visibility: hidden !important;
					}
				`
			}} />
			<DragDropContext 
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				{/* Clean container with no transforms to avoid positioning issues */}
				<div style={{ 
					transform: 'none', 
					position: 'relative',
					isolation: 'isolate'
				}}>
				<div className={classes.plannerContainer}>
				{/* Event Header */}
				<div className={classes.eventHeader}>
					<div className={classes.eventTitle}>
						{event.name}
					</div>
					{event.start && (
						<div className={classes.eventDate}>
							{new Date(event.start).toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</div>
					)}
				</div>

				{/* Controls Bar */}
				<div className={classes.controlsBar}>
					<div className={classes.actionButtons}>
						<button
							className={classes.actionButton}
							onClick={open}
							disabled={isLocked}
						>
							<IconPlus size={16} />
							Add Stage
						</button>
						<button
							className={`${classes.actionButton} ${isLocked ? classes.lockButton : ''}`}
							onClick={() => setIsLocked(!isLocked)}
						>
							<IconLock size={16} />
							{isLocked ? 'Unlock' : 'Lock'}
						</button>
					</div>
					<div className={classes.statsInfo}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
							<IconUsers size={16} />
							{scheduledSlots.length} scheduled
						</div>
						{conflicts.length > 0 && (
							<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
								<IconAlertTriangle size={16} />
								{conflicts.length} conflicts
							</div>
						)}
						<div style={{ 
							display: 'flex', 
							alignItems: 'center', 
							gap: '0.5rem', 
							color: savingState === 'saving' ? '#f59e0b' : savingState === 'error' ? '#ef4444' : '#10b981'
						}}>
							<IconDeviceFloppy size={16} />
							{savingState === 'saving' ? 'Saving...' : savingState === 'error' ? 'Save failed' : 'Auto-saved'}
						</div>
					</div>
				</div>

				{/* Artist Pool */}
				<div className={classes.artistPool}>
					<div className={classes.poolTitle}>
						<IconMusic size={20} />
						Available Artists ({availableUnassignedArtists.length})
					</div>
					<Droppable droppableId="artist-pool" direction="horizontal" isDropDisabled>
						{(provided) => (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								<div className={classes.artistGrid}>
									{availableUnassignedArtists.map((artist, index) => (
										<Draggable
											key={artist.id}
											draggableId={artist.id}
											index={index}
											isDragDisabled={isLocked}
										>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className={`${classes.artistCard} ${snapshot.isDragging ? classes.artistCardDragging : ''}`}
													style={provided.draggableProps.style}
												>
													<div className={classes.artistInfo}>
														<div className={classes.artistName}>
															{artist.name}
														</div>
														{artist.genre && (
															<div className={classes.artistGenre}>
																{artist.genre}
															</div>
														)}
													</div>
													{conflicts.includes(artist.id) && (
														<div className={classes.conflictIndicator} />
													)}
												</div>
											)}
										</Draggable>
									))}
								</div>
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</div>

				{/* Lineup Board */}
				<div className={classes.lineupBoard}>
					{/* Time Column */}
					<div className={classes.timeColumn}>
						{timeSlots.map((timeSlot) => (
							<div key={timeSlot.time} className={classes.timeSlot}>
								{timeSlot.time}
							</div>
						))}
					</div>

					{/* Stages Container */}
					<div className={classes.stagesContainer}>
						{stages.map((stage) => (
							<div key={stage.id} className={classes.stageColumn}>
								<div className={classes.stageHeader}>
									<span>{stage.name}</span>
									{!isLocked && (
										<ActionIcon
											size="sm"
											variant="subtle"
											color="red"
											onClick={() => handleDeleteStage(stage.id)}
											style={{ marginLeft: 'auto' }}
										>
											<IconTrash size={14} />
										</ActionIcon>
									)}
								</div>
								<div className={classes.stageTimeline}>
									{timeSlots.map((timeSlot) => {
										const slot = getSlotForStageAndTime(stage.id, timeSlot.time);
										const dropId = `${stage.id}__${timeSlot.time}`;

										return (
											<Droppable key={dropId} droppableId={dropId} isDropDisabled={isLocked}>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.droppableProps}
														className={`${classes.stageSlot} ${snapshot.isDraggingOver ? classes.stageSlotDragOver : ''
															} ${slot ? classes.stageSlotActive : ''}`}
													>
														{slot ? (
															<div className={classes.performanceCard}>
																<div className={classes.performanceInfo}>
																	<Avatar
																		src={getAvatarUrl(slot.artist)}
																		size={40}
																		className={classes.performanceAvatar}
																	>
																		{slot.artist.name.charAt(0)}
																	</Avatar>
																	<div className={classes.performanceDetails}>
																		<div className={classes.performanceName}>
																			{slot.artist.name}
																		</div>
																		<div className={classes.performanceTime}>
																			{slot.startTime} - {slot.endTime}
																		</div>
																	</div>
																	<ActionIcon
																		size="sm"
																		variant="subtle"
																		color="white"
																		onClick={() => handleRemoveSlot(slot.id)}
																		disabled={isLocked}
																	>
																		<IconTrash size={14} />
																	</ActionIcon>
																</div>
																{conflicts.includes(slot.artist.id) && (
																	<div className={classes.conflictIndicator} />
																)}
															</div>
														) : (
															<div className={classes.emptySlot}>
																Drop artist here
															</div>
														)}
														{provided.placeholder}
													</div>
												)}
											</Droppable>
										);
									})}
								</div>
							</div>
						))}

						{/* Add Stage Button */}
						<div className={classes.addStageButton} onClick={open}>
							<IconPlus size={24} />
							<div>Add New Stage</div>
						</div>
					</div>
				</div>

				{/* Add Stage Modal */}
				<Modal
					opened={opened}
					onClose={close}
					title="Add New Stage"
					classNames={{ content: classes.modal, title: classes.modalTitle }}
					centered
				>
					<Stack gap="md">
						<TextInput
							label="Stage Name"
							placeholder="Enter stage name"
							value={newStageName}
							onChange={(e) => setNewStageName(e.currentTarget.value)}
							data-autofocus
						/>

						<Group justify="flex-end">
							<Button variant="outline" onClick={close} disabled={isSubmittingStage}>
								Cancel
							</Button>
							<Button
								onClick={handleAddStage}
								disabled={!newStageName.trim() || isSubmittingStage}
								loading={isSubmittingStage}
							>
								Add Stage
							</Button>
						</Group>
					</Stack>
				</Modal>

				{/* Delete Stage Confirmation Modal */}
				<Modal
					opened={deleteConfirmOpened}
					onClose={closeDeleteConfirm}
					title="Delete Stage"
					centered
					size="sm"
				>
					<Stack gap="md">
						<div style={{ textAlign: 'center', color: 'var(--mantine-color-text)' }}>
							Are you sure you want to delete this stage? This will also remove all artist assignments for this stage. This action cannot be undone.
						</div>

						<Group justify="center" gap="md">
							<Button variant="outline" onClick={closeDeleteConfirm}>
								Cancel
							</Button>
							<Button color="red" onClick={confirmDeleteStage}>
								Delete Stage
							</Button>
						</Group>
					</Stack>
				</Modal>
				</div>
				</div>
		</DragDropContext>
		</>
	);
}
