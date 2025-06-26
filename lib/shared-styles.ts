import { CSSProperties } from 'react';

// Gradient definitions
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  primaryOverlay: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
  secondary: 'linear-gradient(45deg, #ff6b35, #f7931e)',
  accent: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
  hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  vibrant: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  upcomingEvent: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  pastEvent: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  text: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
} as const;

// Common background colors with opacity
export const BACKGROUNDS = {
  whiteOverlay: {
    light: 'rgba(255,255,255,0.05)',
    medium: 'rgba(255,255,255,0.1)',
    heavy: 'rgba(255,255,255,0.3)',
  },
  darkOverlay: {
    light: 'rgba(0,0,0,0.1)',
    medium: 'rgba(0,0,0,0.3)',
    heavy: 'rgba(0,0,0,0.7)',
  },
  mantineColors: {
    blueLight: 'var(--mantine-color-blue-0)',
    grayLight: 'var(--mantine-color-gray-2)',
    violetBorder: 'var(--mantine-color-violet-2)',
  },
} as const;

// Decorative element styles
export const DECORATIVE_ELEMENTS = {
  heroCircleLarge: {
    position: 'absolute' as const,
    width: '200px',
    height: '200px',
    background: BACKGROUNDS.whiteOverlay.medium,
    borderRadius: '50%',
  },
  heroCircleSmall: {
    position: 'absolute' as const,
    width: '150px',
    height: '150px',
    background: BACKGROUNDS.whiteOverlay.light,
    borderRadius: '50%',
  },
  vinylBackground: {
    position: 'absolute' as const,
    left: -40,
    top: -10,
    opacity: 0.06,
    zIndex: 0,
    transform: 'rotate(-15deg)',
  },
} as const;

// Common positioning styles
export const POSITIONS = {
  topRight: {
    top: 0,
    right: 0,
    transform: 'translate(50%, -50%)',
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    transform: 'translate(-50%, 50%)',
  },
  absoluteOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  relativeWithZIndex: {
    position: 'relative' as const,
    zIndex: 1,
  },
  relativeWithHighZIndex: {
    position: 'relative' as const,
    zIndex: 2,
  },
} as const;

// Hero section styles
export const HERO_STYLES = {
  container: {
    position: 'relative' as const,
    overflow: 'hidden',
    color: 'white',
  },
  minHeight: {
    small: '300px',
    medium: '40vh',
    large: '70vh',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem',
    ...POSITIONS.relativeWithHighZIndex,
  },
} as const;

// Avatar styles
export const AVATAR_STYLES = {
  heroBorder: {
    border: '4px solid rgba(255,255,255,0.3)',
  },
  gradientBackground: GRADIENTS.accent,
} as const;

// Button styles
export const BUTTON_STYLES = {
  cta: {
    background: GRADIENTS.secondary,
    border: 'none',
    fontWeight: 700,
    fontSize: '18px',
    padding: '16px 32px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
} as const;

// Card styles
export const CARD_STYLES = {
  heroSection: {
    ...HERO_STYLES.container,
    minHeight: HERO_STYLES.minHeight.small,
  },
  ctaCard: {
    background: GRADIENTS.primary,
    color: 'white',
  },
  infoCard: {
    backgroundColor: BACKGROUNDS.mantineColors.blueLight,
  },
} as const;

// Text shadow styles
export const TEXT_SHADOWS = {
  light: '0 1px 2px rgba(0, 0, 0, 0.2)',
  medium: '0 2px 4px rgba(0, 0, 0, 0.2)',
  dark: '0 2px 4px rgba(0, 0, 0, 0.4)',
  darkLight: '0 1px 2px rgba(0, 0, 0, 0.3)',
} as const;

// Typography responsive styles
export const TYPOGRAPHY = {
  responsiveTitle: {
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    fontWeight: 300,
    color: 'white',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    background: GRADIENTS.text,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
  },
  maxWidth: {
    description: '600px',
    hero: '700px',
  },
} as const;

// Animation and transition styles
export const ANIMATIONS = {
  cardHover: {
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHoverTransform: {
    transform: 'translateY(-4px)',
  },
} as const;

// Utility function to combine styles
export const combineStyles = (...styles: (CSSProperties | undefined)[]): CSSProperties => {
  return styles.reduce((acc, style) => ({ ...acc, ...(style || {}) }), {});
};

// Helper functions for creating decorated backgrounds
export const createHeroBackground = (imageUrl?: string, gradient = GRADIENTS.primary) => ({
  background: imageUrl 
    ? `${GRADIENTS.primaryOverlay}, url(${imageUrl}) center/cover`
    : gradient,
});

export const createDecorativeCircle = (size: number, opacity: number, position: 'topRight' | 'bottomLeft') => ({
  ...DECORATIVE_ELEMENTS.heroCircleLarge,
  width: `${size}px`,
  height: `${size}px`,
  background: `rgba(255,255,255,${opacity})`,
  ...POSITIONS[position],
});
