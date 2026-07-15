import { NextResponse } from "next/server";
import type { Padriver } from "@/lib/airtable";
import { client } from "@/lib/client";

export async function POST(request: Request) {
	const padriverData: Padriver = await request.json();

	try {
		await client.airtable.padriver.create(padriverData);
	} catch {
		return NextResponse.json({ success: false }, { status: 502 });
	}

	return NextResponse.json({ success: true }, { status: 201 });
}
