/**
 * Google Fonts Selector Component
 * 
 * A Mantine-based component for searching, previewing, and selecting Google Fonts.
 * 
 * ## Features
 * - Search through Google Fonts API
 * - Live font previews 
 * - Category indicators with color coding
 * - Debounced search for performance
 * - Fallback to demo fonts when no API key provided
 * - Follows project theming
 * 
 * ## Usage
 * 
 * ### Basic Usage (Demo Mode)
 * ```tsx
 * import FontSelect from '@/components/FontSelect';
 * 
 * function MyComponent() {
 *   const [selectedFont, setSelectedFont] = useState<string | null>(null);
 * 
 *   return (
 *     <FontSelect
 *       label="Choose a font"
 *       value={selectedFont}
 *       onChange={setSelectedFont}
 *       placeholder="Search fonts..."
 *     />
 *   );
 * }
 * ```
 * 
 * ### With Google Fonts API Key
 * ```tsx
 * import FontSelect from '@/components/FontSelect';
 * 
 * function MyComponent() {
 *   const [selectedFont, setSelectedFont] = useState<string | null>(null);
 * 
 *   return (
 *     <FontSelect
 *       label="Choose a font"
 *       value={selectedFont}
 *       onChange={setSelectedFont}
 *       apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY}
 *       placeholder="Search fonts..."
 *     />
 *   );
 * }
 * ```
 * 
 * ### Form Integration
 * ```tsx
 * import { useForm } from '@mantine/form';
 * import FontSelect from '@/components/FontSelect';
 * 
 * function FormExample() {
 *   const form = useForm({
 *     initialValues: {
 *       fontFamily: '',
 *     },
 *   });
 * 
 *   return (
 *     <form onSubmit={form.onSubmit(console.log)}>
 *       <FontSelect
 *         label="Font Family"
 *         required
 *         {...form.getInputProps('fontFamily')}
 *       />
 *     </form>
 *   );
 * }
 * ```
 * 
 * ## API Key Setup
 * 
 * To use the full Google Fonts catalog:
 * 1. Go to [Google Cloud Console](https://console.cloud.google.com/)
 * 2. Create a new project or select existing
 * 3. Enable the Google Fonts Developer API
 * 4. Create an API key in Credentials
 * 5. Add to your environment variables:
 *    ```
 *    NEXT_PUBLIC_GOOGLE_FONTS_API_KEY=your_api_key_here
 *    ```
 * 
 * ## Font Categories
 * 
 * Fonts are color-coded by category:
 * - **Serif** - Pink (#e64980)
 * - **Sans-serif** - Blue (#1971c2) 
 * - **Monospace** - Green (#37b24d)
 * - **Display** - Orange (#f76707)
 * - **Handwriting** - Purple (#9c36b5)
 * 
 * ## Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | value | string | undefined | Selected font family name |
 * | onChange | (value: string \| null) => void | undefined | Callback when selection changes |
 * | placeholder | string | "Search for a font..." | Placeholder text |
 * | label | string | undefined | Field label |
 * | description | string | undefined | Field description |
 * | error | string | undefined | Error message |
 * | required | boolean | false | Whether field is required |
 * | disabled | boolean | false | Whether field is disabled |
 * | size | "xs" \| "sm" \| "md" \| "lg" \| "xl" | "md" | Field size |
 * | apiKey | string | undefined | Google Fonts API key |
 */

export {};
