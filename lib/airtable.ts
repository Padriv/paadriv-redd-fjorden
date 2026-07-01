const baseUrl = process.env.BASE_URL;
const app = process.env.AIRTABLE_APP_ID;
const table = process.env.AIRTABLE_TABLE_NAME;

export type Padriver = {
	records: [
		{
			fields: {
				Navn: string;
				Telefon: string;
				Epost: string;
				Kompetanse: string[];
				Prosjekt: string[];
				Samtykke: string;
				"Samtykke offentliggjøre kontaktinfo": boolean;
			};
		},
	];
};

const createPadriver = async (data: Padriver) => {
	await fetch(`${baseUrl}/${app}/${table}`, {
		headers: {
			Authorization: `Bearer ${process.env.AIRTABLE_PAT_KEY}`,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(data),
	});
};

export const airtableClient = {
	padriver: { create: createPadriver },
};
