import type { client } from "@/lib/client";

type PadriverRecord = Awaited<
	ReturnType<typeof client.airtable.padriver.list>
>["records"][number];

type PadriverCardProps = {
	record: PadriverRecord;
};

function getInitials(name: string): string {
	const words = name.trim().split(/\s+/).filter(Boolean);
	const first = words[0]?.[0] ?? "";
	const last = words.length > 1 ? words[words.length - 1][0] : "";
	return `${first}${last}`.toUpperCase();
}

export default function PadriverCard({ record }: PadriverCardProps) {
	const photo = record.fields.Profilbilde?.[0];

	return (
		<div className="flex flex-col items-center gap-inline rounded-2xl border border-border-subtle bg-cream p-6 text-center">
			{photo ? (
				<img
					src={photo.thumbnails?.large.url ?? photo.url}
					alt={record.fields.Navn}
					className="h-24 w-24 rounded-full object-cover"
				/>
			) : (
				<div className="flex h-24 w-24 items-center justify-center rounded-full bg-border-subtle text-subheading font-semibold text-muted">
					{getInitials(record.fields.Navn)}
				</div>
			)}
			<h3 className="text-subheading font-semibold text-green">
				{record.fields.Navn}
			</h3>
			{record.fields.Motivasjon && (
				<p className="text-body text-copy">{record.fields.Motivasjon}</p>
			)}
			{record.fields.Kompetanse && record.fields.Kompetanse.length > 0 && (
				<p className="text-body text-muted">
					Kompetanse: {record.fields.Kompetanse.join(", ")}
				</p>
			)}
			<div className="text-body text-muted">
				<p>{record.fields.Epost}</p>
				<p>{record.fields.Telefon}</p>
			</div>
		</div>
	);
}
