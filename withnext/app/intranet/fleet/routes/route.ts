import { NextResponse } from "next/server";
import { AuthError, requireCapability } from "@/lib/acl";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		await requireCapability("fleet:view");
	} catch (e) {
		if (e instanceof AuthError) {
			return NextResponse.json({ ok: false, error: { message: e.message } }, { status: e.status });
		}
		throw e;
	}

	const routes = await prisma.route.findMany({
		orderBy: { code: "asc" },
		select: {
			id: true,
			code: true,
			name: true,
			origin: true,
			destination: true,
			color: true,
			status: true,
		},
	});

	return NextResponse.json({ ok: true, data: routes });
}
