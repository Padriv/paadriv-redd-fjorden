const baseUrl = process.env.BASE_URL;
const contentBaseUrl = process.env.AIRTABLE_CONTENT_BASE_URL;
const app = process.env.AIRTABLE_APP_ID;
const table = process.env.AIRTABLE_TABLE_NAME;
const project = process.env.AIRTABLE_PROJECT_ID;
const partnereTable = process.env.AIRTABLE_PARTNERE_TABLE_NAME;
const prosjektportefoljeTable =
	process.env.AIRTABLE_PROSJEKTPORTEFOLJE_TABLE_NAME;

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
				"Samtykke offentliggjøre kontaktinfo": boolean;
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
				"Epost Organisasjon": string;
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
export type Bilde = {
	filename: string;
	contentType: string;
	base64: string;
};

export type CreatePadriverRequest = Padriver & { bilde?: Bilde | null };

const profilbildeField = "Profilbilde";

type CreatePadriverResponse = { records: [{ id: string }] };

const isCreatePadriverResponse = (
	data: unknown,
): data is CreatePadriverResponse => {
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
			Authorization: `Bearer ${process.env.AIRTABLE_PAT_KEY}`,
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
	if (!isCreatePadriverResponse(json)) {
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
				Authorization: `Bearer ${process.env.AIRTABLE_PAT_KEY}`,
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
				Authorization: `Bearer ${process.env.AIRTABLE_PAT_KEY}`,
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

// Bilde sendes ikke med enda - krever et eget uploadAttachment-kall
const createPartner = async (data: Partner) => {
	const body = JSON.stringify(data);

	const response = await fetch(`${baseUrl}/${app}/${partnereTable}`, {
		headers: {
			Authorization: `Bearer ${process.env.AIRTABLE_PAT_KEY}`,
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

	const partnerNavn = data.records[0].fields["Navn på organisasjon"];
	await addPartnerToSamarbeidspartnere(partnerNavn);
};

const uploadAttachment = async (
	recordId: string,
	fieldName: string,
	bilde: Bilde,
) => {
	const response = await fetch(
		`${contentBaseUrl}/${app}/${recordId}/${encodeURIComponent(fieldName)}/uploadAttachment`,
		{
			headers: {
				Authorization: `Bearer ${process.env.AIRTABLE_PAT_KEY}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				contentType: bilde.contentType,
				file: bilde.base64,
				filename: bilde.filename,
			}),
		},
	);
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Airtable svarte med status ${response.status} ved opplasting av bilde: ${errorText}`,
		);
	}
};

const uploadPadriverBilde = (recordId: string, bilde: Bilde) =>
	uploadAttachment(recordId, profilbildeField, bilde);

export type PartnerListItem = {
	id: string;
	navn: string;
	logoUrl?: string;
};

type PartnerResponse = {
	id: string;
	fields: {
		"Navn på organisasjon"?: string;
		Bilde?: { url: string }[];
	};
};

type PartnerResponseWithName = PartnerResponse & {
	fields: { "Navn på organisasjon": string };
};

const hasOrganizationName = (
	record: PartnerResponse,
): record is PartnerResponseWithName =>
	typeof record.fields["Navn på organisasjon"] === "string";

const getPartnere = async (): Promise<PartnerListItem[]> => {
	const response = await fetch(`${baseUrl}/${app}/${partnereTable}`, {
		headers: {
			Authorization: `Bearer ${process.env.AIRTABLE_PAT_KEY}`,
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
	return records.filter(hasOrganizationName).map((record) => ({
		id: record.id,
		navn: record.fields["Navn på organisasjon"],
		logoUrl: record.fields.Bilde?.[0]?.url,
	}));
};

export const airtableClient = {
	padriver: { create: createPadriver, uploadBilde: uploadPadriverBilde },
	partnere: { create: createPartner, list: getPartnere },
};
