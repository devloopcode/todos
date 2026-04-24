// All todo data lives in localStorage under this key.
// Centralising it here prevents key typos across the codebase.
const STORAGE_KEY = "todos";

export type Todo = {
	id: string;
	text: string;
	completed: boolean;
	// Stored so the list can be rendered in insertion order
	createdAt: number;
};

// --- Low-level storage helpers ---

/** Returns the current todos array from localStorage, or [] if absent/corrupt. */
export function getTodos(): Todo[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as Todo[]) : [];
	} catch {
		// Guard against JSON.parse throwing on corrupted data
		return [];
	}
}

/** Replaces the entire todos array in localStorage. All mutations go through here. */
function saveTodos(todos: Todo[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// --- CRUD operations ---
// Each function reads the current state, applies its change, persists the
// result, and returns the new array so callers can update React state in
// one step without a second getTodos() call.

/** Creates a new todo and appends it to the list. */
export function addTodo(text: string): Todo[] {
	const todos = getTodos();
	const newTodo: Todo = {
		// crypto.randomUUID() is available in all modern browsers and produces
		// collision-resistant IDs without a library dependency
		id: crypto.randomUUID(),
		text: text.trim(),
		completed: false,
		createdAt: Date.now(),
	};
	const updated = [...todos, newTodo];
	saveTodos(updated);
	return updated;
}

/** Updates the text and/or completed flag of a single todo. */
export function updateTodo(
	id: string,
	changes: Partial<Pick<Todo, "text" | "completed">>,
): Todo[] {
	const todos = getTodos();
	const updated = todos.map((todo) =>
		todo.id === id ? { ...todo, ...changes } : todo,
	);
	saveTodos(updated);
	return updated;
}

/** Removes a single todo by id. */
export function deleteTodo(id: string): Todo[] {
	const todos = getTodos();
	const updated = todos.filter((todo) => todo.id !== id);
	saveTodos(updated);
	return updated;
}
