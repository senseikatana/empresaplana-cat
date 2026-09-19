import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, hasCapability, requireCapability } from "@/lib/acl";
import { prisma } from "@/lib/prisma";

export async function GET() {
	let user;
	try {
		user = await requireCapability("chat:access");
	} catch (e) {
		if (e instanceof AuthError) {
			return NextResponse.json({ ok: false, error: { message: e.message } }, { status: e.status });
		}
		throw e;
	}

	const isStaff = hasCapability(user.role, "chat:staff");

	const where = isStaff
		? { type: "client-company" }
		: {
				type: "client-company",
				participants: { some: { userId: user.id } },
			};

	const conversations = await prisma.conversation.findMany({
		where,
		orderBy: { updatedAt: "desc" },
		take: 50,
		include: {
			messages: { orderBy: { createdAt: "desc" }, take: 1 },
			participants: { select: { userId: true } },
		},
	});

	const data = conversations.map((c) => {
		const clientParticipant = c.participants.find((p) => p.userId !== user.id);
		const lastMsg = c.messages[0] ?? null;
		return {
			id: c.id,
			type: c.type,
			clientUserId: clientParticipant?.userId ?? null,
			updatedAt: c.updatedAt,
			lastMessage: lastMsg
				? {
						body: lastMsg.body,
						senderRole: lastMsg.senderRole,
						createdAt: lastMsg.createdAt,
					}
				: null,
		};
	});

	return NextResponse.json({ ok: true, data });
}

const postSchema = z.object({
	conversationId: z.number().int().optional(),
	body: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
	let user;
	try {
		user = await requireCapability("chat:access");
	} catch (e) {
		if (e instanceof AuthError) {
			return NextResponse.json({ ok: false, error: { message: e.message } }, { status: e.status });
		}
		throw e;
	}

	const raw = await req.json();
	const parsed = postSchema.safeParse(raw);
	if (!parsed.success) {
		return NextResponse.json({ ok: false, error: { message: "Missatge buit" } }, { status: 400 });
	}

	const { conversationId, body } = parsed.data;
	const isStaff = hasCapability(user.role, "chat:staff");

	if (isStaff && !conversationId) {
		return NextResponse.json(
			{ ok: false, error: { message: "El staff ha d'indicar la conversa" } },
			{ status: 400 },
		);
	}

	let convId: number;

	if (conversationId) {
		const conv = await prisma.conversation.findUnique({
			where: { id: conversationId },
			include: { participants: true },
		});
		if (!conv) {
			return NextResponse.json(
				{ ok: false, error: { message: "Conversa no trobada" } },
				{ status: 404 },
			);
		}
		const isParticipant = conv.participants.some((p) => p.userId === user.id);
		if (!isParticipant && !isStaff) {
			return NextResponse.json({ ok: false, error: { message: "Sense accés" } }, { status: 403 });
		}
		convId = conversationId;
	} else {
		if (isStaff) {
			return NextResponse.json(
				{ ok: false, error: { message: "El staff ha d'indicar la conversa" } },
				{ status: 400 },
			);
		}

		const existing = await prisma.conversation.findFirst({
			where: {
				type: "client-company",
				participants: { some: { userId: user.id } },
			},
		});

		if (existing) {
			convId = existing.id;
		} else {
			const created = await prisma.conversation.create({
				data: {
					type: "client-company",
					participants: {
						create: { userId: user.id, role: user.role },
					},
				},
			});
			convId = created.id;
		}
	}

	const message = await prisma.message.create({
		data: {
			conversationId: convId,
			senderId: user.id,
			senderRole: user.role,
			body,
		},
		select: {
			id: true,
			conversationId: true,
			body: true,
			senderId: true,
			senderRole: true,
			createdAt: true,
		},
	});

	await prisma.conversation.update({
		where: { id: convId },
		data: { updatedAt: new Date() },
	});

	return NextResponse.json({ ok: true, data: message });
}
