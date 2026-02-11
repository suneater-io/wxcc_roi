# AI Development Rules & Tech Stack

## Tech Stack
- **Framework**: Next.js 15+ with App Router and React 19.
- **Language**: TypeScript for strict type safety across all components and hooks.
- **Styling**: Tailwind CSS for all layout and component styling, utilizing the custom theme defined in `tailwind.config.ts`.
- **UI Components**: shadcn/ui built on Radix UI primitives (located in `components/ui/`).
- **Icons**: Lucide React for consistent, accessible iconography.
- **Forms & Validation**: React Hook Form for state management and Zod for schema-based validation.
- **Charts**: Recharts for data visualization, integrated via the shadcn `ChartContainer` wrapper.
- **Typography**: Inter for body text and DM Sans for headings (configured via Next.js Fonts).

## Architectural Rules

### 1. Component Structure
- **Atomic Design**: Keep components small and focused. If a component exceeds 100 lines, evaluate it for refactoring into smaller sub-components.
- **Location**: 
  - Page-level components go in `app/`.
  - Feature-specific components go in `components/[feature-name]/`.
  - Reusable UI primitives go in `components/ui/`.
- **Client vs Server**: Use `"use client"` only when necessary for interactivity or browser APIs.

### 2. Styling Guidelines
- **Tailwind Only**: Avoid CSS modules or inline styles. Use Tailwind utility classes exclusively.
- **Class Merging**: Always use the `cn()` utility from `lib/utils.ts` when merging classes or handling conditional styles.
- **Responsive Design**: Use mobile-first breakpoints (`sm:`, `md:`, `lg:`, `xl:`) for all layouts.

### 3. State Management
- **Local State**: Use `useState` and `useReducer` for component-level state.
- **Derived State**: Heavily utilize `useMemo` for complex calculations (like ROI formulas) to prevent unnecessary re-renders.
- **Callbacks**: Use `useCallback` for functions passed to memoized child components.

### 4. UI & UX
- **shadcn/ui**: Do not reinvent the wheel. Check `components/ui/` first before building a new UI element.
- **Icons**: Use `lucide-react` icons. Ensure they have consistent sizing (usually `h-4 w-4` or `h-5 w-5`).
- **Feedback**: Use the `sonner` or `toast` components to provide user feedback for actions like "Loading Defaults" or "Adding Workflows".

### 5. Data Visualization
- **Charts**: Use the `ChartContainer` and `ChartTooltip` components from `components/ui/chart.tsx` to ensure charts match the application's theme and styling.

### 6. Code Quality
- **TypeScript**: Avoid `any`. Define interfaces for all data structures (e.g., `Workflow`, `PlatformCosts`).
- **Naming**: Use PascalCase for components and camelCase for variables/functions.