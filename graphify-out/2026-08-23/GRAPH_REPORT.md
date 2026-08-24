# Graph Report - arsip-kelas-digital-main  (2026-08-18)

## Corpus Check
- 132 files · ~47,056 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 935 nodes · 2145 edges · 111 communities (49 shown, 62 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- db.ts
- utils.ts
- sidebar.tsx
- devDependencies
- instrumentation.tsx
- compilerOptions
- index.ts
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
- item.tsx
- form.tsx
- chart.tsx
- 8. Feature Implementation Details
- select.tsx
- vly-toolbar-readonly.tsx
- navigation-menu.tsx
- useAuth
- breadcrumb.tsx
- empty.tsx
- Domain Docs
- toggle-group.tsx
- Issue tracker: Local Markdown
- tsconfig.json
- pagination.tsx
- Implementation Plan — Arsip Kelas Digital
- alert.tsx
- 10. Testing Strategy
- Agent skills
- 2. Existing Functionality
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
- button-group.tsx
- react-hook-form
- react-intersection-observer
- react-resizable-panels
- react-router
- 7. Authentication & Authorization
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
- 4. Feature Scope
- 12. Risks & Technical Decisions
- 1. Current Architecture
- 6. File-Level Changes

## God Nodes (most connected - your core abstractions)
1. `cn()` - 286 edges
2. `usePageTitle()` - 35 edges
3. `useAuth()` - 26 edges
4. `compilerOptions` - 22 edges
5. `useOrganization()` - 20 edges
6. `Button()` - 19 edges
7. `pecahTanggal()` - 19 edges
8. `compilerOptions` - 17 edges
9. `PageHeader()` - 15 edges
10. `useGallery()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Public Logo Asset` --semantically_similar_to--> `Source Logo Asset`  [INFERRED] [semantically similar]
  public/logo.svg → src/assets/logo.svg
- `LogoDropdown()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/LogoDropdown.tsx → src/hooks/use-auth.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `ButtonGroupText()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/button-group.tsx → src/lib/utils.ts
- `ButtonGroupSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/button-group.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (111 total, 62 thin omitted)

### Community 0 - "db.ts"
Cohesion: 0.05
Nodes (93): FadeIn(), PageHeader(), PageHeaderProps, PhotoPlate(), PhotoPlateProps, PlaceholderNote(), SiteFooter(), TAUTAN (+85 more)

### Community 1 - "utils.ts"
Cohesion: 0.10
Nodes (38): AdminLayout(), AdminLayoutProps, ConfirmDialog(), ConfirmDialogProps, DataTable(), DataTableProps, AlertDialog(), AlertDialogAction() (+30 more)

### Community 2 - "sidebar.tsx"
Cohesion: 0.06
Nodes (41): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), SheetTrigger() (+33 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (41): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint (+33 more)

### Community 4 - "instrumentation.tsx"
Cohesion: 0.18
Nodes (10): Collapsible(), CollapsibleContent(), CollapsibleTrigger(), DialogDescription(), ErrorBoundary, ErrorBoundaryState, GenericError, InstrumentationProvider() (+2 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): DOM, DOM.Iterable, ES2020, src, vly-toolbar-readonly.tsx, compilerOptions, allowImportingTsExtensions, baseUrl (+20 more)

### Community 6 - "index.ts"
Cohesion: 0.06
Nodes (56): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), AspectRatio(), ContextMenu(), ContextMenuCheckboxItem(), ContextMenuContent() (+48 more)

### Community 7 - "cn"
Cohesion: 0.05
Nodes (54): Avatar(), AvatarFallback(), AvatarImage(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+46 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ES2023, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+12 more)

### Community 9 - "use-auth.ts"
Cohesion: 0.20
Nodes (16): UseAuthReturn, AuthChangeHandler, AuthState, AuthUser, getAuthState(), getUser(), GUEST_ID, isGuestStored() (+8 more)

### Community 10 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 12 - "dropdown-menu.tsx"
Cohesion: 0.14
Nodes (16): LogoDropdown(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal() (+8 more)

### Community 13 - "main.tsx"
Cohesion: 0.11
Nodes (15): Toaster(), AdminAgenda, AdminAnnouncements, AdminGallery, AdminMembers, AdminOrganization, AdminSchedule, AdminUsers (+7 more)

### Community 15 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 16 - "Auth.tsx"
Cohesion: 0.21
Nodes (9): AdminSidebar(), AdminSidebarProps, KelasMark(), AuthPage, NotFound, Auth(), AuthProps, resolveRedirectAfterAuth() (+1 more)

### Community 17 - "item.tsx"
Cohesion: 0.18
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

### Community 18 - "form.tsx"
Cohesion: 0.23
Nodes (11): FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+3 more)

### Community 19 - "chart.tsx"
Cohesion: 0.25
Nodes (10): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+2 more)

### Community 20 - "8. Feature Implementation Details"
Cohesion: 0.18
Nodes (11): 8.10 Home Page → Supabase, 8.1 Role System Expansion, 8.2 Admin Layout, 8.3 Gallery, 8.4 Announcements, 8.5 Agenda, 8.6 Schedule, 8.7 Members (+3 more)

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
Cohesion: 0.29
Nodes (6): RequireAdmin(), RequireOwner(), RequireAuth(), useAuth(), Dashboard, Dashboard()

### Community 25 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (7): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 26 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

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

### Community 31 - "pagination.tsx"
Cohesion: 0.13
Nodes (12): InputOTP(), InputOTPGroup(), InputOTPSeparator(), InputOTPSlot(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem() (+4 more)

### Community 32 - "Implementation Plan — Arsip Kelas Digital"
Cohesion: 0.22
Nodes (8): 11. Acceptance Criteria, 3. Current Gaps, 5. Supabase Changes, 9. Implementation Order, Implementation Plan — Arsip Kelas Digital, New Tables, RLS Policies (all tables), Storage Bucket

### Community 33 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 34 - "10. Testing Strategy"
Cohesion: 0.22
Nodes (9): 10. Testing Strategy, Authentication, CRUD Operations, Gallery, Loading & Empty States, Responsive, Role-Based Access, Supabase Errors (+1 more)

### Community 35 - "Agent skills"
Cohesion: 0.50
Nodes (3): Agent skills, Domain docs, Issue tracker

### Community 36 - "2. Existing Functionality"
Cohesion: 0.22
Nodes (9): 2. Existing Functionality, Auth (`src/lib/auth.ts` + `src/hooks/use-auth.ts`), Design System (`src/index.css`), Profile (DB table `profiles`), Reusable Components, RLS Policies, shadcn/ui Components (already installed, 53 components), Static Data Model (`src/data/kelas.ts`) (+1 more)

### Community 45 - "dependencies"
Cohesion: 0.13
Nodes (15): embla-carousel-react, dependencies, embla-carousel-react, @radix-ui/react-scroll-area, @radix-ui/react-slot, react, react-dom, recharts (+7 more)

### Community 78 - "storage.ts"
Cohesion: 0.28
Nodes (7): ALLOWED_MIME_TYPES, GALLERY_BUCKET, MAX_FILE_SIZE, uploadGalleryImage(), UploadResult, validateImageFile(), supabase

### Community 80 - "button-group.tsx"
Cohesion: 0.38
Nodes (5): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Separator()

### Community 85 - "7. Authentication & Authorization"
Cohesion: 0.33
Nodes (6): 7. Authentication & Authorization, Auth Flow, Frontend vs Backend Security, Guest Flow, Role Resolution, Route Protection

### Community 104 - "4. Feature Scope"
Cohesion: 0.40
Nodes (5): 4.1 Three-Role System, 4.2 Admin Panel, 4.3 Content Management, 4.4 User Management (Owner only), 4. Feature Scope

### Community 108 - "12. Risks & Technical Decisions"
Cohesion: 0.50
Nodes (4): 12. Risks & Technical Decisions, Decisions Requiring Clarification, Security Risks, Technical Decisions

### Community 109 - "1. Current Architecture"
Cohesion: 0.50
Nodes (4): 1. Current Architecture, Data Flow, Routing (all lazy-loaded), Stack

### Community 110 - "6. File-Level Changes"
Cohesion: 0.50
Nodes (4): 6. File-Level Changes, Files to Create, Files to Modify, Files to Reuse (no changes needed)

## Knowledge Gaps
- **265 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+260 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **62 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `db.ts`, `utils.ts`, `sidebar.tsx`, `instrumentation.tsx`, `index.ts`, `badge.tsx`, `dropdown-menu.tsx`, `carousel.tsx`, `Auth.tsx`, `item.tsx`, `form.tsx`, `chart.tsx`, `select.tsx`, `navigation-menu.tsx`, `breadcrumb.tsx`, `empty.tsx`, `toggle-group.tsx`, `pagination.tsx`, `alert.tsx`, `button-group.tsx`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`, `class-variance-authority`, `clsx`, `@radix-ui/react-dialog`, `cmdk`, `@radix-ui/react-label`, `date-fns`, `framer-motion`, `hono`, `@hookform/resolvers`, `input-otp`, `@jridgewell/trace-mapping`, `lucide-react`, `next-themes`, `@radix-ui/react-select`, `@radix-ui/react-toggle`, `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `vaul`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toggle-group`, `@radix-ui/react-tooltip`, `react-day-picker`, `react-hook-form`, `react-intersection-observer`, `react-resizable-panels`, `react-router`, `sonner`, `tailwind-merge`, `tailwindcss`, `@tailwindcss/vite`, `@vly-ai/integrations`, `zod`, `@zumer/snapdom`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `Button()` connect `utils.ts` to `sidebar.tsx`, `instrumentation.tsx`, `index.ts`, `cn`, `dropdown-menu.tsx`, `carousel.tsx`, `Auth.tsx`, `useAuth`, `pagination.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useAuth()` (e.g. with `signInAsGuest()` and `signInWithGoogle()`) actually correct?**
  _`useAuth()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _265 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05338030077225308 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09877264757451783 - nodes in this community are weakly interconnected._