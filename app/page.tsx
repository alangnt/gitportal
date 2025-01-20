"use client"

// REACT
import {useEffect, useState} from "react"

// NEXT
import Link from "next/link";

// AUTH
import {useSession} from "next-auth/react";

// SHADCN
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

// LUCIDE
import {Bookmark, ExternalLink, GitFork, Heart, Star, Trophy, X} from "lucide-react";

// HEADER
import Header from "@/components/Header";

// Types
import {Category, Project, User} from "@/types/types";
import {categoryPipe} from "@/utils/category";

// UTILS

export default function Home() {
	const {data: session, status} = useSession();
	
	// USERS
	const [loading, setLoading] = useState<boolean>(true);
	
	// PROJECTS
	const [projects, setProjects] = useState<Project[]>([]);
	const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
	
	// FILTERS
	const [selectedLanguage, setSelectedLanguage] = useState<string>("")
	const [selectedCategory, setSelectedCategory] = useState<string>("")
	
	// SEARCHBAR
	const [searchQuery, setSearchQuery] = useState("");
	
	// PAGINATION
	const [projectsToShow, setProjectsToShow] = useState(12);
	
	// SHOWMORE BUTTON
	const handleShowMore = () => {
		setProjectsToShow(prev => prev + 12); // Show 9 more projects
	};
	
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
			
			setProjects(data.data);
			setDisplayedProjects(data.data.slice(0, projectsToShow));
			
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};
	
	// LEADERBOARD
	const ranking: Project[] = projects.sort((a: Project, b: Project) => b.likes.length - a.likes.length).slice(0, 10);
	
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
		} catch (error) {
			console.error(error);
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
	}, [status]);
	
	useEffect(() => {
		fetchProjects();
	}, []);
	
	useEffect(() => {
		let filteredProjects: Project[] = projects;
		
		if (searchQuery.trim() !== "") {
			filteredProjects = projects.filter((project: Project) =>
				project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		if (selectedLanguage.length > 0) {
			filteredProjects = projects.filter((project: Project) =>
				project.language.includes(selectedLanguage)
			);
		}
		if (selectedCategory.length > 0) {
			filteredProjects = projects.filter((project: Project) =>
				project.category.includes(selectedCategory)
			);
		}
		
		setDisplayedProjects(filteredProjects.slice(0, projectsToShow));
	}, [projectsToShow, searchQuery, selectedLanguage, selectedCategory]);
	
	if (loading) return <div>Loading...</div>;
	
	return (
		<>
			<Header/>
			
			<main
				className={"flex flex-col md:flex-row gap-4 grow w-full md:max-w-[1280px] px-4 max-lg:px-6 my-4"}>
				<div className={"flex flex-col gap-4"}>
					<section className={"flex items-center w-full relative"}>
						<Input
							type="text"
							value={searchQuery}
							onChange={handleSearch}
							placeholder={"Find an open source project now..."}
							className={"w-full shadow"}
						/>
						<Button className={'absolute right-0'} onClick={() => setSearchQuery('')} variant={'ghost'}><X/></Button>
					</section>
					
					<Card>
						<CardHeader>
							<CardTitle>Choose a filter below</CardTitle>
						</CardHeader>
						<CardContent className={"flex flex-col gap-4"}>
							<div className={"flex flex-col gap-4"}>
								<Label>Filter by language</Label>
								<div className={"flex gap-2"}>
									{[...new Set(projects.map((project: Project) => project.language))].map((language: string) => (
										<Badge
											key={language}
											className={"cursor-pointer hover:scale-105 duration-150 transition-all"}
											onClick={() => {
												setSelectedCategory("")
												setSelectedLanguage(selectedLanguage === language ? "" : language)
											}}
											style={{
												backgroundColor: selectedLanguage === language ? "rgb(23, 23, 23, 0.7)" : "",
											}}
										>{language}</Badge>
									))}
								</div>
							</div>
							<div className={"flex flex-col gap-2"}>
								<Label>Filter by category</Label>
								<div className={"flex gap-2"}>
									{[...new Set(projects.map((project: Project) => project.category))].map((category) => (
										<Badge
											key={category}
											className={"cursor-pointer hover:scale-105 duration-150 transition-all"}
											onClick={() => {
												setSelectedLanguage("")
												setSelectedCategory(selectedCategory === category ? "" : category)
											}}
											style={{
												backgroundColor: selectedCategory === category ? "rgb(23, 23, 23, 0.7)" : "",
											}}
										>{categoryPipe(category as keyof Category)}</Badge>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
					
					{projects && projects.length > 0 ? (
						<section className={"flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"}>
							{displayedProjects.map((project: Project) => (
								<Dialog key={project._id}>
									<DialogTrigger asChild>
										<Card
											className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow h-fit"}
											key={project._id}>
											<CardHeader>
												<CardTitle className="flex items-center justify-between">
													<span>{project.title}</span>
													<div className={"flex items-center gap-1"}>
														{status === "authenticated" && project.user !== userInfo?._id ? (
															<Button
																variant={"ghost"}
																onClick={(event) => {
																	event.stopPropagation();
																	handleLikeProject(project._id);
																}}
																className={"text-red-500"}
															>{project.totalLikes}
																<Heart
																	fill={project.likes && userInfo?._id && project.likes.includes(userInfo?._id) ? "red" : "white"}
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
												<div className={"flex gap-2"}>
													<Badge className={"w-fit"}>
														{project.language ? project.language : "None"}
													</Badge>
													<Badge className={"w-fit"}>{categoryPipe(project.category as keyof Category)}</Badge>
												</div>
											</CardHeader>
											<CardContent>
												<p
													className="text-sm text-gray-500 truncate">{project.description ? project.description : "No description"}</p>
											</CardContent>
											<CardFooter className="flex justify-between text-sm text-gray-500">
												<div className={"flex flex-col lg:flex-row justify-between gap-2 w-full"}>
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
											</CardFooter>
										</Card>
									</DialogTrigger>
									<DialogContent className={"sm:max-w-[425px]"}>
										<DialogHeader>
											<div className={"flex items-center gap-1"}>
												<DialogTitle className={"text-2xl"}>{project.title}</DialogTitle>
												{status === "authenticated" && project.user !== userInfo?._id ? (
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
											<div className={"flex gap-2"}>
												<Badge className={"w-fit"}>
													{project.language ? project.language : "None"}
												</Badge>
												<Badge className={"w-fit"}>{categoryPipe(project.category as keyof Category)}</Badge>
											</div>
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
					
					{projects.length > 12 && displayedProjects.length < projects.length && (
						<Button onClick={handleShowMore} className="flex place-self-center mt-4 w-fit">
							Show More
						</Button>
					)}
				</div>
				<section className={"hidden"}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Trophy className="h-5 w-5 text-yellow-500"/>
								Top 10 Most Liked Projects
							</CardTitle>
							<CardDescription>Discover the most popular open-source projects on our platform</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Rank</TableHead>
										<TableHead>Project</TableHead>
										<TableHead>Author</TableHead>
										<TableHead className={"text-center"}>Language</TableHead>
										<TableHead>Likes</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{ranking.map((project: Project, index: number) => (
										<TableRow key={project._id}>
											<TableCell className="font-medium">{index + 1}</TableCell>
											<TableCell>{project.completeTitle}</TableCell>
											<TableCell>{project.user_github}</TableCell>
											<TableCell className={"text-center"}><Badge>{project.language}</Badge></TableCell>
											<TableCell>{project.likes ? project.likes.length : "0"}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</section>
			</main>
		</>
	)
}