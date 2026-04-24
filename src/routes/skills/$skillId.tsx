import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/skills/$skillId")({
	component: Skill,
});

function Skill() {
	const { skillId } = Route.useParams();
	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<h1>Hello "{skillId}"!</h1>
		</main>
	);
}
