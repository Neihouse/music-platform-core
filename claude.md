# Music Platform Core - Development Documentation

## Overview
This is a Next.js-based music platform application built with Mantine UI components, TypeScript, and Supabase for backend services.

## Project Structure
```
music-platform-core/
├── app/                    # Next.js App Router pages
│   ├── artist/            # Artist dashboard and related pages
│   ├── promoter/          # Promoter dashboard and related pages
│   ├── auth/              # Authentication pages
│   └── ...                # Other app routes
├── components/            # Reusable React components
├── db/                    # Database queries and validation
├── lib/                   # Utility libraries and configurations
└── public/                # Static assets
```

## Key Features
- **Artist Dashboard**: Comprehensive dashboard for artists to manage their profile, tracks, and promoter relationships
- **Promoter Dashboard**: Tools for promoters to discover and connect with artists
- **Authentication**: Secure user authentication with Supabase
- **Media Upload**: Support for track, avatar, and banner image uploads
- **Responsive Design**: Mobile-first responsive design across all components

## Recent Development Work

### Mobile Responsiveness Improvements
📱 **[View Mobile Improvements Documentation](./MOBILE_IMPROVEMENTS.md)**

Comprehensive mobile responsiveness enhancements have been implemented for the artist dashboard, focusing on:
- Mobile-first responsive design patterns
- Progressive enhancement across breakpoints
- Touch-friendly interface optimizations
- Performance-optimized responsive layouts

Key improvements include:
- Responsive hero banner with optimized layouts for mobile/tablet/desktop
- Progressive sizing for stats cards and interactive elements
- Mobile-optimized PromotersCard component
- Enhanced spacing and typography scaling
- Performance-optimized conditional rendering

## Technology Stack
- **Frontend**: Next.js 14, React, TypeScript
- **UI Library**: Mantine v8
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Mantine CSS-in-JS with responsive style props
- **Deployment**: Vercel (recommended)

## Development Guidelines

### Component Development
- Use TypeScript for all components
- Follow Mantine's design system patterns
- Implement mobile-first responsive design
- Use proper error boundaries and loading states

### Responsive Design Patterns
- Utilize Mantine's responsive style props where supported
- Implement `hiddenFrom`/`visibleFrom` for conditional layouts
- Follow progressive enhancement principles
- Test across mobile, tablet, and desktop breakpoints
- **Always reference [Mantine v8 Style Props Documentation](https://mantine.dev/styles/style-props/) when updating styles**

### Style Development Guidelines
📋 **IMPORTANT**: Before making any style updates, always consult the official Mantine v8 Style Props documentation:
- 🔗 **Reference**: https://mantine.dev/styles/style-props/
- Use responsive style props syntax: `{{ base: "sm", sm: "md", lg: "xl" }}`
- Understand which components support responsive props vs. requiring `hiddenFrom`/`visibleFrom`
- Follow Mantine's breakpoint system: `xs`, `sm`, `md`, `lg`, `xl`
- Implement mobile-first responsive design patterns

### Performance Considerations
- Minimize responsive style prop usage for better performance
- Use conditional rendering to avoid duplicate content
- Implement proper image optimization
- Follow Next.js performance best practices

## Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Supabase account and project

### Development Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Configure your Supabase credentials

# Run development server
npm run dev
```

### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Documentation Links
- 📱 [Mobile Responsiveness Improvements](./MOBILE_IMPROVEMENTS.md) - Detailed documentation of mobile UX enhancements
- 🎨 [Component Documentation](./components/) - Individual component README files
- 🔧 [Migration Guides](./components/StyledTitle/MIGRATION.md) - Component migration documentation

## Contributing
When contributing to this project:
1. Follow the established TypeScript and React patterns
2. Ensure mobile responsiveness in all new components
3. Update documentation for significant changes
4. Test across different screen sizes and devices
5. Follow the established file and folder structure

---

*Last updated: July 7, 2025*