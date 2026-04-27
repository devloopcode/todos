/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { fetchPosts, POSTS_QUERY_KEY } from "#/lib/posts";

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

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<section className="island-shell rounded-2xl p-6 sm:p-8 mb-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<span className="island-kicker">TanStack Query</span>
						<h1 className="display-title mt-2 text-4xl font-bold text-(--sea-ink)">
							Posts
						</h1>
						{posts && (
							<p className="text-sm text-(--sea-ink-soft) mt-1">
								{posts.length} posts from JSONPlaceholder
							</p>
						)}
					</div>
					<button
						type="button"
						onClick={() => refetch()}
						disabled={isFetching}
						className="island-shell rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-semibold text-(--palm) border border-(--chip-line) disabled:opacity-40 disabled:cursor-not-allowed hover:border-(--lagoon) cursor-pointer flex-shrink-0"
					>
						<RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
						Refetch
					</button>
				</div>
			</section>

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

			{posts && (
				<ul className="space-y-2">
					{posts.map((post) => (
						<li key={post.id}>
							<Link
								to="/posts/$postId"
								params={{ postId: String(post.id) }}
								className="island-shell rounded-xl px-4 py-3 flex items-center gap-3 border border-(--line) hover:border-(--lagoon) transition-colors"
							>
								<span className="text-xs font-mono text-(--sea-ink-soft) w-8 flex-shrink-0">
									#{post.id}
								</span>
								<span className="text-sm text-(--sea-ink) capitalize truncate">
									{post.title}
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
