'use server';

import { createClient } from '@/utils/supabase/server';

export interface LocalArtist {
  id: string;
  name: string;
  bio: string;
  avatar_img?: string;
  banner_img?: string;
  selectedFont?: string;
  genre?: string;
  followerCount?: number;
}

export interface LocalVenue {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  address?: string;
  selectedFont?: string;
  upcomingEvents?: number;
  banner_img?: string;
  avatar_img?: string;
}

export interface LocalPromoter {
  id: string;
  name: string;
  bio?: string;
  avatar_img?: string;
  banner_img?: string;
  selectedFont?: string;
  eventsOrganized?: number;
}

export interface LocalEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  artists: string[];
  price?: string;
  banner_img?: string;
}

export interface CityData {
  artists: LocalArtist[];
  venues: LocalVenue[];
  promoters: LocalPromoter[];
  events: LocalEvent[];
}

export async function getCityMusicData(cityName: string): Promise<CityData> {
  const supabase = await createClient();
  
  try {
    // First, try to find the locality by name with more precise matching
    const normalizedCityName = cityName.trim().toLowerCase();
    const { data: localities } = await supabase
      .from('localities')
      .select('id, name')
      .ilike('name', normalizedCityName)
      .limit(1);
    
    const localityId = localities?.[0]?.id;
    
    if (!localityId) {
      // Return empty data if city not found
      return {
        artists: [],
        venues: [],
        promoters: [],
        events: []
      };
    }

    // Fetch artists in the city
    const { data: artists } = await supabase
      .from('artists')
      .select(`
        id,
        name,
        bio,
        avatar_img,
        banner_img,
        selectedFont,
        administrative_area_id,
        localities!inner(id, name)
      `)
      .eq('localities.id', localityId)
      .limit(6);

    // Fetch venues in the city
    const { data: venues } = await supabase
      .from('venues')
      .select(`
        id,
        name,
        description,
        capacity,
        address,
        selectedFont
      `)
      .eq('locality', localityId)
      .limit(6);

    // Fetch events in the city
    const { data: events } = await supabase
      .from('events')
      .select(`
        id,
        name,
        date,
        venue,
        venues!inner(name),
        events_artists!inner(
          artist,
          artists!inner(name)
        )
      `)
      .eq('locality', localityId)
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(6);

    // Fetch promoters (this might need to be adjusted based on your schema)
    const { data: promoters } = await supabase
      .from('promoters')
      .select(`
        id,
        name,
        bio,
        avatar_img,
        banner_img,
        selectedFont
      `)
      .limit(4);

    // Transform the data to match our interface
    const transformedArtists: LocalArtist[] = (artists || []).map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      bio: artist.bio || '',
      avatar_img: artist.avatar_img || undefined,
      banner_img: artist.banner_img || undefined,
      selectedFont: artist.selectedFont || undefined,
      genre: 'Various', // You might want to add a genre field to your schema
      // followerCount removed - not a real feature yet
    }));

    const transformedVenues: LocalVenue[] = (venues || []).map((venue: any) => ({
      id: venue.id,
      name: venue.name,
      description: venue.description || undefined,
      capacity: venue.capacity || undefined,
      address: venue.address || undefined,
      selectedFont: venue.selectedFont || undefined,
      // upcomingEvents removed - should be calculated from real events data
    }));

    const transformedEvents: LocalEvent[] = (events || []).map((event: any) => ({
      id: event.id,
      name: event.name,
      date: event.date || new Date().toISOString(),
      venue: event.venues?.name || 'TBA',
      artists: event.events_artists?.map((ea: any) => ea.artists?.name).filter(Boolean) || [],
      // price removed - should come from real event data when pricing feature is implemented
    }));

    const transformedPromoters: LocalPromoter[] = (promoters || []).map((promoter: any) => ({
      id: promoter.id,
      name: promoter.name,
      bio: promoter.bio || undefined,
      avatar_img: promoter.avatar_img || undefined,
      banner_img: promoter.banner_img || undefined,
      selectedFont: promoter.selectedFont || undefined,
      // eventsOrganized removed - should be calculated from real events data
    }));

    return {
      artists: transformedArtists,
      venues: transformedVenues,
      promoters: transformedPromoters,
      events: transformedEvents
    };

  } catch (error) {
    console.error('Error fetching city music data:', error);
    // Return empty data on error
    return {
      artists: [],
      venues: [],
      promoters: [],
      events: []
    };
  }
}
