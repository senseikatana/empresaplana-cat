import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { hashPasskey, verifyPasskey } from "@/lib/passkey";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const session = await getSessionUser();
	if (!session) {
		return NextResponse.json({ ok: false, error: { message: "No autenticat" } }, { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: { id: session.id },
		select: {
			id: true,
			username: true,
			name: true,
			fullName: true,
			email: true,
			phone: true,
			role: true,
			totpSecret: true,
			emailVerified: true,
			createdAt: true,
		},
	});

	if (!user) {
		return NextResponse.json(
			{ ok: false, error: { message: "Usuari no trobat" } },
			{ status: 404 },
		);
	}

	const { totpSecret, ...safeUser } = user;
	return NextResponse.json({
		ok: true,
		data: { user: { ...safeUser, totpEnabled: !!totpSecret } },
	});
}

const patchSchema = z.object({
	name: z.string().min(1).max(60).optional(),
	email: z.string().email().max(200).optional(),
	phone: z.string().max(30).optional(),
	currentPasskey: z.string().min(1).max(128).optional(),
	newPassword: z.string().min(8).max(128).optional(),
});

export async function PATCH(req: NextRequest) {
	const session = await getSessionUser();
	if (!session) {
		return NextResponse.json({ ok: false, error: { message: "No autenticat" } }, { status: 401 });
	}

	const body = await req.json();
	const parsed = patchSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ ok: false, error: { message: "Dades invàlides" } }, { status: 400 });
	}

	const { name, email, phone, currentPasskey, newPassword } = parsed.data;

	if ((email || newPassword) && !currentPasskey) {
		return NextResponse.json(
			{
				ok: false,
				error: { message: "Cal indicar la contrasenya actual" },
			},
			{ status: 400 },
		);
	}

	if (!name && !email && !phone && !newPassword) {
		return NextResponse.json(
			{ ok: false, error: { message: "Res a actualitzar" } },
			{ status: 400 },
		);
	}

	const user = await prisma.user.findUnique({ where: { id: session.id } });
	if (!user) {
		return NextResponse.json(
			{ ok: false, error: { message: "Usuari no trobat" } },
			{ status: 404 },
		);
	}

	if (email || newPassword) {
		if (!verifyPasskey(currentPasskey!, user.passkey)) {
			return NextResponse.json(
				{
					ok: false,
					error: { message: "Contrasenya actual incorrecta" },
				},
				{ status: 403 },
			);
		}
	}

	if (email) {
		const existing = await prisma.user.findFirst({
			where: { email, NOT: { id: session.id } },
		});
		if (existing) {
			return NextResponse.json({ ok: false, error: { message: "email_exists" } }, { status: 409 });
		}
	}

	const updateData: Record<string, unknown> = {};
	if (name) updateData.name = name;
	if (email) updateData.email = email;
	if (phone) updateData.phone = phone;
	if (newPassword) updateData.passkey = hashPasskey(newPassword);

	const updated = await prisma.user.update({
		where: { id: session.id },
		data: updateData,
		select: {
			id: true,
			username: true,
			name: true,
			email: true,
			phone: true,
			role: true,
		},
	});

	return NextResponse.json({ ok: true, data: { user: updated } });
}
