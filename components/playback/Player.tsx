"use client";
import PlaybackContext from "@/lib/PlayerContext";
import { Container } from "@mantine/core";
import * as React from "react";
import AudioPlayer from "react-h5-audio-player";

export interface IPlayerProps {}

export function Player({}: IPlayerProps) {
  const { playUrl } = React.useContext(PlaybackContext);

  return (
    <Container>
      <AudioPlayer src={playUrl} />
    </Container>
  );
}
