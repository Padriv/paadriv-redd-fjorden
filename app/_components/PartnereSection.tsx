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

	// Listen limes sammen med seg selv to ganger, sånn at logoene kan skli i loop uten at det ser ut som de hopper/resetter.
	// "-a" og "-b" er bare et navnelapp-triks så React ikke blir forvirret av at samme partner vises to ganger.
	const loop = [
		...partnere.map((partner) => ({ ...partner, key: `${partner.id}-a` })),
		...partnere.map((partner) => ({ ...partner, key: `${partner.id}-b` })),
	];

	return (
		<section className="flex w-full max-w-4xl flex-col gap-6">
			<h2 className="text-2xl font-semibold text-black">
				Våre {partnere.length} partnere
			</h2>

			<div className="w-full overflow-hidden">
				<div className="flex w-max animate-marquee gap-8">
					{loop.map((partner) => (
						<div
							key={partner.key}
							className="flex h-16 w-40 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4"
						>
							{partner.logoUrl ? (
								// biome-ignore lint/performance/noImgElement: logoene kommer fra Airtable, ikke fra /public
								<img
									src={partner.logoUrl}
									alt={partner.navn}
									className="max-h-10 max-w-full object-contain"
								/>
							) : (
								//Hvis det ikke er lastet opp logo, vis organisasjonsnavnet som tekst
								<span className="text-center text-sm font-semibold text-zinc-700">
									{partner.navn}
								</span>
							)}
						</div>
					))}
				</div>
			</div>

			<Link
				href="/partnere"
				className="self-end text-sm font-medium text-zinc-500 transition-colors hover:text-black"
			>
				Se alle →
			</Link>
		</section>
	);
}
