"use client"

import Header from "@/components/Header";
import {signOut, useSession} from "next-auth/react";
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
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

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
	
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	})
	
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const {name, value} = e.target
		setFormData((prev) => ({...prev, [name]: value}))
	}
	
	const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
	const [sendMessageError, setSendMessageError] = useState<string | null>(null);
	const [sendMessageSuccess, setSendMessageSuccess] = useState<string | null>(null);
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSendMessageLoading(true)
		
		const data = {
			_id: userInfo?._id,
			name: formData.name,
			email: formData.email,
			subject: formData.subject,
			message: formData.message,
		}
		
		try {
			const response = await fetch('/api/inquiries/addInquiry', {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data)
			})
			
			const result = await response.json();
			
			if (!response.ok) {
				console.error("Failed to add inquiry", result.message);
				setSendMessageError("Failed to add inquiry");
				setTimeout(() => setSendMessageError(null), 5000);
			} else {
				setSendMessageSuccess("Inquiry sent. We'll get back to you soon");
				setTimeout(() => setSendMessageSuccess(null), 5000);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setTimeout(() => setSendMessageLoading(false), 1000);
			setFormData({name: "", email: "", subject: "", message: ""})
		}
	}
	
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
	const [deleteFormData, setDeleteFormData] = useState({delete: ''});
	
	const [canDelete, setCanDelete] = useState(false);
	
	const handleDeleteInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const {name, value} = e.target
		setDeleteFormData((prev) => ({...prev, [name]: value}))
		if (value === "DELETE") {
			setCanDelete(true);
		} else {
			setCanDelete(false);
		}
	}
	
	const [deleteUserLoading, setDeleteUserLoading] = useState(false);
	
	const handleDeleteAccount = async (e: React.FormEvent) => {
		e.preventDefault()
		setDeleteUserLoading(true);
		
		const data = {
			_id: userInfo?._id
		}
		
		try {
			const response = await fetch('/api/users/deleteUser', {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			});
			
			const result = await response.json();
			
			if (response.ok) {
				await signOut();
				redirect("/");
			} else {
				console.error("Failed to delete user", result.message);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setDeleteUserLoading(false);
		}
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
						
						<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
							<CardHeader>
								<CardTitle>Privacy and Terms</CardTitle>
								<CardDescription>Review our privacy policy and terms of service</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<div className="flex justify-between items-center">
									<span>Privacy Center</span>
									<Link href="/settings/privacy-center">
										<Button variant="outline">View</Button>
									</Link>
								</div>
								<div className="flex justify-between items-center">
									<span>Privacy Policy</span>
									<Link href="/settings/privacy-policy">
										<Button variant="outline">View</Button>
									</Link>
								</div>
								<div className="flex justify-between items-center">
									<span>Contact Us</span>
									<Dialog>
										<DialogTrigger asChild>
											<Button variant="outline">Contact</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle className={"text-2xl"}>Contact Us</DialogTitle>
												<DialogDescription>
													We&apos;d love to hear from you. Please fill out this form and we&apos;ll get back to you as
													soon
													as
													possible.
												</DialogDescription>
											</DialogHeader>
											<form onSubmit={handleSubmit}>
												<div className="grid gap-4 mt-4">
													<div className="grid gap-2">
														<Label htmlFor="name">Name</Label>
														<Input
															id="name"
															name="name"
															value={formData.name}
															onChange={handleInputChange}
															required
														/>
													</div>
													<div className="grid gap-2">
														<Label htmlFor="email">Email</Label>
														<Input
															id="email"
															name="email"
															type="email"
															value={formData.email}
															onChange={handleInputChange}
															required
														/>
													</div>
													<div className="grid gap-2">
														<Label htmlFor={"subject"}>Subject</Label>
														<Input
															id="subject"
															name="subject"
															value={formData.subject}
															onChange={handleInputChange}
															required
														/>
													</div>
													<div className="grid gap-2">
														<Label htmlFor="message">Message</Label>
														<Textarea
															id="message"
															name="message"
															value={formData.message}
															onChange={handleInputChange}
															required
														/>
													</div>
												</div>
												<DialogFooter className={"mt-4"}>
													<div className={"flex items-center gap-2"}>
														{sendMessageError ? (
															<div className={"text-sm text-center text-red-500"}>{sendMessageError}</div>
														) : null}
														{sendMessageSuccess ? (
															<div className={"text-sm text-center text-green-500"}>{sendMessageSuccess}</div>
														) : null}
														<Button type="submit">{sendMessageLoading ? <span
															className={"animate-spin rounded-full w-4 h-4 border-t-blue-500 border-2"}></span> : "Send Message"}</Button>
													</div>
												</DialogFooter>
											</form>
										</DialogContent>
									</Dialog>
								</div>
							</CardContent>
						</Card>
						
						<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
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
											<Input
												id={"delete"}
												name={"delete"}
												value={deleteFormData.delete}
												onChange={handleDeleteInputChange}
												placeholder="Type DELETE here"
											/>
										</div>
										<DialogFooter className={"flex flex-col gap-2"}>
											<Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
											<Button variant="destructive" disabled={!canDelete} onClick={handleDeleteAccount}>
												{deleteUserLoading ? <span
													className={"animate-spin rounded-full w-4 h-4 border-t-red-800 border-2"}></span> : "Delete account"}
											</Button>
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