'use client'

import {Bookmark, Home, Info, Settings} from "lucide-react"

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"

import {useSession} from "next-auth/react";
import Link from "next/link";

const authenticatedItems = [
	{
		title: "Saved",
		url: "/bookmark",
		icon: Bookmark
	},
]

// Menu items.
const items = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
	},
	{
		title: "About Us",
		url: "/about-us",
		icon: Info,
	},
]

export function AppSidebar() {
	const {data: session, status} = useSession();
	
	return (
		<Sidebar collapsible={"icon"}>
			<SidebarContent>
				{status === "authenticated" && (
					<SidebarGroup>
						<SidebarGroupLabel>Hi, {session?.user?.name} !</SidebarGroupLabel>
					</SidebarGroup>
				)}
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{status === "authenticated" ? (
								<>
									{authenticatedItems.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild>
												<Link href={item.url}>
													<item.icon/>
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</>
							) : null}
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon/>
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
