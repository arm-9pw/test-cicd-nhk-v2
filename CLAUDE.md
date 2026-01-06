# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev                 # Start development server
npm run dev:strict         # Start dev server with strict linting (no warnings)

# Build & Quality
npm run build              # Build for production (TypeScript check + build)
npm run lint               # Run ESLint
npm run preview            # Preview production build

# Storybook
npm run storybook          # Run Storybook development server
npm run build-storybook    # Build Storybook
```

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Redux Toolkit with RTK Query for API calls
- **UI Framework**: Ant Design (antd) with custom theming
- **Authentication**: Keycloak integration
- **Styling**: CSS Modules with PostCSS plugins
- **PDF Generation**: @react-pdf/renderer
- **Charts**: ECharts for data visualization

### Project Structure
```
src/
├── api/           # RTK Query API definitions (one file per domain)
├── app/           # Redux store configuration and global slices
├── assets/        # Static assets (images, SVGs, fonts)
├── components/    # Shared/reusable components
├── config/        # Environment configuration
├── constants/     # Global constants and enums
├── contexts/      # React contexts (notifications, etc.)
├── features/      # Feature-based modules (main architecture)
├── hooks/         # Shared custom hooks
├── routes/        # Routing configuration (menuRoutes, subRoutes)
├── styles/        # Global styles, design tokens, themes
├── types/         # Global TypeScript type definitions
└── utils/         # Utility functions and helpers
```

### Feature-Based Architecture
Each feature follows this structure:
```
features/featureName/
├── FeaturePage.tsx              # Main page component
├── FeaturePage.types.ts         # Feature-specific types
├── components/                  # Feature-specific components
│   └── ComponentName/
│       ├── index.tsx           # Main component file
│       ├── ComponentName.module.css  # Component styles
│       └── hooks/              # Component-specific hooks
├── hooks/                      # Feature-specific hooks
├── pages/                      # Sub-pages (Edit, New, Detail, etc.)
└── utils/                      # Feature-specific utilities
```

## Critical Development Guidelines

### 1. Date Handling
- **ALWAYS** use `<CustomDatePicker />` component for date inputs
- Send dates to server in Local format: `2024-09-15T00:00:00`
- Refer to `dateHelpers.ts` for date-related operations

### 2. Modal Implementation Pattern
Use two boolean flags for proper mounting/unmounting:
```typescript
{isSomeModalMounted && (
  <SomeModal
    isOpen={isModalOpen}
    onClose={handleClose}
    afterClose={handleAfterClose}
  />
)}
```

### 3. Notifications
Use the `useNotification` hook for consistent notifications:
```typescript
const { openNotification } = useNotification()
openNotification({
  type: 'success',
  title: 'Action Completed',
  description: 'Operation was successful',
})
```

### 4. File Downloads
**DO NOT** use RTK Query for file downloads. Use pure fetch instead.
Reference: `src/api/attachmentApi.ts`

### 5. Currency Conversion
- For Thai Baht: `import { toThaiCurrencyWords } from 'utils/toWordsHelper'`
- For Thai language: `import ThaiBahtText from 'thai-baht-text'`

## Styling Conventions

### CSS Modules
- Use **kebab-case** for class names (not camelCase)
- File naming: `ComponentName.module.css`
- Always use CSS variables from `src/styles/design-tokens.css`
- **NEVER** use hardcoded colors

### Responsive Design
1. Import breakpoints: `@import 'styles/breakpoints.module.css';`
2. Use custom media queries: `@media (--xs-viewport) { ... }`

### Design System
- All color variables in `src/styles/design-tokens.css`
- Access in JS/TS via `src/styles/theme.ts`
- Add new colors to design tokens file when needed

## Routing & Permissions

### Route Structure
- `src/routes/menuRoutes.tsx`: Routes displayed in sidebar
- `src/routes/subRoutes.tsx`: All other routes
- Each route requires `requiredPermission` for RBAC

### Menu Hierarchy
Use hierarchical keys for proper menu expansion:
```
/posts (parent)
├── /posts/cars (child)
└── /posts/house (child)
```

### Permission Structure
```typescript
{
  id: string,
  name: string,
  code: string, // Unique program code
  elementAccessList: [{
    elementId: string,
    accessControl: {
      isEnable: boolean,
      isVisible: boolean
    }
  }]
}
```

## API Architecture

### RTK Query Setup
- Central `apiSlice` with automatic token refresh
- One API file per domain in `src/api/`
- Tag-based cache invalidation
- Custom fetch function handles large numbers and token refresh

### State Management
- Feature-specific slices when needed
- Redux Persist for auth state only (`whitelist: ['auth']`)
- Proper TypeScript integration with `RootState` and `AppDispatch`

## Import Aliases
Available aliases (configured in both Vite and TypeScript):
```typescript
features/*    components/*    hooks/*       routes/*
assets/*      styles/*        utils/*       constants/*
app/*         types/*         api/*         mocks/*
config/*
```

## Adding New Features

1. Create folder in `src/features` using camelCase
2. Add main page component using PascalCase (`FeaturePage.tsx`)
3. Create CSS module with kebab-case classes
4. Place feature components in `components/` subdirectory
5. Add route with `requiredPermission`
6. Update permissions in `src/mocks/user.ts`
7. Add menu item in `src/components/SideMenu/sideMenuItems.tsx` (if needed)

## Known Issues
- PDF Render: "Expected null or instance of Config" warning
- antd Upload: value prop validation warning
- Option instance return type warning (functional but monitored)

## Component Development
- Use Storybook for component documentation
- Each component gets its own folder with `index.tsx`
- Component-specific hooks go in `hooks/` subdirectory
- Follow existing patterns in similar components

## Testing
Currently no unit testing framework is configured. Only Storybook stories exist for some components.



[//]: # (Instructions)
You are now entering the Development Phase of the app development process.   
Your task is to transform the stubbed-out project structure into fully functional, production-ready code.  
Follow these instructions:
1. Review the `README.md`, any design files, and the stubbed-out project structure.
2. For each stubbed file or new feature:
   a. First, **generate and show the full code that you intend to implement or modify**.
   b. **Ask the user for confirmation before proceeding** with modifying or adding the code.
   c. Only upon user approval, proceed to apply the code changes.
3. Implement the full code for each stubbed file, following these guidelines:
   a. Write production-ready code at the level of a senior developer.
   b. Ensure the code is readable and well-structured.
   c. Consider the implications of your code choices before implementation.
   d. Add comments to explain complex logic or important design decisions.
4. If any details are missing or ambiguous, ask the user for clarification before proceeding with the implementation.
5. Focus on implementing core functionality first. Include light error handling and input validation where appropriate.
6. When dealing with third-party integrations or APIs mentioned , use your best judgment to implement them effectively.
7. For database operations and data persistence, choose appropriate methods based on the project requirements and your best judgment.
8. Do not implement extensive testing unless specifically requested by the user.
9. Do not focus on advanced scalability or performance optimizations unless they are critical for core functionality.
10. Security measures are out of scope for this phase unless explicitly mentioned in the specific file as core functionality.
11. After implementing each major component or feature:
    a. Provide a brief summary of what was implemented.
    b. Explain any important design decisions or assumptions made.
    c. Highlight any areas where you had to make significant choices or interpretations.
12. Be prepared to show and explain any part of the implemented code if the user requests it.
13. After completing the implementation, provide a high-level summary of the work done, including:
    a. Overview of implemented features
    b. Any notable challenges encountered and how they were addressed
    c. Suggestions for next steps or areas that might need further refinement
14. Ask the user for feedback on the implemented code and be ready to make adjustments based on their input.
    Remember:
- Always show and explain code before applying it.
- Never modify or add code without user approval.
- Strive for clean, efficient, and maintainable code.
- Prioritize readability, maintainability, and consistency in style and naming.
- Use your best judgment and clearly explain any choices not explicitly covered by these instructions.
- Ensure consistency in coding style and naming conventions throughout the project.
- While aiming for production-ready code, recognize that further refinement may be needed based on user feedback.
- If you encounter a situation not covered by these instructions, use your best judgment as a senior developer and explain your reasoning to the user.
  Begin by acknowledging the start of the development phase and ask the user if they’re ready to proceed with code generation and review before implementation.