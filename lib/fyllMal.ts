export function fyllMal(mal: string, verdier: Record<string, string>): string {
	const medVerdier = Object.entries(verdier).reduce(
		(tekst, [plassholder, verdi]) =>
			tekst.replaceAll(`{${plassholder}}`, verdi),
		mal,
	);
	return medVerdier.replace(/\s+/g, " ").trim();
}
