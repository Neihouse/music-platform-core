"use server";
import { Artist, Event, TypedClient, Venue } from "@/utils/supabase/global.types";

export async function getLineupByEventId(supabase: TypedClient, eventId: string) {
    const { data: lineup, error } = await supabase
        .from("events")
        .select(`
      id,
      name,
      date,
      start,
      end,
      lineup_public,
      poster_img,
      event_stage (
        id,
        name,
        venues (
          id,
          name,
          address,
          capacity
        ),
        event_stage_artists (
          id,
          start,
          end,
          artists (
            id,
            name,
            avatar_img,
            bio
          )
        )
      )
    `)
        .eq("id", eventId)
        .single();

    if (error) {
        throw new Error(`Failed to get lineup: ${error.message}`);
    }

    return lineup;
}

export async function getLineupByEventHash(supabase: TypedClient, eventHash: string) {
    const { data: lineup, error } = await supabase
        .from("events")
        .select(`
      id,
      name,
      date,
      start,
      end,
      lineup_public,
      poster_img,
      event_stage (
        id,
        name,
        venues (
          id,
          name,
          address,
          capacity
        ),
        event_stage_artists (
          id,
          start,
          end,
          artists (
            id,
            name,
            avatar_img,
            bio
          )
        )
      )
    `)
        .eq("hash", eventHash)
        .single();

    if (error) {
        throw new Error(`Failed to get lineup: ${error.message}`);
    }

    return lineup;
}

export async function getPublicLineupByEventHash(supabase: TypedClient, eventHash: string) {
    const { data: lineup, error } = await supabase
        .from("events")
        .select(`
      id,
      name,
      date,
      start,
      end,
      lineup_public,
      poster_img,
      event_stage (
        id,
        name,
        venues (
          id,
          name,
          address,
          capacity
        ),
        event_stage_artists (
          id,
          start,
          end,
          artists (
            id,
            name,
            avatar_img,
            bio
          )
        )
      )
    `)
        .eq("hash", eventHash)
        .eq("lineup_public", true)
        .single();

    if (error) {
        throw new Error(`Failed to get public lineup: ${error.message}`);
    }

    return lineup;
}

export async function getStageLineup(supabase: TypedClient, stageId: string) {
    const { data: stage, error } = await supabase
        .from("event_stage")
        .select(`
      id,
      name,
      events (
        id,
        name,
        date,
        start,
        end
      ),
      venues (
        id,
        name,
        address,
        capacity
      ),
      event_stage_artists (
        id,
        start,
        end,
        artists (
          id,
          name,
          avatar_img,
          bio
        )
      )
    `)
        .eq("id", stageId)
        .single();

    if (error) {
        throw new Error(`Failed to get stage lineup: ${error.message}`);
    }

    return stage;
}

export async function getArtistEventSchedule(supabase: TypedClient, artistId: string) {
    const { data: schedule, error } = await supabase
        .from("event_stage_artists")
        .select(`
      id,
      start,
      end,
      events (
        id,
        name,
        date,
        hash,
        poster_img
      ),
      event_stage (
        id,
        name,
        venues (
          id,
          name,
          address
        )
      )
    `)
        .eq("artist", artistId)
        .order("start", { ascending: true });

    if (error) {
        throw new Error(`Failed to get artist schedule: ${error.message}`);
    }

    return schedule || [];
}

export async function getLineupWithTimeSlots(supabase: TypedClient, eventId: string) {
    // Get lineup ordered by time slots
    const { data: lineup, error } = await supabase
        .from("event_stage_artists")
        .select(`
      id,
      start,
      end,
      events!inner (
        id,
        name,
        date,
        lineup_public
      ),
      event_stage (
        id,
        name,
        venues (
          id,
          name,
          address,
          capacity
        )
      ),
      artists (
        id,
        name,
        avatar_img,
        bio
      )
    `)
        .eq("event", eventId)
        .order("start", { ascending: true });

    if (error) {
        throw new Error(`Failed to get lineup with time slots: ${error.message}`);
    }

    return lineup || [];
}

export async function getUnscheduledArtistsForEvent(supabase: TypedClient, eventId: string) {
    // Get artists assigned to event but without specific time slots
    const { data: unscheduled, error } = await supabase
        .from("event_stage_artists")
        .select(`
      id,
      start,
      end,
      event_stage (
        id,
        name,
        venues (
          id,
          name
        )
      ),
      artists (
        id,
        name,
        avatar_img,
        bio
      )
    `)
        .eq("event", eventId)
        .is("start", null)
        .is("end", null);

    if (error) {
        throw new Error(`Failed to get unscheduled artists: ${error.message}`);
    }

    return unscheduled || [];
}

export async function getConflictingTimeSlots(supabase: TypedClient, eventId: string) {
    // Get overlapping time slots for the same stage
    const { data: conflicts, error } = await supabase
        .from("event_stage_artists")
        .select(`
      id,
      start,
      end,
      event_stage (
        id,
        name
      ),
      artists (
        id,
        name
      )
    `)
        .eq("event", eventId)
        .not("start", "is", null)
        .not("end", "is", null)
        .order("event_stage.id")
        .order("start");

    if (error) {
        throw new Error(`Failed to check for conflicts: ${error.message}`);
    }

    // Note: Conflict detection logic would need to be implemented in application code
    // as it requires comparing overlapping time ranges within the same stage
    return conflicts || [];
}

// Core Lineup Types - Since there's no direct 'lineups' table, we define the structure here

/**
 * Main Lineup type representing a complete event lineup with all stages and artists
 */
export type Lineup = {
    /** Event information */
    event: Event;
    /** Array of stages within the event */
    stages: Array<LineupStage>;
};

/**
 * Individual stage within a lineup
 */
export type LineupStage = {
    id: string;
    name: string;
    venue: Pick<Venue, 'id' | 'name' | 'address' | 'capacity'> | null;
    /** Artists performing on this stage, ordered by time */
    performers: Array<LineupPerformer>;
};

/**
 * Artist performance slot within a stage
 */
export type LineupPerformer = {
    /** Assignment ID from event_stage_artists table */
    assignment_id: string;
    /** Performance time slot */
    time_slot: {
        start: string | null;
        end: string | null;
        duration_minutes: number | null;
    };
    /** Artist information */
    artist: Pick<Artist, 'id' | 'name' | 'avatar_img' | 'bio'>;
    /** Optional stage assignment (can be null for unassigned artists) */
    stage_id: string | null;
};

/**
 * Simplified lineup view for public display
 */
export type PublicLineup = Omit<Lineup, 'event'> & {
    event: Pick<Lineup['event'], 'name' | 'date' | 'poster_img'>;
};

/**
 * Time-based lineup view for scheduling interfaces
 */
export type TimeBasedLineup = {
    event_id: string;
    event_name: string;
    date: string | null;
    time_slots: Array<{
        start_time: string;
        end_time: string;
        concurrent_performances: Array<{
            stage: {
                id: string;
                name: string;
                venue_name: string;
            };
            artist: Pick<Artist, 'id' | 'name' | 'avatar_img'>;
            assignment_id: string;
        }>;
    }>;
};

/**
 * Artist's schedule across multiple events
 */
export type ArtistSchedule = Array<{
    assignment_id: string;
    performance: {
        start: string | null;
        end: string | null;
    };
    event: Pick<Event, 'id' | 'name' | 'date' | 'hash' | 'poster_img'>;
    stage: {
        id: string;
        name: string;
        venue: Pick<Venue, 'id' | 'name' | 'address'>;
    };
}>;

/**
 * Scheduling conflict detection result
 */
export type SchedulingConflict = {
    stage_id: string;
    stage_name: string;
    conflicting_performances: Array<{
        assignment_id: string;
        artist_name: string;
        start: string;
        end: string;
        overlap_with: Array<{
            assignment_id: string;
            artist_name: string;
            start: string;
            end: string;
        }>;
    }>;
};

// Legacy types for backward compatibility
export type LineupData = {
    id: string;
    name: string;
    date: string | null;
    start: string | null;
    end: string | null;
    lineup_public: boolean;
    poster_img: string | null;
    event_stage: Array<{
        id: string;
        name: string;
        venues: Pick<Venue, 'id' | 'name' | 'address' | 'capacity'> | null;
        event_stage_artists: Array<{
            id: string;
            start: string | null;
            end: string | null;
            artists: Pick<Artist, 'id' | 'name' | 'avatar_img' | 'bio'> | null;
        }>;
    }>;
};

export type ArtistScheduleData = Array<{
    id: string;
    start: string | null;
    end: string | null;
    events: Pick<Event, 'id' | 'name' | 'date' | 'hash' | 'poster_img'> | null;
    event_stage: {
        id: string;
        name: string;
        venues: Pick<Venue, 'id' | 'name' | 'address'> | null;
    } | null;
}>;
