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

// Menu items.
const items = [
	{
		title: "Home",
		url: "/",
		icon: Home,
		authenticated: false
	},
	{
		title: "Saved",
		url: "/bookmark",
		icon: Bookmark,
		authenticated: true
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
		authenticated: false
	},
	{
		title: "About Us",
		url: "/about-us",
		icon: Info,
		authenticated: false
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
							{items.map((item) => (
								<>
									{item.authenticated ? (
										<>
											{status === "authenticated" && (
												<SidebarMenuItem key={item.title}>
													<SidebarMenuButton asChild>
														<Link href={item.url}>
															<item.icon/>
															<span>{item.title}</span>
														</Link>
													</SidebarMenuButton>
												</SidebarMenuItem>
											)}
										</>
									) : (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild>
												<Link href={item.url}>
													<item.icon/>
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									)}
								</>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
