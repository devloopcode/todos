import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmModal } from "#/components/DeleteConfirmModal";
import { fetchPost, postQueryKey } from "#/lib/posts";

export const Route = createFileRoute("/posts/$postId")({
	component: PostDetailPage,
});

function PostDetailPage() {
	const { postId } = Route.useParams();
	const id = Number(postId);
	// const queryClient = useQueryClient();
	const navigate = useNavigate();

	// const [isEditing, setIsEditing] = useState(false);
	// const [editTitle, setEditTitle] = useState("");
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const {
		data: post,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: postQueryKey(id),
		queryFn: () => fetchPost(id),
	});

	// const updateMutation = useMutation({
	// 	mutationFn: (title: string) => updatePostTitle(id, title),
	// 	onSuccess: (updated) => {
	// 		queryClient.setQueryData(postQueryKey(id), updated);
	// 		queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
	// 		setIsEditing(false);
	// 	},
	// });

	// const deleteMutation = useMutation({
	// 	mutationFn: () => deletePost(id),
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
	// 		navigate({ to: "/posts" });
	// 	},
	// });
	const deleteMutation = () => navigate({ to: "/posts" });

	// const handleEditStart = () => {
	// 	setEditTitle(post?.title ?? "");
	// 	setIsEditing(true);
	// };

	// const handleSave = () => {
	// 	const trimmed = editTitle.trim();
	// 	if (trimmed && trimmed !== post?.title) {
	// 		updateMutation.mutate(trimmed);
	// 	} else {
	// 		setIsEditing(false);
	// 	}
	// };

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<div className="mb-4">
				<Link
					to="/posts"
					className="inline-flex items-center gap-1.5 text-sm text-(--sea-ink-soft) hover:text-(--sea-ink)"
				>
					<ArrowLeft size={14} />
					Back to posts
				</Link>
			</div>

			{isLoading && (
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
			)}

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

			{post && (
				<section className="island-shell rounded-2xl p-6 sm:p-8">
					<div className="flex items-start justify-between gap-4 mb-4">
						<span className="island-kicker">Post #{post.id}</span>
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={() => refetch()}
								className="size-8 rounded-lg flex items-center justify-center text-(--sea-ink-soft) hover:bg-(--surface) cursor-pointer"
								aria-label="Refetch post"
							>
								<RefreshCw size={14} />
							</button>
							{/* <button
								type="button"
								onClick={() => setShowDeleteModal(true)}
								disabled={deleteMutation.isPending}
								className="size-8 rounded-lg flex items-center justify-center text-(--sea-ink-soft) hover:bg-(--surface) hover:text-red-500 cursor-pointer disabled:opacity-40"
								aria-label="Delete post"
							>
								<Trash2 size={14} />
							</button> */}
						</div>
					</div>
					<button
						type="button"
						// onClick={handleEditStart}
						className="text-left mb-6 group w-full"
						aria-label="Click to edit title"
					>
						<h1 className="display-title text-2xl font-bold text-(--sea-ink) capitalize group-hover:text-(--lagoon) transition-colors">
							{post.title}
						</h1>
						{/* <span className="text-xs text-(--sea-ink-soft) mt-0.5 block">
							click to edit title
						</span> */}
					</button>

					{/* {isEditing ? (
						<div className="mb-6">
							<input
								// biome-ignore lint/a11y/noAutofocus: user explicitly triggered edit mode
								autoFocus
								value={editTitle}
								onChange={(e) => setEditTitle(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") handleSave();
									if (e.key === "Escape") setIsEditing(false);
								}}
								className="w-full bg-transparent border-b border-(--lagoon) outline-none text-2xl font-bold text-(--sea-ink) pb-1 capitalize"
							/>
							<div className="flex gap-2 mt-3">
								<button
									type="button"
									onClick={handleSave}
									disabled={updateMutation.isPending}
									className="island-shell rounded-lg px-3 py-1.5 text-xs font-semibold text-(--palm) border border-(--chip-line) hover:border-(--lagoon) cursor-pointer disabled:opacity-40"
								>
									{updateMutation.isPending ? "Saving…" : "Save"}
								</button>
								<button
									type="button"
									onClick={() => setIsEditing(false)}
									className="island-shell rounded-lg px-3 py-1.5 text-xs text-(--sea-ink-soft) border border-(--line) hover:border-(--lagoon) cursor-pointer"
								>
									Cancel
								</button>
							</div>
							{updateMutation.isError && (
								<p className="text-xs text-red-500 mt-2">
									{(updateMutation.error as Error).message}
								</p>
							)}
						</div>
					) : (
						<button
							type="button"
							onClick={handleEditStart}
							className="text-left mb-6 group w-full"
							aria-label="Click to edit title"
						>
							<h1 className="display-title text-2xl font-bold text-(--sea-ink) capitalize group-hover:text-(--lagoon) transition-colors">
								{post.title}
							</h1>
							<span className="text-xs text-(--sea-ink-soft) mt-0.5 block">
								click to edit title
							</span>
						</button>
					)} */}

					<p className="text-sm text-(--sea-ink-soft) leading-relaxed">
						{post.body}
					</p>

					<p className="text-xs text-(--sea-ink-soft) mt-6 pt-4 border-t border-(--line)">
						Author · User {post.userId}
					</p>
				</section>
			)}

			{showDeleteModal && post && (
				<DeleteConfirmModal
					todoText={post.title}
					onConfirm={() => {
						setShowDeleteModal(false);
						// deleteMutation.mutate();
						deleteMutation();
					}}
					onCancel={() => setShowDeleteModal(false)}
				/>
			)}
		</main>
	);
}
