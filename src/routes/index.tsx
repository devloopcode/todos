import { createFileRoute } from "@tanstack/react-router";
import { HardDrive, Plus } from "lucide-react";
import { useState } from "react";
import { TodoItem } from "#/components/TodoItem";
import {
	addTodo,
	deleteTodo,
	getTodos,
	type Todo,
	updateTodo,
} from "#/lib/todos";

export const Route = createFileRoute("/")({
	component: SpaTodosPage,
});

function SpaTodosPage() {
	// No loader here — this route has no server involvement after the initial
	// HTML shell is sent. The lazy initialiser reads localStorage once on mount.
	const [todos, setTodos] = useState<Todo[]>(() => getTodos());
	const [inputText, setInputText] = useState("");

	// --- handlers ---
	// Each delegates to the localStorage layer (which persists the change) and
	// replaces local state with the returned updated array in one step.

	function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = inputText.trim();
		if (!trimmed) return;
		setTodos(addTodo(trimmed));
		setInputText("");
	}

	function handleToggle(id: string) {
		const todo = todos.find((t) => t.id === id);
		if (!todo) return;
		setTodos(updateTodo(id, { completed: !todo.completed }));
	}

	function handleUpdate(id: string, text: string) {
		setTodos(updateTodo(id, { text }));
	}

	function handleDelete(id: string) {
		setTodos(deleteTodo(id));
	}

	const completedCount = todos.filter((t) => t.completed).length;

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			{/* Page header */}
			<section className="island-shell rounded-2xl p-6 sm:p-8 mb-6">
				<div className="flex items-center gap-2 mb-3">
					<span className="island-kicker">SPA Mode</span>
					<span className="text-xs text-(--sea-ink-soft)">•</span>
					<span className="inline-flex items-center gap-1 text-xs text-(--sea-ink-soft)">
						<HardDrive size={11} />
						localStorage
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

				{/* SPA explanation panel */}
				<div className="mt-4 p-3 rounded-xl border border-(--chip-line) bg-(--chip-bg) text-xs text-(--sea-ink-soft) space-y-1">
					<p>
						<strong className="text-(--sea-ink)">How SPA works here:</strong>{" "}
						the server only delivers the HTML shell and JavaScript bundle. React
						boots in your browser, reads <code>localStorage</code>, and renders
						the list — entirely client-side, no server round-trips for data.
					</p>
					<p>
						Todos are private to this browser and device. They persist across
						page refreshes but are invisible to other tabs' network traffic
						(check DevTools → Network — you'll see nothing for mutations).
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
					className="flex-1 island-shell rounded-xl px-4 py-3 text-sm text-(--sea-ink) placeholder:text-(--sea-ink-soft) outline-none focus:border-(--lagoon) border border-(--line)"
				/>
				<button
					type="submit"
					disabled={!inputText.trim()}
					className="island-shell rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-semibold text-(--palm) border border-(--chip-line) disabled:opacity-40 disabled:cursor-not-allowed hover:border-(--lagoon) cursor-pointer"
				>
					<Plus size={16} />
					Add
				</button>
			</form>

			{/* Todo list */}
			{todos.length === 0 ? (
				<p className="text-center text-(--sea-ink-soft) text-sm py-12">
					No tasks yet. Add one above to get started.
				</p>
			) : (
				<ul className="space-y-2">
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
