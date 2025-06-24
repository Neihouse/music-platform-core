// Configuration for AI poster generation services

export interface AIServiceConfig {
  name: string;
  apiEndpoint: string;
  requiresApiKey: boolean;
  supportedSizes: string[];
  maxPromptLength: number;
  defaultSettings: Record<string, any>;
}

export const AI_SERVICES: Record<string, AIServiceConfig> = {
  openai: {
    name: 'OpenAI DALL-E 3',
    apiEndpoint: 'https://api.openai.com/v1/images/generations',
    requiresApiKey: true,
    supportedSizes: ['1024x1024', '1024x1792', '1792x1024'],
    maxPromptLength: 4000,
    defaultSettings: {
      model: 'dall-e-3',
      quality: 'hd',
      style: 'vivid',
      n: 1
    }
  },
  stability: {
    name: 'Stability AI',
    apiEndpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    requiresApiKey: true,
    supportedSizes: ['1024x1024', '1152x896', '896x1152', '1216x832', '832x1216'],
    maxPromptLength: 2000,
    defaultSettings: {
      cfg_scale: 7,
      steps: 30,
      samples: 1
    }
  },
  midjourney: {
    name: 'Midjourney',
    apiEndpoint: 'https://api.midjourney.com/v1/imagine', // Note: This is not a real endpoint
    requiresApiKey: true,
    supportedSizes: ['1024x1024', '1024x1792', '1792x1024'],
    maxPromptLength: 1500,
    defaultSettings: {
      version: '6',
      quality: '1',
      stylize: '100'
    }
  }
};

export const POSTER_STYLES = {
  modern: {
    name: 'Modern',
    description: 'Contemporary design with clean lines and modern typography',
    promptModifiers: [
      'contemporary design',
      'clean typography',
      'geometric shapes',
      'modern color gradients',
      'minimalist layout'
    ]
  },
  vintage: {
    name: 'Vintage',
    description: 'Retro-inspired design with classic concert poster elements',
    promptModifiers: [
      'retro typography',
      'distressed textures',
      'vintage color palette',
      'classic rock poster style',
      'aged paper effect'
    ]
  },
  minimalist: {
    name: 'Minimalist',
    description: 'Clean and simple with plenty of white space',
    promptModifiers: [
      'minimal design',
      'plenty of white space',
      'elegant typography',
      'simple composition',
      'clean layout'
    ]
  },
  bold: {
    name: 'Bold',
    description: 'Strong typography and high contrast design',
    promptModifiers: [
      'strong typography',
      'high contrast',
      'dynamic layout',
      'eye-catching elements',
      'bold colors'
    ]
  }
};

export const COLOR_SCHEMES = {
  vibrant: {
    name: 'Vibrant',
    description: 'Bright, energetic colors',
    promptModifiers: [
      'bright colors',
      'energetic palette',
      'high saturation',
      'vibrant hues'
    ]
  },
  monochrome: {
    name: 'Monochrome',
    description: 'Black, white, and shades of gray',
    promptModifiers: [
      'black and white',
      'grayscale',
      'monochromatic',
      'high contrast'
    ]
  },
  pastel: {
    name: 'Pastel',
    description: 'Soft, muted colors',
    promptModifiers: [
      'soft colors',
      'muted palette',
      'pastel tones',
      'gentle hues'
    ]
  },
  dark: {
    name: 'Dark',
    description: 'Dark backgrounds with bright accents',
    promptModifiers: [
      'dark background',
      'bright accents',
      'neon highlights',
      'contrast lighting'
    ]
  }
};

export const DEFAULT_POSTER_SETTINGS = {
  width: 800,
  height: 1200,
  format: 'jpg',
  quality: 'high',
  dpi: 300
};

// Environment variable checks
export function validateAIServiceConfig(): { isValid: boolean; missingKeys: string[] } {
  const requiredEnvVars = [
    'AI_POSTER_SERVICE', // Which service to use
    'OPENAI_API_KEY',    // If using OpenAI
    'STABILITY_API_KEY', // If using Stability AI
    // Add other service keys as needed
  ];

  const missingKeys = requiredEnvVars.filter(key => !process.env[key]);
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
}

export function getActiveAIService(): string {
  return process.env.AI_POSTER_SERVICE || 'placeholder';
}

export function getServiceConfig(serviceName: string): AIServiceConfig | null {
  return AI_SERVICES[serviceName] || null;
}
