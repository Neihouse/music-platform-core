import { CityData } from "@/app/discover/actions";

export const mockCityData: CityData = {
  artists: [
    {
      id: "1",
      name: "Electric Shadows",
      bio: "Indie electronic duo creating atmospheric soundscapes that blend organic and synthetic elements.",
      genre: "Electronic",
      banner_img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop&q=80", // Neon concert stage
      avatar_img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80", // Electronic music artist
      selectedFont: "Poppins",
    },
    {
      id: "2", 
      name: "Luna Verde",
      bio: "Bilingual indie folk artist weaving stories of urban life and natural beauty.",
      genre: "Indie Folk",
      banner_img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200&h=600&fit=crop&q=80", // Acoustic guitar performance
      avatar_img: "https://images.unsplash.com/photo-1494790108755-2616c96c0787?w=400&h=400&fit=crop&q=80", // Folk artist with guitar
      selectedFont: "Montserrat",
    },
    {
      id: "3",
      name: "Neon Collective",
      bio: "High-energy rock band known for their explosive live performances and catchy hooks.",
      genre: "Rock",
      banner_img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=600&fit=crop&q=80", // Rock concert crowd
      avatar_img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop&q=80", // Rock band members
      selectedFont: "Roboto",
    },
  ],
  venues: [
    {
      id: "1",
      name: "The Underground",
      description: "Intimate venue featuring emerging artists and experimental music.",
      capacity: 200,
      banner_img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&h=600&fit=crop&q=80", // Small intimate venue
      avatar_img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop&q=80", // Venue logo/stage
      selectedFont: "Inter",
    },
    {
      id: "2",
      name: "Riverside Amphitheater", 
      description: "Outdoor venue with stunning views, perfect for summer concerts.",
      capacity: 5000,
      banner_img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop&q=80", // Large outdoor amphitheater
      avatar_img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80", // Amphitheater from above
      selectedFont: "Lato",
    },
    {
      id: "3",
      name: "Jazz Corner",
      description: "Historic venue known for its incredible acoustics and cozy atmosphere.",
      capacity: 150,
      banner_img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&h=600&fit=crop&q=80", // Jazz club interior
      avatar_img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop&q=80", // Jazz instruments/atmosphere
      selectedFont: "Playfair Display",
    },
  ],
  promoters: [
    {
      id: "1",
      name: "Sonic Boom Events",
      bio: "Curating unique musical experiences that connect artists with their perfect audience.",
      banner_img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&h=600&fit=crop&q=80", // Concert crowd from above
      avatar_img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop&q=80", // Event organizer/DJ
      selectedFont: "Raleway",
    },
    {
      id: "2",
      name: "Underground Collective",
      bio: "Supporting local and touring acts with a focus on experimental and indie music.",
      banner_img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=600&fit=crop&q=80", // Underground venue/club
      avatar_img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&q=80", // Music collective member
      selectedFont: "Open Sans",
    },
  ],
  events: [
    {
      id: "1",
      name: "Summer Sonic Festival",
      date: "2025-07-15T19:00:00",
      venue: "Riverside Amphitheater",
      artists: ["Electric Shadows", "Luna Verde", "Neon Collective"],
      banner_img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop&q=80", // Festival crowd
    },
    {
      id: "2",
      name: "Indie Night Sessions",
      date: "2025-07-02T21:00:00", 
      venue: "The Underground",
      artists: ["Luna Verde", "Local Opener"],
      banner_img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200&h=600&fit=crop&q=80", // Indie acoustic performance
    },
    {
      id: "3",
      name: "Rock Revival",
      date: "2025-07-08T20:00:00",
      venue: "Jazz Corner",
      artists: ["Neon Collective"],
      banner_img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=600&fit=crop&q=80", // Rock concert
    },
  ],
};
