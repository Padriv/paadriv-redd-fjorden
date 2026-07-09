import { client } from "@/lib/client";

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
		<main className="flex min-h-screen flex-col items-center bg-white px-16 py-32">
			<div className="flex w-full max-w-2xl flex-col gap-6">
				<h1 className="text-3xl font-semibold text-black">Pådrivere</h1>
				<div className="flex flex-col gap-4">
					{records.map((record) => (
						<div
							key={record.id}
							className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-6"
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
							<h2 className="text-xl font-semibold text-black">
								{record.fields.Navn}
							</h2>
							{record.fields.Motivasjon && (
								<p className="text-gray-700">{record.fields.Motivasjon}</p>
							)}
							{record.fields.Kompetanse &&
								record.fields.Kompetanse.length > 0 && (
									<p className="text-sm text-gray-500">
										Kompetanse: {record.fields.Kompetanse.join(", ")}
									</p>
								)}
							{record.fields["Samtykke offentliggjøre kontaktinfo"] && (
								<div className="text-sm text-gray-500">
									<p>{record.fields.Epost}</p>
									<p>{record.fields.Telefon}</p>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
