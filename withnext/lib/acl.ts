import { type Capability, type CapabilityOverrides, hasCapability } from "#shared/acl";
import { getSessionUser, type SessionUser } from "./auth";

export type { Capability, Role } from "#shared/acl";
export { hasCapability } from "#shared/acl";

export class AuthError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export async function can(
	capability: Capability,
	overrides?: CapabilityOverrides,
): Promise<SessionUser> {
	const user = await getSessionUser();
	if (!user) throw new AuthError(401, "No autenticat");
	if (!hasCapability(user.role, capability, overrides)) {
		throw new AuthError(403, "Sense accés");
	}
	return user;
}

export async function requireCapability(capability: Capability): Promise<SessionUser> {
	return can(capability);
}
