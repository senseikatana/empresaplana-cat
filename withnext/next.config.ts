import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const withMDX = createMDX({
	options: {
		remarkPlugins: [],
		rehypePlugins: [],
	},
});

const nextConfig: NextConfig = {
	serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
	pageExtensions: ["ts", "tsx", "md", "mdx"],
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
				],
			},
		];
	},
};

export default withNextIntl(withMDX(nextConfig));
