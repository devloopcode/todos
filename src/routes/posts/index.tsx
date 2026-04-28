/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Pen, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteConfirmModal } from "#/components/DeleteConfirmModal";
import { fetchPosts, POSTS_QUERY_KEY, type Post } from "#/lib/posts";

export const Route = createFileRoute("/posts/")({
	component: PostsPage,
});

function PostsPage() {
	const {
		data: posts,
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: POSTS_QUERY_KEY,
		queryFn: fetchPosts,
	});

	const [postsData, setPostsData] = useState<Post[] | undefined>(posts);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [target, setTarget] = useState<Post | null>(null);

	useEffect(() => {
		setPostsData(posts);
	}, [posts]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<svg
					width="120"
					height="60"
					viewBox="0 0 120 60"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Loading spinner</title>
					<style>{`
              @keyframes bounce {
                0%, 80%, 100% { cy: 38px; }
                40%            { cy: 20px; }
              }
              .d1 { animation: bounce 1.2s ease-in-out 0s    infinite; }
              .d2 { animation: bounce 1.2s ease-in-out 0.2s  infinite; }
              .d3 { animation: bounce 1.2s ease-in-out 0.4s  infinite; }
            `}</style>

					<circle className="d1" cx="30" cy="38" r="7" fill="#4A90E2" />
					<circle className="d2" cx="60" cy="38" r="7" fill="#4A90E2" />
					<circle className="d3" cx="90" cy="38" r="7" fill="#4A90E2" />
				</svg>
			</div>
		);
	}

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<section className="island-shell rounded-2xl p-6 sm:p-8 mb-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<span className="island-kicker">TanStack Query</span>
						<h1 className="display-title mt-2 text-4xl font-bold text-(--sea-ink)">
							Posts
						</h1>
						{postsData && (
							<p className="text-sm text-(--sea-ink-soft) mt-1">
								{postsData.length} {postsData.length === 1 ? "post" : "posts"}
							</p>
						)}
					</div>
					<button
						type="button"
						onClick={() => {
							refetch();
							setPostsData(posts);
						}}
						disabled={isFetching}
						className="island-shell rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-semibold text-(--palm) border border-(--chip-line) disabled:opacity-40 disabled:cursor-not-allowed hover:border-(--lagoon) cursor-pointer flex-shrink-0"
					>
						<RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
						Refetch
					</button>
				</div>
			</section>

			<div className="island-shell flex justify-center items-center gap-2 rounded-xl mb-6">
				<input
					id="edit-title-input"
					type="text"
					className="w-full bg-transparent outline-none border-none px-3 py-2.5 text-sm text-(--sea-ink) placeholder:text-(--sea-ink-soft)"
					onChange={(e) =>
						setPostsData(
							posts?.filter((post) =>
								post.title.toLowerCase().includes(e.target.value.toLowerCase()),
							) as Post[],
						)
					}
					placeholder="Search posts by title..."
				/>
				<button
					type="button"
					className="w-8 text-(--sea-ink-soft) hover:text-(--sea-ink)"
				>
					<Search size={15} />
				</button>
				<button
					type="button"
					onClick={() => {
						//clear search input
						const searchInput = document.getElementById(
							"edit-title-input",
						) as HTMLInputElement;
						searchInput.value = "";
						setPostsData(posts);
					}}
					className="w-8 cursor-pointer text-(--sea-ink-soft) hover:text-(--sea-ink)"
				>
					<X size={15} />
				</button>
			</div>

			{isError && (
				<div className="island-shell rounded-2xl p-6 text-center">
					<p className="text-red-500 text-sm mb-4">
						{(error as Error).message}
					</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="island-shell rounded-xl px-4 py-2 text-sm font-semibold text-(--palm) border border-(--chip-line) hover:border-(--lagoon) cursor-pointer"
					>
						Retry
					</button>
				</div>
			)}

			{showDeleteModal && target && (
				<DeleteConfirmModal
					todoText={target.title}
					onConfirm={() => {
						setShowDeleteModal(false);
						setPostsData(postsData?.filter((p) => p.id !== target.id));
					}}
					onCancel={() => setShowDeleteModal(false)}
				/>
			)}

			{showEditModal && target && (
				<EditConfirmModal
					todoText={target.title}
					onConfirm={(updatedTitle) => {
						setShowEditModal(false);
						setPostsData(
							postsData?.map((p) =>
								p.id === target.id ? { ...target, title: updatedTitle } : p,
							),
						);
					}}
					onCancel={() => setShowEditModal(false)}
				/>
			)}

			{postsData && (
				<ul className="space-y-2">
					{postsData.map((post) => (
						<li
							key={post.id}
							className="flex items-center island-shell gap-2 w-full border border-(--line) hover:border-(--lagoon) rounded-xl px-2"
						>
							<Link
								to="/posts/$postId"
								params={{ postId: String(post.id) }}
								className="p-2 flex items-center gap-3 grow min-w-0"
							>
								<span className="text-xs font-mono text-(--sea-ink-soft) w-8 shrink-0">
									#{post.id}
								</span>
								<span className="text-lg text-(--sea-ink-soft)">|</span>
								<span className="text-xs sm:text-sm text-(--sea-ink) capitalize truncate">
									{post.title}
								</span>
							</Link>
							<button
								type="button"
								onClick={() => {
									// setPostsData(postsData.filter((p) => p.id !== post.id))
									setTarget(post);
									setShowDeleteModal(true);
								}}
								className="size-8 rounded-lg flex items-center justify-center text-(--sea-ink-soft) hover:bg-(--surface) hover:text-red-500 cursor-pointer disabled:opacity-40"
								aria-label="Delete post"
							>
								<Trash2 size={14} />
							</button>
							{/* update */}
							<button
								type="button"
								onClick={() => {
									setTarget(post);
									setShowEditModal(true);
								}}
								className="size-8 rounded-lg flex items-center justify-center text-(--sea-ink-soft) hover:bg-(--surface) hover:text-blue-500 cursor-pointer disabled:opacity-40"
							>
								<Pen size={14} />
							</button>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}

function EditConfirmModal({
	todoText,
	onConfirm,
	onCancel,
}: {
	todoText: string;
	onConfirm: (updatedTitle: string) => void;
	onCancel: () => void;
}) {
	const [updatedTitle, setUpdatedTitle] = useState(todoText);

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="edit-modal-title"
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{
				background: "rgba(10, 20, 24, 0.55)",
				backdropFilter: "blur(8px)",
				WebkitBackdropFilter: "blur(8px)",
			}}
		>
			{/* Card — stop click from bubbling to backdrop */}
			<div className="island-shell rounded-2xl p-6 w-full max-w-md shadow-2xl border border-(--line) flex flex-col gap-5">
				{/* Header */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<div className="size-7 rounded-lg bg-(--surface) flex items-center justify-center">
							<Pen size={13} className="text-(--palm)" />
						</div>
						<h2
							id="edit-modal-title"
							className="text-sm font-semibold text-(--sea-ink) tracking-tight"
						>
							Edit Post
						</h2>
					</div>
					<p className="text-xs text-(--sea-ink-soft) pl-9">
						Make changes to the post title below.
					</p>
				</div>

				{/* Divider */}
				<div className="h-px bg-(--line)" />

				{/* Input */}
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="edit-title-input"
						className="text-xs font-medium text-(--sea-ink-soft) uppercase tracking-widest"
					>
						Title
					</label>
					<input
						id="edit-title-input"
						type="text"
						value={updatedTitle}
						onChange={(e) => setUpdatedTitle(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") onConfirm(updatedTitle);
							if (e.key === "Escape") onCancel();
						}}
						className="w-full rounded-xl border border-(--line) bg-(--surface) px-3 py-2.5 text-sm text-(--sea-ink) placeholder:text-(--sea-ink-soft) outline-none focus:border-(--lagoon) focus:ring-2 focus:ring-(--lagoon)/20 transition-all"
					/>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end gap-2 pt-1">
					<button
						type="button"
						onClick={onCancel}
						className="rounded-xl px-4 py-2 text-sm font-medium text-(--sea-ink-soft) border border-(--line) hover:border-(--lagoon) hover:text-(--sea-ink) cursor-pointer transition-all"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => onConfirm(updatedTitle)}
						disabled={!updatedTitle.trim() || updatedTitle === todoText}
						className="island-shell rounded-xl px-4 py-2 text-sm font-semibold text-(--palm) border border-(--chip-line) hover:border-(--lagoon) cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Save changes
					</button>
				</div>
			</div>
		</div>
	);
}
