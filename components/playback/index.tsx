"use client";
import "react-h5-audio-player/lib/styles.css";
import { useEffect, useState } from "react";
import PlayerContext from "@/lib/PlayerContext";
import { getTrackPlayURL } from "@/db/queries/tracks";

export interface IPlaybackProps {
  children: React.ReactNode;
}

export function Playback({ children }: IPlaybackProps) {
  const [error, setError] = useState<string | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [playUrl, setPlayUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!trackId) {
      return;
    }
    async function handlePlay(trackId: string) {
      try {
        setPlayUrl(await getTrackPlayURL(trackId));
      } catch (error) {
        console.error("Error fetching play URL:", error);

        setError(`${error}`);
      }
    }

    handlePlay(trackId);
  }, [trackId]);

  return (
    <PlayerContext.Provider value={{ playUrl, setTrackId }}>
      {children}
    </PlayerContext.Provider>
  );
}
