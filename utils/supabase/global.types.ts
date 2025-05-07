import { Database } from "./database.types";

type Public = Database["public"]["Tables"];
export type Track = Public["tracks"]["Row"];
export type Artist = Public["artists"]["Row"];
export type Locality = Public["localities"]["Row"];
export type AdministrativeArea = Public["administrative_area"]["Row"];
