import { NextResponse } from "next/server";
import { client } from "@/lib/client";

export async function GET() {
	const partnere = await client.airtable.partnere.list();
	return NextResponse.json({ partnere });
}

export async function POST(request: Request) {
	const data = await request.json();
	await client.airtable.partnere.create(data);
	return NextResponse.json({ success: true }, { status: 201 });
}
