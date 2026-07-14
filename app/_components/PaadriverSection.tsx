import Link from "next/link";
import { client } from "@/lib/client";
import Wave from "./Wave";

type PadriverRecord = Awaited<
	ReturnType<typeof client.airtable.padriver.list>
>["records"][number];

type Slot =
	| { kind: "photo"; record: PadriverRecord }
	| { kind: "empty"; key: string }
	| { kind: "invisible"; key: string };

type SlotKind = "photo" | "empty" | "invisible";

const CIRCLE_BASE = "aspect-square w-full max-w-20";

// 4x3-grid: tre plasser er låst til alltid å være tomme sirkler (aldri
// bilde), og to plasser er helt usynlige (ingen sirkel i det hele tatt).
// Resten fylles med opptil 7 tilfeldig valgte pådrivere som har profilbilde.
const SLOT_PATTERN: SlotKind[] = [
	"empty", // låst — aldri bilde
	"photo",
	"empty", // låst — aldri bilde
	"photo",
	"photo",
	"photo",
	"invisible",
	"photo",
	"photo",
	"invisible",
	"photo",
	"empty", // låst — aldri bilde
];

function shuffle<T>(items: T[]): T[] {
	const shuffled = [...items];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

function buildGrid(photos: PadriverRecord[]): Slot[] {
	const selected = shuffle(photos);
	let photoIndex = 0;

	// Nøkkelen bygges her, fra posisjonen i det faste mønsteret — ikke i JSX-en
	// som rendrer resultatet. Mønsteret endrer seg aldri, så posisjonen er en
	// trygg, stabil nøkkel selv om vi ikke bruker den direkte som React-key.
	return SLOT_PATTERN.map((slotKind, i) => {
		if (slotKind === "photo" && photoIndex < selected.length) {
			return { kind: "photo", record: selected[photoIndex++] };
		}
		if (slotKind === "invisible")
			return { kind: "invisible", key: `slot-${i}` };
		return { kind: "empty", key: `slot-${i}` };
	});
}

export default async function PaadriverSection() {
	let records: Awaited<
		ReturnType<typeof client.airtable.padriver.list>
	>["records"] = [];
	let loadFailed = false;

	try {
		({ records } = await client.airtable.padriver.list());
	} catch {
		loadFailed = true;
	}

	const withPhoto = records.filter((record) => record.fields.Profilbilde?.[0]);
	const grid = buildGrid(withPhoto);

	return (
		<section className="relative w-full bg-cream px-16 pb-56 pt-56">
			<Wave fillClassName="fill-deep-green" />
			<Wave fillClassName="fill-deep-green" position="bottom" />

			<div className="mx-auto grid w-full max-w-2xl grid-cols-1 items-center gap-cluster md:grid-cols-2">
				<div className="flex flex-col gap-group">
					<h2 className="text-section font-semibold text-green">
						Menneskene bak
					</h2>
					<p className="text-body text-copy">
						Ildsjeler, fagfolk og naboer som allerede har tatt tak. Bla i
						profilene og finn noen å slå følge med.
					</p>
					<Link
						href="/padriver"
						className="text-link font-medium text-ink transition-colors hover:text-green"
					>
						{loadFailed
							? "Se alle pådrivere →"
							: `Se alle ${records.length} pådrivere →`}
					</Link>
				</div>

				<div className="mx-auto grid w-fit grid-cols-4 gap-group">
					{grid.map((slot) => {
						if (slot.kind === "photo") {
							return (
								<img
									key={slot.record.id}
									src={
										slot.record.fields.Profilbilde?.[0].thumbnails?.large.url ??
										slot.record.fields.Profilbilde?.[0].url
									}
									alt={slot.record.fields.Navn}
									className={`${CIRCLE_BASE} rounded-full object-cover`}
								/>
							);
						}
						if (slot.kind === "empty") {
							return (
								<div
									key={slot.key}
									className={`${CIRCLE_BASE} rounded-full border border-border`}
								/>
							);
						}
						return <div key={slot.key} className={CIRCLE_BASE} />;
					})}
				</div>
			</div>
		</section>
	);
}
