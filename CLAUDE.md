# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sudoku for All is a cross-platform Sudoku game built with **Expo 55**, **React Native 0.83**, and **React 19**. It targets iOS, Android, and Web.

### Motivation

I'm porting my Swift game to React Native now to support both platforms.

## Common Commands

```bash
pnpm start          # Start Expo dev server
pnpm start:clear    # Start with cache cleared
pnpm ios            # Run on iOS simulator
pnpm android        # Run on Android emulator
pnpm compile        # TypeScript type check (tsc --noEmit)
pnpm lint           # ESLint
pnpm lint:fix       # Auto-fix lint issues
pnpm test           # Run Jest tests
pnpm test:watch     # Jest in watch mode
pnpm prebuild       # Regenerate native projects (iOS/Android)
```

## Architecture

### Routing

File-based routing via **Expo Router**. Two routes: `/` (home) and `/game` (game screen). Route files live in `src/app/`.

### State Management

**Zustand** with **Immer** middleware for immutable updates:

- `src/lib/store/gameplay.ts` — game state (puzzle, cursor, moves, entry mode, undo/redo)
- `src/lib/store/graphics.ts` — rendering state (board layout, fonts)

### Rendering

The Sudoku board is rendered using **@shopify/react-native-skia** (canvas-based 2D graphics), not standard React Native views.

### Styling

**Tailwind CSS v4.1** via **Uniwind** (React Native Tailwind). Metro is configured with Uniwind's CSS entry point. Use `cn()` from `src/lib/cn.ts` for merging class names.

### Game Logic

- Puzzle generation: `sudoku-gen` package (via `src/lib/helpers/puzzle-helper.ts`)
- Peer highlighting: `src/lib/helpers/peers.ts` (rows, columns, subgrids, same values)
- Move history with undo/redo: `src/lib/helpers/history.ts`
- Entry modes: "number" (single digit) or "note" (candidate pencil marks)

### Key Directory Structure

- `src/app/` — route pages and layouts
- `src/lib/components/screens/` — full-screen UI components (home, game)
- `src/lib/components/screens/game/board/` — Skia-based board rendering
- `src/lib/store/` — Zustand stores
- `src/lib/helpers/` — pure business logic and utilities
- `src/lib/hooks/` — custom React hooks
- `src/lib/constants/` — game constants (board dimensions)
- `src/lib/shared-types.ts` — shared TypeScript types

### Platform-Specific Code

Some components have `.ios.tsx` and `.android.tsx` variants (e.g., entry mode toggle). TypeScript is configured with module suffixes for `.ios` and `.native`.

## Code Style

- 4 spaces indentation
- Pre-commit hooks via **Husky** + **lint-staged** auto-fix TypeScript files
- TypeScript strict mode enabled
- Package manager: **pnpm** (with `node-linker=hoisted` in `.npmrc`)
