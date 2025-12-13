# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cercle Amical is a community website for a French social club in Saint Gildas de Rhuys. It's built with Nuxt 4 and uses Nuxt Content for content management with a static deployment to Cloudflare Pages.

## Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start development server on http://localhost:3000
pnpm build        # Build for production (static output)
pnpm preview      # Preview production build locally
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript type checking
```

## Architecture

### Framework Stack
- **Nuxt 4** with static preset (`nitro.preset: 'static'`)
- **Nuxt UI v4** for component library
- **Nuxt Content v3** for markdown-based content management
- **nuxt-og-image** for OpenGraph image generation
- **nuxt-studio** for CMS integration (accessible at `/admin`)

### Directory Structure
- `app/` - Vue components, pages, layouts, and assets
- `content/` - Markdown content organized by numbered sections (actualites, activites, evenements, informations)
- `server/` - Server routes (currently has raw markdown endpoint)
- `public/` - Static assets

### Content Structure
Content is organized in `content/` with numbered prefixes for navigation ordering:
- `1.actualites/` - News articles
- `2.activites/` - Club activities (Belote, Tarot, Petanque, etc.)
- `3.evenements/` - Events and calendar
- `4.informations/` - General information

Content collections defined in `content.config.ts`:
- `landing` - Homepage content (`index.md`)
- `docs` - All other content pages with optional `date` and `links` schema fields

### Configuration
- `nuxt.config.ts` - Main Nuxt configuration
- `app/app.config.ts` - UI theming and site configuration (header, footer, TOC)
- ESLint configured with Nuxt preset, stylistic rules (no comma dangles, 1tbs brace style)

## MCP Tools

When available, use Nuxt MCP tools for documentation lookup:
- `mcp_nuxt_*` - Nuxt framework documentation and modules
- `mcp_nuxt-ui_*` - Nuxt UI component documentation, props, slots, examples
