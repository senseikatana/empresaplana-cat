import { redirect } from "next/navigation";
import { hasCapability } from "#shared/acl";
import { getSessionUser } from "@/lib/auth";

export default async function DashboardPage() {
	const user = await getSessionUser();

	if (!user) {
		redirect("/dashboard/login");
	}

	if (hasCapability(user.role, "users:manage")) {
		redirect("/dashboard/gestion");
	}

	if (hasCapability(user.role, "fleet:view")) {
		redirect("/dashboard/trabajador");
	}

	redirect("/dashboard/cliente");
}
