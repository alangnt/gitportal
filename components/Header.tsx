"use client"

import {NavigationMenu, NavigationMenuList} from "@/components/ui/navigation-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

import {signIn, signOut, useSession} from "next-auth/react";

import Link from "next/link";
import Image from "next/image";

import {User2} from "lucide-react"

export default function Header() {
	const {data: session, status} = useSession();
	
	return (
		<header className={"flex justify-between border-b-[1px] w-full px-2 max-lg:pr-6"}>
			<div className={"flex items-center"}>
				<Link href={'/'}
				      className={"flex items-center gap-2 p-1 pr-4 m-1 hover:bg-black hover:text-white hover:rounded-md duration-150 transition-all cursor-pointer"}>
					<div className={'rounded-md overflow-hidden ml-2'}>
						<Image src={'/icons/icon.png'} alt={'Icon logo'} height={'30'} width={'30'}/>
					</div>
					<h1
						className={"hidden sm:flex font-semibold text-3xl text-center"}>GitPortal</h1>
				</Link>
			</div>
			
			<NavigationMenu>
				<NavigationMenuList>
					<Link
						href="https://www.producthunt.com/posts/gitportal?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-gitportal"
						target="_blank">
						<Image
							src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=795574&theme=light&t=1737322305297"
							alt="GitPortal - Your&#0032;Gateway&#0032;to&#0032;Open&#0032;Source&#0032;Collaboration | Product Hunt"
							width="200"
							height="40"/>
					</Link>
					{status === "authenticated" && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar>
									<AvatarImage src={session?.user?.image || ''} className={"cursor-pointer"}/>
									<AvatarFallback>
										<User2/>
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									className={"cursor-pointer"}
								>
									<Link href={"/profile"} className={"w-full"}>
										Profile
									</Link>
								</DropdownMenuItem>
								
								<DropdownMenuSeparator/>
								
								<DropdownMenuItem
									className={"cursor-pointer"}
									onClick={async () => {
										await signOut();
									}}
								>
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
					
					{status === "unauthenticated" && (
						<Dialog>
							<DialogTrigger asChild>
								<Button variant={"outline"}>Sign in</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle className={"text-2xl"}>Create an account</DialogTitle>
									<DialogDescription className={"hidden"}>
										Enter your email below to create your account
									</DialogDescription>
								</DialogHeader>
								<div className="flex flex-col gap-4 w-full">
									<div className="flex flex-col gap-2">
										<Button
											type="submit"
											className={"w-full"}
											onClick={async () => {
												await signIn("github")
											}}
										>
											<GitHubIcon/>
											<span>Sign In</span>
										</Button>
										
										{/* TODO: add Google connexion later */}
									</div>
									
									{/* TODO: add manual connexion later
									<div className="relative w-full hidden">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t"/>
										</div>
										<div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
										</div>
									</div>
									
									<form className="grid flex-1 gap-4">
										<div>
											<Label htmlFor={"email"} className={"font-semibold"}>Email</Label>
											<Input type={"email"} placeholder={"jane.doe@example.com"}></Input>
										</div>
										<div>
											<Label htmlFor={"password"} className={"font-semibold"}>Password</Label>
											<Input type={"password"}></Input>
										</div>
										<Button type="submit">
											Create account
										</Button>
									</form>
									 */}
								</div>
							</DialogContent>
						</Dialog>
					)}
				</NavigationMenuList>
			</NavigationMenu>
		</header>
	)
}

export function GitHubIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width="24"
			height="24"
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
		>
			<path
				d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
		</svg>
	)
}
