/**
 * Demo CRUD script — validates Prisma + Neon connection end-to-end.
 * Run: pnpm run db:demo
 */

import { hashPasskey } from "../../lib/passkey";
import { prisma } from "./db";

async function main() {
	console.log("🔍 Connecting to Neon via Prisma...");
	console.log("");

	// CREATE
	const demoUser = await prisma.user.create({
		data: {
			username: `demo-${Date.now()}`,
			passkey: hashPasskey("demo1234"),
			name: "Alice",
			fullName: "Alice Demo",
			email: `alice-${Date.now()}@example.com`,
			phone: "+34 600 000 000",
			role: "client",
		},
	});
	console.log(`✅ CREATE — User #${demoUser.id} (${demoUser.username})`);

	// READ
	const foundUser = await prisma.user.findUnique({
		where: { id: demoUser.id },
	});
	console.log(`✅ READ   — found: ${foundUser?.name} <${foundUser?.email}>`);

	// UPDATE
	const updatedUser = await prisma.user.update({
		where: { id: demoUser.id },
		data: { name: "Alice Smith" },
	});
	console.log(`✅ UPDATE — name changed to: ${updatedUser.name}`);

	// DELETE
	await prisma.user.delete({ where: { id: demoUser.id } });
	console.log(`✅ DELETE — User #${demoUser.id} removed`);

	console.log("");
	console.log("🎉 CRUD cycle complete — Neon + Prisma working.");
}

main()
	.catch((error) => {
		console.error("❌ CRUD failed:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
