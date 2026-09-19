import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
	const origin = req.nextUrl.searchParams.get("origin")?.trim() ?? "";
	const destination = req.nextUrl.searchParams.get("destination")?.trim() ?? "";

	if (!origin || !destination) {
		return NextResponse.json(
			{ ok: false, error: { message: "Origen i destinació requerits" } },
			{ status: 400 },
		);
	}

	const routes = await prisma.route.findMany({
		where: {
			status: "active",
			origin: { contains: origin, mode: "insensitive" },
			destination: { contains: destination, mode: "insensitive" },
		},
		select: {
			id: true,
			code: true,
			name: true,
			origin: true,
			destination: true,
			color: true,
		},
	});

	return NextResponse.json({ ok: true, data: routes });
}
