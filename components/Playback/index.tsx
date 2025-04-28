import { createContext } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export interface IPlaybackProps {
  src: string;
}

const PlayerContext = createContext({
  src: "",
});

export function Playback({ src }: IPlaybackProps) {
  return (
    <div></div>

    // <PlayerContext.Provider>
    //   <AudioPlayer src={src} />
    // </PlayerContext.Provider>
  );
}
