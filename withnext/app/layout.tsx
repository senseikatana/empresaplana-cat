import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist",
});

export const metadata: Metadata = {
	title: {
		template: "%s — Empresa Plana",
		default: "Empresa Plana — Transports de Catalunya",
	},
	description: "Serveis de transport discrecional i regular a la Costa Daurada i Camp de Tarragona",
	metadataBase: new URL("https://empresaplana.cat"),
	manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ca" className={geist.variable}>
			<head>
				<meta name="theme-color" content="#013990" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link rel="preconnect" href="https://lh3.googleusercontent.com" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
				/>
			</head>
			<body className="font-sans bg-background text-on-surface antialiased">{children}</body>
		</html>
	);
}
