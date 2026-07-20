import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";
import { client } from "@/lib/client";
import PadriverCard from "./_components/PadriverCard";

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
			<Navigationbar solid />
			<main className="flex min-h-screen flex-col items-center bg-deep-green px-4 py-32 md:px-28">
				<div className="flex w-full max-w-5xl flex-col gap-loose">
					<h1 className="text-heading font-semibold text-cream">Pådrivere</h1>
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
					<div className="flex flex-col gap-group">
						{records.map((record) => (
							<PadriverCard key={record.id} record={record} />
						))}
					</div>
				</div>
			</main>
			<Footer variant="cream" />
		</>
	);
}
