import { NextResponse } from "next/server";
import { client } from "@/lib/client";
import type { CreatePadriverRequest } from "@/lib/airtable";

export async function POST(request: Request) {
	const { bilde, ...padriverData }: CreatePadriverRequest = await request.json();

	try {
		const result = await client.airtable.padriver.create(padriverData);
		const recordId = result.records[0].id;
		if (bilde && recordId) {
			await client.airtable.padriver.uploadBilde(recordId, bilde);
		}
	} catch (error) {
		return NextResponse.json({ success: false }, { status: 502 });
	}

	return NextResponse.json({ success: true }, { status: 201 });
}
