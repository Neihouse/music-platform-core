"use client";

import { Container } from "@mantine/core";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ConditionalLayoutProps {
  children: ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Pages that should NOT have the container wrapper (full-width pages)
  const fullWidthPages = [
    '/artists/', // Any artist page
  ];
  
  const isFullWidth = fullWidthPages.some(path => pathname.includes(path));
  
  if (isFullWidth) {
    return <>{children}</>;
  }
  
  return (
    <Container size={1200} px="1rem" py="1.5rem" style={{ 
      backgroundColor: 'var(--mantine-color-dark-9)',
      minHeight: 'calc(100vh - 110px)', // Account for header + footer
      color: 'var(--mantine-color-gray-0)'
    }}>
      {children}
    </Container>
  );
}
