import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setSessionCookie, signSessionToken } from "@/lib/auth";
import { hashPasskey } from "@/lib/passkey";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(60)
		.regex(/^[a-z0-9._-]+$/i),
	email: z.string().email().max(200),
	password: z.string().min(8).max(128),
	name: z.string().min(1).max(60),
});

export async function POST(req: NextRequest) {
	const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "local";
	const rl = rateLimit("register", ip, 5, 60 * 60 * 1000);
	if (!rl.ok) {
		return NextResponse.json(
			{
				ok: false,
				error: { message: "Massa peticions, torna-ho a provar més tard" },
			},
			{ status: 429 },
		);
	}

	const body = await req.json();
	const parsed = registerSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{
				ok: false,
				error: {
					message: parsed.error.issues[0]?.message ?? "Dades invàlides",
				},
			},
			{ status: 400 },
		);
	}

	const { username, email, password, name } = parsed.data;

	const existing = await prisma.user.findFirst({
		where: { OR: [{ username }, { email }] },
	});
	if (existing) {
		return NextResponse.json(
			{ ok: false, error: { message: "Ja existeix un compte amb aquestes dades" } },
			{ status: 409 },
		);
	}

	const user = await prisma.user.create({
		data: {
			username,
			email,
			name,
			fullName: name,
			phone: "",
			passkey: hashPasskey(password),
			role: "client",
		},
	});

	const token = await signSessionToken({
		id: user.id,
		username: user.username,
		role: "client",
	});
	await setSessionCookie(token);

	return NextResponse.json({
		ok: true,
		data: {
			user: {
				id: user.id,
				username: user.username,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		},
	});
}
