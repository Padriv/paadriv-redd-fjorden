import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";
import PartnereHero from "@/app/partnere/_components/PartnereHero";
import { RevealGroup, RevealItem } from "@/components/RevealGroup";
import { client } from "@/lib/client";
import PartnerCard from "./_components/PartnerCard";

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
			<Navigationbar />
			<main className="relative flex min-h-screen w-full flex-col items-center bg-deep-green">
				<PartnereHero partnerCount={partnere.length} loadFailed={loadFailed} />
				<div className="flex w-full flex-col items-center px-4 pb-32 md:px-28">
					<div className="flex w-full max-w-5xl flex-col gap-loose">
						{loadFailed && (
							<p className="text-body text-muted-inverse">
								Beklager, vi klarer dessverre ikke å laste partnere akkurat nå.
								Prøv igjen om litt.
							</p>
						)}
						{!loadFailed && partnere.length === 0 && (
							<p className="text-body text-muted-inverse">
								Ingen partnere å vise ennå.
							</p>
						)}
						<RevealGroup className="grid grid-cols-1 gap-group sm:grid-cols-2 lg:grid-cols-4">
							{partnere.map((partner, index) => (
								<RevealItem
									key={partner.id}
									delayMs={Math.min(index * 60, 600)}
								>
									<PartnerCard partner={partner} />
								</RevealItem>
							))}
						</RevealGroup>
					</div>
				</div>
			</main>
			<Footer variant="cream" />
		</>
	);
}
