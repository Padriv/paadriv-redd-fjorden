import { client } from "@/lib/client";

import Footer from "@/app/_components/Footer";
import Navigationbar from "@/app/_components/Navigationbar";

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
			<main className="flex min-h-screen flex-col items-center bg-background px-4 py-32 md:px-28">
				<div className="flex w-full max-w-5xl flex-col gap-loose">
					<h1 className="text-heading font-semibold text-ink">Pådrivere</h1>
					{loadFailed && (
						<p className="text-body text-muted">
							Beklager, vi klarer dessverre ikke å laste Pådrivere akkurat nå.
							Prøv igjen om litt.
						</p>
					)}
					{!loadFailed && records.length === 0 && (
						<p className="text-body text-muted">Ingen Pådrivere å vise ennå.</p>
					)}
					<div className="flex flex-col gap-group">
						{records.map((record) => (
							<div
								key={record.id}
								className="flex flex-col gap-inline rounded-2xl border border-border-subtle bg-surface p-6"
							>
								{record.fields.Profilbilde?.[0] && (
									<img
										src={
											record.fields.Profilbilde[0].thumbnails?.large.url ??
											record.fields.Profilbilde[0].url
										}
										alt={record.fields.Navn}
										className="h-24 w-24 rounded-full object-cover"
									/>
								)}
								<h3 className="text-subheading font-semibold text-green">
									{record.fields.Navn}
								</h3>
								{record.fields.Motivasjon && (
									<p className="text-body text-copy">
										{record.fields.Motivasjon}
									</p>
								)}
								{record.fields.Kompetanse &&
									record.fields.Kompetanse.length > 0 && (
										<p className="text-body text-muted">
											Kompetanse: {record.fields.Kompetanse.join(", ")}
										</p>
									)}
								<div className="text-body text-muted">
									<p>{record.fields.Epost}</p>
									<p>{record.fields.Telefon}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
			<Footer variant="green" />
		</>
	);
}
