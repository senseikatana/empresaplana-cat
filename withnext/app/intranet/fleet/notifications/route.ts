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

	const notifications = await prisma.notification.findMany({
		orderBy: { createdAt: "desc" },
		take: 50,
		select: {
			id: true,
			type: true,
			title: true,
			desc: true,
			createdAt: true,
			read: true,
			routeId: true,
		},
	});

	return NextResponse.json({ ok: true, data: notifications });
}
