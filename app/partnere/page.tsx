import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";
import PartnereHero from "@/app/partnere/_components/PartnereHero";
import { client } from "@/lib/client";

export default async function Partnere() {
	let partnere: Awaited<ReturnType<typeof client.airtable.partnere.list>> = [];
	let loadFailed = false;

	try {
		partnere = await client.airtable.partnere.list();
	} catch {
		loadFailed = true;
	}

	return (
		<>
			<Navigationbar solid />
			<main className="relative flex min-h-screen w-full flex-col items-center bg-deep-green">
				<PartnereHero partnerCount={partnere.length} loadFailed={loadFailed} />
			</main>
			<Footer variant="green" />
		</>
	);
}
