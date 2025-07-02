import { ReactNode } from 'react';

interface ArtistLayoutProps {
  children: ReactNode;
}

export default function ArtistLayout({ children }: ArtistLayoutProps) {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--mantine-color-dark-9)',
      margin: 0, // Remove negative margins that cause overflow
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      {children}
    </div>
  );
}
