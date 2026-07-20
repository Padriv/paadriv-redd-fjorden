import type { client } from "@/lib/client";

type PadriverRecord = Awaited<
	ReturnType<typeof client.airtable.padriver.list>
>["records"][number];

type PadriverCardProps = {
	record: PadriverRecord;
};

export default function PadriverCard({ record }: PadriverCardProps) {
	return (
		<div className="flex flex-col gap-inline rounded-2xl border border-border-subtle bg-surface p-6">
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
