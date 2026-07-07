import { NextResponse } from "next/server";
import type { CreatePartnerRequest } from "@/lib/airtable";
import { client } from "@/lib/client";

export async function POST(request: Request) {
	const { bilde, logo, ...partnerData }: CreatePartnerRequest =
		await request.json();

	try {
		const result = await client.airtable.partnere.create(partnerData);
		const recordId = result.records[0].id;
		if (bilde && recordId) {
			await client.airtable.partnere.uploadImage(recordId, bilde);
		}
		if (logo && recordId) {
			await client.airtable.partnere.uploadLogo(recordId, logo);
		}
	} catch (error) {
		return NextResponse.json({ success: false }, { status: 502 });
	}

	return NextResponse.json({ success: true }, { status: 201 });
}
