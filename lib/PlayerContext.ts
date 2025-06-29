import { createContext } from "react";

export interface Track {
  id: string;
  title: string;
  duration: number;
  artist?: string; // Artist name for display
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  playUrl: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  error: string | null;
}

export interface PlayerActions {
  playTrack: (trackId: string) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

export interface PlayerContextType extends PlayerState, PlayerActions {}

const defaultPlayerState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  playUrl: null,
  currentTime: 0,
  duration: 0,
  volume: 1,
  error: null,
};

const defaultPlayerActions: PlayerActions = {
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  stopTrack: () => {},
  setVolume: () => {},
  seekTo: () => {},
};

const PlaybackContext = createContext<PlayerContextType>({
  ...defaultPlayerState,
  ...defaultPlayerActions,
});

export default PlaybackContext;
