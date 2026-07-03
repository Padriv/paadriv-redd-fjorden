import { NextResponse } from "next/server";
import { client } from "@/lib/client";

export async function POST(request: Request) {
	const data = await request.json();

	try {
		await client.airtable.padriver.create(data);
	} catch (error) {
		console.error("Kunne ikke opprette pådriver i Airtable:", error);
		return NextResponse.json({ success: false }, { status: 502 });
	}

	return NextResponse.json({ success: true }, { status: 201 });
}
