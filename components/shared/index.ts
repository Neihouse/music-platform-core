export { default as HeroSection } from './HeroSection';
export { default as ProfileHeader } from './ProfileHeader';
export { default as ContentTabs } from './ContentTabs';
export { default as MusicGrid } from './MusicGrid';
export { default as EventsList } from './EventsList';
export { default as CollaboratorsGrid } from './CollaboratorsGrid';
export { default as ProfileContent } from './ProfileContent';
export type { ProfileTab, ProfileEntity, ProfileContentProps } from './ProfileContent';
export type { MusicTrack, MusicGridProps } from './MusicGrid';
export { 
  transformArtistData, 
  transformPromoterData, 
  transformPromoterLocalities 
} from './ProfileContentHelpers';

// New shared components for discover page
export { SearchHero } from './SearchHero';
export { MusicCard } from './MusicCard';
export { ArtistCard } from './ArtistCard';
export { VenueCard } from './VenueCard';
export { EventCard } from './EventCard';
export { ContentSection } from './ContentSection';
