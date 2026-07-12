# PROJECT KNOWLEDGE BASE

**Project**: Jasuda Marketplace Platform
**Ecosystem**: Next.js (App Router), React, Tailwind, Shadcn UI, Supabase, PostgreSQL
**Role**: Expert Frontend Architect & Full-Stack Developer

## OVERVIEW

This repository houses a complex B2B/B2C multi-vendor marketplace. The system architecture dictates a strict separation between the "Jasuda Flagship Store" (Premium, Aquatic Ocean Theme, Custom Features) and "Standard Tenant Stores" (Clean, Standardized, Uniform).

## REPOSITORY STRUCTURE

```text
jasuda-marketplace/
├── app/
│   ├── (admin)/              # Complex 7-page B2B Dashboard
│   ├── (shop)/
│   │   ├── jasuda/           # Premium flagship store routes
│   │   ├── tenant/[slug]/    # Standardized tenant store routes
│   │   └── checkout/         # Integrated checkout system
├── components/
│   ├── ui/                   # Shadcn UI primitives
│   ├── jasuda/               # Exclusive premium components
│   ├── tenant/               # Standardized tenant components
│   └── shared/               # Global navigation, footers, auth
├── lib/
│   ├── supabase/             # Database clients and auth helpers
│   ├── utils.ts              # cn() utility and formatters
├── actions/                  # Next.js Server Actions
└── styles/
    └── globals.css           # Ocean Theme Tailwind configurations

```

## WHERE TO LOOK

| Task                 | Location               | Notes                                              |
| -------------------- | ---------------------- | -------------------------------------------------- |
| Modify Premium UI    | `components/jasuda/`   | Must use Ocean Blue to Seaweed Green gradient      |
| Update standard grid | `components/tenant/`   | Keep it clean, 4-column layout, no premium effects |
| Database queries     | `actions/`             | Use Server Actions with Supabase client            |
| Checkout flow        | `app/(shop)/checkout/` | BCA VA and QRIS logic resides here                 |
| UI Primitives        | `components/ui/`       | Shadcn generated files, modify with caution        |

## CONVENTIONS & THEME VARIABLES

### Tailwind Ocean Theme Config

Ensure `tailwind.config.ts` incorporates these custom values:

- `colors.ocean.light`: Soft Ocean Blue
- `colors.seaweed.dark`: Seaweed Green
- `backgroundImage.ocean-gradient`: `linear-gradient(to right, var(--ocean-light), var(--seaweed-dark))`

### Component Naming

- Use PascalCase for React components: `JasudaHeroBanner.tsx`, `TenantProductCard.tsx`.
- Use camelCase for server actions and utility functions: `processCheckoutBCA()`, `formatRupiah()`.

## ANTI-PATTERNS (CRITICAL RULES)

| Forbidden Action                               | Reason / Consequence                                                        |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| Adding Shopee/Tokopedia links to Tenant Stores | Strict business constraint. External links are exclusive to Jasuda.         |
| Using standard `bg-blue-500`                   | Violates Ocean Theme. Use semantic variables (`bg-ocean-light`).            |
| Client-side data fetching for SEO pages        | Ruins Core Web Vitals. Use Server Components for product details.           |
| Combining Jasuda and Tenant states             | Causes architectural pollution. Keep store states 100% isolated.            |
| Mixing Admin and User logic                    | Security risk. Use completely separate layout groups `(admin)` vs `(shop)`. |

## EXTERNAL MCP / STITCH VIBE CODE REFERENCE

When the agent requires visual layout context, refer to these Stitch IDs using `curl -L`:

- **Checkout**: `676d9c403d284f0ca302ea06164efbf4`
- **Jasuda Store**: `baf9c10511ca466990b05ba7e18748e9`
- **Tenant Store**: `c759c4b979f54c5ab0a705c192800b67`
- **Nav Alt 1 (Mega-Menu)**: `53e32b90e2fa493e8c0e8a5c78643960`
- **Nav Alt 2 (Carousel)**: `f20113249c684ea3b6f93515eb82ac5e`
- **Nav Alt 3 (Masonry)**: `d130636b575f48d88d18677b046d4b17`
- **Nav Alt 4 (Sidebar)**: `8865a072d5bd4415826557581840187f`
- **Nav Alt 5 (Map)**: `22ada921a832414bbcfc4d92aa529bfe`
