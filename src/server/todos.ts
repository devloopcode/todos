import { createServerFn } from "@tanstack/react-start";
import type { Todo } from "#/lib/todos";

// Module-level Map acts as the server-side store.
// It persists across requests within one server process but resets on restart.
// In a real app, replace this with a database (Postgres, SQLite, etc.).
const store = new Map<string, Todo>();

// --- Server functions ---
// createServerFn compiles these out of the client bundle entirely.
// The client calls them like normal async functions; TanStack Start turns
// each call into an HTTP POST to an auto-generated endpoint.

/** Returns all todos, sorted by insertion order. */
export const getServerTodos = createServerFn().handler(async () => {
	return Array.from(store.values()).sort((a, b) => a.createdAt - b.createdAt);
});

/** Creates a new todo and returns the full updated list. */
export const addServerTodo = createServerFn()
	// .validator((text: string) => text)
	.handler(async ({ data: text }) => {
		const todo: Todo = {
			id: crypto.randomUUID(),
			text: text.trim(),
			completed: false,
			createdAt: Date.now(),
		};
		store.set(todo.id, todo);
		return Array.from(store.values()).sort((a, b) => a.createdAt - b.createdAt);
	});

/** Flips the completed flag of one todo and returns the updated list. */
export const toggleServerTodo = createServerFn()
	// .validator((id: string) => id)
	.handler(async ({ data: id }) => {
		const existing = store.get(id);
		if (existing) store.set(id, { ...existing, completed: !existing.completed });
		return Array.from(store.values()).sort((a, b) => a.createdAt - b.createdAt);
	});

/** Updates the text of one todo and returns the updated list. */
export const updateServerTodo = createServerFn()
	// .validator((input: { id: string; text: string }) => input)
	.handler(async ({ data }) => {
		const existing = store.get(data.id);
		if (existing) store.set(data.id, { ...existing, text: data.text });
		return Array.from(store.values()).sort((a, b) => a.createdAt - b.createdAt);
	});

/** Removes one todo and returns the updated list. */
export const deleteServerTodo = createServerFn()
	// .validator((id: string) => id)
	.handler(async ({ data: id }) => {
		store.delete(id);
		return Array.from(store.values()).sort((a, b) => a.createdAt - b.createdAt);
	});
