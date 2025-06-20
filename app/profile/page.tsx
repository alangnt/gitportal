"use client"

// REACT
import React, {useEffect, useRef, useState} from "react";

// NEXT
// AUTH
import {useSession} from "next-auth/react";
import {redirect} from 'next/navigation';

// COMPONENTS
import Header from "@/components/Header";

// SHADCN
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";

// LUCIDE
import {
	ChevronDown,
	ExternalLink,
	GitFork,
	Github,
	GitPullRequest,
	Globe,
	Heart,
	Mail,
	MapPin,
	Pipette,
	Plus,
	RefreshCcw,
	Star,
	Trash2,
	Twitter,
	User2
} from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";

// QR Code
import {useQRCode} from "next-qrcode";

// Share project
import {toPng} from 'html-to-image'

// Types
import {Project, User} from "@/types/types";

export default function UserProfilePage() {
	const {data: session, status} = useSession();
	
	// USERS
	const [userInfo, setUserInfo] = useState<User | null>(null);
	const [userFetched, setUserFetched] = useState(false);
	
	// EDIT USER PROFILE
	const [editUserInfo, setEditUserInfo] = useState<User | null>(null);
	
	const [loading, setLoading] = useState<boolean>(true);
	
	// FETCH USER INFO
	const fetchUserProfile = async () => {
		try {
			if (!session?.user?.email) {
				console.error("User session is not available.");
			}
			
			const response = await fetch('/api/users');
			if (!response?.ok) {
				console.error('Failed to fetch user infos');
			}
			
			const data = await response.json();
			const userInfos = data.data.filter(
				(user: User) => user.email === session?.user?.email
			);
			
			if (userInfos.length === 0) {
				console.error("No user found with the given email.");
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
	
	// PROJECTS
	const [projects, setProjects] = useState([]);
	const [contributedProjects, setContributedProjects] = useState([]);
	const [selectedProject, setSelectedProject] = useState<Project>();
	
	const [showMoreState, setShowMoreState] = useState<Record<string, boolean>>({});
	
	const handleToggleShowMore = (projectId: string) => {
		setShowMoreState(prevState => ({
			...prevState,
			[projectId]: !prevState[projectId], // Toggle the showMore state for the specific project
		}));
	};
	
	const [totalStars, setTotalStars] = useState(0);
	const [totalForks, setTotalForks] = useState(0);
	
	// FETCH USER'S PROJECTS
	const fetchCreatedProjects = async () => {
		if (!userInfo) return;
		
		try {
			const response = await fetch("/api/projects");
			if (!response.ok) {
				console.error("Failed to fetch projects");
			}
			const data = await response.json();
			
			const contributedProjects = data.data.filter(
				(project: Project) => project.contributions && project.contributions.includes(userInfo._id)
			);
			const userProjects = data.data.filter(
				(project: Project) => project.user === userInfo._id
			);
			
			const sumTotalStars = userProjects.reduce((acc: number, project: Project) => acc + project.stars, 0);
			setTotalStars(sumTotalStars);
			
			const sumTotalForks = userProjects.reduce((acc: number, project: Project) => acc + project.forks, 0);
			setTotalForks(sumTotalForks);
			
			setProjects(userProjects);
			setContributedProjects(contributedProjects);
			
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	const [customCategories, setCustomCategories] = useState<string[]>([]);
	
	const [addProjectFormData, setAddProjectFormData] = useState({
		title: '',
		category: ''
	})
	
	const [editProjectFormData, setEditProjectFormData] = useState({
		_id: "",
		title: "",
	})
	
	const [editUserFormData, setEditUserFormData] = useState({
		username: "",
		bio: '',
		location: '',
		website: '',
		twitter: '',
		github: '',
	})
	
	const handleAddProjectInfoChange = (field: string, value: string) => {
		setAddProjectFormData((prev) => ({...prev, [field]: value}));
	};
	
	const handleEditProjectInfoChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const {name, value} = e.target
		setEditProjectFormData((prev) => ({...prev, [name]: value}))
	}
	
	const handleUserInfoChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const {name, value} = e.target
		setEditUserFormData((prev) => ({...prev, [name]: value}))
	}
	
	const [editUserError, setEditUserError] = useState<string | null>(null);
	const [editUserLoading, setEditUserLoading] = useState<boolean>(false);
	
	const handleSubmitEditUserForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setEditUserLoading(true);
		setEditUserError(null);
		
		const data = {
			_id: userInfo?._id,
			...editUserFormData
		};
		
		try {
			const response = await fetch('/api/users/editUser', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			
			const result = await response.json();
			
			if (response.status === 409) {
				setTimeout(() => {
					setEditUserError("Username already taken");
				}, 1000)
			}
			
			if (response.ok) {
				window.location.reload();
			} else {
				console.error('Error updating:', result.message);
			}
		} catch (error) {
			console.error('Request failed:', error);
		} finally {
			setTimeout(() => {
				setEditUserLoading(false);
			}, 1000)
		}
	};
	
	// ADD PROJECT ERROR MESSAGE
	const [addProjectError, setAddProjectError] = useState<string | null>(null);
	const [addProjectLoading, setAddProjectLoading] = useState<boolean>(false);
	const [isFetchedProject, setIsFetchedProject] = useState<boolean>(false);

	const addCustomCategory = (category: string) => {
		if (customCategories.includes(category)) return setCustomCategories(customCategories.filter((cat: string) => cat !== category));
		setCustomCategories((prev) => ([...prev, category]));
	}
	
	const handleSubmitAddProjectForm = async (e: React.FormEvent<HTMLFormElement>, addProject: boolean = false) => {
		e.preventDefault();

		setAddProjectLoading(true);
		setAddProjectError(null);
		
		try {
			const data = {
				_id: userInfo?._id,
				user: userInfo?.github,
				...addProjectFormData,
				categories: customCategories
			}
			
			console.log(data);

			const response = await fetch(`/api/projects/${addProject ? 'addProject' : 'fetchProject'}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			
			const result = await response.json();
			
			if (response.ok) {
				if (!isFetchedProject) {
					await addFilters(result.message);
				} else {
					window.location.reload();
				}
			} else {
				if (response.status === 409) {
					setTimeout(() => {
						setAddProjectError("Project already exists");
					}, 1000)
				}
				if (response.status === 400) {
					setTimeout(() => {
						setAddProjectError("Project doesn't exist");
					}, 1000)
				}
				console.error('Error adding:', result.message);
			}
		} catch (error) {
			console.error('Request failed:', error);
		} finally {
			setAddProjectLoading(false);
		}
	}

	const [keywords, setKeywords] = useState<string[] | undefined>(undefined);

	const addFilters = async (description: string) => {
		const res = await fetch('/api/keywords', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ description }),
		});

		const data = await res.json();
		if (data.message.length > 0) setKeywords(data.message.trim().split(', ').map((word: string) => word.trim()));
		else setKeywords(undefined);
		
		setIsFetchedProject(true);
	};
	
	const [editProjectError, setEditProjectError] = useState<string | null>(null);
	const [editProjectLoading, setEditProjectLoading] = useState(false);
	
	const handleSubmitEditProjectForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setEditProjectLoading(true);
		setEditProjectError(null);
		
		const data = {
			userId: userInfo?._id,
			user: userInfo?.github,
			...editProjectFormData
		}
		
		if (editProjectFormData.title === selectedProject?.title) {
			setTimeout(() => {
				setEditProjectError("You cannot switch to current project")
				setEditProjectLoading(false);
			}, 1000)
			return;
		}
		
		try {
			const response = await fetch('/api/projects/editProject', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			
			const result = await response.json();
			
			if (response.ok) {
				window.location.reload();
			} else {
				if (response.status === 409) {
					setEditProjectError("Project already exists");
				}
				if (response.status === 410) {
					setEditProjectError("Project doesn't exist");
				}
				console.error('Error updating:', result.message);
			}
		} catch (error) {
			console.error('Request failed:', error);
		} finally {
			setTimeout(() => {
				setEditProjectLoading(false);
			}, 1000)
		}
	}
	
	const [deleteProjectLoading, setDeleteProjectLoading] = useState(false);
	
	const handleDeleteProject = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setDeleteProjectLoading(true);
		
		const data = {
			user: userInfo?.github,
			title: selectedProject?.title
		}
		
		try {
			const response = await fetch('/api/projects/deleteProject', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			
			const result = await response.json();
			
			if (response.ok) {
				window.location.reload();
			} else {
				console.error('Error deleting:', result.message);
			}
		} catch (error) {
			console.error('Request failed:', error);
		} finally {
			setDeleteProjectLoading(false);
		}
	}
	
	const [refreshingProjectLoading, setRefreshingProjectLoading] = useState(false);
	
	const handleRefreshProjects = async () => {
		setRefreshingProjectLoading(true);
		
		try {
			const response = await fetch('/api/projects/updateProject', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({user: userInfo?._id})
			});
			
			if (!response.ok) {
				console.error('Failed to update projects');
			} else {
				window.location.reload();
			}
		} catch (error) {
			console.error('Request failed:', error);
			setLoading(false);
		}
	}
	
	// QR Code generator
	const {SVG} = useQRCode();
	
	// SHARE PROJECT
	const cardRef = useRef<HTMLDivElement>(null)
	
	const saveAsImage = async (title: string) => {
		if (cardRef.current) {
			const dataUrl = await toPng(cardRef.current, {quality: 0.95})
			const link = document.createElement('a')
			link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-project-card.png`
			link.href = dataUrl
			link.click()
		}
	}
	
	const shareToTwitter = (title: string, url: string) => {
		const text = `Check out my awesome open-source project: ${title}\n${url}`
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
		window.open(twitterUrl, '_blank')
	}
	
	const [cardColors, setCardColors] = useState({
		bgColor: "",
		textColor: "",
		subTextColor: "",
	})
	
	const sampleColors = [
		"#121212",
		"#1a1a2e",
		"#737373",
		"#f5deb3",
		"#f9f9f9"
	]
	
	const handleBgColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCardColors((prevColors) => ({
			...prevColors,
			bgColor: event.target.value,
		}));
	};
	
	const handleTextColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCardColors((prevColors) => ({
			...prevColors,
			textColor: event.target.value,
		}));
	};
	
	const handleSubTextColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCardColors((prevColors) => ({
			...prevColors,
			subTextColor: event.target.value,
		}));
	};
	
	useEffect(() => {
		if (status === "unauthenticated") {
			redirect("/");
		} else if (status === "authenticated") {
			if (userFetched) {
				fetchCreatedProjects();
			} else {
				fetchUserProfile();
			}
		}
	}, [status, userFetched]);
	
	useEffect(() => {
		if (selectedProject) {
			setEditProjectFormData({
				_id: selectedProject._id || '',
				title: selectedProject.title || ''
			})
		}
		
		if (editUserInfo) {
			setEditUserFormData({
				username: userInfo?.username || "",
				bio: userInfo?.bio || "",
				location: userInfo?.location || "",
				website: userInfo?.website || "",
				twitter: userInfo?.twitter || "",
				github: userInfo?.github || "",
			})
		}
	}, [selectedProject, editUserInfo]);
	
	useEffect(() => {
		console.log(isFetchedProject)
	}, [isFetchedProject]);
	
	if (loading) return <div>Loading...</div>;
	
	return (
		<>
			{status === "authenticated" && (
				<>
					<Header/>
					
					<main className={"flex flex-col gap-4 grow w-full max-w-[1280px] px-4 max-lg:px-6 mt-4 mb-10"}>
						<div className={"grid gap-8 md:grid-cols-2"}>
							<Card
								className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
								<CardHeader className="flex flex-row items-center gap-4">
									<Avatar size={"xl"}>
										<AvatarImage src={session?.user?.image || userInfo?.image}/>
										<AvatarFallback>
											<User2/>
										</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle>{userInfo?.name || 'User'}</CardTitle>
										<CardDescription>{userInfo?.username ? `@${userInfo?.username}` : 'No username'}</CardDescription>
									</div>
								</CardHeader>
								<CardContent>
									<p className="mb-4 text-sm text-gray-600">{userInfo?.bio || "Hey, I'm new here"}</p>
									<div className="mb-4 grid gap-2 text-sm">
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-gray-500"/>
											{userInfo?.location || 'Location not provided'}
										</div>
										<div className="flex items-center gap-2">
											<Globe className="h-4 w-4 text-gray-500"/>
											<Link
												href={userInfo?.website || '#'}
												target={userInfo?.website ? "_blank" : ""}
												className={userInfo?.website ? "text-blue-500 hover:underline" : ""}
											>
												{userInfo?.website || 'Website not provided'}
											</Link>
										</div>
										<div className="flex items-center gap-2">
											<Twitter className="h-4 w-4 text-gray-500"/>
											<Link
												href={`https://twitter.com/${userInfo?.twitter || '#'}`}
												target={userInfo?.twitter ? "_blank" : ""}
												className={userInfo?.twitter ? "text-blue-500 hover:underline" : ""}
											>
												{userInfo?.twitter ? `@${userInfo?.twitter}` : 'Account not provided'}
											</Link>
										</div>
										<div className="flex items-center gap-2">
											<Github className="h-4 w-4 text-gray-500"/>
											<Link
												href={`https://github.com/${userInfo?.github || '#'}`}
												target={userInfo?.github ? "_blank" : ""}
												className={userInfo?.github ? "text-blue-500 hover:underline" : ""}
											>
												{userInfo?.github ? `@${userInfo?.github}` : 'Account not provided'}
											</Link>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4 text-gray-500"/>
											<Link
												href={`mailto:${userInfo?.email || ''}`}
												className={userInfo?.email ? "text-blue-500 hover:underline" : ""}
											>
												{userInfo?.email || 'Email not provided'}
											</Link>
										</div>
									</div>
									<Dialog>
										<DialogTrigger asChild>
											<Button
												className="w-full"
												onClick={() => setEditUserInfo(userInfo ? userInfo : null)}
											>Edit Profile</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[425px]">
											{userInfo && userInfo?.username ? (
												<>
													<DialogHeader>
														<DialogTitle>Edit Profile</DialogTitle>
														<DialogDescription>
															Make changes to your profile here. Click save when you&apos;re done.
														</DialogDescription>
													</DialogHeader>
													<form onSubmit={handleSubmitEditUserForm}>
														<div className="grid gap-4 py-4">
															<div className="grid grid-cols-4 items-center gap-4">
																<Label htmlFor="bio" className="text-right">
																	Bio
																</Label>
																<Textarea
																	id="bio"
																	name="bio"
																	value={editUserFormData.bio}
																	onChange={handleUserInfoChange}
																	className="col-span-3"
																/>
															</div>
															<div className="grid grid-cols-4 items-center gap-4">
																<Label htmlFor="location" className="text-right">
																	Location
																</Label>
																<Input
																	id="location"
																	name="location"
																	value={editUserFormData.location}
																	onChange={handleUserInfoChange}
																	className="col-span-3"
																/>
															</div>
															<div className="grid grid-cols-4 items-center gap-4">
																<Label htmlFor="website" className="text-right">
																	Website
																</Label>
																<Input
																	id="website"
																	name="website"
																	value={editUserFormData.website}
																	onChange={handleUserInfoChange}
																	className="col-span-3"
																/>
															</div>
															<div className="grid grid-cols-4 items-center gap-4">
																<Label htmlFor="twitter" className="text-right">
																	Twitter
																</Label>
																<Input
																	id="twitter"
																	name="twitter"
																	value={editUserFormData.twitter}
																	onChange={handleUserInfoChange}
																	className="col-span-3"
																/>
															</div>
															<div className="grid grid-cols-4 items-center gap-4">
																<Label htmlFor="github" className="text-right">
																	GitHub
																</Label>
																<Input
																	id="github"
																	name="github"
																	value={editUserFormData.github}
																	onChange={handleUserInfoChange}
																	className="col-span-3"
																/>
															</div>
														</div>
														<DialogFooter>
															<Button type="submit">{editUserLoading ? <span
																className={"animate-spin rounded-full w-4 h-4 border-t-blue-500 border-2"}></span> : "Save changes"}</Button>
														</DialogFooter>
													</form>
												</>
											) : (
												<>
													<DialogHeader>
														<DialogTitle>Create your username</DialogTitle>
														<DialogDescription>
															Once your username is set, you&apos;ll be able to edit your profile.
														</DialogDescription>
													</DialogHeader>
													<form onSubmit={handleSubmitEditUserForm}>
														<div className="grid gap-4 py-4">
															<div className="grid grid-cols-4 items-center gap-4">
																<Label htmlFor="username" className="text-right">
																	Username
																</Label>
																<Input
																	id="username"
																	name="username"
																	value={editUserFormData.username}
																	onChange={handleUserInfoChange}
																	className="col-span-3"
																/>
															</div>
														</div>
														<DialogFooter>
															<Button type="submit">{editUserLoading ? <span
																className={"animate-spin rounded-full w-4 h-4 border-t-blue-500 border-2"}></span> : "Save changes"}</Button>
														</DialogFooter>
														{editUserError ? (
															<div className={"text-sm text-center text-red-500 mt-4"}>{editUserError}</div>
														) : null}
													</form>
												</>
											)}
										</DialogContent>
									</Dialog>
								</CardContent>
							</Card>
							
							<section className="grid gap-4 md:grid-cols-2">
								<Card
									className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Total Projects</CardTitle>
										<GitPullRequest className="h-4 w-4 text-muted-foreground"/>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{projects?.length || '0'}</div>
									</CardContent>
								</Card>
								<Card
									className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Contributions</CardTitle>
										<GitPullRequest className="h-4 w-4 text-muted-foreground"/>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{userInfo?.totalContributions || '0'}</div>
									</CardContent>
								</Card>
								<Card
									className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Total Stars</CardTitle>
										<Star className="h-4 w-4 text-muted-foreground"/>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{totalStars}</div>
									</CardContent>
								</Card>
								<Card
									className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Total Forks</CardTitle>
										<GitFork className="h-4 w-4 text-muted-foreground"/>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{totalForks}</div>
									</CardContent>
								</Card>
							</section>
						</div>
						
						<Tabs defaultValue="created" className="w-full">
							<div className="flex flex-col sm:flex-row items-center gap-2">
								<div>
									<TabsList className={"shadow"}>
										<TabsTrigger value="created">Created Projects</TabsTrigger>
										<TabsTrigger value="contributed">Contributed Projects</TabsTrigger>
									</TabsList>
								</div>
								
								<div className={"flex items-center gap-2"}>
									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant={"outline"}
												className={"shadow"}
												onClick={() => {
													setAddProjectFormData({
														title: "",
														category: ""
													});
													setAddProjectError("");
													setIsFetchedProject(false);
													setKeywords([])
													setCustomCategories([]);
												}}
											><Plus/></Button>
										</DialogTrigger>
										{userInfo && userInfo?.github ? (
											<>
												<DialogContent className="sm:max-w-[425px]">
													<DialogHeader>
														<DialogTitle>Add a project</DialogTitle>
														<DialogDescription>
															Add your project here. Click save when you&apos;re done.
														</DialogDescription>
													</DialogHeader>
													<form onSubmit={(e) => handleSubmitAddProjectForm(e, isFetchedProject)}>
														<div className="grid gap-4 py-4">
															<div className="grid grid-cols-4 items-center gap-4">
																<Label htmlFor="title" className="text-right">
																	Title
																</Label>
																<Input
																	id="title"
																	name="title"
																	value={addProjectFormData.title}
																	onChange={(e) =>
																		handleAddProjectInfoChange(e.target.name, e.target.value)
																	}
																	className="col-span-3"
																/>
																<Label htmlFor="category" className="text-right">
																	Category
																</Label>
																<Select
																	onValueChange={(value) =>
																		handleAddProjectInfoChange("category", value)
																	}
																	required
																>
																	<SelectTrigger className="w-[180px]">
																		<SelectValue
																			placeholder="Select a category"
																		/>
																	</SelectTrigger>
																	<SelectContent>
																		<SelectGroup>
																			<SelectLabel>Categories</SelectLabel>
																			
																			<SelectItem value="Front End">Front End</SelectItem>
																			<SelectItem value="Back End">Back End</SelectItem>
																			<SelectItem value="Full Stack">Full Stack</SelectItem>
																			<SelectItem value="Android">Android</SelectItem>
																			<SelectItem value="Apple">Apple</SelectItem>
																			<SelectItem value="AI">AI</SelectItem>
																			<SelectItem value="Machine Learning">Machine Learning</SelectItem>
																			<SelectItem value="Data Analysis">Data Analysis</SelectItem>
																			<SelectItem value="2D Games">2D Games</SelectItem>
																			<SelectItem value="3D Games">3D Games</SelectItem>
																			<SelectItem value="Browser Extension">Browser Extension</SelectItem>
																			<SelectItem value="Database Management">Database Management</SelectItem>
																			<SelectItem value="ORM">ORM</SelectItem>
																			<SelectItem value="API Development">API Development</SelectItem>
																			<SelectItem value="UI Libraries">UI Libraries</SelectItem>
																		</SelectGroup>
																	</SelectContent>
																</Select>
															</div>
														</div>
														<DialogFooter className={"flex flex-col gap-4"}>
															<Button type="submit">{addProjectLoading ? <span
																className={"animate-spin rounded-full w-4 h-4 border-t-blue-500 border-2"}></span> : !isFetchedProject ? "Add project" : "Continue"}</Button>
															
															{keywords && keywords.length > 0 ? (
																<section className={"flex flex-col gap-4"}>
																	<h4 className={'text-center'}>Would you like to add custom keywords ?</h4>
																	<div className={"flex flex-wrap justify-center gap-2"}>
																		{keywords.map((keyword: string, index: number) => (
																			<Badge
																				key={index}
																				className={`cursor-pointer hover:scale-105 duration-150 transition-all ${customCategories.includes(keyword) ? 'scale-105' : ''}`}
																				onClick={() => addCustomCategory(keyword)}
																				style={{
																					backgroundColor: customCategories.includes(keyword) ? "rgb(23, 23, 23, 0.7)" : "",
																				}}
																			>{keyword}</Badge>
																		))}
																	</div>
																</section>
															) : (
																<>
																	{isFetchedProject && (
																		<p className={'text-xs text-center place-self-center'}>No keywords found.</p>
																	)}
																</>
															)}
														</DialogFooter>
														
														{addProjectError ? (
															<div className={"text-sm text-center text-red-500 mt-4"}>{addProjectError}</div>
														) : null}
													</form>
												</DialogContent>
											</>
										) : (
											<>
												<DialogContent className="sm:max-w-[425px]">
													<DialogHeader>
														<DialogTitle>Add your GitHub username</DialogTitle>
														<DialogDescription>
															You first need to add your GitHub username to your profile.
														</DialogDescription>
													</DialogHeader>
												</DialogContent>
											</>
										)}
									</Dialog>
									
									<Button onClick={handleRefreshProjects}><RefreshCcw
										className={refreshingProjectLoading ? 'animate-spin ease-in-out' : ''}/></Button>
								</div>
							</div>
							<TabsContent value="created">
								{projects && projects.length > 0 ? (
									<section className={"flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
										{projects.map((project: Project) => (
											<Card
												className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow h-fit"}
												key={project._id}
											>
												<CardHeader>
													<CardTitle className="flex items-center justify-between">
														<span>{project.title}</span>
														<div className={"flex items-center gap-2"}>
															<Dialog>
																<DialogTrigger asChild>
																	<Button
																		variant={"outline"}
																		size={"sm"}
																		onClick={() => setSelectedProject(project)}
																	>Edit</Button>
																</DialogTrigger>
																<DialogContent className="sm:max-w-[425px]">
																	<DialogHeader>
																		<DialogTitle>Edit Project</DialogTitle>
																		<DialogDescription>
																			Switch project here. Click save when you&apos;re done. Attention, once saved, the
																			likes count will be reset.
																		</DialogDescription>
																	</DialogHeader>
																	<form onSubmit={handleSubmitEditProjectForm}>
																		<div className="grid gap-4 py-4">
																			<div className="grid grid-cols-4 items-center gap-4">
																				<Label htmlFor="title" className="text-right">
																					Title
																				</Label>
																				<Input
																					id="title"
																					name="title"
																					value={editProjectFormData.title}
																					onChange={handleEditProjectInfoChange}
																					className="col-span-3"
																				/>
																			</div>
																		</div>
																		<DialogFooter className={'gap-2 sm:gap-0 mt-4 sm:mt-0'}>
																			<Dialog>
																				<DialogTrigger asChild>
																					<Button
																						variant={"outline"}
																						className={"bg-red-300 text-red-500 hover:bg-red-400 hover:text-red-600"}
																						onClick={() => setSelectedProject(project)}
																					><Trash2/></Button>
																				</DialogTrigger>
																				<DialogContent className="sm:max-w-[425px]">
																					<DialogHeader>
																						<DialogTitle>Are you sure ?</DialogTitle>
																					</DialogHeader>
																					<form onSubmit={handleDeleteProject}>
																						<DialogFooter>
																							<Button type="submit">{deleteProjectLoading ? <span
																								className={"animate-spin rounded-full w-4 h-4 border-t-blue-500 border-2"}></span> : "Delete project"}</Button>
																						</DialogFooter>
																					</form>
																				</DialogContent>
																			</Dialog>
																			<Button type="submit">{editProjectLoading ? <span
																				className={"animate-spin rounded-full w-4 h-4 border-t-blue-500 border-2"}></span> : "Save changes"}</Button>
																		</DialogFooter>
																		{editProjectError ? (
																			<div className={"text-sm text-center text-red-500 mt-4"}>{editProjectError}</div>
																		) : null}
																	</form>
																</DialogContent>
															</Dialog>
															<Link
																href={project.url}
																target="_blank"
																rel="noopener noreferrer"
																className="text-blue-500 hover:text-blue-600"
															>
																<ExternalLink className="h-4 w-4"/>
															</Link>
														</div>
													</CardTitle>
													<div className={"flex gap-2 flex-wrap"}>
														<Badge className={"w-fit"}>
															{project.language ? project.language : "None"}
														</Badge>
														{Array.isArray(project.categories) && project.categories.map((category: string, index: number) => (
															<Badge key={index} className="w-fit">
																{category}
															</Badge>
														))}
													</div>
												
												</CardHeader>
												<CardContent className={"flex flex-col gap-1"}>
													<p
														className="text-sm text-gray-500"
														style={{
															overflow:
																showMoreState[project._id] ? "" : "hidden",
															textOverflow:
																showMoreState[project._id] ? "" : "ellipsis",
															whiteSpace:
																showMoreState[project._id] ? "" : "nowrap",
														}}
													>{project.description ? project.description : "No description"}</p>
													<ChevronDown
														className={"flex place-self-center w-6 h-6 hover:bg-accent rounded-md p-1 transition-all duration-150"}
														onClick={() => handleToggleShowMore(project._id)}
														style={{
															transform:
																showMoreState[project._id] ? "rotate(180deg)" : "",
															opacity:
																project.description ? "1" : "0"
														}}
													/>
												</CardContent>
												<CardFooter className="flex flex-col gap-4 text-sm text-gray-500 w-full">
													<div className={"flex flex-col sm:flex-row justify-between gap-2 w-full"}>
														<div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4"/>
	                              {project.stars}
                              </span>
															<span className="flex items-center gap-1">
                                <GitFork className="h-4 w-4"/>
																{project.forks}
                              </span>
															<span className="flex items-center gap-1">
                                <Heart className="h-4 w-4"/>
																{project.totalLikes}
                              </span>
														</div>
														<div>Updated: {project.updatedAt}</div>
													</div>
													<Dialog>
														<DialogTrigger asChild>
															<Button
																onClick={() => {
																	setCardColors({
																		bgColor: "#FFFFFF",
																		textColor: "#000000",
																		subTextColor: "#737373"
																	});
																}}
																className={"w-full"}
															>Share project</Button>
														</DialogTrigger>
														<DialogContent className={"flex flex-col items-center w-full max-h-[80vh] overflow-auto"}>
															<DialogTitle className={"flex flex-wrap mt-4 mb-6 sm:mb-0"}>You can share your project
																card
																everywhere</DialogTitle>
															<Card
																ref={cardRef}
																className={"w-fit sm:w-full"}
																style={{
																	backgroundColor: cardColors.bgColor,
																	color: cardColors.textColor
																}}>
																<CardHeader>
																	<CardTitle
																		className={"text-center sm:text-left text-2xl"}>{project.completeTitle}</CardTitle>
																	<CardDescription
																		className={"text-center sm:text-left"}
																		style={{
																			color: cardColors.subTextColor
																		}}>
																		{userInfo?.github}/{project.title}
																	</CardDescription>
																</CardHeader>
																<CardContent className={"flex flex-col sm:flex-row gap-4"}>
																	<div className={"rounded-md w-full h-full overflow-hidden"}>
																		<SVG
																			text={project.url}
																			options={{
																				margin: 2,
																				width: 200,
																				color: {
																					dark: '#000000',
																					light: '#FFFFFF',
																				},
																			}}
																		/>
																	</div>
																	<div className={"flex items-center justify-center w-full"}>
																		<h2 className={"text-2xl text-center"}>Seen on<br/><span
																			className={"font-semibold"}>GitPortal.org</span></h2>
																	</div>
																</CardContent>
															</Card>
															<section className={"flex flex-col gap-2 sm:gap-8 mt-6 w-full"}>
																<section className={"flex flex-col gap-2 w-full"}>
																	<article className={"flex flex-col gap-2"}>
																		<Label htmlFor={"bg-color"}>Edit the background color</Label>
																		<div className={"flex gap-2 w-full mb-4"}>
																			<div className={"flex flex-wrap sm:flex-nowrap gap-2"}>
																				{sampleColors.map((color: string) => (
																					<Button
																						key={color}
																						style={{
																							backgroundColor: color,
																						}}
																						onClick={() => setCardColors((prevColors) => ({
																							...prevColors,
																							bgColor: color
																						}))}
																						className={"w-10 border-[1px] hover:scale-105 hover:shadow duration-150 transition-all"}
																					></Button>
																				))}
																			</div>
																			<div className={"flex w-full relative"}>
																				<Input
																					type={"color"}
																					id={"bg-color"}
																					name={"bg-color"}
																					value={cardColors.bgColor}
																					onChange={handleBgColorChange}
																					className={"absolute top-0 right-0 opacity-0 cursor-pointer"}
																				></Input>
																				<div
																					className={"flex items-center justify-center w-10 h-10 border-[1px] rounded-md"}
																					style={{
																						backgroundColor: cardColors.bgColor
																					}}
																				><Pipette className={"w-4 h-4"}/></div>
																			</div>
																		</div>
																	</article>
																	<article className={"flex flex-col gap-2"}>
																		<Label htmlFor={"text-color"}>Edit the text color</Label>
																		<div className={"flex gap-2 w-full mb-4"}>
																			<div className={"flex flex-wrap sm:flex-nowrap gap-2"}>
																				{sampleColors.map((color: string) => (
																					<Button
																						key={color}
																						style={{
																							backgroundColor: color,
																						}}
																						onClick={() => setCardColors((prevColors) => ({
																							...prevColors,
																							textColor: color
																						}))}
																						className={"w-10 border-[1px] hover:scale-105 hover:shadow duration-150 transition-all"}
																					></Button>
																				))}
																			</div>
																			<div className={"flex w-full relative"}>
																				<Input
																					type={"color"}
																					id={"text-color"}
																					name={"text-color"}
																					value={cardColors.textColor}
																					onChange={handleTextColorChange}
																					className={"absolute top-0 right-0 opacity-0 cursor-pointer"}
																				></Input>
																				<div
																					className={"flex items-center justify-center w-10 h-10 border-[1px] rounded-md"}
																					style={{
																						backgroundColor: cardColors.textColor
																					}}
																				><Pipette className={"text-white w-4 h-4"}/></div>
																			</div>
																		</div>
																	</article>
																	<article className={"flex flex-col gap-2"}>
																		<Label htmlFor={"subtext-color"}>Edit the sub-text color</Label>
																		<div className={"flex gap-2 w-full"}>
																			<div className={"flex flex-wrap sm:flex-nowrap gap-2"}>
																				{sampleColors.map((color: string) => (
																					<Button
																						key={color}
																						style={{
																							backgroundColor: color,
																						}}
																						onClick={() => setCardColors((prevColors) => ({
																							...prevColors,
																							subTextColor: color
																						}))}
																						className={"w-10 border-[1px] hover:scale-105 hover:shadow duration-150 transition-all"}
																					></Button>
																				))}
																			</div>
																			<div className={"flex w-full relative"}>
																				<Input
																					type={"color"}
																					id={"subtext-color"}
																					name={"subtext-color"}
																					value={cardColors.subTextColor}
																					onChange={handleSubTextColorChange}
																					className={"absolute top-0 right-0 opacity-0 cursor-pointer"}
																				></Input>
																				<div
																					className={"flex items-center justify-center w-10 h-10 border-[1px] rounded-md"}
																					style={{
																						backgroundColor: cardColors.subTextColor
																					}}
																				><Pipette className={"text-white w-4 h-4"}/></div>
																			</div>
																		</div>
																	</article>
																</section>
																<div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-6 w-full">
																	<Button className={"w-full"} onClick={() => saveAsImage(project.title)}>Save as
																		Image</Button>
																	<Button className={"w-full"}
																	        onClick={() => shareToTwitter(project.title, project.url)}>Share
																		on
																		Twitter</Button>
																</div>
															</section>
														</DialogContent>
													</Dialog>
												</CardFooter>
											</Card>
										))}
									</section>
								) : (
									<div className={"text-center sm:text-left sm:ml-4 mt-4"}>No projects created</div>
								)}
							</TabsContent>
							<TabsContent value="contributed">
								{contributedProjects && contributedProjects.length > 0 ? (
									<section className={"grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
										{contributedProjects.map((project: Project) => (
											<Card
												className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}
												key={project._id}>
												<CardHeader>
													<CardTitle className="flex items-center justify-between">
														<span>{project.title}</span>
													</CardTitle>
													<Badge
														className={"w-fit"}>{project.language ? project.language : "No particular language"}</Badge>
												</CardHeader>
												<CardContent>
													<p className="text-sm text-gray-500">{project.description}</p>
												</CardContent>
												<CardFooter className="flex justify-between text-sm text-gray-500">
													<div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4"/>
	                            {project.stars}
                            </span>
														<span className="flex items-center gap-1">
                              <GitFork className="h-4 w-4"/>
															{project.forks}
                            </span>
														<span className="flex items-center gap-1">
                              <Heart className="h-4 w-4"/>
															{project.totalLikes}
                            </span>
													</div>
													<div>Updated: {project.updatedAt}</div>
												</CardFooter>
											</Card>
										))}
									</section>
								) : (
									<div className={"text-center sm:text-left sm:ml-4 mt-4"}>No projects contributed (coming soon)</div>
								)}
							</TabsContent>
						</Tabs>
					</main>
				</>
			)}
		</>
	)
}
