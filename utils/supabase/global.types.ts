import { Database } from "./database.types";

type Public = Database["public"]["Tables"];
export type Track = Public["tracks"]["Row"];
export type Artist = Public["artists"]["Row"];
