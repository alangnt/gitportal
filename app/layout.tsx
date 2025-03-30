import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";

import {SessionProvider} from "next-auth/react";

import {Analytics} from "@vercel/analytics/react"
import Sidebar from "@/components/Sidebar";

import React from "react";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "GitPortal",
	description: "Your Gateway to Open Source Collaboration",
	applicationName: "GitPortal",
	authors: [{name: "Alan Geirnaert", url: "https://alan.geirnaert.com"}],
	creator: "Alan Geirnaert",
	publisher: "Vercel",
	generator: "Next.js",
	keywords: "next.js, react, github",
	icons: {icon: "/icons/icon.png", apple: "/icons/icon.png"},
	openGraph: {
		type: "website",
		url: "https://gitportal.org",
		title: "GitPortal",
		description: "Your Gateway to Open Source Collaboration",
		siteName: "GitPortal",
		images: [{
			url: "/icons/icon.png",
		}]
	},
	twitter: {
		card: "summary_large_image",
		site: "@gnt_alan",
		creator: "@gnt_alan",
		images: "/icons/icon.png",
	},
	appleWebApp: {
		capable: true,
		title: "GitPortal",
		statusBarStyle: "black-translucent"
	},
	bookmarks: "https://gitportal.org",
};

export default async function RootLayout({
	                                         children,
                                         }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
		<body
			className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen`}
		>
		<SessionProvider>
			<Sidebar/>
			<div className={"flex flex-col items-center w-full pl-12"}>
				{children}
				<Analytics/>
			</div>
		</SessionProvider>
		</body>
		</html>
	);
}
