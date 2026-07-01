import { NextResponse } from "next/server";
import { client } from "@/lib/client";

export async function POST(request: Request) {
	const data = await request.json();
	await client.airtable.padriver.create(data);
	return NextResponse.json({ success: true }, { status: 201 });
}
