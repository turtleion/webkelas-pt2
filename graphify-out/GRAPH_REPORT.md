# Graph Report - arsip-kelas-digital-main  (2026-08-23)

## Corpus Check
- 170 files · ~74,475 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1090 nodes · 2825 edges · 118 communities (56 shown, 62 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9fc80a92`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useTranslation
- AdminGallery.tsx
- sidebar.tsx
- devDependencies
- utils.ts
- compilerOptions
- ui/index.ts
- cn
- compilerOptions
- use-auth.ts
- components.json
- badge.tsx
- dropdown-menu.tsx
- main.tsx
- class-variance-authority
- carousel.tsx
- Auth.tsx
- context-menu.tsx
- form.tsx
- chart.tsx
- Implementation Plan — Personalization, Themes, Layouts & Localization
- select.tsx
- vly-toolbar-readonly.tsx
- navigation-menu.tsx
- useAuth
- command.tsx
- table.tsx
- Domain Docs
- toggle-group.tsx
- Issue tracker: Local Markdown
- tsconfig.json
- 20. Testing Strategy
- Implementation Plan — Invitation-Based Registration & Verified Access
- alert.tsx
- Register.tsx
- Agent skills
- 8.1 Color Scheme Definitions
- RootErrorBoundary
- ToolbarErrorBoundary
- clsx
- Graphify Rule
- @radix-ui/react-dialog
- cmdk
- @radix-ui/react-label
- date-fns
- dependencies
- framer-motion
- hono
- @hookform/resolvers
- input-otp
- @jridgewell/trace-mapping
- lucide-react
- main.ts
- next-themes
- @radix-ui/react-select
- @radix-ui/react-toggle
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-aspect-ratio
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-collapsible
- @radix-ui/react-context-menu
- @radix-ui/react-dropdown-menu
- @radix-ui/react-hover-card
- @radix-ui/react-menubar
- @radix-ui/react-navigation-menu
- @radix-ui/react-popover
- @radix-ui/react-progress
- @radix-ui/react-radio-group
- vaul
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-switch
- @radix-ui/react-tabs
- @radix-ui/react-toggle-group
- @radix-ui/react-tooltip
- storage.ts
- react-day-picker
- 7.1 Built-in Theme Presets
- react-hook-form
- react-intersection-observer
- react-resizable-panels
- react-router
- popover.tsx
- sonner
- tailwind-merge
- tailwindcss
- @tailwindcss/vite
- @vly-ai/integrations
- zod
- @zumer/snapdom
- Public Logo Asset
- vly-integrations.ts
- global.d.ts
- Index HTML Entrypoint
- VLY Integrations Specification
- Convex Auth Architecture
- Convex Backend Guidelines
- Frontend & UI Conventions
- Project Overview & Tech Stack
- tabs.tsx
- 10. Home Layout System
- 9. Font System
- 11. Language/i18n System
- 13. Settings Page (`/settings`)
- 14. Admin Global Theme Page (`/admin/theme`)
- 15. Database Strategy (Stability & Backward Compatibility)
- 17. Runtime Settings Resolution & Custom Transition Engine
- 18. File-Level Changes
- 1. Current Architecture
- 3. Existing Supabase/User Architecture

## God Nodes (most connected - your core abstractions)
1. `cn()` - 302 edges
2. `useTranslation()` - 87 edges
3. `usePageTitle()` - 44 edges
4. `useAuth()` - 39 edges
5. `useOrganization()` - 34 edges
6. `pecahTanggal()` - 25 edges
7. `Implementation Plan — Personalization, Themes, Layouts & Localization` - 23 edges
8. `usePreferences()` - 22 edges
9. `compilerOptions` - 22 edges
10. `Button()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Public Logo Asset` --semantically_similar_to--> `Source Logo Asset`  [INFERRED] [semantically similar]
  public/logo.svg → src/assets/logo.svg
- `Orang()` --calls--> `inisialNama()`  [EXTRACTED]
  Organisasi-BACKUP.tsx → src/lib/tanggal.ts
- `Orang()` --calls--> `padNomor()`  [EXTRACTED]
  Organisasi-BACKUP.tsx → src/lib/tanggal.ts
- `Organisasi()` --calls--> `useOrganization()`  [EXTRACTED]
  Organisasi-BACKUP.tsx → src/hooks/use-organization.ts
- `Organisasi()` --calls--> `usePageTitle()`  [EXTRACTED]
  Organisasi-BACKUP.tsx → src/hooks/use-page-title.ts

## Import Cycles
- None detected.

## Communities (118 total, 62 thin omitted)

### Community 0 - "useTranslation"
Cohesion: 0.05
Nodes (112): Orang(), Organisasi(), AdminLayoutProps, AdminSidebar(), AdminSidebarProps, HomeBento(), HomeLayoutProps, HomeClassic() (+104 more)

### Community 1 - "AdminGallery.tsx"
Cohesion: 0.06
Nodes (56): AdminLayout(), ConfirmDialog(), ConfirmDialogProps, DataTable(), DataTableProps, AlertDialog(), AlertDialogAction(), AlertDialogCancel() (+48 more)

### Community 2 - "sidebar.tsx"
Cohesion: 0.06
Nodes (41): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), SheetTrigger() (+33 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (41): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint (+33 more)

### Community 4 - "utils.ts"
Cohesion: 0.08
Nodes (50): BackgroundSelector(), ColorSchemePicker(), getLuminance(), hasContrastWarning(), FontSelector(), LanguageSelector(), LayoutSelector(), LivePreview() (+42 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): DOM, DOM.Iterable, ES2020, src, vly-toolbar-readonly.tsx, compilerOptions, allowImportingTsExtensions, baseUrl (+20 more)

### Community 6 - "ui/index.ts"
Cohesion: 0.06
Nodes (57): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), AspectRatio(), Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem() (+49 more)

### Community 7 - "cn"
Cohesion: 0.05
Nodes (58): Avatar(), AvatarFallback(), AvatarImage(), ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Card() (+50 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ES2023, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+12 more)

### Community 9 - "use-auth.ts"
Cohesion: 0.20
Nodes (18): UseAuthReturn, AuthChangeHandler, AuthState, AuthUser, getAuthState(), getUser(), GUEST_ID, isGuestStored() (+10 more)

### Community 10 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 12 - "dropdown-menu.tsx"
Cohesion: 0.14
Nodes (16): LogoDropdown(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal() (+8 more)

### Community 13 - "main.tsx"
Cohesion: 0.09
Nodes (18): Toaster(), AdminAgenda, AdminAnnouncements, AdminDashboard, AdminGallery, AdminMembers, AdminOrganization, AdminSchedule (+10 more)

### Community 15 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 16 - "Auth.tsx"
Cohesion: 0.39
Nodes (5): AuthStateRedirector(), VerificationWarningBar(), resolveInternalRedirect(), AuthPage, Auth()

### Community 17 - "context-menu.tsx"
Cohesion: 0.12
Nodes (15): ContextMenu(), ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuGroup(), ContextMenuItem(), ContextMenuLabel(), ContextMenuPortal(), ContextMenuRadioGroup() (+7 more)

### Community 18 - "form.tsx"
Cohesion: 0.23
Nodes (11): FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+3 more)

### Community 19 - "chart.tsx"
Cohesion: 0.25
Nodes (10): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+2 more)

### Community 20 - "Implementation Plan — Personalization, Themes, Layouts & Localization"
Cohesion: 0.15
Nodes (12): 12. Global Admin Defaults vs User Preferences, 16.1 RLS Matrix for Personalization, 16. Authentication & RLS, 19. Implementation Order, 21. Migration & Backward Compatibility, 22. Risks & Decisions Required, 2.1 CSS Tokens (`src/index.css`), 2. Existing Theme/Design System (+4 more)

### Community 21 - "select.tsx"
Cohesion: 0.18
Nodes (10): Select(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator() (+2 more)

### Community 22 - "vly-toolbar-readonly.tsx"
Cohesion: 0.29
Nodes (9): ComponentInfo, FiberNode, formatReactComponentHierarchy(), getDomSelector(), getReactComponentHierarchy(), getSelectedElementAnnotation(), getSelectedElementsPrompt(), injectHighlightStyle() (+1 more)

### Community 23 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 24 - "useAuth"
Cohesion: 0.21
Nodes (8): RequireAdmin(), RequireOwner(), RequireAuth(), RequireSignedIn(), RequireVerified(), useAuth(), Dashboard, Dashboard()

### Community 25 - "command.tsx"
Cohesion: 0.20
Nodes (9): Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+1 more)

### Community 26 - "table.tsx"
Cohesion: 0.22
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 27 - "Domain Docs"
Cohesion: 0.33
Nodes (5): Before exploring, read, Domain Docs, File structure, Flag ADR conflicts, Use glossary's vocabulary

### Community 28 - "toggle-group.tsx"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 29 - "Issue tracker: Local Markdown"
Cohesion: 0.40
Nodes (4): Conventions, Issue tracker: Local Markdown, When skill says "fetch relevant ticket", When skill says "publish issue tracker"

### Community 30 - "tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 31 - "20. Testing Strategy"
Cohesion: 0.25
Nodes (8): 20.1 Theme & Mode Switching, 20.2 Custom Theme Detection, 20.3 Color Customization, 20.4 Dynamic Font Loading, 20.5 Home Layouts, 20.6 Localization (i18n), 20.7 Persistence & Role Separation, 20. Testing Strategy

### Community 32 - "Implementation Plan — Invitation-Based Registration & Verified Access"
Cohesion: 0.07
Nodes (28): 10. Routing / Redirect Logic, 11. Supabase / RLS Changes, 12. Files Modify / Create, 13. Implementation Order, 14. Manual Actions (cannot be done by Claude Code), 1. Current Architecture Analysis, 2. Proposed Authentication State Model, 3. Route Protection Changes (+20 more)

### Community 33 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 34 - "Register.tsx"
Cohesion: 0.50
Nodes (6): redeemInvitationCode(), displayNormalized(), hashCode(), normalizeCodeInput(), Register, Register()

### Community 35 - "Agent skills"
Cohesion: 0.40
Nodes (4): Agent skills, Domain docs, graphify, Issue tracker

### Community 36 - "8.1 Color Scheme Definitions"
Cohesion: 0.33
Nodes (6): 1. Paper Scheme, 2. Glass Scheme, 3. Cartoon Scheme (Light Only), 8.1 Color Scheme Definitions, 8.2 Custom Color Scheme (User-Created), 8. Color Scheme System

### Community 45 - "dependencies"
Cohesion: 0.13
Nodes (15): embla-carousel-react, dependencies, embla-carousel-react, @radix-ui/react-scroll-area, @radix-ui/react-slot, react, react-dom, recharts (+7 more)

### Community 78 - "storage.ts"
Cohesion: 0.27
Nodes (8): ALLOWED_MIME_TYPES, GALLERY_BUCKET, MAX_FILE_SIZE, uploadGalleryImage(), UploadResult, validateImageFile(), supabase, AdminGallery()

### Community 80 - "7.1 Built-in Theme Presets"
Cohesion: 0.40
Nodes (5): 7.1 Built-in Theme Presets, 7. Theme System, Theme 1: Paper (Default), Theme 2: Glass, Theme 3: Cartoon

### Community 85 - "popover.tsx"
Cohesion: 0.40
Nodes (3): Popover(), PopoverContent(), PopoverTrigger()

### Community 104 - "tabs.tsx"
Cohesion: 0.40
Nodes (4): Tabs(), TabsContent(), TabsList(), TabsTrigger()

### Community 108 - "10. Home Layout System"
Cohesion: 0.50
Nodes (4): 10. Home Layout System, Layout 1: Editorial Classic (`HomeClassic.tsx`), Layout 2: Modern Bento Grid (`HomeBento.tsx`), Layout 3: Archive Showcase (`HomeShowcase.tsx`)

### Community 109 - "9. Font System"
Cohesion: 0.50
Nodes (4): 9.1 Built-in User Fonts, 9.2 Dynamic Font Loading Engine (`src/lib/font-loader.ts`), 9.3 Admin Font Management, 9. Font System

### Community 110 - "11. Language/i18n System"
Cohesion: 0.67
Nodes (3): 11.1 Dictionary Architecture, 11.2 Translation Hook (`useTranslation()`), 11. Language/i18n System

### Community 111 - "13. Settings Page (`/settings`)"
Cohesion: 0.67
Nodes (3): 13.1 Route & Layout, 13.2 Sections, 13. Settings Page (`/settings`)

### Community 112 - "14. Admin Global Theme Page (`/admin/theme`)"
Cohesion: 0.67
Nodes (3): 14.1 Route & Access, 14.2 Functional Capabilities, 14. Admin Global Theme Page (`/admin/theme`)

### Community 113 - "15. Database Strategy (Stability & Backward Compatibility)"
Cohesion: 0.67
Nodes (3): 15.1 Zero-Destructive Database Guarantee, 15.2 Schema Migration SQL (`supabase/migrations/202608180001_personalization.sql`), 15. Database Strategy (Stability & Backward Compatibility)

### Community 114 - "17. Runtime Settings Resolution & Custom Transition Engine"
Cohesion: 0.67
Nodes (3): 17.1 Determination Algorithm, 17.2 DOM & Token Injection (`applyThemeToDOM()`), 17. Runtime Settings Resolution & Custom Transition Engine

### Community 115 - "18. File-Level Changes"
Cohesion: 0.67
Nodes (3): 18.1 Files to Create, 18.2 Files to Modify, 18. File-Level Changes

### Community 116 - "1. Current Architecture"
Cohesion: 0.67
Nodes (3): 1.1 Tech Stack, 1.2 Current Routing Architecture, 1. Current Architecture

### Community 117 - "3. Existing Supabase/User Architecture"
Cohesion: 0.67
Nodes (3): 3.1 PostgreSQL Tables & Structures, 3.2 Authentication & Guest Mode (`src/lib/auth.ts` + `src/hooks/use-auth.ts`), 3. Existing Supabase/User Architecture

## Knowledge Gaps
- **293 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+288 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **62 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `useTranslation`, `AdminGallery.tsx`, `sidebar.tsx`, `utils.ts`, `ui/index.ts`, `badge.tsx`, `dropdown-menu.tsx`, `carousel.tsx`, `context-menu.tsx`, `form.tsx`, `chart.tsx`, `select.tsx`, `navigation-menu.tsx`, `command.tsx`, `table.tsx`, `toggle-group.tsx`, `alert.tsx`, `popover.tsx`, `tabs.tsx`?**
  _High betweenness centrality (0.208) - this node is a cross-community bridge._
- **Why does `useTranslation()` connect `useTranslation` to `AdminGallery.tsx`, `Register.tsx`, `utils.ts`, `storage.ts`, `Auth.tsx`, `useAuth`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `useTranslation`, `Register.tsx`, `utils.ts`, `use-auth.ts`, `dropdown-menu.tsx`, `Auth.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useAuth()` (e.g. with `signInAsGuest()` and `signInWithGoogle()`) actually correct?**
  _`useAuth()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _293 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useTranslation` be split into smaller, more focused modules?**
  _Cohesion score 0.05354000837871806 - nodes in this community are weakly interconnected._
- **Should `AdminGallery.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.062037037037037036 - nodes in this community are weakly interconnected._