'use client'

import {Bookmark, Home, Settings} from "lucide-react"

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

// Menu items.
const items = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "Saved",
		url: "/bookmark",
		icon: Bookmark
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
	},
]

export function AppSidebar() {
	const {data: session, status} = useSession();
	
	return (
		<>
			{status === "authenticated" && (
				<Sidebar collapsible={"icon"}>
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Application</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{items.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild>
												<a href={item.url}>
													<item.icon/>
													<span>{item.title}</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
				</Sidebar>
			)}
		</>
	)
}
