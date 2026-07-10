import Link from "next/link";
import { client } from "@/lib/client";

export default async function PartnereSection() {
	let partnere: Awaited<ReturnType<typeof client.airtable.partnere.list>> = [];

	try {
		partnere = await client.airtable.partnere.list();
	} catch {
		return null;
	}

	if (partnere.length === 0) {
		return null;
	}

	return (
		<section className="flex w-full max-w-4xl flex-col gap-6">
			<h2 className="text-section font-semibold text-cream">
				Våre {partnere.length} partnere
			</h2>

			<div className="w-full overflow-hidden">
				<div className="flex w-max animate-marquee gap-8">
					{partnere.map((partner) => (
						<div
							key={partner.id}
							className="flex h-16 w-40 flex-shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-white px-4"
						>
							{partner.logoUrl ? (
								<img
									src={partner.logoUrl}
									alt={partner.navn}
									className="max-h-10 max-w-full object-contain"
								/>
							) : (
								// Hvis det ikke er lastet opp logo, vis organisasjonsnavnet som tekst
								<span className="text-center text-body font-semibold text-copy">
									{partner.navn}
								</span>
							)}
						</div>
					))}
				</div>
			</div>

			<Link
				href="/partnere"
				className="self-end text-link font-medium text-muted-inverse transition-colors hover:text-white"
			>
				Se alle →
			</Link>
		</section>
	);
}
