/**
 * ACL estilo WordPress: los roles son paquetes nombrados de capabilities.
 * La autorización pregunta por capability, no por rol.
 */

export const ROLES = ["client", "worker", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const CAPABILITIES = [
	"dashboard:access",
	"profile:edit",
	"chat:access",
	"chat:create",
	"chat:staff",
	"fleet:view",
	"fleet:manage",
	"budgets:view",
	"budgets:manage",
	"content:manage",
	"users:manage",
	"system:manage",
] as const;
export type Capability = (typeof CAPABILITIES)[number];

export const ROLE_CAPABILITIES: Record<Role, readonly Capability[]> = {
	client: ["dashboard:access", "profile:edit", "chat:access", "chat:create"],
	worker: [
		"dashboard:access",
		"profile:edit",
		"chat:access",
		"chat:staff",
		"fleet:view",
		"budgets:view",
	],
	admin: CAPABILITIES,
};

export interface CapabilityOverrides {
	allow?: readonly Capability[];
	deny?: readonly Capability[];
}

export function isRole(value: unknown): value is Role {
	return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function hasCapability(
	role: Role,
	capability: Capability,
	overrides?: CapabilityOverrides,
): boolean {
	if (overrides?.deny?.includes(capability)) return false;
	if (overrides?.allow?.includes(capability)) return true;
	return ROLE_CAPABILITIES[role].includes(capability);
}

export function capabilitiesForRole(role: Role): readonly Capability[] {
	return ROLE_CAPABILITIES[role];
}
