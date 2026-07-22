const baseUrl = process.env.AIRTABLE_BASE_URL;
const app = process.env.AIRTABLE_APP_BASE_ID;
const table = process.env.AIRTABLE_PADRIVERE_TABLE_ID;
const project = process.env.AIRTABLE_PROSJEKT_RECORD_ID;
const partnereTable = process.env.AIRTABLE_PARTNERE_TABLE_ID;
const prosjektportefoljeTable =
	process.env.AIRTABLE_PROSJEKTPORTEFOLJE_TABLE_ID;
const quotesTable = process.env.AIRTABLE_SITAT_TABLE_ID;

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
		Logo?: AirtableAttachment[];
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
	const filterByFormula = `AND(FIND("Oppdrag Fjorden vår", ARRAYJOIN({Prosjekt})), {Godkjent av Pådriv})`;
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
	return { records: records.filter(hasNavn) };
};

export type PartnerListItem = {
	id: string;
	navn: string;
	logoUrl: string;
};

type PartnerResponse = {
	id: string;
	fields: {
		"Navn på organisasjon"?: string;
		Logo?: { url: string }[];
		"Godkjent av Pådriv"?: boolean;
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
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Airtable svarte med status ${response.status}: ${errorText}`,
		);
	}

	const json = await response.json();

	const { records } = json as { records: PartnerResponse[] };
	return records.filter(hasNameAndLogo).map((record) => ({
		id: record.id,
		navn: record.fields["Navn på organisasjon"],
		logoUrl: record.fields.Logo[0].url,
	}));
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
};
