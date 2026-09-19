import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const session = await getSessionUser();
	if (!session) {
		return NextResponse.json({ ok: false, error: { message: "No autenticat" } }, { status: 401 });
	}

	const favorites = await prisma.favoriteRoute.findMany({
		where: { userId: session.id },
	});

	const routeIds = favorites.map((f) => f.routeId);
	const routes = await prisma.route.findMany({
		where: { id: { in: routeIds } },
		select: {
			id: true,
			code: true,
			name: true,
			origin: true,
			destination: true,
			color: true,
		},
	});

	const routeMap = new Map(routes.map((r) => [r.id, r]));
	const data = favorites
		.filter((f) => routeMap.has(f.routeId))
		.map((f) => {
			const { id: _routeId, ...routeData } = routeMap.get(f.routeId)!;
			return { id: f.id, routeId: f.routeId, ...routeData };
		});

	return NextResponse.json({ ok: true, data });
}

const putSchema = z.object({
	routeId: z.string().min(1),
});

export async function PUT(req: NextRequest) {
	const session = await getSessionUser();
	if (!session) {
		return NextResponse.json({ ok: false, error: { message: "No autenticat" } }, { status: 401 });
	}

	const body = await req.json();
	const parsed = putSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ ok: false, error: { message: "routeId requerit" } },
			{ status: 400 },
		);
	}

	const { routeId } = parsed.data;

	const route = await prisma.route.findUnique({ where: { id: routeId } });
	if (!route) {
		return NextResponse.json({ ok: false, error: { message: "Ruta no trobada" } }, { status: 404 });
	}

	const existing = await prisma.favoriteRoute.findUnique({
		where: { userId_routeId: { userId: session.id, routeId } },
	});

	if (existing) {
		await prisma.favoriteRoute.delete({ where: { id: existing.id } });
		return NextResponse.json({ ok: true, data: { favorite: false } });
	}

	await prisma.favoriteRoute.create({
		data: { userId: session.id, routeId },
	});

	return NextResponse.json({ ok: true, data: { favorite: true } });
}
