import { type NextRequest, NextResponse } from "next/server";
import { AuthError, hasCapability, requireCapability } from "@/lib/acl";
import type { SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	let user: SessionUser;
	try {
		user = await requireCapability("chat:access");
	} catch (e) {
		if (e instanceof AuthError) {
			return NextResponse.json({ ok: false, error: { message: e.message } }, { status: e.status });
		}
		throw e;
	}

	const { id: rawId } = await params;
	const id = Number(rawId);
	if (!Number.isInteger(id) || id <= 0) {
		return NextResponse.json({ ok: false, error: { message: "Id invàlid" } }, { status: 400 });
	}

	const conv = await prisma.conversation.findUnique({
		where: { id },
		include: {
			participants: { select: { userId: true } },
			messages: { orderBy: { createdAt: "asc" }, take: 200 },
		},
	});

	if (!conv) {
		return NextResponse.json(
			{ ok: false, error: { message: "Conversa no trobada" } },
			{ status: 404 },
		);
	}

	const isStaff = hasCapability(user.role, "chat:staff");
	const isParticipant = conv.participants.some((p) => p.userId === user.id);

	if (!isStaff && !isParticipant) {
		return NextResponse.json({ ok: false, error: { message: "Sense accés" } }, { status: 403 });
	}

	return NextResponse.json({
		ok: true,
		data: {
			id: conv.id,
			type: conv.type,
			messages: conv.messages.map((m) => ({
				id: m.id,
				body: m.body,
				senderId: m.senderId,
				senderRole: m.senderRole,
				readAt: m.readAt,
				createdAt: m.createdAt,
			})),
		},
	});
}
