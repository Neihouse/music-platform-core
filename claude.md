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

### Code Review Feedback & Improvements (July 2025)

#### ✅ Completed
1. **Unused Props Cleanup**: Removed unused `userId` prop from SettingsClient component
2. **Component Architecture**: Successfully broke down large SettingsClient component into smaller, maintainable pieces:
   - `EmailSection.tsx` - Handles email updates with validation
   - `PasswordSection.tsx` - Manages password changes
   - `DeleteAccountSection.tsx` - Account deletion with confirmation modal
3. **Shared Components**: Created reusable `ThemedCard` and `ThemedPaper` components to reduce styling duplication
4. **Hero Section Optimization**: Made top card more condensed by reducing spacing:
   - Reduced gap from "lg" to "md" in main stack
   - Reduced Group gaps from "lg"/"sm" to "md"/"xs"
   - Reduced padding in hero Paper from "xl" to "lg" on medium screens

#### 🔄 In Progress / Next Steps
1. **CSS Media Query Migration**: Replace inline `@media` queries with Mantine's responsive props
   - Current issue: Not all Mantine components support responsive object syntax
   - Need to use `sx` prop with `theme.fn.smallerThan/largerThan` for unsupported components
   - File: `/app/promoter/page.tsx` has ~14 inline media queries to convert

2. **Component Styling Consolidation**: 
   - Continue replacing Card components with ThemedCard in promoter page
   - Standardize all Paper components to use ThemedPaper
   - Create consistent color scheme variables

#### 📝 Important Notes
- **CSS-in-JS Media Queries**: Use camelCase property names in media queries (e.g., `alignItems` not `align-items`)
- **Responsive Props Support**: Check Mantine component documentation before using responsive object syntax
- **Component Modularity**: Large components should be broken into logical sub-components for maintainability

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
📋 **IMPORTANT**: Before making any style updates, always consult the official Mantine v8 documentation:
- 🔗 **Style Props Reference**: https://mantine.dev/styles/style-props/
- 🔗 **Responsive Style Props**: https://mantine.dev/styles/responsive/#responsive-style-props
- Use responsive style props syntax: `{{ base: "sm", sm: "md", lg: "xl" }}`
- Understand which components support responsive props vs. requiring `hiddenFrom`/`visibleFrom`
- Follow Mantine's breakpoint system: `xs`, `sm`, `md`, `lg`, `xl`
- Implement mobile-first responsive design patterns
- **Prefer responsive style props over duplicate components** to reduce code duplication

#### CSS-in-JS Media Query Syntax
⚠️ **CRITICAL**: When using inline styles with media queries in React/Mantine:
- **INCORRECT**: `'@media (min-width: 48em)'` - Standard CSS syntax will cause errors
- **CORRECT**: `'@media (minWidth: 48em)'` - Use camelCase for CSS properties in objects
- **ALTERNATIVE**: Use Mantine's responsive style props instead of inline media queries when possible
- **Example**:
  ```tsx
  // ❌ Wrong - will cause error
  style={{
    '@media (min-width: 48em)': {
      fontSize: '1.5rem'
    }
  }}
  
  // ✅ Correct - camelCase property names
  style={{
    '@media (minWidth: 48em)': {
      fontSize: '1.5rem'
    }
  }}
  
  // ✅ Better - use Mantine's responsive props when supported
  fz={{ base: "md", sm: "lg" }}
  ```

### Performance Considerations
- Minimize responsive style prop usage for better performance
- Use conditional rendering to avoid duplicate content
- Implement proper image optimization
- Follow Next.js performance best practices

### Database Query Guidelines
🔍 **CRITICAL**: Always check existing queries before creating new ones:
- Use existing functions in `/db/queries/` directory
- Check `/db/queries/tracks.ts` for track-related queries like `getTracks()`, `getTopTracks()`, etc.
- Check `/db/queries/artists.ts` for artist-related queries  
- Check `/db/queries/promoters.ts` for promoter-related queries
- **DO NOT duplicate query logic** - reuse existing functions
- Transform data in action files (e.g., `/app/*/actions.ts`) rather than creating new queries
- Follow the pattern: Query functions return raw data, Action functions transform for UI consumption

### Code Duplication Prevention
⚠️ **AVOID DUPLICATE CODE**:
- Always check if functionality already exists before implementing
- Use existing components from `/components/shared/` like `MusicGrid`, `ArtistCard`, etc.
- Reuse existing query functions from `/db/queries/`
- Transform data in actions rather than creating new database queries
- Check this documentation and existing code patterns before starting new features

### Server Actions vs Server Functions
🏗️ **Important Architectural Pattern**:
- **Server Actions** (`'use server'`): Use for client-side form submissions and user interactions only
- **Server Functions**: Use for RSC (React Server Component) data fetching - no `'use server'` needed
- **File Organization**:
  - `/app/*/actions.ts` - Server actions for client interactions
  - `/app/*/data.ts` - Server functions for RSC data fetching
- **Client Components**: Cannot directly call server functions - data must be passed as props from RSC

### Data Flow Architecture 
🔄 **Critical Data Flow Pattern**:
1. **RSC (Server Components)**: Fetch data using cached server functions from `/data.ts`
2. **Pass data as props**: Always pass server-fetched data to client components as props
3. **Client Components**: Never directly call server functions - receive data via props only
4. **Server Actions**: Only for user interactions (forms, buttons) - never for initial data fetching
5. **Parallel Fetching**: Use `Promise.all()` for multiple independent data sources

**Example Structure**:
```
/app/page/
  ├── page.tsx        # RSC - fetches data, passes to client
  ├── actions.ts      # Server actions for user interactions
  └── data.ts         # Server functions for RSC data fetching
```

### File Organization & Caching Patterns
📁 **Cache Implementation Pattern**:
- Use Next.js `cache()` wrapper for data fetching functions in RSCs
- Create cached versions like `getCachedCityData`, `getCachedPopularCities` for performance
- Cache functions should handle errors gracefully and return fallback data
- Use `Promise.all()` for parallel data fetching when possible

Example pattern:
```typescript
const getCachedDataFunction = cache(async (params: string): Promise<DataType> => {
  try {
    const data = await serverFunction(params);
    return data;
  } catch (error) {
    // Return fallback data structure
    return { /* empty/default data */ };
  }
});
```

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