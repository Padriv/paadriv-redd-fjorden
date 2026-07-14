import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";

export default function Partnere() {
	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-10 py-32 md:px-28">
				<div className="flex max-w-5xl flex-col gap-loose">
					<h1 className="text-heading font-semibold text-ink">Våre partnere</h1>
					<p className="text-lead leading-8 text-copy">
						Oversikt over alle partnere
					</p>
				</div>
			</main>
			<Footer variant="green" />
		</>
	);
}
