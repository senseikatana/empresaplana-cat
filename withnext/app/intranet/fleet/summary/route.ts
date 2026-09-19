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

	const [routes, buses, stops, schedules, drivers] = await Promise.all([
		prisma.route.count(),
		prisma.bus.count(),
		prisma.stop.count(),
		prisma.schedule.count(),
		prisma.driver.count(),
	]);

	return NextResponse.json({
		ok: true,
		data: { routes, buses, stops, schedules, drivers },
	});
}
