"use client"

import Header from "@/components/Header";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {User} from "@/types/types";
import {redirect} from "next/navigation";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import {Trash2} from "lucide-react";
import {Input} from "@/components/ui/input";

export default function SettingsPage() {
	const {data: session, status} = useSession();
	
	const [loading, setLoading] = useState<boolean>(true);
	
	const [userInfo, setUserInfo] = useState<User | null>(null);
	const [userFetched, setUserFetched] = useState(false);
	
	// FETCH USER INFO
	const fetchUserProfile = async () => {
		try {
			if (!session?.user?.email) {
				throw new Error("User session is not available.");
			}
			
			const response = await fetch('/api/users');
			if (!response?.ok) {
				throw new Error('Failed to fetch user infos');
			}
			
			const data = await response.json();
			const userInfos = data.data.filter(
				(user: User) => user.email === session?.user?.email
			);
			
			if (userInfos.length === 0) {
				throw new Error("No user found with the given email.");
			}
			
			const user = userInfos[0];
			setUserInfo(user);
			setUserFetched(true);
			
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};
	
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	
	const handleDeleteAccount = async () => {
		console.log("handleDelete");
	}
	
	useEffect(() => {
		if (status === "unauthenticated") {
			redirect("/");
		} else if (status === "authenticated") {
			fetchUserProfile();
		}
	}, [status, userFetched]);
	
	if (loading) return <div>Loading...</div>;
	
	return (
		<>
			{status === "authenticated" && (
				<>
					<Header/>
					
					<main className={"flex flex-col gap-4 grow w-full md:max-w-[1280px] px-4 max-lg:px-6 mt-4"}>
						<h2 className={"text-3xl font-semibold"}>Settings</h2>
						
						<Card>
							<CardHeader>
								<CardTitle>Privacy and Terms</CardTitle>
								<CardDescription>Review our privacy policy and terms of service</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<div className="flex justify-between items-center">
									<span>Privacy Center</span>
									<Link href="/privacy-center">
										<Button variant="outline">View</Button>
									</Link>
								</div>
								<div className="flex justify-between items-center">
									<span>Privacy Policy</span>
									<Link href="/privacy-policy">
										<Button variant="outline">View</Button>
									</Link>
								</div>
								<div className="flex justify-between items-center">
									<span>Contact Us</span>
									<Link href="/contact">
										<Button variant="outline">Contact</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
						
						<Card>
							<CardHeader>
								<CardTitle>Delete Account</CardTitle>
								<CardDescription>Permanently delete your account and all associated data</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-500">
									Warning: This action is irreversible. All your projects, contributions, and personal data will be
									permanently deleted.
								</p>
							</CardContent>
							<CardFooter>
								<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
									<DialogTrigger asChild>
										<Button variant="destructive">
											<Trash2 className="mr-2 h-4 w-4"/>
											Delete Account
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Are you absolutely sure?</DialogTitle>
											<DialogDescription>
												This action cannot be undone. This will permanently delete your account and remove your data
												from our servers.
											</DialogDescription>
										</DialogHeader>
										<div className="flex flex-col gap-4 py-4">
											<p className="text-sm text-gray-500">
												To confirm, please type &quot;DELETE&quot; in the input field below:
											</p>
											<Input id="delete-confirmation" placeholder="Type DELETE here"/>
										</div>
										<DialogFooter>
											<Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
											<Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</CardFooter>
						</Card>
					</main>
				</>
			)}
		</>
	)
}