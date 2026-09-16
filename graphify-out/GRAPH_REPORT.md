# Graph Report - arsip-kelas-digital-main (2026-09-11)

## Corpus Check

- 206 files · ~88,972 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 1149 nodes · 3230 edges · 142 communities (67 shown, 75 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `1e30ea8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)

- AdminDuty.tsx
- useTranslation
- sidebar.tsx
- devDependencies
- utils.ts
- compilerOptions
- ui/index.ts
- cn
- compilerOptions
- useAuth
- components.json
- drawer.tsx
- dropdown-menu.tsx
- db.ts
- AdminArticles.tsx
- carousel.tsx
- ConfirmDialog.tsx
- use-mbg.ts
- form.tsx
- chart.tsx
- AdminInvitationCodes.tsx
- resolveInternalRedirect
- vly-toolbar-readonly.tsx
- navigation-menu.tsx
- kelas.ts
- context-menu.tsx
- field.tsx
- Domain Docs
- item.tsx
- Issue tracker: Local Markdown
- tsconfig.json
- storage.ts
- AdminSchedule.tsx
- Tugas.jsx
- framer-motion
- Agent skills
- table.tsx
- Dashboard.tsx
- input-group.tsx
- select.tsx
- Graphify Rule
- AdminNotification.tsx
- org.junit.Test
- @radix-ui/react-label
- date-fns
- dependencies
- breadcrumb.tsx
- hono
- @hookform/resolvers
- input-otp
- @jridgewell/trace-mapping
- lucide-react
- main.ts
- next-themes
- @radix-ui/react-select
- embla-carousel-react
- @radix-ui/react-accordion
- empty.tsx
- @radix-ui/react-aspect-ratio
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-collapsible
- button-group.tsx
- @radix-ui/react-dropdown-menu
- @radix-ui/react-hover-card
- clsx
- use-gallery.ts
- accordion.tsx
- @radix-ui/react-progress
- @radix-ui/react-radio-group
- vaul
- marked
- @radix-ui/react-slider
- @radix-ui/react-slot
- @radix-ui/react-tabs
- @radix-ui/react-toggle-group
- @radix-ui/react-tooltip
- react
- react-day-picker
- input-otp.tsx
- react-hook-form
- react-intersection-observer
- react-dom
- react-router
- @supabase/supabase-js
- sonner
- tailwind-merge
- tailwindcss
- @tailwindcss/vite
- @vly-ai/integrations
- zod
- tabs.tsx
- Public Logo Asset
- vly-integrations.ts
- global.d.ts
- Index HTML Entrypoint
- gradlew
- Convex Auth Architecture
- Convex Backend Guidelines
- Frontend & UI Conventions
- Project Overview & Tech Stack
- hover-card.tsx
- resizable.tsx
- MainActivity.java
- badge.tsx
- kbd.tsx
- @capacitor/browser
- capacitor.config.ts
- @capacitor/core
- @capacitor/keyboard
- @capacitor/splash-screen
- @capacitor/status-bar
- @capawesome/capacitor-google-sign-in
- main.tsx
- class-variance-authority
- toggle-group.tsx
- cmdk
- @radix-ui/react-dialog
- alert.tsx
- @radix-ui/react-menubar
- popover.tsx
- @radix-ui/react-separator
- @zumer/snapdom
- RootErrorBoundary
- ToolbarErrorBoundary
- @radix-ui/react-scroll-area
- @radix-ui/react-switch
- @radix-ui/react-toggle
- react-resizable-panels
- recharts

## God Nodes (most connected - your core abstractions)

1. `cn()` - 302 edges
2. `useTranslation()` - 109 edges
3. `usePageTitle()` - 62 edges
4. `useAuth()` - 41 edges
5. `useOrganization()` - 36 edges
6. `pecahTanggal()` - 31 edges
7. `Button()` - 26 edges
8. `PageHeader()` - 23 edges
9. `usePreferences()` - 22 edges
10. `compilerOptions` - 22 edges

## Surprising Connections (you probably didn't know these)

- `Public Logo Asset` --semantically_similar_to--> `Source Logo Asset` [INFERRED] [semantically similar]
  public/logo.svg → src/assets/logo.svg
- `LogoDropdown()` --calls--> `useAuth()` [EXTRACTED]
  src/components/LogoDropdown.tsx → src/hooks/use-auth.ts
- `AlertDialogOverlay()` --calls--> `cn()` [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `ButtonGroupText()` --calls--> `cn()` [EXTRACTED]
  src/components/ui/button-group.tsx → src/lib/utils.ts
- `ButtonGroupSeparator()` --calls--> `cn()` [EXTRACTED]
  src/components/ui/button-group.tsx → src/lib/utils.ts

## Import Cycles

- None detected.

## Communities (142 total, 75 thin omitted)

### Community 0 - "AdminDuty.tsx"

Cohesion: 0.20
Nodes (12): DataTable(), DataTableProps, Input(), useDutySchedule(), createDutySchedule(), deleteDutySchedule(), getDutySchedule(), updateDutySchedule() (+4 more)

### Community 1 - "useTranslation"

Cohesion: 0.06
Nodes (95): AdminLayout(), AdminLayoutProps, AdminSidebar(), AdminSidebarProps, ConfirmDialog(), HomeBento(), HomeLayoutProps, HomeClassic() (+87 more)

### Community 2 - "sidebar.tsx"

Cohesion: 0.06
Nodes (41): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), SheetTrigger() (+33 more)

### Community 3 - "devDependencies"

Cohesion: 0.04
Nodes (45): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint (+37 more)

### Community 4 - "utils.ts"

Cohesion: 0.08
Nodes (52): BackgroundSelector(), ColorSchemePicker(), getLuminance(), hasContrastWarning(), FontSelector(), LanguageSelector(), LayoutSelector(), LivePreview() (+44 more)

### Community 5 - "compilerOptions"

Cohesion: 0.07
Nodes (28): DOM, DOM.Iterable, ES2020, src, vly-toolbar-readonly.tsx, compilerOptions, allowImportingTsExtensions, baseUrl (+20 more)

### Community 6 - "ui/index.ts"

Cohesion: 0.19
Nodes (17): AspectRatio(), Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarGroup(), MenubarItem(), MenubarLabel(), MenubarMenu() (+9 more)

### Community 7 - "cn"

Cohesion: 0.12
Nodes (20): Avatar(), AvatarFallback(), AvatarImage(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+12 more)

### Community 8 - "compilerOptions"

Cohesion: 0.10
Nodes (20): ES2023, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+12 more)

### Community 9 - "useAuth"

Cohesion: 0.14
Nodes (24): RequireAdmin(), RequireOwner(), RequireAuth(), RequireSignedIn(), RequireVerified(), useAuth(), UseAuthReturn, AuthChangeHandler (+16 more)

### Community 10 - "components.json"

Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 11 - "drawer.tsx"

Cohesion: 0.18
Nodes (10): Drawer(), DrawerClose(), DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerPortal() (+2 more)

### Community 12 - "dropdown-menu.tsx"

Cohesion: 0.14
Nodes (16): LogoDropdown(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal() (+8 more)

### Community 13 - "db.ts"

Cohesion: 0.17
Nodes (22): Anggota, useAgenda(), useArticles(), useMembers(), createAgendaItem(), createArticle(), createMember(), deleteAgendaItem() (+14 more)

### Community 14 - "AdminArticles.tsx"

Cohesion: 0.08
Nodes (29): Collapsible(), CollapsibleContent(), CollapsibleTrigger(), Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput() (+21 more)

### Community 15 - "carousel.tsx"

Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 16 - "ConfirmDialog.tsx"

Cohesion: 0.11
Nodes (22): ConfirmDialogProps, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+14 more)

### Community 17 - "use-mbg.ts"

Cohesion: 0.48
Nodes (6): useMbgSchedule(), createMbgSchedule(), deleteMbgSchedule(), getMbgSchedule(), updateMbgSchedule(), AdminMbg()

### Community 18 - "form.tsx"

Cohesion: 0.23
Nodes (11): FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+3 more)

### Community 19 - "chart.tsx"

Cohesion: 0.25
Nodes (10): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+2 more)

### Community 20 - "AdminInvitationCodes.tsx"

Cohesion: 0.20
Nodes (16): Button(), createInvitationCode(), InvitationCodeRow, listInvitationCodes(), redeemInvitationCode(), codePrefix(), displayNormalized(), generateInvitationCode() (+8 more)

### Community 21 - "resolveInternalRedirect"

Cohesion: 0.60
Nodes (3): AuthStateRedirector(), VerificationWarningBar(), resolveInternalRedirect()

### Community 22 - "vly-toolbar-readonly.tsx"

Cohesion: 0.29
Nodes (9): ComponentInfo, FiberNode, formatReactComponentHierarchy(), getDomSelector(), getReactComponentHierarchy(), getSelectedElementAnnotation(), getSelectedElementsPrompt(), injectHighlightStyle() (+1 more)

### Community 23 - "navigation-menu.tsx"

Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 24 - "kelas.ts"

Cohesion: 0.13
Nodes (16): agenda, AgendaItem, galeri, GaleriItem, jadwal, JadwalHari, JadwalRow, kelas (+8 more)

### Community 25 - "context-menu.tsx"

Cohesion: 0.12
Nodes (15): ContextMenu(), ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuGroup(), ContextMenuItem(), ContextMenuLabel(), ContextMenuPortal(), ContextMenuRadioGroup() (+7 more)

### Community 26 - "field.tsx"

Cohesion: 0.16
Nodes (12): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+4 more)

### Community 27 - "Domain Docs"

Cohesion: 0.33
Nodes (5): Before exploring, read, Domain Docs, File structure, Flag ADR conflicts, Use glossary's vocabulary

### Community 28 - "item.tsx"

Cohesion: 0.18
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

### Community 29 - "Issue tracker: Local Markdown"

Cohesion: 0.40
Nodes (4): Conventions, Issue tracker: Local Markdown, When skill says "fetch relevant ticket", When skill says "publish issue tracker"

### Community 30 - "tsconfig.json"

Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 31 - "storage.ts"

Cohesion: 0.20
Nodes (8): GOOGLE_WEB_CLIENT_ID, initCapacitorNative(), setupExternalLinkInterceptor(), ALLOWED_MIME_TYPES, GALLERY_BUCKET, MAX_FILE_SIZE, UploadResult, supabase

### Community 32 - "AdminSchedule.tsx"

Cohesion: 0.29
Nodes (9): useSchedule(), createSchedule(), deleteSchedule(), getSchedules(), updateSchedule(), AdminSchedule, AdminSchedule(), DAY_I18N_KEYS (+1 more)

### Community 33 - "Tugas.jsx"

Cohesion: 0.40
Nodes (5): ACCENTS, DAY_NAMES, formatKey(), MONTHS, TugasPage()

### Community 35 - "Agent skills"

Cohesion: 0.40
Nodes (4): Agent skills, Domain docs, graphify, Issue tracker

### Community 36 - "table.tsx"

Cohesion: 0.22
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 38 - "input-group.tsx"

Cohesion: 0.28
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 39 - "select.tsx"

Cohesion: 0.18
Nodes (10): Select(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator() (+2 more)

### Community 41 - "AdminNotification.tsx"

Cohesion: 0.18
Nodes (22): DailyNotificationBanner(), DailyBundle, useDailyOverview(), addDaysISO(), dayNameOf(), HARI_SEKOLAH, labelTanggal(), nextSchoolDay() (+14 more)

### Community 42 - "org.junit.Test"

Cohesion: 0.36
Nodes (4): ExampleInstrumentedTest, ExampleUnitTest, org.junit.runner.RunWith, org.junit.Test

### Community 45 - "dependencies"

Cohesion: 0.12
Nodes (17): @capacitor/android, @capacitor/app, @capacitor/cli, dompurify, dependencies, @capacitor/android, @capacitor/app, @capacitor/cli (+9 more)

### Community 46 - "breadcrumb.tsx"

Cohesion: 0.25
Nodes (7): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 57 - "empty.tsx"

Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 62 - "button-group.tsx"

Cohesion: 0.38
Nodes (5): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Separator()

### Community 66 - "use-gallery.ts"

Cohesion: 0.52
Nodes (6): useGallery(), createGalleryPhoto(), deleteGalleryPhoto(), getGalleryPhotos(), updateGalleryPhoto(), deleteGalleryImage()

### Community 67 - "accordion.tsx"

Cohesion: 0.40
Nodes (4): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 80 - "input-otp.tsx"

Cohesion: 0.40
Nodes (4): InputOTP(), InputOTPGroup(), InputOTPSeparator(), InputOTPSlot()

### Community 92 - "tabs.tsx"

Cohesion: 0.40
Nodes (4): Tabs(), TabsContent(), TabsList(), TabsTrigger()

### Community 98 - "gradlew"

Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 104 - "hover-card.tsx"

Cohesion: 0.50
Nodes (3): HoverCard(), HoverCardContent(), HoverCardTrigger()

### Community 108 - "resizable.tsx"

Cohesion: 0.50
Nodes (3): ResizableHandle(), ResizablePanel(), ResizablePanelGroup()

### Community 119 - "main.tsx"

Cohesion: 0.07
Nodes (24): Toaster(), AdminAgenda, AdminGallery, AdminMbg, AdminMembers, AdminNotification, AdminOrganization, AdminTheme (+16 more)

### Community 121 - "toggle-group.tsx"

Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 124 - "alert.tsx"

Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 126 - "popover.tsx"

Cohesion: 0.40
Nodes (3): Popover(), PopoverContent(), PopoverTrigger()

## Knowledge Gaps

- **255 isolated node(s):** `ACCENTS`, `MONTHS`, `DAY_NAMES`, `config`, `$schema` (+250 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **75 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `AdminDuty.tsx`, `useTranslation`, `sidebar.tsx`, `utils.ts`, `ui/index.ts`, `drawer.tsx`, `dropdown-menu.tsx`, `AdminArticles.tsx`, `carousel.tsx`, `ConfirmDialog.tsx`, `form.tsx`, `chart.tsx`, `AdminInvitationCodes.tsx`, `navigation-menu.tsx`, `context-menu.tsx`, `field.tsx`, `item.tsx`, `table.tsx`, `input-group.tsx`, `select.tsx`, `breadcrumb.tsx`, `empty.tsx`, `button-group.tsx`, `accordion.tsx`, `input-otp.tsx`, `tabs.tsx`, `hover-card.tsx`, `resizable.tsx`, `badge.tsx`, `kbd.tsx`, `toggle-group.tsx`, `alert.tsx`, `popover.tsx`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `@zumer/snapdom`, `devDependencies`, `@radix-ui/react-scroll-area`, `@radix-ui/react-switch`, `@radix-ui/react-toggle`, `react-resizable-panels`, `recharts`, `framer-motion`, `@radix-ui/react-label`, `date-fns`, `hono`, `@hookform/resolvers`, `input-otp`, `@jridgewell/trace-mapping`, `lucide-react`, `next-themes`, `@radix-ui/react-select`, `embla-carousel-react`, `@radix-ui/react-accordion`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `clsx`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `vaul`, `marked`, `@radix-ui/react-slider`, `@radix-ui/react-slot`, `@radix-ui/react-tabs`, `@radix-ui/react-toggle-group`, `@radix-ui/react-tooltip`, `react`, `react-day-picker`, `react-hook-form`, `react-intersection-observer`, `react-dom`, `react-router`, `@supabase/supabase-js`, `sonner`, `tailwind-merge`, `tailwindcss`, `@tailwindcss/vite`, `@vly-ai/integrations`, `zod`, `@capacitor/browser`, `@capacitor/core`, `@capacitor/keyboard`, `@capacitor/splash-screen`, `@capacitor/status-bar`, `@capawesome/capacitor-google-sign-in`, `class-variance-authority`, `cmdk`, `@radix-ui/react-dialog`, `@radix-ui/react-menubar`, `@radix-ui/react-separator`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `useTranslation()` connect `useTranslation` to `AdminDuty.tsx`, `AdminSchedule.tsx`, `utils.ts`, `Dashboard.tsx`, `AdminNotification.tsx`, `db.ts`, `AdminArticles.tsx`, `use-mbg.ts`, `AdminInvitationCodes.tsx`, `resolveInternalRedirect`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useAuth()` (e.g. with `signInAsGuest()` and `signInWithGoogle()`) actually correct?**
  _`useAuth()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ACCENTS`, `MONTHS`, `DAY_NAMES` to the rest of the system?**
  _255 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useTranslation` be split into smaller, more focused modules?**
  _Cohesion score 0.06432923783837778 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05673758865248227 - nodes in this community are weakly interconnected._
