"use client"

// REACT
import {useEffect, useState} from "react"

// NEXT
import Link from "next/link";

// AUTH
import {useSession} from "next-auth/react";

// SHADCN
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

// LUCIDE
import {Bookmark, ExternalLink, GitFork, Heart, Star} from "lucide-react";

// HEADER
import Header from "@/components/Header";

// Types
import {Project, User} from "@/types/types";

export default function Home() {
	const {data: session, status} = useSession();
	
	// USERS
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	
	// PROJECTS
	const [projects, setProjects] = useState(undefined);
	
	// SEARCHBAR
	const [searchQuery, setSearchQuery] = useState("");
	
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	}
	
	// FETCH PROJECTS
	const fetchProjects = async () => {
		try {
			const response = await fetch('/api/projects');
			if (!response.ok) {
				throw new Error('Failed to fetch projects');
			}
			const data = await response.json();
			
			if (searchQuery.trim() !== "") {
				const filteredBySearch = data.data.filter((project: Project) => project.title && project.title.toLowerCase().includes(searchQuery));
				setProjects(filteredBySearch);
			} else {
				setProjects(data.data);
			}
			
			setLoading(false);
		} catch (err: any) {
			setError(err.message);
			setLoading(false);
		}
	};
	
	const createUserProfile = async () => {
		const data = {name: session?.user?.name, email: session?.user?.email, image: session?.user?.image};
		
		const response = await fetch("/api/users/createUser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data)
		});
		
		const result = await response.json();
		
		if (!result) {
			console.error('Failed to create user');
		}
	}
	
	const [userInfo, setUserInfo] = useState<User | null>(null);
	
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
			
			setLoading(false);
		} catch (err: any) {
			console.error(err);
			setError(err.message);
			setLoading(false);
		}
	};
	
	const handleLikeProject = async (_id: string) => {
		try {
			const data = {
				_id: _id,
				userId: userInfo?._id,
			}
			
			const response = await fetch('/api/projects/likeProject', {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data)
			});
			
			const result = await response.json();
			
			if (!result) {
				console.error('Failed to like project');
			}
			
			fetchProjects()
		} catch (error) {
			console.error('Request failed:', error);
		}
	}
	
	const handleBookmarkProject = async (_id: string) => {
		try {
			const data = {
				_id: userInfo?._id,
				projectId: _id
			}
			
			const response = await fetch('/api/projects/bookmarkProject', {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data)
			})
			
			const result = await response.json();
			
			if (!result) {
				console.error('Failed to bookmark project');
			}
			
			fetchUserProfile()
		} catch (error) {
			console.error('Request failed:', error);
		}
	}
	
	useEffect(() => {
		if (status === "authenticated") {
			createUserProfile();
			fetchUserProfile();
		}
		
		fetchProjects();
	}, [status, searchQuery]);
	
	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	
	return (
		<>
			<Header/>
			
			<main className={"flex flex-col gap-4 grow w-full md:max-w-[1280px] px-4 max-lg:px-6 mt-4"}>
				<section className={"w-full"}>
					<Input
						type="text"
						value={searchQuery}
						onChange={handleSearch}
						placeholder={"Find an open source project now..."}
						className={"w-full shadow"}
					/>
				</section>
				
				{projects && projects.length > 0 ? (
					<section className={"grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"}>
						{projects.map((project: Project) => (
							<Dialog key={project._id}>
								<DialogTrigger asChild>
									<Card
										className={"hover:-translate-y-1 hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}
										key={project._id}>
										<CardHeader>
											<CardTitle className="flex items-center justify-between">
												<span>{project.title}</span>
												<div className={"flex items-center gap-1"}>
													{status === "authenticated" && project.user === userInfo?._id ? (
														<Button
															variant={"ghost"}
															onClick={(event) => {
																event.stopPropagation();
																handleLikeProject(project._id);
															}}
															className={"text-red-500"}
														>{project.totalLikes}
															<Heart
																fill={project.likes && userInfo?._id && project.likes.includes(userInfo._id) ? "red" : "white"}
															/>
														</Button>
													) : null}
													{status === "authenticated" ? (
														<Button
															variant={"ghost"}
															onClick={(event) => {
																event.stopPropagation();
																handleBookmarkProject(project._id)
															}}
														>
															<Bookmark
																fill={userInfo?.bookmarks && userInfo?.bookmarks.includes(project._id) ? "black" : "white"}
															/>
														</Button>
													) : null}
													<Link
														href={project.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-500 hover:text-blue-600"
														onClick={(event) => {
															event.stopPropagation();
														}}
													>
														<ExternalLink className="h-4 w-4"/>
													</Link>
												</div>
											</CardTitle>
											<Badge className={"w-fit"}>{project.language}</Badge>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-gray-500 md:truncate">{project.description}</p>
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
											</div>
											<div>Updated: {project.updatedAt}</div>
										</CardFooter>
									</Card>
								</DialogTrigger>
								<DialogContent className={"sm:max-w-[425px]"}>
									<DialogHeader>
										<div className={"flex items-center gap-1"}>
											<DialogTitle className={"text-2xl"}>{project.title}</DialogTitle>
											{project.user === userInfo?._id ? (
												<Button
													variant={"ghost"}
													onClick={(event) => {
														event.stopPropagation();
														handleLikeProject(project._id);
													}}
													className={"text-red-500"}
												>{project.totalLikes}
													<Heart
														fill={project.likes && userInfo?._id && project.likes.includes(userInfo._id) ? "red" : "white"}
													/>
												</Button>
											) : null}
											{status === "authenticated" ? (
												<Button
													variant={"ghost"}
													onClick={(event) => {
														event.stopPropagation();
														handleBookmarkProject(project._id)
													}}
												>
													<Bookmark
														fill={userInfo?.bookmarks && userInfo?.bookmarks.includes(project._id) ? "black" : "white"}
													/>
												</Button>
											) : null}
										</div>
										<Badge className={"w-fit"}>{project.language}</Badge>
									</DialogHeader>
									<DialogDescription>{project.description}</DialogDescription>
									<DialogFooter>
										<div className="flex justify-between text-sm text-gray-500 w-full">
											<div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4"/>
	                        {project.stars}
                        </span>
												<span className="flex items-center gap-1">
                            <GitFork className="h-4 w-4"/>
													{project.forks}
                        </span>
											</div>
											<div>Updated: {project.updatedAt}</div>
										</div>
									</DialogFooter>
									<Button>
										<Link
											href={project.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-2"
										>Visit the project
											<ExternalLink className="h-4 w-4"/>
										</Link>
									</Button>
								</DialogContent>
							</Dialog>
						))}
					</section>
				) : (
					<div>No projects found</div>
				)}
			</main>
		</>
	)
}