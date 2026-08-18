You are working on an existing web application codebase.

IMPORTANT:
Before making any changes, use the existing Graphify knowledge graph/codegraph to understand the current architecture and relationships between components, pages, hooks, services, authentication, and database-related code.

The Graphify graph is an architecture map, NOT the final source of truth.
After identifying relevant nodes through Graphify, inspect the actual source files before modifying them.

Your task has THREE major objectives:

1. Completely improve/rework the visual design
2. Introduce a sophisticated glassmorphism visual system without falling into generic AI-SaaS design
3. Completely migrate the existing Convex backend/database/authentication architecture to Supabase

Do not rush into implementation.

First analyze the existing architecture and create an implementation plan.

==================================================
PART 1 — CODEBASE ANALYSIS
==================================================

Use Graphify first.

Identify:

- application entry points
- routing
- page/section structure
- shared components
- UI component system
- styling architecture
- Tailwind configuration
- existing design tokens
- authentication flow
- Convex configuration
- Convex queries
- Convex mutations
- Convex actions
- Convex schema
- Convex generated API usage
- hooks related to authentication/data
- components that directly depend on Convex
- environment variables
- data models
- user/session relationships
- any existing Supabase code
- any integration that may depend on Convex

Then inspect the relevant source files.

Do NOT assume the Graphify graph is perfectly complete.

Create a concise architecture summary before implementation.

==================================================
PART 2 — VISUAL REDESIGN
==================================================

Completely improve the visual design of the application while preserving its existing purpose and functionality.

The design should use:

GLASSMORPHISM

- ORGANIC MATERIALITY
- EDITORIAL DESIGN
- CALM, DISTINCTIVE COLOR SYSTEM

The goal is NOT to create another generic AI-generated SaaS website.

Avoid common AI design patterns such as:

- purple + blue gradients
- generic blue SaaS interfaces
- excessive rounded cards
- endless bento grids
- identical glass cards repeated everywhere
- giant gradient blobs
- random floating 3D objects
- excessive neon
- generic dashboard aesthetics
- excessive pills
- excessive badges
- "AI startup" visual language
- predictable centered hero sections
- decorative elements with no purpose

Do NOT simply add backdrop-blur to every existing card and call it glassmorphism.

The glass should feel like an actual visual material.

Use variation in:

- opacity
- blur
- translucency
- border intensity
- depth
- layering
- shadows
- reflections
- subtle gradients
- background interaction

Use glass selectively.

Some surfaces should be opaque or organic rather than glass.

==================================================
DESIGN DIRECTION
==================================================

The design should feel:

- sophisticated
- human-directed
- calm
- tactile
- modern
- distinctive
- slightly experimental
- technically polished

Use an intentional color palette rather than default Tailwind colors.

If the existing brand already establishes a color direction, preserve and evolve it rather than replacing it randomly.

If the existing design is weak or inconsistent, establish a coherent design token system.

Create/reuse consistent tokens for:

- background
- foreground
- muted text
- primary accent
- secondary accent
- glass surface
- glass border
- glass shadow
- subtle highlight
- destructive/error states
- spacing
- radius
- typography

Maintain visual consistency across all pages.

Do not redesign each page independently.

==================================================
LAYOUT & COMPOSITION
==================================================

Improve hierarchy and composition.

Prioritize:

1. typography
2. whitespace
3. visual hierarchy
4. composition
5. meaningful interaction
6. subtle material effects

Do not add decoration merely to make the page look "fancy".

Every visual element should have a purpose.

Use asymmetry where appropriate.

Avoid forcing everything into symmetrical card grids.

Use editorial composition where it improves the interface.

==================================================
INTERACTION
==================================================

Add tasteful interaction where appropriate.

Examples:

- subtle glass hover response
- gentle elevation
- background light movement
- soft border illumination
- smooth state transitions
- subtle parallax
- contextual hover effects
- meaningful micro-interactions

Animations must remain:

- smooth
- restrained
- fast enough to feel responsive
- not distracting

Do NOT add animations everywhere.

Respect reduced-motion preferences where practical.

==================================================
PART 3 — CONVEX → SUPABASE MIGRATION
==================================================

This is a FULL migration.

Do NOT leave Convex partially integrated.

Audit the entire codebase for:

- convex imports
- Convex client initialization
- Convex providers
- generated Convex API
- generated Convex data types
- useQuery
- useMutation
- useAction
- Convex auth
- Convex schema
- Convex functions
- Convex environment variables
- Convex-specific hooks
- Convex-specific components
- Convex-specific utilities
- Convex dependencies in package.json

Map every Convex dependency to its Supabase equivalent.

==================================================
SUPABASE ARCHITECTURE
==================================================

Use Supabase as the backend/database/authentication platform.

Use:

- Supabase PostgreSQL
- Supabase Auth where authentication is required
- Supabase JavaScript client
- Row Level Security where appropriate

Do not introduce an unnecessary custom backend.

The application should remain frontend-focused unless the existing functionality genuinely requires server-side logic.

Do not create an Express server just to replace Convex.

==================================================
DATABASE MIGRATION
==================================================

Inspect the existing Convex schema and data access patterns.

Translate them into an appropriate PostgreSQL schema.

For every Convex table/model determine:

- table name
- columns
- data types
- primary key
- foreign keys
- nullable fields
- default values
- timestamps
- indexes
- relationships

Preserve the existing data model semantics.

Do not blindly translate Convex fields one-to-one if PostgreSQL has a more appropriate representation.

If relationships exist, model them properly using foreign keys.

If arrays/objects are genuinely required, determine whether PostgreSQL arrays, JSONB, or normalized relational tables are more appropriate.

Do not over-normalize simple data.

==================================================
AUTHENTICATION MIGRATION
==================================================

If Convex currently handles authentication:

Replace it with Supabase Auth.

Audit:

- login
- signup
- logout
- session persistence
- protected routes
- current-user logic
- authentication hooks
- user profile access
- auth-dependent components

Use Supabase's session/auth APIs appropriately.

Do not create a fake authentication layer.

Make sure the frontend reacts correctly when:

- user is logged out
- user is logging in
- session is loading
- session exists
- session expires

==================================================
DATA ACCESS MIGRATION
==================================================

Replace Convex queries/mutations/actions with appropriate Supabase operations.

Examples:

Convex query
→ Supabase SELECT

Convex mutation
→ Supabase INSERT / UPDATE / DELETE

Convex auth
→ Supabase Auth

Convex generated API
→ Supabase client/data-access layer

Do not scatter raw Supabase queries throughout every UI component if a small reusable data-access layer would make the architecture cleaner.

However, do NOT over-engineer the data layer.

Follow the existing project architecture where reasonable.

==================================================
REMOVE CONVEX COMPLETELY
==================================================

After the migration:

Remove unused Convex code.

Remove:

- Convex packages
- Convex configuration
- Convex generated files
- unused Convex hooks
- Convex imports
- Convex environment variables
- Convex-specific providers
- dead Convex functions
- obsolete files

Search the entire repository for remaining Convex references.

There should be no accidental runtime dependency on Convex.

Do not delete files blindly.
Verify that they are actually obsolete.

==================================================
ENVIRONMENT VARIABLES
==================================================

Determine exactly which environment variables the new Supabase architecture requires.

For a Vite frontend, use the appropriate Vite environment variable convention.

Do not expose secrets in frontend environment variables.

Clearly distinguish:

PUBLIC client configuration
vs
SERVER-ONLY secrets.

Never put a Supabase service-role key in the frontend.

Create or update the appropriate example environment file if the project convention supports it.

==================================================
IMPLEMENTATION PROCESS
==================================================

Follow this sequence:

STEP 1
Analyze the existing Graphify graph.

STEP 2
Inspect relevant source files.

STEP 3
Create an implementation plan.

STEP 4
Implement the visual design system.

STEP 5
Implement the glassmorphism redesign consistently across the application.

STEP 6
Audit all Convex dependencies.

STEP 7
Design the Supabase schema.

STEP 8
Implement Supabase client/auth/data access.

STEP 9
Replace Convex functionality.

STEP 10
Remove obsolete Convex code.

STEP 11
Run the application.

STEP 12
Check for build errors.

STEP 13
Check for runtime errors.

STEP 14
Check authentication.

STEP 15
Check database operations.

STEP 16
Check responsive design.

STEP 17
Perform a final search for remaining Convex references.

STEP 18
Review the UI for visual consistency and AI-slop patterns.

Do not skip verification.

==================================================
IMPORTANT CONSTRAINTS
==================================================

Do NOT:

- use TypeScript if this project is intended to remain JavaScript
- introduce unnecessary dependencies
- introduce a backend server unnecessarily
- redesign functionality without reason
- delete working functionality
- rewrite unrelated code
- create unnecessary abstractions
- create excessive components
- add generic UI components just for the sake of abstraction
- blindly convert every CSS value to a Tailwind utility
- force everything into glassmorphism
- use generic AI-generated visual patterns
- leave Convex partially connected

Preserve existing functionality unless the migration requires a change.

Prefer the smallest clean architectural change that achieves the goal.

==================================================
VISUAL VERIFICATION
==================================================

After implementation, inspect the application visually.

Check:

- typography
- spacing
- hierarchy
- glass effects
- contrast
- color consistency
- responsive behavior
- hover states
- loading states
- empty states
- error states

Make sure the redesign feels like ONE coherent design system.

It must not look like different AI-generated sections stitched together.

==================================================
FINAL REPORT
==================================================

When everything is finished, provide a concise report containing:

1. What was changed visually
2. What glassmorphism system was introduced
3. What Convex functionality was migrated
4. What Supabase architecture was created
5. What files were added/modified/deleted
6. What dependencies were added/removed
7. What tests/checks were performed
8. Any remaining limitations or decisions that require my input

==================================================
SUPABASE DASHBOARD SETUP — VERY IMPORTANT
==================================================

At the VERY END, provide a separate section titled:

"SUPABASE DASHBOARD SETUP REQUIRED"

This section must tell me exactly what I need to manually configure in the Supabase Dashboard.

Do NOT simply say "configure Supabase".

Give me a concrete checklist.

For example, determine whether I need to:

- create a Supabase project
- create database tables
- run SQL migrations
- enable/configure authentication providers
- configure email authentication
- configure redirect URLs
- configure Site URL
- configure Row Level Security
- create RLS policies
- create storage buckets
- configure storage policies
- add environment variables
- copy Supabase URL
- copy Supabase anon/publishable key
- configure any other required Supabase settings

Only include items that are actually required by THIS codebase.

For every required manual setup, explain:

WHAT I NEED TO DO
WHERE I NEED TO DO IT
WHAT VALUE/CONFIGURATION I NEED
WHY IT IS REQUIRED

If SQL needs to be executed manually in Supabase SQL Editor, provide the exact SQL.

If environment variables are required, provide the exact variable names and explain where I should put them.

Do NOT invent credentials or values.

Use placeholders such as:

VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...

If something is already handled automatically by the code and does NOT require Dashboard configuration, explicitly say so.

The final result must leave me with a clear checklist of everything I personally need to configure in Supabase Dashboard before the application can work correctly.
