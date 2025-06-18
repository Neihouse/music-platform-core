"use client";

import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Button,
  SimpleGrid,
  Center,
  ThemeIcon,
  Image,
  Modal,
  FileInput,
} from "@mantine/core";
import {
  IconCamera,
  IconCameraOff,
  IconUpload,
  IconPhoto,
} from "@tabler/icons-react";
import { useState } from "react";

interface VenueGallerySectionProps {
  gallery: any[];
  venueId: string;
}

export function VenueGallerySection({
  gallery,
  venueId,
}: VenueGallerySectionProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (gallery.length === 0) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <ThemeIcon size={60} variant="light" color="gray">
            <IconCameraOff size={30} />
          </ThemeIcon>
          <Text size="lg" c="dimmed" ta="center">
            No photos have been uploaded for this venue yet.
          </Text>
          <Button
            variant="outline"
            size="sm"
            leftSection={<IconUpload size={16} />}
            onClick={() => setUploadModalOpen(true)}
          >
            Upload Photos
          </Button>
        </Stack>

        <UploadModal
          opened={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          venueId={venueId}
        />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>Venue Gallery</Title>
        <Button
          variant="outline"
          size="sm"
          leftSection={<IconUpload size={16} />}
          onClick={() => setUploadModalOpen(true)}
        >
          Add Photos
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
        {gallery.map((image, index) => (
          <GalleryItem
            key={index}
            image={image}
            onClick={() => setSelectedImage(image.url)}
          />
        ))}
      </SimpleGrid>

      {/* Image Preview Modal */}
      <Modal
        opened={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="Venue Photo"
        size="xl"
        centered
      >
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Venue photo"
            radius="md"
            fit="contain"
          />
        )}
      </Modal>

      {/* Upload Modal */}
      <UploadModal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        venueId={venueId}
      />
    </Stack>
  );
}

interface GalleryItemProps {
  image: any;
  onClick: () => void;
}

function GalleryItem({ image, onClick }: GalleryItemProps) {
  return (
    <Card
      p={0}
      radius="md"
      withBorder
      style={{ cursor: "pointer", overflow: "hidden" }}
      onClick={onClick}
    >
      <Image
        src={image.url}
        alt={image.caption || "Venue photo"}
        h={200}
        fit="cover"
      />
    </Card>
  );
}

interface UploadModalProps {
  opened: boolean;
  onClose: () => void;
  venueId: string;
}

function UploadModal({ opened, onClose, venueId }: UploadModalProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    if (!files.length) return;

    setUploading(true);
    // TODO: Implement file upload logic
    // This would typically involve uploading to a storage service
    // and saving the URLs to the database
    
    console.log("Uploading files for venue:", venueId, files);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      onClose();
    }, 2000);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Upload Venue Photos"
      centered
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Upload photos of your venue to showcase it to potential event organizers and fans.
        </Text>

        <FileInput
          label="Select Photos"
          placeholder="Choose image files"
          leftSection={<IconPhoto size={16} />}
          accept="image/*"
          multiple
          onChange={(files) => files && handleUpload(files)}
          disabled={uploading}
        />

        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
