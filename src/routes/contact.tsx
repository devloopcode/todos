import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
	component: Contact,
});

function Contact() {
	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<h1>Hello "/contact"!</h1>
		</main>
	);
}
