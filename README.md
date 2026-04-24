# Todos

A modern, full-stack task management application built with **React 19**, **Vite**, and the **TanStack ecosystem**. This project serves as a demonstration of best practices using TanStack Router, TanStack Start, and Tailwind CSS v4.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **TanStack Router** | Type-safe, file-based client-side routing |
| **TanStack Start** | Full-stack server functions & SSR |
| **Tailwind CSS v4** | Utility-first styling |
| **TypeScript** | Strict type safety |
| **Biome** | Linting & formatting |
| **Vitest** | Unit testing |
| **React Testing Library** | Component testing |

---

## Getting Started

```bash
npm install       # Install dependencies
npm run dev       # Start dev server on http://localhost:3000
```

## Available Scripts

```bash
npm run dev       # Start Vite dev server on port 3000
npm run build     # Build for production
npm run preview   # Preview production build
npm run test      # Run Vitest test suite
npm run lint      # Run Biome linter
npm run format    # Run Biome formatter
npm run check     # Run Biome lint + format check
```

---

## Features

### ✅ Core (MVP)

- **Create todos** — Add new tasks to the list
- **Edit todos** — Modify task titles inline
- **Delete todos** — Remove tasks with a confirmation modal (`DeleteConfirmModal`)
- **Toggle completion** — Mark tasks as done or undone
- **File-based routing** — Clean URL structure powered by TanStack Router

---

## Planned Features

### 1. 🔗 Type-Safe URL Filtering & Search
> **TanStack Router — Search Params**

Move filters and search terms into the URL so views are bookmarkable and shareable.

- Filter by status: `?filter=active`, `?filter=completed`, `?filter=all`
- Search by keyword: `?search=groceries`
- Fully type-safe search params validated by TanStack Router's schema system
- Shareable and deep-linkable filtered views

**Why:** This demonstrates one of TanStack Router's most powerful differentiators — strictly typed URL search parameters with runtime validation.

---

### 2. ⚡ Optimistic UI Updates
> **TanStack Query — Mutations**

Update the UI immediately on user action before waiting for a server response. If the server call fails, automatically roll back.

- Instant checkbox toggle feedback
- Instant delete feedback
- Automatic rollback on failure with user-visible error toast
- Zero loading spinners for common mutations

**Why:** Makes the app feel native-level fast. A flagship use case for TanStack Query's `onMutate` / `onError` / `onSettled` lifecycle.

---

### 3. 📄 Dynamic Todo Detail Routes
> **TanStack Router — Dynamic Segments**

Add a full detail page for each todo at `/todo/$todoId`.

- Sub-tasks list inside a todo
- Rich text notes / description field
- Due date picker
- Priority level (Low / Medium / High / Urgent)
- Breadcrumb navigation back to the list
- Loader pre-fetches todo data before the route renders

**Why:** Introduces dynamic route segments, `loader` functions, and `Route.useLoaderData()` patterns from TanStack Router.

---

### 4. 🖥️ Server Functions & API Integration
> **TanStack Start — Server Functions**

Move all data mutations server-side using TanStack Start's `createServerFn`. Use a persistent backend (SQLite via Drizzle ORM, or a mock in-memory store).

- `createServerFn` for `getTodos`, `createTodo`, `updateTodo`, `deleteTodo`
- Server-side validation before writing to the database
- Isomorphic data loading — same function works on server and client

**Why:** Demonstrates full-stack React 19 capabilities and the TanStack Start server function model without a separate API layer.

---

### 5. 🏷️ Categories & Labels

Organize todos using user-defined labels with color coding.

- Create custom labels (e.g., "Work 🔵", "Personal 🟢", "Urgent 🔴")
- Assign multiple labels to a single todo
- Filter the list by label
- Label chips displayed inline on each `TodoItem`
- Labels persisted to backend

**Why:** Adds relational data complexity (many-to-many: todos ↔ labels) that reflects real-world application data modeling.

---

### 6. 🖱️ Drag-and-Drop Reordering
> **`@hello-pangea/dnd` or `dnd-kit`**

Allow users to drag todos to manually reorder their list.

- Drag handle on each `TodoItem`
- Visual drop indicator while dragging
- Optimistic reorder update (no spinner)
- Persist new order to server after drop
- Keyboard-accessible drag and drop (ARIA compliant)

**Why:** A staple feature in premium task managers (Todoist, Linear, Notion) that tests complex state management and server sync.

---

### 7. 🌙 Dark Mode & Theming
> **Tailwind CSS v4 — CSS Variables**

Full dark mode support with system preference detection and a manual toggle.

- Respects `prefers-color-scheme` on first load
- Manual toggle stored in `localStorage`
- Smooth transition between modes
- All colors defined as CSS custom properties via Tailwind v4 theme tokens

**Why:** Tailwind CSS v4 makes CSS-variable-based theming trivially easy and dark mode is an expected quality signal in modern apps.

---

### 8. 🔐 Authentication & Protected Routes
> **TanStack Router — Route Guards & `beforeLoad`**

Add a login flow with protected routes that redirect unauthenticated users.

- `/login` — Email + password login form
- `/register` — New account registration form
- Route `beforeLoad` guard: redirects to `/login` if not authenticated
- Session stored in a cookie (server-side) or `localStorage` (client-side)
- Logout clears session and redirects to `/login`
- User context available app-wide via React Context

**Why:** Practices TanStack Router's `beforeLoad`, `redirect`, and context-passing patterns — core skills for any production application.

---

## Project Structure

```
src/
├── routes/           # File-based routes (TanStack Router)
│   ├── __root.tsx    # Root layout (HTML shell, nav)
│   └── index.tsx     # Home route — todo list
├── components/
│   ├── ui/           # Generic reusable primitives
│   ├── TodoItem.tsx
│   └── DeleteConfirmModal.tsx
├── constants/        # Centralized string literals and tokens
├── types/            # Shared TypeScript interfaces
└── utils/            # Pure utility functions
```

---

## Architecture Principles

- **Smart / Dumb split** — Routes own state and logic; UI components are pure and prop-driven.
- **One component per file** — No barrel components or helpers mixed in.
- **Constants centralization** — No inline string literals or magic numbers.
- **Strict TypeScript** — `any` is forbidden; every prop and function is fully typed.
- **Functional style** — `map`, `filter`, `reduce` over imperative loops; no direct state mutation.

---

## Learn More

- [TanStack Router](https://tanstack.com/router)
- [TanStack Start](https://tanstack.com/start)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Vite](https://vite.dev)
- [Biome](https://biomejs.dev)
- [Vitest](https://vitest.dev)
