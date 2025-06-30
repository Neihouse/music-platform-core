import { ReactNode } from 'react';

interface PromoterLayoutProps {
  children: ReactNode;
}

export default function PromoterLayout({ children }: PromoterLayoutProps) {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--mantine-color-dark-9)',
      margin: '-1.5rem -1rem', // Remove the container padding/margins
      marginTop: '-1.5rem', // Remove top padding from AppShellMain
      marginBottom: '-1.5rem', // Remove bottom padding from AppShellMain
      width: 'calc(100% + 2rem)', // Compensate for the removed horizontal margins
    }}>
      {children}
    </div>
  );
}
