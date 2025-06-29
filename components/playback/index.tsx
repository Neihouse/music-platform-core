"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import PlayerContext, { PlayerState, Track } from "@/lib/PlayerContext";
import { getTrackPlayURL, getTrackById } from "@/db/queries/tracks";
import { createClient } from "@/utils/supabase/client";

export interface IPlaybackProps {
  children: React.ReactNode;
}

export function Playback({ children }: IPlaybackProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();
  
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    playUrl: null,
    currentTime: 0,
    duration: 0,
    volume: 1,
    error: null,
  });

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    // Audio event listeners
    const handleLoadStart = () => {
      setPlayerState(prev => ({ ...prev, isLoading: true, error: null }));
    };

    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({ 
        ...prev, 
        duration: audio.duration || 0,
        isLoading: false 
      }));
    };

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({ 
        ...prev, 
        currentTime: audio.currentTime || 0 
      }));
    };

    const handlePlay = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleEnded = () => {
      setPlayerState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        currentTime: 0 
      }));
    };

    const handleError = () => {
      setPlayerState(prev => ({ 
        ...prev, 
        isPlaying: false,
        isLoading: false,
        error: 'Failed to load audio' 
      }));
    };

    const handleVolumeChange = () => {
      setPlayerState(prev => ({ ...prev, volume: audio.volume }));
    };

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('volumechange', handleVolumeChange);

    return () => {
      // Cleanup event listeners
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  const playTrack = useCallback(async (trackId: string) => {
    if (!audioRef.current) return;

    try {
      setPlayerState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // If it's the same track and we're paused, just resume
      if (playerState.currentTrack?.id === trackId) {
        if (audioRef.current.paused) {
          await audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
        return;
      }

      // Stop current track if playing
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }

      // Get track details and play URL
      const [trackDetails, playUrl] = await Promise.all([
        getTrackById(supabase, trackId),
        getTrackPlayURL(supabase, trackId)
      ]);
      
      if (!playUrl) {
        throw new Error('Failed to get track URL');
      }

      // Set new track
      audioRef.current.src = playUrl;
      audioRef.current.currentTime = 0;

      // Create track object with real data
      const track: Track = {
        id: trackId,
        title: trackDetails.title,
        duration: trackDetails.duration,
        artist: trackDetails.artist, // Include the artist information
      };

      setPlayerState(prev => ({
        ...prev,
        currentTrack: track,
        playUrl,
        currentTime: 0,
      }));

      // Play the track
      await audioRef.current.play();
      
    } catch (error) {
      console.error('Error playing track:', error);
      setPlayerState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to play track'
      }));
    }
  }, [supabase, playerState.currentTrack?.id]);

  const pauseTrack = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const resumeTrack = useCallback(async () => {
    if (audioRef.current && audioRef.current.paused && playerState.playUrl) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Error resuming track:', error);
        setPlayerState(prev => ({
          ...prev,
          error: 'Failed to resume playback'
        }));
      }
    }
  }, [playerState.playUrl]);

  const stopTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayerState(prev => ({
        ...prev,
        currentTrack: null,
        playUrl: null,
        currentTime: 0,
        isPlaying: false,
      }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current && playerState.duration > 0) {
      audioRef.current.currentTime = Math.max(0, Math.min(playerState.duration, time));
    }
  }, [playerState.duration]);

  return (
    <PlayerContext.Provider value={{
      ...playerState,
      playTrack,
      pauseTrack,
      resumeTrack,
      stopTrack,
      setVolume,
      seekTo,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}
