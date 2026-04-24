import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import type { Todo } from "#/lib/todos";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

type TodoItemProps = {
	todo: Todo;
	onToggle: (id: string) => void;
	onUpdate: (id: string, text: string) => void;
	onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	// Local edit buffer — only committed on save so ESC can discard changes
	const [editText, setEditText] = useState(todo.text);

	function handleSave() {
		const trimmed = editText.trim();
		// Only persist if there is actual content and it changed
		if (trimmed && trimmed !== todo.text) {
			onUpdate(todo.id, trimmed);
		} else {
			setEditText(todo.text);
		}
		setIsEditing(false);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") handleSave();
		if (e.key === "Escape") {
			setEditText(todo.text);
			setIsEditing(false);
		}
	}

	function handleEditStart() {
		// Sync the buffer with the latest text in case it changed externally
		setEditText(todo.text);
		setIsEditing(true);
	}

	return (
		<>
		<li className="feature-card island-shell rise-in rounded-xl p-4 flex items-center gap-3">
			{/* Completion toggle — circle becomes filled when done */}
			<button
				type="button"
				onClick={() => onToggle(todo.id)}
				className={`flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
					todo.completed
						? "bg-(--lagoon) border-(--lagoon) text-white"
						: "border-(--line) hover:border-(--lagoon)"
				}`}
				aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
			>
				{todo.completed && <Check size={12} strokeWidth={3} />}
			</button>

			{/* Inline edit input or static text */}
			{isEditing ? (
				<input
					// biome-ignore lint/a11y/noAutofocus: user explicitly triggered edit mode
					autoFocus
					value={editText}
					onChange={(e) => setEditText(e.target.value)}
					onBlur={handleSave}
					onKeyDown={handleKeyDown}
					className="flex-1 bg-transparent border-b border-(--lagoon) outline-none text-sm text-(--sea-ink) py-0.5"
				/>
			) : (
				<span
					className={`flex-1 text-sm ${
						todo.completed
							? "line-through text-(--sea-ink-soft)"
							: "text-(--sea-ink)"
					}`}
				>
					{todo.text} at {new Date(todo.createdAt).toLocaleTimeString()}
				</span>
			)}

			{/* Action buttons — swap between edit/confirm and edit/cancel pairs */}
			<div className="flex items-center gap-1">
				{isEditing ? (
					<>
						<button
							type="button"
							onClick={handleSave}
							className="size-8 rounded-lg flex items-center justify-center text-(--palm) hover:bg-(--surface) cursor-pointer"
							aria-label="Save"
						>
							<Check size={15} />
						</button>
						<button
							type="button"
							onClick={() => {
								setEditText(todo.text);
								setIsEditing(false);
							}}
							className="size-8 rounded-lg flex items-center justify-center text-(--sea-ink-soft) hover:bg-(--surface) cursor-pointer"
							aria-label="Cancel"
						>
							<X size={15} />
						</button>
					</>
				) : (
					<>
						<button
							type="button"
							onClick={handleEditStart}
							className="size-8 rounded-lg flex items-center justify-center text-(--sea-ink-soft) hover:bg-(--surface) hover:text-(--sea-ink) cursor-pointer"
							aria-label="Edit"
						>
							<Pencil size={15} />
						</button>
						<button
							type="button"
							onClick={() => setShowDeleteModal(true)}
							className="size-8 rounded-lg flex items-center justify-center text-(--sea-ink-soft) hover:bg-(--surface) hover:text-red-500 cursor-pointer"
							aria-label="Delete"
						>
							<Trash2 size={15} />
						</button>
					</>
				)}
			</div>
		</li>
		{showDeleteModal && (
			<DeleteConfirmModal
				todoText={todo.text}
				onConfirm={() => {
					setShowDeleteModal(false);
					onDelete(todo.id);
				}}
				onCancel={() => setShowDeleteModal(false)}
			/>
		)}
		</>
	);
}
