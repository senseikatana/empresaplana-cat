import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const offices = await prisma.office.findMany({
		orderBy: { order: "asc" },
		select: {
			id: true,
			name: true,
			address: true,
			city: true,
			postalCode: true,
			phone: true,
			purpose: true,
		},
	});

	return NextResponse.json({ ok: true, data: offices });
}
