# GEMINI.md - Jasuda Multi-Vendor Marketplace Platform

This file provides critical architectural guidelines, design system constraints, and context for the Gemini AI Agent when working with code in this repository.

## Project Overview

Jasuda is an enterprise-grade multi-vendor e-commerce platform built with Next.js. The architecture strictly separates a premium flagship store ("Jasuda") focusing on premium seaweed and aquatic commodities from dozens of standard tenant stores. The platform prioritizes high data density, flawless UX/UI, and scalable B2B/B2C logic.

## Core Tech Stack & Architecture

- **Framework**: Next.js (App Router, Server Components prioritized for performance)
- **Frontend/UI**: React, Tailwind CSS, Shadcn UI
- **Backend/Logic**: Supabase (Authentication, Row Level Security, Edge Functions) and PostgreSQL (Relational Data, Transactions)
- **Styling Paradigm**: Utility-first CSS via Tailwind with custom theme extensions for the Jasuda brand.
- **State Management**: React Context for global UI states, Server Actions for data mutations.

## Design System: Ocean Theme

The visual identity is strictly governed by the "Ocean Theme". You must adhere to these guidelines when generating UI components:

- **Primary Gradient**: Soft Ocean Blue to Seaweed Green. Use this for primary CTAs, active states, and premium Jasuda sections.
- **Typography**: Inter or Plus Jakarta Sans (Modern, sharp, highly legible).
- **Surfaces & Backgrounds**: Clean white backgrounds, extremely subtle light-blue or green tinted neutral borders, and dark slate for primary text to maintain B2B readability.
- **Micro-interactions**: Smooth hover states utilizing the gradient, fluid transitions, and skeleton loaders for all asynchronous data fetching.

## UI/UX Modularity & Vibe Code References

To maintain absolute design consistency, reference the following Google Stitch / MCP components via their IDs. These represent the finalized source of truth for our UI modules:

1. **Integrated Checkout System (Ocean Theme)**
   - ID: `676d9c403d284f0ca302ea06164efbf4`
   - Context: Single-page checkout, split layout, BCA VA and QRIS accordions.

2. **Navigation Alt 5: Interactive Map View (Ocean Theme)**
   - ID: `22ada921a832414bbcfc4d92aa529bfe`
   - Context: Isometric 2D mall layout for store discovery.

3. **Jasuda Flagship Store (Ocean Theme)**
   - ID: `baf9c10511ca466990b05ba7e18748e9`
   - Context: Premium visual treatment, glassmorphism, external marketplace links (Shopee/Tokopedia).

4. **Standard Tenant Store (Ocean Theme)**
   - ID: `c759c4b979f54c5ab0a705c192800b67`
   - Context: Uniform 4-column grid, highly standardized, NO external marketplace links.

5. **Navigation Alt 4: Sidebar Alphabetical Index (Ocean Theme)**
   - ID: `8865a072d5bd4415826557581840187f`
   - Context: Collapsible A-Z quick-jump index for tenant discovery.

6. **Navigation Alt 3: Dynamic Masonry Grid (Ocean Theme)**
   - ID: `d130636b575f48d88d18677b046d4b17`
   - Context: Dynamic scaling cards based on tenant popularity.

7. **Navigation Alt 2: Horizontal Brand Carousel (Ocean Theme)**
   - ID: `f20113249c684ea3b6f93515eb82ac5e`
   - Context: Infinite scroll carousel below hero banner.

8. **Navigation Alt 1: Mega-Menu Explorer (Ocean Theme)**
   - ID: `53e32b90e2fa493e8c0e8a5c78643960`
   - Context: Promotional left banner for Jasuda, multi-column list for tenants.

## AI Agent Development Guidelines

When modifying or generating code for this repository, Gemini must follow these rules:

1. **Component Segregation**: Never mix Jasuda premium components with Standard Tenant components. They must remain logically and visually isolated.
2. **Server Actions First**: Use Next.js Server Actions for forms, checkout processes, and database queries. Minimize client-side fetching unless absolutely necessary for interactivity.
3. **Shadcn Best Practices**: Extend Shadcn UI components elegantly using `cn()` (clsx/tailwind-merge) utility. Do not inline complex conditional styles without it.
4. **Database Integrity**: When writing PostgreSQL/Supabase queries, always account for multi-tenant architecture. Tenant IDs must be strictly verified via Row Level Security (RLS) policies.
5. **No Hallucinated Colors**: Strictly use Tailwind configuration variables (e.g., `bg-ocean-gradient`, `text-seaweed-800`). Do not invent random hex codes.
