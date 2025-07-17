# Lineup Construction Guide

## Overview

A **lineup** in the music platform represents the scheduled performance arrangement for an event, organizing artists across different stages with specific time slots. The lineup is constructed through relationships between three core database tables: `artists`, `event_stage`, and `event_stage_artists`.

## Database Schema Relationships

### Core Tables

#### 1. `artists`
- **Purpose**: Stores artist profile information
- **Key Fields**:
  - `id`: Unique artist identifier
  - `name`: Artist name
  - `avatar_img`: Artist profile image
  - `bio`: Artist biography
  - `user_id`: Reference to the user who manages this artist

#### 2. `event_stage` 
- **Purpose**: Defines stages/venues within an event
- **Key Fields**:
  - `id`: Unique stage identifier
  - `name`: Stage name (e.g., "Main Stage", "Acoustic Stage")
  - `event`: Foreign key to `events.id`
  - `venue`: Foreign key to `venues.id`

#### 3. `event_stage_artists`
- **Purpose**: Junction table that assigns artists to specific stages with time slots
- **Key Fields**:
  - `id`: Unique assignment identifier
  - `artist`: Foreign key to `artists.id`
  - `event`: Foreign key to `events.id`
  - `stage`: Foreign key to `event_stage.id` (nullable)
  - `start`: Performance start time (nullable)
  - `end`: Performance end time (nullable)

### Supporting Tables

#### 4. `events`
- **Purpose**: Event details and metadata
- **Key Fields**:
  - `id`: Unique event identifier
  - `name`: Event name
  - `date`: Event date
  - `lineup_public`: Boolean indicating if lineup is publicly visible
  - `venue`: Primary venue reference

#### 5. `venues`
- **Purpose**: Venue information
- **Key Fields**:
  - `id`: Unique venue identifier
  - `name`: Venue name
  - `address`: Venue address
  - `capacity`: Venue capacity

## Lineup Construction Logic

### Relationship Flow

1. **Event → Stages**: An event can have multiple stages defined in `event_stage`
2. **Stages → Artists**: Each stage can have multiple artists assigned via `event_stage_artists`
3. **Time Scheduling**: Artists are scheduled with `start` and `end` times within their stage assignments

### Data Structure

A complete lineup consists of:

```typescript
interface Lineup {
  event: {
    id: string;
    name: string;
    date: string;
    lineup_public: boolean;
  };
  stages: Array<{
    id: string;
    name: string;
    venue: {
      id: string;
      name: string;
      address: string;
      capacity: number;
    };
    performers: Array<{
      artist: {
        id: string;
        name: string;
        avatar_img: string;
      };
      start_time: string | null;
      end_time: string | null;
      assignment_id: string;
    }>;
  }>;
}
```

### Key Design Patterns

1. **Hierarchical Organization**: Event → Stages → Artists
2. **Flexible Staging**: Artists can be assigned to specific stages or left unassigned
3. **Time Slot Management**: Optional start/end times allow for flexible scheduling
4. **Venue Integration**: Each stage is tied to a specific venue for multi-venue events

### Query Considerations

When constructing lineups, consider:

- **Join Performance**: Use proper indexes on foreign keys
- **Temporal Ordering**: Sort by start times when available
- **Public Visibility**: Respect the `lineup_public` flag
- **Null Handling**: Handle cases where stage or time information is missing
- **Multi-Venue Support**: Account for events spanning multiple venues

### Common Use Cases

1. **Festival Lineups**: Multiple stages with scheduled time slots
2. **Single Venue Events**: All artists on one stage with time progression
3. **Open Mic/Flexible Events**: Artists without specific time assignments
4. **Multi-Day Events**: Time slots spanning multiple dates

This structure provides flexibility for various event types while maintaining data integrity and enabling efficient queries for lineup display and management.
