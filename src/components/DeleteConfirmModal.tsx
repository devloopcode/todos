/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
	todoText: string;
	onConfirm: () => void;
	onCancel: () => void;
};

export function DeleteConfirmModal({ todoText, onConfirm, onCancel }: Props) {
	const [exiting, setExiting] = useState(false);
	const exitingRef = useRef(false);
	const pendingAction = useRef<"confirm" | "cancel">("cancel");

	const trigger = useCallback((action: "confirm" | "cancel") => {
		if (exitingRef.current) return;
		exitingRef.current = true;
		pendingAction.current = action;
		setExiting(true);
	}, []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") trigger("cancel");
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [trigger]);

	function handleAnimationEnd(e: React.AnimationEvent<HTMLDivElement>) {
		// Only react to the card's own animationend, not bubbled child animations
		if (e.target !== e.currentTarget) return;
		if (!exiting) return;
		if (pendingAction.current === "confirm") onConfirm();
		else onCancel();
	}

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="delete-modal-title"
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
				exiting ? "modal-backdrop-exit" : "modal-backdrop-enter"
			}`}
			style={{
				background: "rgba(10, 20, 24, 0.55)",
				backdropFilter: "blur(8px)",
				WebkitBackdropFilter: "blur(8px)",
			}}
			onClick={() => trigger("cancel")}
		>
			<div
				className={`island-shell w-full max-w-sm rounded-2xl overflow-hidden ${
					exiting ? "modal-card-exit" : "modal-card-enter"
				}`}
				onClick={(e) => e.stopPropagation()}
				onAnimationEnd={handleAnimationEnd}
			>
				{/* Red accent strip */}
				<div className="h-1 bg-linear-to-r from-red-400 via-red-500 to-rose-400" />

				<div className="p-6">
					{/* Icon */}
					<div className="flex justify-center mb-5">
						<div
							className="modal-icon-ring flex size-16 items-center justify-center rounded-full border border-red-200/50"
							style={{ background: "rgba(254, 226, 226, 0.45)" }}
						>
							<Trash2 size={26} className="text-red-500 modal-trash-icon" />
						</div>
					</div>

					{/* Text */}
					<div className="text-center mb-6">
						<h2
							id="delete-modal-title"
							className="display-title text-xl font-bold text-(--sea-ink) mb-2"
						>
							Delete this task?
						</h2>
						<p className="text-sm text-(--sea-ink-soft) leading-relaxed">
							<span className="font-medium text-(--sea-ink) italic line-clamp-2">
								"{todoText}"
							</span>
							<span className="text-xs mt-1 block">
								This action cannot be undone.
							</span>
						</p>
					</div>

					{/* Actions */}
					<div className="flex gap-3">
						<button
							// biome-ignore lint/a11y/noAutofocus: cancel is the safe default in a destructive confirm dialog
							autoFocus
							type="button"
							onClick={() => trigger("cancel")}
							className="flex-1 rounded-xl border border-(--line) py-2.5 text-sm font-semibold text-(--sea-ink-soft) hover:text-(--sea-ink) hover:border-(--lagoon) hover:bg-(--surface) cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={() => trigger("confirm")}
							className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white cursor-pointer"
							style={{
								background: "linear-gradient(135deg, #f87171, #ef4444)",
								boxShadow:
									"0 4px 14px rgba(239, 68, 68, 0.3), 0 1px 3px rgba(239, 68, 68, 0.2)",
							}}
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
}
