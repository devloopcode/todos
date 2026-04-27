import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import appCss from "../styles.css?url";

// Runs once before React hydrates to apply the persisted theme class
// without a flash. Inlined as a raw string so it executes synchronously.
const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		head: () => ({
			meta: [
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ title: "TanStack Start Starter" },
			],
			links: [{ rel: "stylesheet", href: appCss }],
		}),
		// shellComponent owns the entire HTML document (<html>, <head>, <body>)
		shellComponent: RootDocument,
		// component is the in-page layout rendered inside <body> for every route
		component: RootLayout,
	},
);

// --- Layout (rendered for every route) ---

function RootLayout() {
	const { queryClient } = Route.useRouteContext();
	return (
		<QueryClientProvider client={queryClient}>
			<NavBar />
			{/* Outlet renders the matched child route's component */}
			<Outlet />
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
				{/*
				 * activeOptions.exact prevents "/" from matching every route.
				 * activeProps.className is merged into className only when active,
				 * which triggers the underline animation via .is-active in styles.css.
				 */}
				{/* <Link
					to="/"
					activeOptions={{ exact: true }}
					className="nav-link text-sm"
					activeProps={{ className: "is-active" }}
				>
					SPA Mode
				</Link>
				<Link
					to="/ssr"
					className="nav-link text-sm"
					activeProps={{ className: "is-active" }}
				>
					SSR Mode
				</Link> */}
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

// --- HTML shell (wraps the entire document) ---

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
				{children}

				<TanStackDevtools
					config={{ position: "bottom-right" }}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
