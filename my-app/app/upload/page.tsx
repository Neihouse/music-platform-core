"use client";

import { Container, Title, Button, Group } from '@mantine/core';
import { TrackUploader } from '@/components/track/TrackUploader';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getUser } from '@/utils/auth';

export default function UploadPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Upload Track</Title>
        <Button
          variant="light"
          leftSection={<IconArrowLeft size={20} />}
          onClick={() => router.push('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Group>

      <TrackUploader />
    </Container>
  );
}
