export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      administrative_areas: {
        Row: {
          country_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          country_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          country_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "administrative_areas_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      albums: {
        Row: {
          created_at: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      artists: {
        Row: {
          administrative_area_id: string | null
          avatar_img: string | null
          banner_img: string | null
          bio: string
          country_id: string | null
          created_at: string
          external_links: string[] | null
          id: string
          name: string
          selectedFont: string | null
          user_id: string
        }
        Insert: {
          administrative_area_id?: string | null
          avatar_img?: string | null
          banner_img?: string | null
          bio?: string
          country_id?: string | null
          created_at?: string
          external_links?: string[] | null
          id?: string
          name: string
          selectedFont?: string | null
          user_id?: string
        }
        Update: {
          administrative_area_id?: string | null
          avatar_img?: string | null
          banner_img?: string | null
          bio?: string
          country_id?: string | null
          created_at?: string
          external_links?: string[] | null
          id?: string
          name?: string
          selectedFont?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artists_administrative_area_fkey"
            columns: ["administrative_area_id"]
            isOneToOne: false
            referencedRelation: "administrative_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artists_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      artists_localities: {
        Row: {
          artist: string
          created_at: string
          locality: string
        }
        Insert: {
          artist: string
          created_at?: string
          locality: string
        }
        Update: {
          artist?: string
          created_at?: string
          locality?: string
        }
        Relationships: [
          {
            foreignKeyName: "artists_localities_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artists_localities_locality_fkey"
            columns: ["locality"]
            isOneToOne: false
            referencedRelation: "localities"
            referencedColumns: ["id"]
          },
        ]
      }
      artists_tags: {
        Row: {
          artist_id: string
          created_at: string
          tag: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          tag: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "artists_tags_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artists_tags_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["name"]
          },
        ]
      }
      artists_tracks: {
        Row: {
          artist: string
          created_at: string
          track: string
        }
        Insert: {
          artist: string
          created_at?: string
          track: string
        }
        Update: {
          artist?: string
          created_at?: string
          track?: string
        }
        Relationships: [
          {
            foreignKeyName: "artists_tracks_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artists_tracks_track_fkey"
            columns: ["track"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      event_images: {
        Row: {
          artist: string | null
          created_at: string
          id: string
          locality: string | null
          promoter: string | null
          venue: string | null
        }
        Insert: {
          artist?: string | null
          created_at?: string
          id?: string
          locality?: string | null
          promoter?: string | null
          venue?: string | null
        }
        Update: {
          artist?: string | null
          created_at?: string
          id?: string
          locality?: string | null
          promoter?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_images_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_images_locality_fkey"
            columns: ["locality"]
            isOneToOne: false
            referencedRelation: "localities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_images_promoter_fkey"
            columns: ["promoter"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_images_venue_fkey"
            columns: ["venue"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      event_stage: {
        Row: {
          created_at: string
          event: string
          id: string
          name: string
          venue: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          name: string
          venue: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          name?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_stage_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_stage_venue_fkey"
            columns: ["venue"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      event_stage_artists: {
        Row: {
          artist: string
          created_at: string
          event: string
          id: string
          set_end: string | null
          set_start: string | null
          stage: string | null
        }
        Insert: {
          artist: string
          created_at?: string
          event: string
          id?: string
          set_end?: string | null
          set_start?: string | null
          stage?: string | null
        }
        Update: {
          artist?: string
          created_at?: string
          event?: string
          id?: string
          set_end?: string | null
          set_start?: string | null
          stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_stage_artists_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_stage_artists_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_stage_artists_stage_fkey"
            columns: ["stage"]
            isOneToOne: false
            referencedRelation: "event_stage"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          created_at: string
          date: string | null
          id: string
          locality: string | null
          name: string
          user_id: string | null
          venue: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          date?: string | null
          id?: string
          locality?: string | null
          name: string
          user_id?: string | null
          venue?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          date?: string | null
          id?: string
          locality?: string | null
          name?: string
          user_id?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_locality_fkey"
            columns: ["locality"]
            isOneToOne: false
            referencedRelation: "localities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_fkey"
            columns: ["venue"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      events_artists: {
        Row: {
          artist: string
          created_at: string
          end_time: string | null
          event: string
          start_time: string | null
        }
        Insert: {
          artist: string
          created_at?: string
          end_time?: string | null
          event: string
          start_time?: string | null
        }
        Update: {
          artist?: string
          created_at?: string
          end_time?: string | null
          event?: string
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_artists_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_artists_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events_promoters: {
        Row: {
          created_at: string
          event: string
          promoter: string
        }
        Insert: {
          created_at?: string
          event: string
          promoter: string
        }
        Update: {
          created_at?: string
          event?: string
          promoter?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_promoters_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_promoters_promoter_fkey"
            columns: ["promoter"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
        ]
      }
      fans: {
        Row: {
          administrative_area_id: string | null
          created_at: string
          display_name: string
          id: string
          locality_id: string | null
        }
        Insert: {
          administrative_area_id?: string | null
          created_at?: string
          display_name: string
          id?: string
          locality_id?: string | null
        }
        Update: {
          administrative_area_id?: string | null
          created_at?: string
          display_name?: string
          id?: string
          locality_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fans_administrative_area_id_fkey"
            columns: ["administrative_area_id"]
            isOneToOne: false
            referencedRelation: "administrative_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fans_locality_id_fkey"
            columns: ["locality_id"]
            isOneToOne: false
            referencedRelation: "localities"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      localities: {
        Row: {
          administrative_area_id: string
          country_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          administrative_area_id: string
          country_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          administrative_area_id?: string
          country_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "localities_administrative_area_id_fkey"
            columns: ["administrative_area_id"]
            isOneToOne: false
            referencedRelation: "administrative_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "localities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      "pre-registered-users": {
        Row: {
          created_at: string
          email: string
          id: string
          locality: string
          type: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          locality: string
          type: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          locality?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "pre-registered-users_locality_fkey"
            columns: ["locality"]
            isOneToOne: false
            referencedRelation: "localities"
            referencedColumns: ["id"]
          },
        ]
      }
      promoters: {
        Row: {
          avatar_img: string | null
          banner_img: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          user_id: string
        }
        Insert: {
          avatar_img?: string | null
          banner_img?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          user_id?: string
        }
        Update: {
          avatar_img?: string | null
          banner_img?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      promoters_artists: {
        Row: {
          artist: string
          created_at: string
          promoter: string
        }
        Insert: {
          artist: string
          created_at?: string
          promoter: string
        }
        Update: {
          artist?: string
          created_at?: string
          promoter?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoters_artists_artist_id_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoters_artists_promoter_id_fkey"
            columns: ["promoter"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
        ]
      }
      promoters_localities: {
        Row: {
          created_at: string
          locality_id: string
          promoter_id: string
        }
        Insert: {
          created_at?: string
          locality_id: string
          promoter_id: string
        }
        Update: {
          created_at?: string
          locality_id?: string
          promoter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoters_localities_locality_id_fkey"
            columns: ["locality_id"]
            isOneToOne: false
            referencedRelation: "localities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoters_localities_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
        ]
      }
      promoters_tags: {
        Row: {
          created_at: string
          promoter: string
          tag: string
        }
        Insert: {
          created_at?: string
          promoter: string
          tag: string
        }
        Update: {
          created_at?: string
          promoter?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoters_tags_promoter_fkey"
            columns: ["promoter"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoters_tags_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["name"]
          },
        ]
      }
      promoters_venues: {
        Row: {
          created_at: string
          promoter_id: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          promoter_id: string
          venue_id: string
        }
        Update: {
          created_at?: string
          promoter_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoters_venues_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoters_venues_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          name: string
        }
        Insert: {
          created_at?: string
          name: string
        }
        Update: {
          created_at?: string
          name?: string
        }
        Relationships: []
      }
      track_plays: {
        Row: {
          created_at: string
          id: string
          track: string
          user: string
        }
        Insert: {
          created_at?: string
          id?: string
          track: string
          user: string
        }
        Update: {
          created_at?: string
          id?: string
          track?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_plays_track_fkey"
            columns: ["track"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          album_id: string | null
          bitrate: number | null
          channels: number
          codec: string
          container: string | null
          created_at: string
          duration: number
          featured: boolean
          id: string
          sample_rate: number | null
          size: number | null
          title: string
          user_id: string
        }
        Insert: {
          album_id?: string | null
          bitrate?: number | null
          channels: number
          codec: string
          container?: string | null
          created_at?: string
          duration: number
          featured?: boolean
          id?: string
          sample_rate?: number | null
          size?: number | null
          title: string
          user_id?: string
        }
        Update: {
          album_id?: string | null
          bitrate?: number | null
          channels?: number
          codec?: string
          container?: string | null
          created_at?: string
          duration?: number
          featured?: boolean
          id?: string
          sample_rate?: number | null
          size?: number | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks_tags: {
        Row: {
          created_at: string
          tag: string
          track_id: string | null
        }
        Insert: {
          created_at?: string
          tag: string
          track_id?: string | null
        }
        Update: {
          created_at?: string
          tag?: string
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracks_tags_tag_fkey"
            columns: ["tag"]
            isOneToOne: true
            referencedRelation: "tags"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "tracks_tags_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          administrative_area: string
          capacity: number | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          locality: string
          name: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          administrative_area: string
          capacity?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          locality: string
          name: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          administrative_area?: string
          capacity?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          locality?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_administrative_area_fkey"
            columns: ["administrative_area"]
            isOneToOne: false
            referencedRelation: "administrative_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_locality_fkey"
            columns: ["locality"]
            isOneToOne: false
            referencedRelation: "localities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
