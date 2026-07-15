import { NextResponse } from "next/server";
import type { Partner } from "@/lib/airtable";
import { client } from "@/lib/client";

export async function GET() {
	const partnere = await client.airtable.partnere.list();
	return NextResponse.json({ partnere });
}

export async function POST(request: Request) {
	const partnerData: Partner = await request.json();

	try {
		await client.airtable.partnere.create(partnerData);
	} catch {
		return NextResponse.json({ success: false }, { status: 502 });
	}

	return NextResponse.json({ success: true }, { status: 201 });
}
