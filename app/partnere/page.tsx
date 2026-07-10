import Navigationbar from "@/app/_components/Navigationbar";

export default function Partnere() {
	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-16 py-32">
				<div className="flex max-w-2xl flex-col gap-stack">
					<h1 className="text-heading font-semibold text-ink">Våre partnere</h1>
					<p className="text-lead leading-8 text-copy">
						Oversikt over alle partnere
					</p>
				</div>
			</main>
		</>
	);
}