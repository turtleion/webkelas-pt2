# Graph Report - arsip-kelas-digital-main  (2026-08-14)

## Corpus Check
- 108 files · ~30,475 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 779 nodes · 1627 edges · 104 communities (43 shown, 61 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- main.tsx
- alert-dialog.tsx
- sidebar.tsx
- devDependencies
- instrumentation.tsx
- compilerOptions
- index.ts
- cn
- compilerOptions
- auth.ts
- components.json
- utils.ts
- dropdown-menu.tsx
- context-menu.tsx
- class-variance-authority
- carousel.tsx
- input-group.tsx
- item.tsx
- form.tsx
- chart.tsx
- drawer.tsx
- select.tsx
- vly-toolbar-readonly.tsx
- navigation-menu.tsx
- field.tsx
- breadcrumb.tsx
- empty.tsx
- Domain Docs
- toggle-group.tsx
- Issue tracker: Local Markdown
- tsconfig.json
- input-otp.tsx
- accordion.tsx
- alert.tsx
- popover.tsx
- Agent skills
- resizable.tsx
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
- react-day-picker
- react-hook-form
- react-intersection-observer
- react-resizable-panels
- react-router
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 282 edges
2. `compilerOptions` - 22 edges
3. `usePageTitle()` - 19 edges
4. `compilerOptions` - 17 edges
5. `useAuth()` - 14 edges
6. `Button()` - 13 edges
7. `pecahTanggal()` - 11 edges
8. `kelas` - 10 edges
9. `PlaceholderNote()` - 9 edges
10. `SiteHeader()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Public Logo Asset` --semantically_similar_to--> `Source Logo Asset`  [INFERRED] [semantically similar]
  public/logo.svg → src/assets/logo.svg
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `ButtonGroupText()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/button-group.tsx → src/lib/utils.ts
- `ButtonGroupSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/button-group.tsx → src/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (104 total, 61 thin omitted)

### Community 0 - "main.tsx"
Cohesion: 0.06
Nodes (61): RequireAuth(), FadeIn(), KelasMark(), PageHeader(), PageHeaderProps, PhotoPlate(), PhotoPlateProps, PlaceholderNote() (+53 more)

### Community 1 - "alert-dialog.tsx"
Cohesion: 0.11
Nodes (22): AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay() (+14 more)

### Community 2 - "sidebar.tsx"
Cohesion: 0.06
Nodes (41): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), SheetTrigger() (+33 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (41): eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint (+33 more)

### Community 4 - "instrumentation.tsx"
Cohesion: 0.08
Nodes (26): Collapsible(), CollapsibleContent(), CollapsibleTrigger(), Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput() (+18 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): DOM, DOM.Iterable, ES2020, src, vly-toolbar-readonly.tsx, compilerOptions, allowImportingTsExtensions, baseUrl (+20 more)

### Community 6 - "index.ts"
Cohesion: 0.16
Nodes (20): AspectRatio(), HoverCard(), HoverCardContent(), HoverCardTrigger(), Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarGroup() (+12 more)

### Community 7 - "cn"
Cohesion: 0.10
Nodes (29): Avatar(), AvatarFallback(), AvatarImage(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+21 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ES2023, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+12 more)

### Community 9 - "auth.ts"
Cohesion: 0.15
Nodes (21): LogoDropdown(), useAuth(), UseAuthReturn, AuthChangeHandler, AuthState, AuthUser, getAuthState(), getUser() (+13 more)

### Community 10 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 11 - "utils.ts"
Cohesion: 0.15
Nodes (7): Badge(), badgeVariants, Checkbox(), Progress(), Slider(), Spinner(), Switch()

### Community 12 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (15): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuPortal(), DropdownMenuRadioGroup() (+7 more)

### Community 13 - "context-menu.tsx"
Cohesion: 0.12
Nodes (15): ContextMenu(), ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuGroup(), ContextMenuItem(), ContextMenuLabel(), ContextMenuPortal(), ContextMenuRadioGroup() (+7 more)

### Community 15 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 16 - "input-group.tsx"
Cohesion: 0.21
Nodes (10): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+2 more)

### Community 17 - "item.tsx"
Cohesion: 0.13
Nodes (17): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Item(), ItemActions(), ItemContent(), ItemDescription() (+9 more)

### Community 18 - "form.tsx"
Cohesion: 0.23
Nodes (11): FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+3 more)

### Community 19 - "chart.tsx"
Cohesion: 0.25
Nodes (10): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+2 more)

### Community 20 - "drawer.tsx"
Cohesion: 0.18
Nodes (10): Drawer(), DrawerClose(), DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerPortal() (+2 more)

### Community 21 - "select.tsx"
Cohesion: 0.18
Nodes (10): Select(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator() (+2 more)

### Community 22 - "vly-toolbar-readonly.tsx"
Cohesion: 0.29
Nodes (9): ComponentInfo, FiberNode, formatReactComponentHierarchy(), getDomSelector(), getReactComponentHierarchy(), getSelectedElementAnnotation(), getSelectedElementsPrompt(), injectHighlightStyle() (+1 more)

### Community 23 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 24 - "field.tsx"
Cohesion: 0.16
Nodes (12): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+4 more)

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

### Community 31 - "input-otp.tsx"
Cohesion: 0.40
Nodes (4): InputOTP(), InputOTPGroup(), InputOTPSeparator(), InputOTPSlot()

### Community 32 - "accordion.tsx"
Cohesion: 0.40
Nodes (4): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 33 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 34 - "popover.tsx"
Cohesion: 0.40
Nodes (3): Popover(), PopoverContent(), PopoverTrigger()

### Community 35 - "Agent skills"
Cohesion: 0.50
Nodes (3): Agent skills, Domain docs, Issue tracker

### Community 36 - "resizable.tsx"
Cohesion: 0.50
Nodes (3): ResizableHandle(), ResizablePanel(), ResizablePanelGroup()

### Community 45 - "dependencies"
Cohesion: 0.13
Nodes (15): embla-carousel-react, dependencies, embla-carousel-react, @radix-ui/react-scroll-area, @radix-ui/react-slot, react, react-dom, recharts (+7 more)

## Knowledge Gaps
- **206 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `main.tsx`, `alert-dialog.tsx`, `sidebar.tsx`, `instrumentation.tsx`, `index.ts`, `utils.ts`, `dropdown-menu.tsx`, `context-menu.tsx`, `carousel.tsx`, `input-group.tsx`, `item.tsx`, `form.tsx`, `chart.tsx`, `drawer.tsx`, `select.tsx`, `navigation-menu.tsx`, `field.tsx`, `breadcrumb.tsx`, `empty.tsx`, `toggle-group.tsx`, `input-otp.tsx`, `accordion.tsx`, `alert.tsx`, `popover.tsx`, `resizable.tsx`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`, `class-variance-authority`, `clsx`, `@radix-ui/react-dialog`, `cmdk`, `@radix-ui/react-label`, `date-fns`, `framer-motion`, `hono`, `@hookform/resolvers`, `input-otp`, `@jridgewell/trace-mapping`, `lucide-react`, `next-themes`, `@radix-ui/react-select`, `@radix-ui/react-toggle`, `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `vaul`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toggle-group`, `@radix-ui/react-tooltip`, `react-day-picker`, `react-hook-form`, `react-intersection-observer`, `react-resizable-panels`, `react-router`, `sonner`, `tailwind-merge`, `tailwindcss`, `@tailwindcss/vite`, `@vly-ai/integrations`, `zod`, `@zumer/snapdom`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Button()` connect `alert-dialog.tsx` to `main.tsx`, `sidebar.tsx`, `instrumentation.tsx`, `index.ts`, `cn`, `auth.ts`, `dropdown-menu.tsx`, `carousel.tsx`, `input-group.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06460674157303371 - nodes in this community are weakly interconnected._
- **Should `alert-dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10541310541310542 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05673758865248227 - nodes in this community are weakly interconnected._