import { fyllMal } from "./fyllMal";
import { getPadriverSkjemaCopy, getPartnerSkjemaCopy } from "./skjemaCopy";

export type { PadriverSkjemaCopy, PartnerSkjemaCopy } from "./skjemaCopy";

const baseUrl = process.env.AIRTABLE_BASE_URL;
const app = process.env.AIRTABLE_APP_BASE_ID;
const table = process.env.AIRTABLE_PADRIVERE_TABLE_ID;
const project = process.env.AIRTABLE_PROSJEKT_RECORD_ID;
const partnereTable = process.env.AIRTABLE_PARTNERE_TABLE_ID;
const prosjektportefoljeTable =
	process.env.AIRTABLE_PROSJEKTPORTEFOLJE_TABLE_ID;
const quotesTable = process.env.AIRTABLE_SITAT_TABLE_ID;
const teksterTable = process.env.AIRTABLE_TEKSTER_ID;

export type AirtableAttachment = {
	url: string;
	thumbnails?: {
		large: { url: string };
	};
};

export type Padriver = {
	records: [
		{
			fields: {
				Navn: string;
				Telefon: string;
				Epost: string;
				Motivasjon: string;
				Kompetanse: string[];
				Samtykke: string;
				Profilbilde?: AirtableAttachment[];
			};
		},
	];
};

export type Partner = {
	records: [
		{
			fields: {
				"Navn på organisasjon": string;
				Organisasjonsnummer: number;
				Lokasjon: string;
				"Navn kontaktperson": string;
				"Epost kontaktperson": string;
				"Tlf kontaktperson": string;
				Motivasjon: string;
				Kompetanse: string[];
				"Økonomisk bidrag": string;
				"Annet bidrag": string;
				Samtykke: boolean;
			};
		},
	];
};

const addProjectToFields = (record: Padriver["records"][number]) => {
	return { fields: { ...record.fields, Prosjekt: [project] } };
};

type CreateRecordResponse = { records: [{ id: string }] };

const isCreateRecordResponse = (
	data: unknown,
): data is CreateRecordResponse => {
	if (typeof data !== "object" || data === null || !("records" in data))
		return false;
	const { records } = data as { records: unknown };
	return (
		Array.isArray(records) &&
		records.length > 0 &&
		typeof records[0]?.id === "string"
	);
};

const createPadriver = async (data: Padriver) => {
	const records = data.records.map(addProjectToFields);
	const body = JSON.stringify({ records });

	const response = await fetch(`${baseUrl}/${app}/${table}`, {
		headers: {
			Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
			"Content-Type": "application/json",
		},
		method: "POST",
		body,
	});
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Airtable svarte med status ${response.status}: ${errorText}`,
		);
	}

	const json = await response.json();
	if (!isCreateRecordResponse(json)) {
		throw new Error("Uventet svar fra Airtable ved oppretting av pådriver");
	}
	return json;
};

// Samarbeidspartnere er et Multiple select-felt, ikke et lenke-felt, så vi må hente gjeldende liste og skrive den tilbake med den nye partneren lagt til.
const addPartnerToSamarbeidspartnere = async (partnerNavn: string) => {
	const getResponse = await fetch(
		`${baseUrl}/${app}/${prosjektportefoljeTable}/${project}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
			},
		},
	);

	if (!getResponse.ok) {
		const errorText = await getResponse.text();
		throw new Error(
			`Klarte ikke å hente prosjektraden fra Prosjektportefølje: ${getResponse.status} ${errorText}`,
		);
	}

	const record = await getResponse.json();
	const eksisterende: string[] = record.fields?.Samarbeidspartnere ?? [];

	if (eksisterende.includes(partnerNavn)) {
		return;
	}

	const patchResponse = await fetch(
		`${baseUrl}/${app}/${prosjektportefoljeTable}/${project}`,
		{
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				fields: { Samarbeidspartnere: [...eksisterende, partnerNavn] },
				typecast: true,
			}),
		},
	);

	if (!patchResponse.ok) {
		const errorText = await patchResponse.text();
		throw new Error(
			`Klarte ikke å oppdatere Samarbeidspartnere: ${patchResponse.status} ${errorText}`,
		);
	}
};

const createPartner = async (data: Partner) => {
	const body = JSON.stringify(data);

	const response = await fetch(`${baseUrl}/${app}/${partnereTable}`, {
		headers: {
			Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
			"Content-Type": "application/json",
		},
		method: "POST",
		body,
	});
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Airtable svarte med status ${response.status}: ${errorText}`,
		);
	}

	const json = await response.json();
	if (!isCreateRecordResponse(json)) {
		throw new Error("Uventet svar fra Airtable ved oppretting av partner");
	}

	const partnerNavn = data.records[0].fields["Navn på organisasjon"];
	await addPartnerToSamarbeidspartnere(partnerNavn);

	return json;
};

type PadriverResponseRecord = {
	id: string;
	fields: {
		Navn?: string;
		Telefon?: string;
		Epost?: string;
		Motivasjon?: string;
		Kompetanse?: string[];
		Samtykke?: string;
		Profilbilde?: AirtableAttachment[];
	};
};

type PadriverResponseRecordWithName = PadriverResponseRecord & {
	fields: { Navn: string };
};

const hasNavn = (
	record: PadriverResponseRecord,
): record is PadriverResponseRecordWithName =>
	typeof record.fields.Navn === "string";

export type PadriverListResponse = {
	records: PadriverResponseRecordWithName[];
};

const getPadriver = async (): Promise<PadriverListResponse> => {
	const filterByFormula = `AND(FIND("Oppdrag Fjorden vår", ARRAYJOIN({Prosjekt})), {Godkjent av Pådriv}, {Samtykke synlig Pådriver})`;
	const url = `${baseUrl}/${app}/${table}?filterByFormula=${encodeURIComponent(filterByFormula)}`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
		},
		next: { revalidate: 60 },
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Airtable svarte med status ${response.status} ved henting av pådrivere: ${errorText}`,
		);
	}

	const json = await response.json();
	const { records } = json as { records: PadriverResponseRecord[] };
	return {
		records: records
			.filter(hasNavn)
			.sort((a, b) => a.fields.Navn.localeCompare(b.fields.Navn, "nb")),
	};
};

export type PartnerKontaktperson = {
	navn: string;
	bilde?: AirtableAttachment;
	epost?: string;
	telefon?: string;
};

export type PartnerListItem = {
	id: string;
	navn: string;
	logoUrl: string;
	kompetanse: string[];
	lokasjon?: string;
	kontaktperson?: PartnerKontaktperson;
};

type PartnerResponse = {
	id: string;
	fields: {
		"Navn på organisasjon"?: string;
		Logo?: { url: string }[];
		"Godkjent av Pådriv"?: boolean;
		Kompetanse?: string[];
		Lokasjon?: string;
		"Navn kontaktperson"?: string;
		"Epost kontaktperson"?: string;
		"Tlf kontaktperson"?: string;
		Bilde?: AirtableAttachment[];
		"Samtykke synlig kontaktperson"?: boolean;
	};
};

type PartnerResponseWithNameAndLogo = PartnerResponse & {
	fields: { "Navn på organisasjon": string; Logo: { url: string }[] };
};

const hasNameAndLogo = (
	record: PartnerResponse,
): record is PartnerResponseWithNameAndLogo =>
	typeof record.fields["Navn på organisasjon"] === "string" &&
	Array.isArray(record.fields.Logo) &&
	record.fields.Logo.length > 0;

const getPartnere = async (): Promise<PartnerListItem[]> => {
	const filterByFormula = `{Godkjent av Pådriv}`;
	const url = `${baseUrl}/${app}/${partnereTable}?filterByFormula=${encodeURIComponent(filterByFormula)}`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
		},
		next: { revalidate: 60 },
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Airtable svarte med status ${response.status}: ${errorText}`,
		);
	}

	const json = await response.json();

	const { records } = json as { records: PartnerResponse[] };
	return records
		.filter(hasNameAndLogo)
		.map((record) => {
			const kontaktpersonNavn = record.fields["Navn kontaktperson"];
			const visKontaktperson =
				record.fields["Samtykke synlig kontaktperson"] && kontaktpersonNavn;

			return {
				id: record.id,
				navn: record.fields["Navn på organisasjon"],
				logoUrl: record.fields.Logo[0].url,
				kompetanse: record.fields.Kompetanse ?? [],
				lokasjon: record.fields.Lokasjon,
				kontaktperson: visKontaktperson
					? {
							navn: kontaktpersonNavn,
							bilde: record.fields.Bilde?.[0],
							epost: record.fields["Epost kontaktperson"],
							telefon: record.fields["Tlf kontaktperson"],
						}
					: undefined,
			};
		})
		.sort((a, b) => a.navn.localeCompare(b.navn, "nb"));
};

export type QuoteListItem = {
	id: string;
	name: string;
	quote: string;
};

type QuoteResponse = {
	id: string;
	fields: {
		Navn?: string;
		Sitat?: string;
	};
};

type QuoteResponseWithNameAndQuote = QuoteResponse & {
	fields: { Navn: string; Sitat: string };
};

const hasNameAndQuote = (
	record: QuoteResponse,
): record is QuoteResponseWithNameAndQuote =>
	typeof record.fields.Navn === "string" &&
	typeof record.fields.Sitat === "string";

const getQuotes = async (): Promise<QuoteListItem[]> => {
	const response = await fetch(`${baseUrl}/${app}/${quotesTable}`, {
		headers: {
			Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Airtable svarte med status ${response.status}: ${errorText}`,
		);
	}

	const json = await response.json();

	const { records } = json as { records: QuoteResponse[] };
	return records.filter(hasNameAndQuote).map((record) => ({
		id: record.id,
		name: record.fields.Navn,
		quote: record.fields.Sitat,
	}));
};

type TekstResponse = {
	fields: {
		Nøkkel?: string;
		"Synlig tekst"?: string;
	};
};

const hentTeksterFraAirtable = async (): Promise<Record<string, string>> => {
	try {
		const tekster: Record<string, string> = {};
		let offset: string | undefined;

		// Airtable returnerer maks 100 rader per kall, med en offset til neste
		// side. Uten denne løkken ville tekster utover rad 100 stille falt
		// tilbake til fallback-teksten når Tekster-tabellen vokser forbi 100 rader.
		do {
			const url = new URL(`${baseUrl}/${app}/${teksterTable}`);
			if (offset) url.searchParams.set("offset", offset);

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
				},
				next: { revalidate: 60 },
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error(
					`Airtable svarte med status ${response.status} ved henting av tekster: ${errorText}`,
				);
				return {};
			}

			const json = await response.json();
			const { records, offset: nextOffset } = json as {
				records: TekstResponse[];
				offset?: string;
			};

			for (const record of records) {
				const nokkel = record.fields.Nøkkel;
				const synligTekst = record.fields["Synlig tekst"];
				if (nokkel && synligTekst) {
					tekster[nokkel] = synligTekst;
				}
			}
			offset = nextOffset;
		} while (offset);

		return tekster;
	} catch (error) {
		console.error("Klarte ikke å hente tekster fra Airtable", error);
		return {};
	}
};

export const getTekst = async (
	nokkel: string,
	fallback: string,
): Promise<string> => {
	const tekster = await hentTeksterFraAirtable();
	return tekster[nokkel] ?? fallback;
};
const getTekstMedVerdier = async (
	nokkel: string,
	fallback: string,
	verdier: Record<string, string>,
): Promise<string> => {
	const mal = await getTekst(nokkel, fallback);
	return fyllMal(mal, verdier);
};

const getTekstMedAntall = (
	nokkel: string,
	fallback: string,
	antall: number | null,
): Promise<string> =>
	getTekstMedVerdier(nokkel, fallback, {
		antall: antall === null ? "" : String(antall),
	});

export type Kort = { title: string; description: string };

const getKortSeksjon = async (
	nokkelPrefix: string,
	fallback: { heading: string; intro: string; benefits: Kort[] },
): Promise<{ heading: string; intro: string; benefits: Kort[] }> => {
	const [heading, intro, benefits] = await Promise.all([
		getTekst(`${nokkelPrefix}.overskrift`, fallback.heading),
		getTekst(`${nokkelPrefix}.ingress`, fallback.intro),
		Promise.all(
			fallback.benefits.map((kort, index) =>
				Promise.all([
					getTekst(`${nokkelPrefix}.kort-${index + 1}.tittel`, kort.title),
					getTekst(
						`${nokkelPrefix}.kort-${index + 1}.beskrivelse`,
						kort.description,
					),
				]).then(([title, description]) => ({ title, description })),
			),
		),
	]);
	return { heading, intro, benefits };
};

export type NavigasjonCopy = {
	logo: string;
	padriverLabel: string;
	partnereLabel: string;
	joinLabel: string;
};

export type FooterCopy = {
	slagord: string;
	kontaktOverskrift: string;
	nyhetsbrevLenke: string;
};

const getGlobalCopy = async (): Promise<{
	nav: NavigasjonCopy;
	footer: FooterCopy;
}> => {
	const [
		logo,
		padriverLabel,
		partnereLabel,
		joinLabel,
		slagord,
		kontaktOverskrift,
		nyhetsbrevLenke,
	] = await Promise.all([
		getTekst("navigasjon.logo", "Oppdrag\nfjorden\nvår"),
		getTekst("navigasjon.lenke-padriver", "Pådrivere"),
		getTekst("navigasjon.lenke-partnere", "Partnere"),
		getTekst("navigasjon.knapp", "Bli med"),
		getTekst(
			"footer.slagord",
			"For alle som vil finne gode løsninger og en mer bærekraftig retning – sammen!",
		),
		getTekst("footer.kontakt.overskrift", "Kontakt"),
		getTekst("footer.kontakt.nyhetsbrev", "Motta nyhetsbrev"),
	]);
	return {
		nav: { logo, padriverLabel, partnereLabel, joinLabel },
		footer: { slagord, kontaktOverskrift, nyhetsbrevLenke },
	};
};

export type PartnerKortCopy = {
	kontaktKnapp: string;
	tilbake: string;
	kontaktpersonForMal: string;
	ingenKontaktperson: string;
	taKontaktEpostPrefix: string;
	taKontaktEpostSuffix: string;
};

const getPartnerKortCopy = async (): Promise<PartnerKortCopy> => {
	const [
		kontaktKnapp,
		tilbake,
		kontaktpersonForMal,
		ingenKontaktperson,
		taKontaktEpostPrefix,
		taKontaktEpostSuffix,
	] = await Promise.all([
		getTekst("partnere.kort.knapp", "Ta kontakt"),
		getTekst("partnere.kort.tilbake", "← Tilbake"),
		getTekst("partnere.kort.kontaktperson-for", "Kontaktperson for {navn}"),
		getTekst(
			"partnere.kort.ingen-kontaktperson",
			"Organisasjonen har ingen synlig kontaktperson.",
		),
		getTekst("partnere.kort.ta-kontakt-epost-prefix", "Ta kontakt på"),
		getTekst(
			"partnere.kort.ta-kontakt-epost-suffix",
			"dersom du ønsker å komme i kontakt med dem.",
		),
	]);
	return {
		kontaktKnapp,
		tilbake,
		kontaktpersonForMal,
		ingenKontaktperson,
		taKontaktEpostPrefix,
		taKontaktEpostSuffix,
	};
};

export type KontaktlenkerCopy = { epostLabel: string; telefonLabel: string };

const getKontaktlenkerCopy = async (): Promise<KontaktlenkerCopy> => {
	const [epostLabel, telefonLabel] = await Promise.all([
		getTekst("padriver-partner.kontaktlenker.epost", "E-post"),
		getTekst("padriver-partner.kontaktlenker.telefon", "Telefon"),
	]);
	return { epostLabel, telefonLabel };
};

export const airtableClient = {
	padriver: {
		create: createPadriver,
		list: getPadriver,
	},
	partnere: {
		create: createPartner,
		list: getPartnere,
	},
	quotes: {
		list: getQuotes,
	},
	tekster: {
		get: getTekst,
		getMedAntall: getTekstMedAntall,
		getKortSeksjon,
		getGlobalCopy,
		getPartnerSkjemaCopy,
		getPadriverSkjemaCopy,
		getPartnerKortCopy,
		getKontaktlenkerCopy,
	},
};
