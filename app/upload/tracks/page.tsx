"use client";

import { TrackUpload } from "@/components/Upload/TrackUpload";
import {
  Box,
  Container,
  Paper,
  Text,
  ThemeIcon
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconMusic
} from "@tabler/icons-react";

export default function UploadTrackPage() {
  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Container size="lg" py={isMobile ? "md" : "xl"}>
      <Paper
        p={isMobile ? "md" : "xl"}
        radius="md"
        withBorder
        style={{
          borderColor: 'var(--mantine-color-violet-2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '-30px',
            right: '-10px',
            opacity: 0.04,
            zIndex: 0,
          }}
        >
          <ThemeIcon size={isMobile ? 180 : 220} radius={isMobile ? 90 : 110} color="violet.4">
            <IconMusic size={isMobile ? 110 : 140} stroke={1} />
          </ThemeIcon>
        </Box>

        <Box style={{ position: 'relative', zIndex: 1 }}>
          <Text size={isMobile ? "md" : "lg"} mb={isMobile ? "md" : "xl"}>
            Upload individual tracks with custom artwork and metadata.
          </Text>

          <TrackUpload />

        </Box>
      </Paper>
    </Container>
  );
}