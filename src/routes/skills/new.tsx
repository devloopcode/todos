import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/skills/new")({
	component: NewSkill,
});

function NewSkill() {
	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<h1>Hello "/skills/new"!</h1>
		</main>
	);
}
