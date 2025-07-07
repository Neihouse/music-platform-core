import { ReactNode } from 'react';
import { Box, rem } from '@mantine/core';

interface DiscoverLayoutProps {
  children: ReactNode;
}

export default function DiscoverLayout({ children }: DiscoverLayoutProps) {
  return <>{children}</>;
}
