import { client } from "@/lib/client";

import Navigationbar from "@/app/_components/Navigationbar";

export default async function Padrivere() {
	let records: Awaited<
		ReturnType<typeof client.airtable.padriver.list>
	>["records"] = [];

	try {
		({ records } = await client.airtable.padriver.list());
	} catch {
		records = [];
	}

	return (
		<>
			<Navigationbar solid />
			<main className="flex min-h-screen flex-col items-center bg-background px-16 py-32">
				<div className="flex w-full max-w-2xl flex-col gap-stack">
					<h1 className="text-heading font-semibold text-ink">Pådrivere</h1>
					{records.length === 0 && (
					<p className="text-body text-muted">
						Klarte ikke å hente noen pådrivere.
					</p>
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
							<h3 className="text-subheading font-semibold text-ink">
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
							{record.fields["Samtykke offentliggjøre kontaktinfo"] && (
								<div className="text-body text-muted">
									<p>{record.fields.Epost}</p>
									<p>{record.fields.Telefon}</p>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
			</main>
		</>
	);
}
