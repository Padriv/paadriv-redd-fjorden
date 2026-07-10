import Link from "next/link";

export default function Partnere() {
	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-16 py-32">
			<Link
				href="/"
				className="absolute left-16 top-10 flex w-fit items-center gap-2 text-link text-muted transition-colors hover:text-ink"
			>
				← Tilbake
			</Link>
			<div className="flex max-w-2xl flex-col gap-6">
				<h1 className="text-heading font-semibold text-ink">Våre partnere</h1>
				<p className="text-lead leading-8 text-copy">
					Oversikt over alle partnere
				</p>
			</div>
		</main>
	);
}
