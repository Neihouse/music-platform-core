import { useMediaQuery } from '@mantine/hooks';

/**
 * Hook for mobile-responsive card sizing and behavior
 */
export const useMobileCardSize = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  const getCardDimensions = () => {
    if (isMobile) {
      return {
        sm: { minWidth: 140, maxWidth: 180, height: 280 },
        md: { minWidth: 160, maxWidth: 200, height: 300 },
        lg: { minWidth: 180, maxWidth: 220, height: 320 }
      }[size];
    } else if (isTablet) {
      return {
        sm: { minWidth: 180, maxWidth: 220, height: 300 },
        md: { minWidth: 200, maxWidth: 240, height: 340 },
        lg: { minWidth: 220, maxWidth: 260, height: 360 }
      }[size];
    } else {
      return {
        sm: { minWidth: 200, maxWidth: 240, height: 320 },
        md: { minWidth: 240, maxWidth: 280, height: 360 },
        lg: { minWidth: 280, maxWidth: 320, height: 400 }
      }[size];
    }
  };

  const getGridColumns = () => {
    if (isMobile) {
      return { base: 6, xs: 6, sm: 6, md: 4, lg: 3 };
    } else if (isTablet) {
      return { base: 6, xs: 6, sm: 4, md: 4, lg: 3 };
    } else {
      return { base: 6, xs: 4, sm: 4, md: 3, lg: 3 };
    }
  };

  const getGap = () => {
    if (isMobile) return 'xs';
    if (isTablet) return 'sm';
    return 'md';
  };

  return {
    cardDimensions: getCardDimensions(),
    gridColumns: getGridColumns(),
    gap: getGap(),
    isMobile,
    isTablet,
  };
};

/**
 * Hook for responsive content section behavior
 */
export const useMobileContentSection = () => {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  const getContainerPadding = () => {
    if (isMobile) return 'md';
    if (isTablet) return 'lg';
    return 'xl';
  };

  const getTitleSize = () => {
    if (isMobile) return '1.5rem';
    if (isTablet) return '1.75rem';
    return '2rem';
  };

  const getGridStyle = () => ({
    display: 'grid',
    gridTemplateColumns: isMobile
      ? '1fr 1fr'
      : isTablet
        ? 'repeat(auto-fill, minmax(200px, 1fr))'
        : 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: isMobile ? '0.5rem' : isTablet ? '0.75rem' : '1rem',
    width: '100%',
    justifyItems: 'center',
  });

  return {
    containerPadding: getContainerPadding(),
    titleSize: getTitleSize(),
    gridStyle: getGridStyle(),
    isMobile,
    isTablet,
  };
};

/**
 * Hook for mobile-optimized promoters page responsive behavior
 */
export const usePromotersPageMobile = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');

  return {
    isMobile,
    isSmallMobile,

    // Grid configuration
    getGridCols: () => ({
      base: 1,
      xs: isSmallMobile ? 1 : 2,
      sm: 2,
      md: 3,
      lg: 4
    }),

    // Spacing
    getContainerPadding: () => isMobile ? { base: "md", sm: "lg" } : { base: "lg", sm: "xl" },
    getStackGap: () => isMobile ? "md" : "xl",
    getCardPadding: () => isMobile ? "sm" : "lg",

    // Typography
    getTitleOrder: () => isMobile ? 2 : 1,
    getSubtitleSize: () => isMobile ? "sm" : "lg",

    // Search
    getSearchPlaceholder: () => isMobile ? "Search promoters..." : "Search for promoters by name, bio, or location...",

    // Card sizing
    getAvatarSize: () => isMobile ? 70 : 80,
    getBioLineClamp: () => isMobile ? 2 : 3,
  };
};
