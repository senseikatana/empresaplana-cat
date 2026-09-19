import { randomUUID } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const budgetSchema = z.object({
	name: z.string().min(1).max(200),
	email: z.string().email().max(200),
	phone: z.string().min(1).max(30),
	company: z.string().max(200).optional().default(""),
	reasonId: z.string().min(1).max(60),
	description: z.string().max(2000).optional().default(""),
	departureCity: z.string().max(120).optional().default(""),
	departureDay: z.string().max(12).optional().default(""),
	departureTime: z.string().max(10).optional().default(""),
	arrivalCity: z.string().max(120).optional().default(""),
	arrivalDay: z.string().max(12).optional().default(""),
	arrivalTime: z.string().max(10).optional().default(""),
	people: z.string().max(10).optional().default(""),
});

export async function POST(req: NextRequest) {
	const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "local";
	const rl = rateLimit("budget", ip, 20, 60 * 1000);
	if (!rl.ok) {
		return NextResponse.json({ ok: false, error: { message: "Massa peticions" } }, { status: 429 });
	}

	const body = await req.json();
	const parsed = budgetSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ ok: false, error: { message: "Dades invàlides" } }, { status: 400 });
	}

	const data = parsed.data;
	const session = await getSessionUser();

	let userId: number;
	if (session) {
		userId = session.id;
	} else {
		if (data.email.length > 60) {
			return NextResponse.json(
				{ ok: false, error: { message: "Email massa llarg" } },
				{ status: 400 },
			);
		}
		const ghost = await prisma.user.upsert({
			where: { username: data.email },
			update: {},
			create: {
				username: data.email,
				passkey: "",
				name: data.name,
				fullName: data.name,
				email: data.email,
				phone: data.phone,
				role: "client",
			},
		});
		userId = ghost.id;
	}

	const budget = await prisma.budget.create({
		data: {
			id: randomUUID(),
			userId,
			clientName: data.name,
			email: data.email,
			phone: data.phone,
			company: data.company,
			reasonId: data.reasonId,
			description: data.description,
			departureCity: data.departureCity,
			departureDay: data.departureDay,
			departureTime: data.departureTime,
			arrivalCity: data.arrivalCity,
			arrivalDay: data.arrivalDay,
			arrivalTime: data.arrivalTime,
			people: data.people,
			status: "received",
		},
		select: { id: true, status: true },
	});

	return NextResponse.json({ ok: true, data: budget });
}
