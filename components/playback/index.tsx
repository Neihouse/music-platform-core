"use client";
import "react-h5-audio-player/lib/styles.css";
import { useEffect, useState } from "react";
import PlayerContext from "@/lib/PlayerContext";
import { getTrackPlayURL } from "@/db/queries/tracks";

export interface IPlaybackProps {
  children: React.ReactNode;
}

export function Playback({ children }: IPlaybackProps) {
  const [trackId, setTrackId] = useState<string | null>(null);
  const [playUrl, setPlayUrl] = useState<string | undefined>(undefined);

  console.log("Playback URL: ", playUrl);

  useEffect(() => {
    if (!trackId) {
      return;
    }
    async function handlePlay(trackId: string) {
      setPlayUrl(await getTrackPlayURL(trackId));
    }

    handlePlay(trackId);
  }, [trackId]);

  return (
    <PlayerContext.Provider value={{ playUrl, setTrackId }}>
      {children}
    </PlayerContext.Provider>
  );
}
