"use client";

import { ActionIcon, Box, Image, Paper, ThemeIcon, Transition } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconPhotoPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";


interface IArtUploadProps {
  onFileChange?: (file: FileWithPath | null) => void;
  isMobile?: boolean;
}

export function ArtUpload({ onFileChange, isMobile: propIsMobile }: IArtUploadProps = {}) {
  const [file, setFile] = useState<FileWithPath | null>(null);
  const [hovered, setHovered] = useState(false);
  const autoIsMobile = useMediaQuery("(max-width: 48em)");
  const isMobile = propIsMobile !== undefined ? propIsMobile : autoIsMobile;

  const imageSize = isMobile ? 120 : 140;



  return (
    <div>
      {renderZone()}
    </div>
  )

  function renderZone() {
    if (file) {
      return (
        <Paper
          shadow="md"
          radius="md"
          style={{
            position: 'relative',
            width: 'fit-content',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            transform: hovered ? 'scale(1.02)' : 'scale(1)',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Image
            src={URL.createObjectURL(file)}
            alt="Track Art"
            width={imageSize}
            height={imageSize}
            radius="md"
            style={{ objectFit: 'cover' }}
          />
          <Transition mounted={hovered || !!isMobile} transition="fade" duration={200}>
            {(styles) => (
              <Box
                style={{
                  ...styles,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--mantine-radius-md)'
                }}
              >
                <ActionIcon
                  color="red"
                  variant="filled"
                  radius="xl"
                  size={isMobile ? "md" : "lg"}
                  onClick={() => setFile(null)}
                  aria-label="Remove image"
                >
                  <IconX size={isMobile ? 16 : 18} />
                </ActionIcon>
              </Box>
            )}
          </Transition>
        </Paper>
      );
    }

    return (
      <Paper
        shadow="sm"
        radius="md"
        style={{
          width: imageSize,
          height: imageSize
        }}
      >
        <Dropzone
          onDrop={(files) => setFile(files[0])}
          onReject={(files) => console.log("rejected files", files)}
          accept={["image/png", "image/jpeg"]}
          style={{
            border: '2px dashed var(--mantine-color-blue-4)',
            backgroundColor: 'var(--mantine-color-blue-0)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderRadius: 'var(--mantine-radius-md)'
          }}
        >
          <Dropzone.Accept>
            <ThemeIcon color="blue" size={isMobile ? 40 : 50} radius={isMobile ? 20 : 25} variant="light">
              <IconPhotoPlus size={isMobile ? 22 : 26} />
            </ThemeIcon>
          </Dropzone.Accept>
          <Dropzone.Reject>
            <ThemeIcon color="red" size={isMobile ? 40 : 50} radius={isMobile ? 20 : 25} variant="light">
              <IconX size={isMobile ? 22 : 26} />
            </ThemeIcon>
          </Dropzone.Reject>
          <Dropzone.Idle>
            <ThemeIcon color="blue" size={isMobile ? 40 : 50} radius={isMobile ? 20 : 25} variant="light">
              <IconPhotoPlus size={isMobile ? 22 : 26} />
            </ThemeIcon>
          </Dropzone.Idle>
        </Dropzone>
      </Paper>
    )
  }
}