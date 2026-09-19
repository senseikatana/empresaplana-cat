import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { isRole, type Role } from "#shared/acl";

const SESSION_COOKIE = "ep_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const ISSUER = "empresaplana";

export type UsuarioRole = Role;

export interface SessionUser {
	id: number;
	username: string;
	role: UsuarioRole;
}

function secret(): Uint8Array {
	const value = process.env.AUTH_SECRET;
	if (!value) {
		throw new Error("AUTH_SECRET is not set.");
	}
	return new TextEncoder().encode(value);
}

export async function signSessionToken(user: SessionUser): Promise<string> {
	return new SignJWT({ username: user.username, role: user.role })
		.setSubject(String(user.id))
		.setIssuer(ISSUER)
		.setIssuedAt()
		.setExpirationTime("7d")
		.setProtectedHeader({ alg: "HS256" })
		.sign(secret());
}

export async function getSessionUser(): Promise<SessionUser | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE)?.value;
	if (!token) return null;
	try {
		const { payload } = await jwtVerify(token, secret(), { issuer: ISSUER });
		const id = Number(payload.sub);
		if (!Number.isInteger(id) || typeof payload.username !== "string") return null;
		if (!isRole(payload.role)) return null;
		return { id, username: payload.username, role: payload.role };
	} catch {
		return null;
	}
}

export async function setSessionCookie(token: string): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: SESSION_MAX_AGE,
	});
}

export async function clearSessionCookie(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE);
}
