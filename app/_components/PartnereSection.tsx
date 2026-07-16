import Link from "next/link";
import type { PartnerListItem } from "@/lib/airtable";
import { client } from "@/lib/client";
import Wave from "./Wave";

function PartnerLogo({ partner }: { partner: PartnerListItem }) {
	if (partner.logoUrl) {
		return (
			<img
				src={partner.logoUrl}
				alt={partner.navn}
				className="max-h-10 max-w-full object-contain"
			/>
		);
	}

	// Hvis det ikke er lastet opp logo, vises organisasjonsnavnet som tekst
	return (
		<span className="text-center text-caption font-semibold leading-tight text-copy">
			{partner.navn}
		</span>
	);
}

function LogoCopy({
	partnere,
	copy,
}: {
	partnere: PartnerListItem[];
	copy: "a" | "b";
}) {
	return partnere.map((partner) => (
		<div
			key={`${copy}-${partner.id}`}
			className="flex h-16 w-40 shrink-0 items-center justify-center px-4"
		>
			<PartnerLogo partner={partner} />
		</div>
	));
}

// Matches --animate-marquee duration in globals.css.
const MARQUEE_DURATION_SECONDS = 145;

function MarqueeRow({
	partnere,
	reverse,
}: {
	partnere: PartnerListItem[];
	reverse?: boolean;
}) {
	// Random negative delay: avoids always starting empty at the loop's start.
	const startDelay = `-${(Math.random() * MARQUEE_DURATION_SECONDS).toFixed(1)}s`;

	return (
		<div className="w-full overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
			<div
				style={{ animationDelay: startDelay }}
				className={`flex w-max animate-marquee gap-3 ${
					reverse ? "[animation-direction:reverse]" : ""
				}`}
			>
				<LogoCopy partnere={partnere} copy="a" />
				<LogoCopy partnere={partnere} copy="b" />
			</div>
		</div>
	);
}

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

	const halfwayPoint = Math.ceil(partnere.length / 2);
	const firstRow = partnere.slice(0, halfwayPoint);
	const secondRow = partnere.slice(halfwayPoint);

	return (
		<section className="relative w-full bg-cream px-4 pb-40 pt-40 md:px-28">
			<Wave fillClassName="fill-deep-green" />
			<Wave fillClassName="fill-deep-green" position="bottom" />

			<div className="mx-auto flex w-full max-w-5xl flex-col gap-cluster">
				<div className="flex flex-col gap-tight">
					<h2 className="text-section font-semibold text-green">
						Samarbeid med våre {partnere.length} partnere
					</h2>
					<p className="text-body text-copy">
						Kommuner, bedrifter og organisasjoner som bidrar med ressurser,
						kompetanse og nettverk inn i arbeidet for en frisk Oslofjord.
					</p>
				</div>

				<div className="flex flex-col gap-cluster">
					<MarqueeRow partnere={firstRow} />
					<MarqueeRow partnere={secondRow} reverse />
				</div>

				<Link
					href="/partnere"
					className="self-end text-base font-medium text-green transition-colors hover:text-ink md:text-lg"
				>
					Se alle {partnere.length} partnere →
				</Link>
			</div>
		</section>
	);
}
