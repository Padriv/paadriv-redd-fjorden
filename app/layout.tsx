import type { Metadata } from "next";
import { Geist_Mono, Manrope, Syne } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const manrope = Manrope({
	variable: "--font-manrope",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const syne = Syne({
	variable: "--font-syne",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Oppdrag: Fjorden Vår",
	description:
		"Et initiativ for å samle krefter rundt Oslofjorden. Bli med du også.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="no"
			className={`${manrope.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				{children}
				<Toaster />
			</body>
		</html>
	);
}
