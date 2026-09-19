import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRole } from "#shared/acl";
import { setSessionCookie, signSessionToken } from "@/lib/auth";
import { verifyPasskey } from "@/lib/passkey";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
	username: z.string().min(1).max(60),
	passkey: z.string().min(1).max(128),
});

export async function POST(req: NextRequest) {
	const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "local";
	const rl = rateLimit("login", ip, 10, 15 * 60 * 1000);
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
	const parsed = loginSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ ok: false, error: { message: "Falten credencials" } },
			{ status: 400 },
		);
	}

	const { username, passkey } = parsed.data;
	const user = await prisma.user.findUnique({ where: { username } });
	if (!user || !verifyPasskey(passkey, user.passkey)) {
		return NextResponse.json(
			{ ok: false, error: { message: "Credencials invàlides" } },
			{ status: 401 },
		);
	}

	if (!isRole(user.role)) {
		return NextResponse.json({ ok: false, error: { message: "Error intern" } }, { status: 500 });
	}

	const token = await signSessionToken({
		id: user.id,
		username: user.username,
		role: user.role,
	});
	await setSessionCookie(token);

	return NextResponse.json({
		ok: true,
		data: {
			user: {
				id: user.id,
				username: user.username,
				name: user.name,
				fullName: user.fullName,
				email: user.email,
				role: user.role,
			},
		},
	});
}
