import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/skills/")({
	component: Skills,
});

function Skills() {
	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<h1>Hello "/skills/"!</h1>
		</main>
	);
}
