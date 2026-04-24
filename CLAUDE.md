# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Todos** is a task management application built with modern web technologies: React 19, Vite, and the TanStack ecosystem.

### Core Value Proposition

A highly responsive, strictly-typed, and cleanly architected todo application that serves as a demonstration of best practices using TanStack Router, TanStack Start, and Tailwind CSS v4.

### MVP Scope

| Feature | Description |
|---------|-------------|
| Todo List | View all todos with fast client-side navigation |
| Create Todo | Add new tasks to the list |
| Edit/Delete | Modify or remove existing tasks (e.g., via `DeleteConfirmModal.tsx`) |
| Routing | File-based client-side routing powered by `@tanstack/react-router` |

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server on port 3000
npm run build        # Build production bundle
npm run preview      # Preview production build locally
npm run test         # Run Vitest test suite
npm run format       # Run Biome formatter
npm run lint         # Run Biome linter
npm run check        # Run Biome check (lint + format)
```

## Architecture

### Routing

Uses **TanStack Router** (file-based routing). All route definitions live under `src/routes/`:
- `src/routes/index.tsx` — Main entry/home route.
- Follow TanStack Router file naming conventions exactly.

### Constants Pattern

Extract all string literals, configuration values, and style tokens into a centralized `src/constants/` directory (create if needed):
- **No magic numbers.** Any number that carries meaning (threshold, limit, duration) must be named and defined in a constants file.
- **Centralized text:** Use constants for UI labels, placeholder text, and generic error messages.

### Components

- `src/components/ui/` — Shared primitive wrappers only (e.g., custom buttons, inputs).
- `src/components/` — Domain-specific components (e.g., `TodoItem.tsx`, `DeleteConfirmModal.tsx`).
- Keep components small and focused.

### Types

- Define strict TypeScript interfaces for all data structures, props, and state.
- Avoid using `any`. Use `unknown` if the type is truly dynamic and narrow it down safely.

### Path Aliases

`#/*` maps to `./src/*` (configured in `package.json`). Use `#/...` for all internal project imports.

### Styling

Uses **Tailwind CSS v4** via `@tailwindcss/vite`:
- Use Tailwind utility classes directly in the `className` prop.
- Avoid custom CSS files or inline style objects unless absolutely necessary.
- Rely on standard Tailwind tokens rather than hardcoding colors.

## Agent Rules

- **Never scan `node_modules/`.** Never search, grep, glob, or read any file inside `node_modules/`. Always restrict file searches to the project source. If a search accidentally returns `node_modules` results, discard them.
- **Never run commands automatically.** The agent must not execute shell commands (e.g. `npm`, `npx`, `git`, `rm`) on its own. Include commands in plan steps as instructions for the engineer to run manually.
- **Never include git commands in plans.** Do not add `git add`, `git commit`, `git push`, or any git command to plan steps. When a task is complete, ask the engineer to commit manually. Git commands are the engineer's responsibility.
- **Never delete files.** When a file needs to be removed, tell the engineer which file to delete and why — do not run `rm` or any equivalent command.
- **Explain every change before making it.** Before editing or creating any file, state what is being changed and why. Wait for user confirmation before proceeding.
- **Always walk through code logic with the engineer before writing it.** For every non-trivial function, explain the logic line by line and wait for the engineer's review and approval before writing the code. Never write a function the engineer hasn't explicitly confirmed.
- **When analysing a bug, always identify the root cause before proposing a fix.** State which file and line is the source of the problem, why it causes the symptom, and what the minimal correct fix is. Do not patch symptoms.
- **Keep plan docs in sync with implementation.** Whenever a change deviates from or extends the original plan — new files, renamed files, architectural decisions, added constants — update the relevant plan document before moving to the next task.

## Code Style & Architecture Rules

### Component Design
- **Smart / dumb split:** Route components (under `src/routes/`) own state and logic (smart). Child UI components only receive props and render (dumb). A UI component must never fetch or mutate data it could receive as props.
- **One component per file.** A file must export exactly one component. No helper components defined in the same file.
- **One `useEffect` per file.** If more than one side effect is needed, split into separate hooks or components. Prefer TanStack Query/Router for data fetching.
- **Keep components small.** If a component exceeds ~100 lines, split it. Each component does one thing.
- **Always pass a stable `key` prop** (e.g., `key={todo.id}`) to any mapped component whose internal state must reset when the data identity changes.
- **Arrow function style** for all components and functions:
  ```ts
  const MyComponent: React.FC<Props> = ({ name }) => { ... }
  const calculate = (x: number): number => x * 2;
  ```

### Naming
- **PascalCase** for component files: `TodoItem.tsx`, `DeleteConfirmModal.tsx`.
- **camelCase** for non-component files (hooks, utils, constants).
- **PascalCase** for component names and types/interfaces.
- **camelCase** for variables, functions, and props.
- **No abbreviated or ambiguous parameter names.** Use full descriptive names: `currentTodo` not `cur`, `todoId` not `id` when context is ambiguous.

### Comments
- Avoid verbose or obvious comments. Do not comment what the code already says.
- Only comment **why**, never **what**. If the logic needs a "what" comment, simplify the logic instead.

### SOLID Principles
- **Single Responsibility:** Each file/component/function has one reason to change.
- **Open/Closed:** Extend behavior through props/composition, not by modifying existing components.
- **Dependency Inversion:** Components depend on props/context interfaces, not concrete implementations.

### Functional Programming
- Prefer pure functions — same input always produces same output, no side effects.
- Use `map`, `filter`, `reduce` over imperative loops.
- Never mutate state directly. Always return new objects/arrays.
- Derive values from state rather than storing redundant state.

### Performance & Hooks
- **Use `memo`** to wrap components that receive stable props to prevent unnecessary re-renders.
- **Use `useCallback`** for functions passed as props to memoized child components.
- **Use `useMemo`** for expensive derived values (e.g. filtered lists, computed totals).
- **Avoid infinite `useEffect` loops** — never put objects, arrays, or functions created inline in the dependency array.

## Code Generation Rules

When generating code:
- Prefer simple solutions.
- Avoid unnecessary abstractions.
- Do not introduce new dependencies without justification.
- Reuse existing utilities when possible.
- Follow existing patterns in the repository before inventing new ones.

## Change Safety Rules

Before modifying code:
1. Identify all affected files.
2. Explain the change briefly.
3. Implement minimal changes.
4. Avoid modifying unrelated files.
5. Preserve existing APIs and interfaces.
6. If a breaking change is required, explain why.

## Architecture Constraints

The following rules must never be violated:
- Screens and routes own state and logic.
- UI components must remain pure and receive props.
- Business logic must not live in UI components.
- Constants must not be duplicated.
- Types must be defined strictly.

## Self Review

After implementing code, review it for:
- Unnecessary complexity
- Duplicated logic
- Missing edge cases
- Performance issues
- Type safety

## Forbidden Patterns

Never do the following:
- Using `any` types.
- Direct state mutation.
- Using `props.x` — always destructure: `({ x }) => ...` not `(props) => props.x`.
- Business logic inside UI components.
- Multiple components in one file.
- `useEffect` dependency hacks.
