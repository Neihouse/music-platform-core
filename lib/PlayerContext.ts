import { createContext } from "react";

const PlaybackContext = createContext<{
  playUrl: string | undefined;
  setTrackId: (trackId: string) => void;
}>({
  playUrl: undefined,
  setTrackId: (trackId: string) => {},
});

export default PlaybackContext;
