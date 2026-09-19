import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const session = await getSessionUser();
	if (!session) {
		return NextResponse.json({ ok: false, error: { message: "No autenticat" } }, { status: 401 });
	}

	const budgets = await prisma.budget.findMany({
		where: { userId: session.id },
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			clientName: true,
			reasonId: true,
			description: true,
			departureCity: true,
			departureDay: true,
			departureTime: true,
			arrivalCity: true,
			arrivalDay: true,
			arrivalTime: true,
			people: true,
			status: true,
			createdAt: true,
		},
	});

	return NextResponse.json({ ok: true, data: budgets });
}
