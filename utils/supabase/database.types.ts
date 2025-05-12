export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      administrative_areas: {
        Row: {
          country_id: string;
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          country_id: string;
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          country_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "administrative_areas_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      albums: {
        Row: {
          created_at: string;
          id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          title?: string;
        };
        Relationships: [];
      };
      artists: {
        Row: {
          administrative_area_id: string | null;
          bio: string;
          country_id: string | null;
          created_at: string;
          id: string;
          locality_id: string | null;
          name: string;
          user_id: string;
        };
        Insert: {
          administrative_area_id?: string | null;
          bio?: string;
          country_id?: string | null;
          created_at?: string;
          id?: string;
          locality_id?: string | null;
          name: string;
          user_id?: string;
        };
        Update: {
          administrative_area_id?: string | null;
          bio?: string;
          country_id?: string | null;
          created_at?: string;
          id?: string;
          locality_id?: string | null;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "artists_administrative_area_fkey";
            columns: ["administrative_area_id"];
            isOneToOne: false;
            referencedRelation: "administrative_areas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artists_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artists_locality_fkey";
            columns: ["locality_id"];
            isOneToOne: false;
            referencedRelation: "localities";
            referencedColumns: ["id"];
          },
        ];
      };
      artists_tags: {
        Row: {
          artist_id: string;
          created_at: string;
          id: string;
          tag_id: string;
        };
        Insert: {
          artist_id: string;
          created_at?: string;
          id?: string;
          tag_id: string;
        };
        Update: {
          artist_id?: string;
          created_at?: string;
          id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "artists_tags_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artist_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artists_tags_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artists_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      artists_tracks: {
        Row: {
          artist_id: string;
          created_at: string;
          id: string;
          track_id: string;
        };
        Insert: {
          artist_id: string;
          created_at?: string;
          id?: string;
          track_id: string;
        };
        Update: {
          artist_id?: string;
          created_at?: string;
          id?: string;
          track_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "artists_tracks_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artist_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artists_tracks_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artists_tracks_track_id_fkey";
            columns: ["track_id"];
            isOneToOne: false;
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          },
        ];
      };
      countries: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      fans: {
        Row: {
          administrative_area_id: string | null;
          created_at: string;
          display_name: string;
          id: string;
          locality_id: string | null;
        };
        Insert: {
          administrative_area_id?: string | null;
          created_at?: string;
          display_name: string;
          id?: string;
          locality_id?: string | null;
        };
        Update: {
          administrative_area_id?: string | null;
          created_at?: string;
          display_name?: string;
          id?: string;
          locality_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fans_administrative_area_id_fkey";
            columns: ["administrative_area_id"];
            isOneToOne: false;
            referencedRelation: "administrative_areas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fans_locality_id_fkey";
            columns: ["locality_id"];
            isOneToOne: false;
            referencedRelation: "localities";
            referencedColumns: ["id"];
          },
        ];
      };
      likes: {
        Row: {
          created_at: string;
          id: string;
          track_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          track_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          track_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_track_id_fkey";
            columns: ["track_id"];
            isOneToOne: false;
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          },
        ];
      };
      localities: {
        Row: {
          administrative_area_id: string;
          country_id: string;
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          administrative_area_id: string;
          country_id: string;
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          administrative_area_id?: string;
          country_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "localities_administrative_area_id_fkey";
            columns: ["administrative_area_id"];
            isOneToOne: false;
            referencedRelation: "administrative_areas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "localities_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      "pre-registered-users": {
        Row: {
          created_at: string;
          email: string;
          id: string;
          locality: string;
          type: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          locality: string;
          type: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          locality?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pre-registered-users_locality_fkey";
            columns: ["locality"];
            isOneToOne: false;
            referencedRelation: "localities";
            referencedColumns: ["id"];
          },
        ];
      };
      promoters: {
        Row: {
          administrative_area_id: string;
          country_id: string;
          created_at: string;
          id: string;
          locality_id: string;
          title: string;
          user_id: string;
        };
        Insert: {
          administrative_area_id: string;
          country_id: string;
          created_at?: string;
          id?: string;
          locality_id: string;
          title: string;
          user_id?: string;
        };
        Update: {
          administrative_area_id?: string;
          country_id?: string;
          created_at?: string;
          id?: string;
          locality_id?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "promoters_administrative_area_id_fkey";
            columns: ["administrative_area_id"];
            isOneToOne: false;
            referencedRelation: "administrative_areas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promoters_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promoters_locality_id_fkey";
            columns: ["locality_id"];
            isOneToOne: false;
            referencedRelation: "localities";
            referencedColumns: ["id"];
          },
        ];
      };
      promoters_artists: {
        Row: {
          artist_id: string;
          created_at: string;
          id: string;
          promoter_id: string;
        };
        Insert: {
          artist_id: string;
          created_at?: string;
          id?: string;
          promoter_id: string;
        };
        Update: {
          artist_id?: string;
          created_at?: string;
          id?: string;
          promoter_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "promoters_artists_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artist_view";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promoters_artists_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promoters_artists_promoter_id_fkey";
            columns: ["promoter_id"];
            isOneToOne: false;
            referencedRelation: "promoters";
            referencedColumns: ["id"];
          },
        ];
      };
      promoters_tags: {
        Row: {
          created_at: string;
          id: number;
          promoter_id: string;
          tag_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          promoter_id: string;
          tag_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          promoter_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "promoters_tags_promoter_id_fkey";
            columns: ["promoter_id"];
            isOneToOne: false;
            referencedRelation: "promoters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promoters_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      promoters_venues: {
        Row: {
          created_at: string;
          id: string;
          promoter_id: string;
          venue_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          promoter_id: string;
          venue_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          promoter_id?: string;
          venue_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "promoters_venues_promoter_id_fkey";
            columns: ["promoter_id"];
            isOneToOne: false;
            referencedRelation: "promoters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promoters_venues_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      track_plays: {
        Row: {
          created_at: string;
          id: string;
          track: string;
          user: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          track: string;
          user: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          track?: string;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "track_plays_track_fkey";
            columns: ["track"];
            isOneToOne: false;
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          },
        ];
      };
      tracks: {
        Row: {
          album_id: string | null;
          bitrate: number | null;
          channels: number;
          codec: string;
          container: string | null;
          created_at: string;
          duration: number;
          featured: boolean;
          id: string;
          sample_rate: number | null;
          size: number | null;
          title: string;
        };
        Insert: {
          album_id?: string | null;
          bitrate?: number | null;
          channels: number;
          codec: string;
          container?: string | null;
          created_at?: string;
          duration: number;
          featured?: boolean;
          id?: string;
          sample_rate?: number | null;
          size?: number | null;
          title: string;
        };
        Update: {
          album_id?: string | null;
          bitrate?: number | null;
          channels?: number;
          codec?: string;
          container?: string | null;
          created_at?: string;
          duration?: number;
          featured?: boolean;
          id?: string;
          sample_rate?: number | null;
          size?: number | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tracks_album_id_fkey";
            columns: ["album_id"];
            isOneToOne: false;
            referencedRelation: "albums";
            referencedColumns: ["id"];
          },
        ];
      };
      tracks_tags: {
        Row: {
          created_at: string;
          id: string;
          tag_id: string;
          track_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          tag_id: string;
          track_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          tag_id?: string;
          track_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tracks_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tracks_tags_track_id_fkey";
            columns: ["track_id"];
            isOneToOne: false;
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          },
        ];
      };
      venues: {
        Row: {
          address: string;
          administrative_area: string;
          capacity: number | null;
          contact_email: string;
          contact_phone: string;
          created_at: string;
          description: string | null;
          id: string;
          locality: string;
          name: string;
          user_id: string;
        };
        Insert: {
          address: string;
          administrative_area: string;
          capacity?: number | null;
          contact_email: string;
          contact_phone: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          locality: string;
          name: string;
          user_id?: string;
        };
        Update: {
          address?: string;
          administrative_area?: string;
          capacity?: number | null;
          contact_email?: string;
          contact_phone?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          locality?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "venues_administrative_area_fkey";
            columns: ["administrative_area"];
            isOneToOne: false;
            referencedRelation: "administrative_areas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "venues_locality_fkey";
            columns: ["locality"];
            isOneToOne: false;
            referencedRelation: "localities";
            referencedColumns: ["id"];
          },
        ];
      };
      venues_tags: {
        Row: {
          created_at: string;
          id: number;
          tag_id: string;
          venue_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          tag_id: string;
          venue_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          tag_id?: string;
          venue_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "venues_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "venues_tags_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      artist_view: {
        Row: {
          administrative_area: string | null;
          bio: string | null;
          created_at: string | null;
          id: string | null;
          locality: string | null;
          name: string | null;
          tracks: Json[] | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "artists_administrative_area_fkey";
            columns: ["administrative_area"];
            isOneToOne: false;
            referencedRelation: "administrative_areas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artists_locality_fkey";
            columns: ["locality"];
            isOneToOne: false;
            referencedRelation: "localities";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
