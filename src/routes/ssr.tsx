import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Server } from "lucide-react";
import { TodoItem } from "#/components/TodoItem";
import type { Todo } from "#/lib/todos";
import {
	addServerTodo,
	deleteServerTodo,
	getServerTodos,
	toggleServerTodo,
	updateServerTodo,
} from "#/server/todos";

export const Route = createFileRoute("/ssr")({
	// This loader executes on the SERVER before the page is sent to the browser.
	// TanStack Start serialises its return value into the HTML response so the
	// client receives a fully-rendered page — no loading flash, and "View Source"
	// in the browser will show the actual todo items inside the HTML.
	loader: async () => {
		const todos = await getServerTodos();
		// Capture the exact moment the server built this response
		return { todos, renderedAt: new Date().toISOString() };
	},
	component: SsrTodosPage,
});

function SsrTodosPage() {
	// Seed React state from the data the server already fetched.
	// After hydration, state lives in memory; mutations go back to the server.
	const { todos: initialTodos, renderedAt } = Route.useLoaderData();
	const [todos, setTodos] = useState<Todo[]>(initialTodos);
	const [inputText, setInputText] = useState("");
	// isPending gives visual feedback while a server round-trip is in flight
	const [isPending, setIsPending] = useState(false);

	// --- handlers ---
	// Each one awaits a createServerFn call (HTTP POST under the hood) and
	// replaces local state with the authoritative list returned by the server.

	async function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = inputText.trim();
		if (!trimmed) return;
		setIsPending(true);
		setTodos(await addServerTodo({ data: trimmed }));
		setInputText("");
		setIsPending(false);
	}

	async function handleToggle(id: string) {
		setIsPending(true);
		setTodos(await toggleServerTodo({ data: id }));
		setIsPending(false);
	}

	async function handleUpdate(id: string, text: string) {
		setIsPending(true);
		setTodos(await updateServerTodo({ data: { id, text } }));
		setIsPending(false);
	}

	async function handleDelete(id: string) {
		setIsPending(true);
		setTodos(await deleteServerTodo({ data: id }));
		setIsPending(false);
	}

	const completedCount = todos.filter((t) => t.completed).length;

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			{/* Page header */}
			<section className="island-shell rounded-2xl p-6 sm:p-8 mb-6">
				<div className="flex items-center gap-2 mb-3">
					<span className="island-kicker">SSR Mode</span>
					<span className="text-xs text-(--sea-ink-soft)">•</span>
					<span className="inline-flex items-center gap-1 text-xs text-(--sea-ink-soft)">
						<Server size={11} />
						In-memory server store
					</span>
				</div>
				<h1 className="display-title mb-2 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
					Your Tasks
				</h1>
				{todos.length > 0 && (
					<p className="text-sm text-(--sea-ink-soft)">
						{completedCount} of {todos.length} completed
					</p>
				)}

				{/* SSR explanation panel */}
				<div className="mt-4 p-3 rounded-xl border border-(--chip-line) bg-(--chip-bg) text-xs text-(--sea-ink-soft) space-y-1">
					<p>
						<strong className="text-(--sea-ink)">How SSR works here:</strong> the
						server ran the loader, fetched todos, and embedded them in the HTML
						before sending it to your browser. Right-click → View Source to see
						them in the markup.
					</p>
					<p>
						Mutations (add / toggle / edit / delete) call{" "}
						<code>createServerFn</code> endpoints — each is a real HTTP round-trip
						to the server. Data is shared across all tabs and sessions.
					</p>
					<p className="font-medium text-(--lagoon-deep)">
						Server rendered at:{" "}
						{new Date(renderedAt).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
						})}
					</p>
				</div>
			</section>

			{/* Add-todo form */}
			<form onSubmit={handleAdd} className="flex gap-3 mb-6">
				<input
					type="text"
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					placeholder="Add a new task…"
					disabled={isPending}
					className="flex-1 island-shell rounded-xl px-4 py-3 text-sm text-(--sea-ink) placeholder:text-(--sea-ink-soft) outline-none focus:border-(--lagoon) border border-(--line) disabled:opacity-60"
				/>
				<button
					type="submit"
					disabled={!inputText.trim() || isPending}
					className="island-shell rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-semibold text-(--palm) border border-(--chip-line) disabled:opacity-40 disabled:cursor-not-allowed hover:border-(--lagoon) cursor-pointer"
				>
					<Plus size={16} />
					{isPending ? "Saving…" : "Add"}
				</button>
			</form>

			{/* Todo list */}
			{todos.length === 0 ? (
				<p className="text-center text-(--sea-ink-soft) text-sm py-12">
					No tasks yet. Add one above to get started.
				</p>
			) : (
				<ul className={`space-y-2 justify-between ${isPending ? "opacity-70 pointer-events-none" : ""}`}>
					{todos.map((todo) => (
						<TodoItem
							key={todo.id}
							todo={todo}
							onToggle={handleToggle}
							onUpdate={handleUpdate}
							onDelete={handleDelete}
						/>
					))}
				</ul>
			)}
		</main>
	);
}
