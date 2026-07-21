import type { SKILL_OPTIONS } from "./skills";

const PALETTE = [
	{ bg: "bg-green-dark-forest", border: "border-green-dark-forest" },
	{ bg: "bg-green-deep-pine", border: "border-green-deep-pine" },
	{ bg: "bg-green-forest", border: "border-green-forest" },
	{ bg: "bg-green-birch-leaf", border: "border-green-birch-leaf" },
	{ bg: "bg-green-deep-sea", border: "border-green-deep-sea" },
	{ bg: "bg-green-sage", border: "border-green-sage" },
	{ bg: "bg-green-moss", border: "border-green-moss" },
	{ bg: "bg-green-light-moss", border: "border-green-light-moss" },
	{ bg: "bg-green-sea", border: "border-green-sea" },
	{ bg: "bg-green-olive", border: "border-green-olive" },
] as const;

type SkillColor = (typeof PALETTE)[number];

export const SKILL_COLORS: Record<(typeof SKILL_OPTIONS)[number], SkillColor> =
	{
		"Sosialt entreprenørskap/samfunnsinnovasjon": PALETTE[0],
		Forretningsutvikling: PALETTE[1],
		"Sirkulær økonomi": PALETTE[2],
		Ombruk: PALETTE[3],
		"Arkitektur ": PALETTE[4],
		Byplanlegging: PALETTE[5],
		Nærmiljøutvikling: PALETTE[6],
		"Naturvern og biologisk mangfold": PALETTE[7],
		"Offentlig forvaltning": PALETTE[8],
		IT: PALETTE[9],
		Økonomi: PALETTE[0],
		Lovverk: PALETTE[1],
		Prosjektutvikling: PALETTE[2],
		Kommunikasjon: PALETTE[3],
		Forskningsarbeid: PALETTE[4],
		Energi: PALETTE[5],
		Klimaløsninger: PALETTE[6],
		Byggteknisk: PALETTE[7],
		"Utdanning og opplæring": PALETTE[8],
		"Sosialt arbeid og inkludering": PALETTE[9],
		Eiendom: PALETTE[0],
		"Frivillig arbeid": PALETTE[1],
		Demokrati: PALETTE[2],
	};

export function getFallbackSkillColor(index: number): SkillColor {
	return PALETTE[index % PALETTE.length];
}
