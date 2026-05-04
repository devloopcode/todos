import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	component: RootLayout,
});

function RootLayout() {
	const { queryClient } = Route.useRouteContext();
	return (
		<QueryClientProvider client={queryClient}>
			<NavBar />
			<Outlet />
			<TanStackDevtools
				config={{ position: "bottom-right" }}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</QueryClientProvider>
	);
}

function NavBar() {
	return (
		<header
			className="sticky top-0 z-10 flex items-center gap-6 px-4 py-3"
			style={{
				background: "var(--header-bg)",
				backdropFilter: "blur(8px)",
				borderBottom: "1px solid var(--line)",
			}}
		>
			<span className="display-title text-sm font-bold text-(--sea-ink)">
				Posts App
			</span>
			<nav className="flex items-center gap-5">
				<Link
					to="/"
					activeOptions={{ exact: true }}
					className="nav-link text-sm"
					activeProps={{ className: "is-active" }}
				>
					Todos
				</Link>
				<Link
					to="/posts"
					className="nav-link text-sm"
					activeProps={{ className: "is-active" }}
				>
					Posts
				</Link>
			</nav>
		</header>
	);
}
