import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { SessionProvider } from "next-auth/react";

import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/core/app-sidebar";

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
  title: "Open Source",
  description: "Generated by create next app",
};

export default async function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
    >
    <SessionProvider>
      <SidebarProvider
        style={{
          "--sidebar-width": "10rem",
        }}
        defaultOpen={defaultOpen}
      >
        <AppSidebar />
        <div className={"w-full"}>
          {children}
        </div>
      </SidebarProvider>
    </SessionProvider>
    </body>
    </html>
  );
}
