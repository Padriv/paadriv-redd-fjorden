import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const syne = Syne({
	variable: "--font-syne",
	subsets: ["latin"],
	weight: ["600", "700", "800"],
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
			className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				{children}
				<Toaster />
			</body>
		</html>
	);
}
