const baseUrl = process.env.BASE_URL;
const app = process.env.AIRTABLE_APP_ID;
const table = process.env.AIRTABLE_TABLE_NAME;
const project = process.env.AIRTABLE_PROJECT_ID;

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

const addProjectToFields = (record: Padriver['records'][number]) => {
    return { ...record.fields, Prosjekt: [project]}
}

const createPadriver = async (data: Padriver) => {
    const records = data.records.map(addProjectToFields)
    const body = JSON.stringify({ records })

    console.log("###############", body)
	const response = await fetch(`${baseUrl}/${app}/${table}`, {
		headers: {
			Authorization: `Bearer ${process.env.AIRTABLE_PAT_KEY}`,
			"Content-Type": "application/json",
		},
		method: "POST",
		body
	});
    console.log("airtable response", response)
};

export const airtableClient = {
	padriver: { create: createPadriver },
};
