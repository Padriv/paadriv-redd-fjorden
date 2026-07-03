const baseUrl = process.env.BASE_URL;
const contentBaseUrl = process.env.AIRTABLE_CONTENT_BASE_URL;
const app = process.env.AIRTABLE_APP_ID;
const table = process.env.AIRTABLE_TABLE_NAME;
const project = process.env.AIRTABLE_PROJECT_ID;
const partnereTable = process.env.AIRTABLE_PARTNERE_TABLE_NAME;

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

const isCreatePadriverResponse = (data: unknown): data is CreatePadriverResponse => {
	if (typeof data !== "object" || data === null || !("records" in data)) return false;
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

// Partnere-tabellen kobles foreløpig ikke mot et Prosjekt-felt, skal etter hvert kobles til Prosjektportefølje/samarbeidspartnere-kolonnen,
//Bilde-feltet sendes heller ikke, fordi det krever et eget uploadAttachment-kall mot Airtable etter at recorden er opprettet
const createPartner = async (data: Partner) => {
	const body = JSON.stringify(data);

	await fetch(`${baseUrl}/${app}/${partnereTable}`, {
		headers: {
			Authorization: `Bearer ${process.env.AIRTABLE_PAT_KEY}`,
			"Content-Type": "application/json",
		},
		method: "POST",
		body,
	});
};


const uploadAttachment = async (recordId: string, fieldName: string, bilde: Bilde) => {
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

export const airtableClient = {
	padriver: { create: createPadriver, uploadBilde: uploadPadriverBilde },
	partnere: { create: createPartner },
};
