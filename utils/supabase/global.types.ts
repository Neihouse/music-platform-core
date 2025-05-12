import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export type TypedClient = SupabaseClient<Database>;
type Public = Database["public"]["Tables"];
export type Track = Public["tracks"]["Row"];
export type Artist = Public["artists"]["Row"];
export type Locality = Public["localities"]["Row"];
export type AdministrativeArea = Public["administrative_areas"]["Row"];
export type Country = Public["countries"]["Row"];
