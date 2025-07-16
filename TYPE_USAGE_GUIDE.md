# TypeScript Type Usage Guide

This guide provides instructions for properly using TypeScript utility types and the global types in this music platform project.

## 📚 TypeScript Utility Types Reference

For detailed information about TypeScript utility types, reference the official documentation:
**🔗 [TypeScript Utility Types Documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html)**

Use the `#fetch_webpage https://www.typescriptlang.org/docs/handbook/utility-types.html` tool to get the latest information about utility types when needed.

## 🎯 Core Principles

### ✅ DO: Always Use Database-First Types
- All types MUST derive from `Database` types or `global.types`
- Never create standalone interface definitions
- Use utility types to compose and extend base types

### ❌ DON'T: Create Independent Types
- Don't create interfaces that don't tie back to database schema
- Don't duplicate type definitions
- Don't use `any` or loose typing

## 🏗️ Project Type Structure

### Base Types Location
```typescript
// Database schema types
import { Database } from "@/utils/supabase/database.types";

// Global types (derived from database)
import { Artist, Event, Venue, Promoter, StoredLocality } from "@/utils/supabase/global.types";
```

### Type Composition Pattern
```typescript
// ✅ CORRECT: Using Pick to select fields and extend
type EventWithVenue = Pick<Event, 'id' | 'name' | 'start'> & {
  venues?: Pick<Venue, 'id' | 'name'> | null;
};

// ✅ CORRECT: Using database table types directly
type PromoterWithImages = Pick<Database['public']['Tables']['promoters']['Row'], 'id' | 'name' | 'bio'> & {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};

// ❌ INCORRECT: Standalone interface
interface BadEventType {
  id: string;
  name: string;
  date: string;
}
```

## 🛠️ Common Utility Types Usage

### 1. Pick<Type, Keys>
Select specific properties from a type:
```typescript
// Select only needed fields from Event
type BasicEvent = Pick<Event, 'id' | 'name' | 'start'>;

// Select from database table directly
type BasicPromoter = Pick<Database['public']['Tables']['promoters']['Row'], 'id' | 'name' | 'bio'>;
```

### 2. Omit<Type, Keys>
Exclude specific properties from a type:
```typescript
// Remove sensitive fields
type PublicUser = Omit<User, 'password' | 'email'>;
```

### 3. Partial<Type>
Make all properties optional:
```typescript
// For update operations
type UpdateArtist = Partial<Pick<Artist, 'name' | 'bio' | 'selectedFont'>>;
```

### 4. Required<Type>
Make all properties required:
```typescript
// When certain fields must be present
type CompleteEvent = Required<Pick<Event, 'id' | 'name' | 'start' | 'venue'>>;
```

### 5. Intersection Types (&)
Combine types:
```typescript
// Base type + additional properties
type ArtistWithImages = Pick<Artist, 'id' | 'name' | 'bio'> & {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};
```

## 📋 Specific Usage Examples

### For Events with Populated Relationships
```typescript
// When event includes populated venue data
type EventWithVenue = Pick<Event, 'id' | 'name' | 'start'> & {
  venues?: Pick<Venue, 'id' | 'name'> | null;
};

// Legacy compatibility (when using 'date' instead of 'start')
type EventWithDate = Pick<Event, 'id' | 'name'> & {
  date: string | null;
  venues?: Pick<Venue, 'id' | 'name'> | null;
};
```

### For Artists/Promoters with Image URLs
```typescript
// Artist with computed image URLs
type ArtistWithImages = Pick<Artist, 'id' | 'name' | 'bio'> & {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};

// Promoter with computed image URLs
type PromoterWithImages = Pick<Database['public']['Tables']['promoters']['Row'], 'id' | 'name' | 'bio'> & {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};
```

### For Track Data with Relationships
```typescript
// Track with play count and artist info
type TrackWithPlayCount = Pick<Database['public']['Tables']['tracks']['Row'], 'id' | 'title'> & {
  plays: number;
  artist?: Pick<Artist, 'id' | 'name'>;
};
```

## 🔄 Type Transformation Patterns

### Function Signature Pattern
```typescript
export function transformEntityData(
  entity: Pick<Database['public']['Tables']['entity_name']['Row'], 'id' | 'name' | 'bio'>,
  relatedData: RelatedType[] = [],
): {
  transformedEntity: TransformedType;
  additionalData: AdditionalType[];
} {
  // Implementation
}
```

### Mapping Between Compatible Types
```typescript
// When converting between similar types (e.g., date vs start field)
const mapToEventWithVenue = (events: EventWithDate[]): EventWithVenue[] => 
  events.map(event => ({
    id: event.id,
    name: event.name,
    start: event.date, // Map date to start
    venues: event.venues
  }));
```

## 🎯 Component Props Patterns

### Profile Component Props
```typescript
interface ComponentProps {
  // Use typed entities
  artist: Artist;
  
  // Use composed types for related data
  promoters: PromoterWithImages[];
  events: EventWithVenue[];
  
  // Use utility types for optional/partial data
  metadata?: Partial<Pick<Artist, 'selectedFont' | 'external_links'>>;
}
```

## 🚨 Common Mistakes to Avoid

### ❌ Don't Create Loose Object Types
```typescript
// BAD
const updateData: any = { name: "New Name" };

// BAD
interface LooseUpdate {
  [key: string]: any;
}

// GOOD
type ArtistUpdate = Partial<Pick<Artist, 'name' | 'bio' | 'selectedFont'>>;
```

### ❌ Don't Duplicate Type Definitions
```typescript
// BAD - Duplicating Event structure
interface CustomEvent {
  id: string;
  name: string;
  start: string;
}

// GOOD - Using Pick from existing type
type CustomEvent = Pick<Event, 'id' | 'name' | 'start'>;
```

### ❌ Don't Ignore Null/Undefined Handling
```typescript
// BAD - Not handling nullable fields
type BadVenueRef = {
  venues: { id: string; name: string; };
};

// GOOD - Properly handling nullable relationships
type GoodVenueRef = {
  venues?: Pick<Venue, 'id' | 'name'> | null;
};
```

## 🔍 Quick Reference Commands

### Get Latest Utility Types Info
```bash
# Use this tool to get current TypeScript utility types documentation
#fetch_webpage https://www.typescriptlang.org/docs/handbook/utility-types.html
```

### Check Type Compatibility
```typescript
// Use TypeScript's built-in type checking
const testAssignment: TargetType = sourceData; // Will show errors if incompatible
```

### Debug Type Issues
```typescript
// Use type assertions for debugging
type DebugType = typeof someVariable; // Shows inferred type
```

## 📝 Checklist for New Type Definitions

- [ ] Does the type derive from Database or global.types?
- [ ] Are you using appropriate utility types (Pick, Omit, etc.)?
- [ ] Is null/undefined handling correct?
- [ ] Are intersection types (&) used properly for extensions?
- [ ] Is the type reusable and not overly specific?
- [ ] Does the type handle relationships correctly?
- [ ] Are optional properties marked with `?`?
- [ ] Is the type documented with comments if complex?

## 🎉 Success Indicators

When types are properly implemented:
- ✅ No TypeScript errors
- ✅ Full IntelliSense/autocomplete support
- ✅ Type safety throughout the application
- ✅ Easy refactoring when database schema changes
- ✅ Clear relationship between UI components and data models

---

**Remember**: Always refer to the official TypeScript documentation using the fetch_webpage tool when in doubt about utility types usage!
