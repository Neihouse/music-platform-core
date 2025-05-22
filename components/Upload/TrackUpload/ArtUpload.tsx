"use client";

import { ActionIcon, Box, Image, Paper, ThemeIcon, Transition } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconPhotoPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";


interface IArtUploadProps {
  onFileChange?: (file: FileWithPath | null) => void;
}

export function ArtUpload({ onFileChange }: IArtUploadProps = {}) {
  const [file, setFile] = useState<FileWithPath | null>(null);
  const [hovered, setHovered] = useState(false);



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
            width={140}
            height={140}
            radius="md"
            style={{ objectFit: 'cover' }}
          />
          <Transition mounted={hovered} transition="fade" duration={200}>
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
                  size="lg"
                  onClick={() => setFile(null)}
                  aria-label="Remove image"
                >
                  <IconX size={18} />
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
          width: 140,
          height: 140
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
            <ThemeIcon color="blue" size={50} radius={25} variant="light">
              <IconPhotoPlus size={26} />
            </ThemeIcon>
          </Dropzone.Accept>
          <Dropzone.Reject>
            <ThemeIcon color="red" size={50} radius={25} variant="light">
              <IconX size={26} />
            </ThemeIcon>
          </Dropzone.Reject>
          <Dropzone.Idle>
            <ThemeIcon color="blue" size={50} radius={25} variant="light">
              <IconPhotoPlus size={26} />
            </ThemeIcon>
          </Dropzone.Idle>
        </Dropzone>
      </Paper>
    )
  }
}