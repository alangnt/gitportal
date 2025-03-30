"use client"

import {Bookmark, ChevronLeft, ChevronsRight, Home, Info, LucideIcon, Settings} from "lucide-react";

import {useState} from "react";
import {useSession} from "next-auth/react";
import Link from "next/link";

type Tab = {
	icon: LucideIcon;
	name: string;
	url: string;
}

export default function Sidebar() {
	const [open, setOpen] = useState<boolean>(true);
	const {data: session, status} = useSession();
	
	const tabs = [
		{
			icon: Home,
			name: "Home",
			url: "/",
		},
		{
			icon: Bookmark,
			name: "Bookmark",
			url: "/bookmark",
		},
		{
			icon: Settings,
			name: "Settings",
			url: "/settings",
		},
		{
			icon: Info,
			name: "About Us",
			url: "/about-us",
		}
	]
	
	return (
		<>
			{status === "authenticated" ? (
				<div className={`absolute ${open ? 'bg-black/50 z-20 !fixed w-screen h-screen' : ''}`}>
					<section
						className={`${open ? 'w-64 z-10' : 'w-12'} transition-all duration-400 fixed bg-white h-full border-r flex flex-col gap-4 p-4`}>
						<div
							className={`flex justify-center items-center cursor-pointer h-8 ${open ? 'border rounded-md shadow-sm h-12 pr-2' : 'w-full'}`}
							onClick={() => setOpen(!open)}>
							{open ? <span className={'flex items-center text-sm'}><ChevronLeft/> Reduce</span> :
								<ChevronsRight/>}
						</div>
						
						<p
							className={`text-gray-500 text-sm mb-4 ${open ? 'opacity-100' : 'opacity-0'} duration-200 transition-all`}>
							Hi, {session?.user?.name} !
						</p>
						
						<div className={`flex flex-col gap-2`}>
							<p
								className={`text-gray-500 text-xs ${open ? 'opacity-100' : 'opacity-0'} duration-200 transition-all`}>Tabs</p>
							
							<section className={`flex flex-col gap-4 ${open ? '' : '-translate-y-32'} transition-all duration-200`}>
								{tabs.map((tab: Tab, i: number) => (
									<Link key={i} href={tab.url} className={'flex items-center gap-2 text-gray-600 text-sm'}>
										<tab.icon className={'w-4 min-w-4'}/>
										<p className={'overflow-hidden truncate'}>{tab.name}</p>
									</Link>
								))}
							</section>
						</div>
					</section>
				</div>
			) : null}
		</>
	);
};
