import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const PUBLIC_AUTH_PATHS = ["/dashboard/login", "/dashboard/register"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (request.method !== "GET" && request.method !== "HEAD") {
		const origin = request.headers.get("origin");
		const host = request.headers.get("host");
		if (origin && host && !origin.includes(host)) {
			return NextResponse.json(
				{ ok: false, error: { message: "Origin no vàlid" } },
				{ status: 403 },
			);
		}
	}

	const dashboardMatch = pathname.match(/^\/(?:(es|en|fr)\/)?dashboard(\/.*)?$/);
	if (dashboardMatch) {
		const subPath = dashboardMatch[1] || "";

		const isPublicAuth = PUBLIC_AUTH_PATHS.some(
			(p) =>
				subPath === p.replace("/dashboard", "") ||
				subPath.startsWith(`${p.replace("/dashboard", "")}/`),
		);

		if (!isPublicAuth) {
			const token = request.cookies.get("ep_session")?.value;
			if (!token) {
				const localeMatch = pathname.match(/^\/(es|en|fr)(\/.*)$/);
				const loginUrl = new URL(
					localeMatch ? `/${localeMatch[1]}/dashboard/login` : "/dashboard/login",
					request.url,
				);
				loginUrl.searchParams.set("redirect", pathname);
				return NextResponse.redirect(loginUrl);
			}
		}
	}

	if (
		!pathname.startsWith("/intranet/") &&
		!pathname.startsWith("/_next/") &&
		!pathname.includes(".")
	) {
		return handleI18nRouting(request);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!intranet|_next|.*\\..*).*)"],
};
