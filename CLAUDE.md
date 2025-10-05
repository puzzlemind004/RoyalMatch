# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RoyalMatch is a multiplayer card game (2-4 players) with real-time WebSocket communication. The game features:

- A color roulette system that changes card hierarchy each round
- Objective-based scoring system
- Simultaneous card playing with effect resolution
- AI opponents with multiple difficulty levels
- Spectator mode

## Architecture

This is a **monorepo** with two separate applications:

### Backend (`server/`)

- **Framework**: AdonisJS 6 (TypeScript, ES Modules)
- **Database**: PostgreSQL with Lucid ORM
- **Real-time**: AdonisJS Transmit (WebSocket wrapper)
- **Auth**: Access token-based authentication
- **Validation**: VineJS validators

**Key architectural patterns:**

- **Path aliases**: Use `#` imports (e.g., `#models/user`, `#services/*`) defined in `package.json` imports field
- **Service layer**: Business logic goes in `app/services/`, NOT in controllers
- **Controllers**: Thin HTTP/WS handlers in `app/controllers/`
- **Validators**: Input validation in `app/validators/` using VineJS

### Frontend (`client/`)

- **Framework**: Angular 18+ with standalone components (NO NgModules)
- **State**: Angular Signals (avoid RxJS BehaviorSubject for state)
- **Styling**: TailwindCSS v4 (uses `@import "tailwindcss"` syntax, NOT v3 directives)
- **Real-time**: socket.io-client for WebSocket

**Key architectural patterns:**

- **Folder structure**:
  - `core/`: Singleton services, guards, interceptors (app-wide utilities)
  - `features/`: Feature modules containing components, services, and models specific to that feature
  - `shared/`: Reusable components, pipes, directives used across features
  - `models/`: TypeScript interfaces for type safety
- **Standalone components**: All components must be standalone (no declarations in NgModule)
- **Environment config**: API URLs in `src/environments/environment.ts`

## Development Commands

### Backend (run from `server/` directory)

```bash
# Development with HMR
npm run dev

# Build for production
npm run build

# Run tests (Japa test runner)
npm run test

# Lint
npm run lint

# Format code
npm run format

# Type checking without build
npm run typecheck

# Database migrations
node ace migration:run
node ace migration:rollback

# Generate new files
node ace make:model ModelName
node ace make:controller ControllerName
node ace make:validator ValidatorName
```

### Frontend (run from `client/` directory)

```bash
# Development server (localhost:4200)
npm start

# Build for production
npm run build

# Format code (no ESLint configured yet)
npm run format

# Run tests
npm test
```

## Critical Development Rules

### Commits

**NEVER create commits autonomously.** The user must explicitly request commits using the `/clean-commit` command. You may:

- Develop and test code
- Verify compilation and functionality
- Let the user review diffs
  But NEVER execute `git commit` on your own initiative.

### Code Quality

- Always use **design patterns** when appropriate (Factory, Strategy, Observer, etc.)
- Properly utilize **TypeScript classes, inheritance, interfaces**
- Follow **SOLID principles** for clean, maintainable code
- Keep code DRY (Don't Repeat Yourself)

### TailwindCSS v4 - CRITICAL STYLING RULES

**NEVER write custom CSS. TailwindCSS utility classes are sufficient for everything.**

- Configuration is in `.postcssrc.json` (NOT `tailwind.config.js`)
- Import in CSS: `@import "tailwindcss";` (NOT `@tailwind` directives)
- Package: `@tailwindcss/postcss`
- **NO custom CSS files** (e.g., component.css should remain empty or use only Tailwind classes)
- **Mobile-first responsive design**: Always start with mobile styles, then use breakpoints (sm:, md:, lg:, xl:, 2xl:)
- Design must be clean and functional on ALL screen sizes (mobile, tablet, desktop)
- Use Tailwind's responsive utilities: `flex`, `grid`, `hidden`, `block`, etc. with breakpoints

### AdonisJS Specifics

- Routes defined in `start/routes.ts`
- Middleware in `app/middleware/`
- Use `node ace` CLI for code generation
- CORS configured for `localhost:4200` in development

### Angular Specifics

- ALL components must be standalone
- Prefer Signals over RxJS for state management
- Use Angular's built-in dependency injection
- Component selector prefix: `app-`
- **ALWAYS externalize HTML templates**: Use separate `.html` files instead of inline `template` strings for better readability

### Internationalization (i18n) - CRITICAL RULE

**⚠️ BEFORE writing ANY text, ask: "Will this text be displayed to the user?"**

- ✅ **YES** → Use Transloco with translation keys (`this.transloco.translate('game.errors.key')`)
- ❌ **NO** → Can remain in English (logs, comments, variable names)

**Frontend (Client):**
```typescript
// ❌ WRONG - Hardcoded text
const msg = 'Card not found';

// ✅ CORRECT - Use Transloco
const msg = this.transloco.translate('game.errors.cardNotFound');

// ✅ CORRECT - With dynamic params
const msg = this.transloco.translate('game.messages.randomDraw', { count: 2 });
```

**Backend (Server):**
```typescript
// ❌ WRONG - Text message
return { success: false, message: 'Player not found' };

// ✅ CORRECT - Translation key
return { success: false, message: 'game.errors.playerNotFound' };

// ✅ CORRECT - With code + key
return {
  code: 'PLAYER_NOT_FOUND',
  message: 'game.errors.playerNotFound'
};

// ✅ CORRECT - With params (format: key|param1|param2)
return { message: 'game.messages.randomDraw|2' };
```

**Key points:**
- Transloco is configured with FR (default) and EN
- Translation files: `client/public/assets/i18n/fr.json` and `en.json`
- Server sends translation keys, client translates them
- HTTP interceptor (`game-error.interceptor.ts`) handles automatic translation
- Server `reason` field is for logs only, NEVER displayed to users

## Project Documentation

Detailed task documentation is in `projet/features/` with 18 features split into 101 tasks. Each feature has its own folder with markdown files describing each task.

Key documentation files:

- `projet/projet.md`: Complete specifications
- `projet/notes/`: Important notes on the project

## API Communication

- Backend runs on `http://localhost:3333`
- Frontend runs on `http://localhost:4200`
- API base URL: `http://localhost:3333`
- Health check endpoint: `GET /api/health`
- WebSocket endpoint: `http://localhost:3333` (Transmit)

## Database

PostgreSQL configuration in `server/.env`:

- Database name: `royalmatch`
- User: `postgres`
- Password: `postgres`
- Host: `127.0.0.1`
- Port: `5432`
