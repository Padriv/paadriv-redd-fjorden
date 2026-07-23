import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";
import { RevealGroup, RevealItem } from "@/components/RevealGroup";
import { client } from "@/lib/client";
import PadriverCard from "./_components/PadriverCard";
import PadriverHero from "./_components/PadriverHero";

export default async function Padrivere() {
	let records: Awaited<
		ReturnType<typeof client.airtable.padriver.list>
	>["records"] = [];
	let loadFailed = false;

	try {
		({ records } = await client.airtable.padriver.list());
	} catch {
		loadFailed = true;
	}

	return (
		<>
			<Navigationbar />
			<main className="relative flex min-h-screen w-full flex-col items-center bg-deep-green">
				<PadriverHero padriverCount={records.length} loadFailed={loadFailed} />
				<div className="flex w-full flex-col items-center px-4 pb-32 md:px-28">
					<div className="flex w-full max-w-5xl flex-col gap-loose">
						{loadFailed && (
							<p className="text-body text-muted-inverse">
								Beklager, vi klarer dessverre ikke å laste Pådrivere akkurat nå.
								Prøv igjen om litt.
							</p>
						)}
						{!loadFailed && records.length === 0 && (
							<p className="text-body text-muted-inverse">
								Ingen Pådrivere å vise ennå.
							</p>
						)}
						<RevealGroup className="grid grid-cols-1 gap-group sm:grid-cols-2 lg:grid-cols-3">
							{records.map((record, index) => (
								<RevealItem key={record.id} delayMs={Math.min(index * 60, 600)}>
									<PadriverCard record={record} />
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
