"use client"

import React, {useEffect, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import {useQRCode} from "next-qrcode";
import {toPng} from "html-to-image";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Pipette} from "lucide-react";

type GitProject = {
	forks: number;
	stars: number;
	description: string;
	language: string;
	url: string;
}

export default function ExtensionPage() {
	const searchParams = useSearchParams();
	
	const [isLoading, setIsLoading] = useState<boolean>(true);
	
	const [gitLink, setGitLink] = useState<string | undefined>(undefined);
	const [gitUser, setGitUser] = useState<string | undefined>(undefined);
	const [gitRepo, setGitRepo] = useState<string | undefined>(undefined);
	const [project, setProject] = useState<GitProject | undefined>(undefined);
	
	function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
		try {
			const parsedUrl = new URL(url);
			const parts = parsedUrl.pathname.split('/').filter(Boolean);
			
			if (parsedUrl.hostname === "github.com" && parts.length >= 2) {
				return {
					owner: parts[0],
					repo: parts[1]
				};
			}
			
			return null;
		} catch (e) {
			console.error("Invalid GitHub URL", e);
			return null;
		}
	}
	
	const fetchProject = async (gitData: { owner: string, repo: string }) => {
		try {
			const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
			const apiUrl = `${baseUrl}/api/github?owner=${gitData.owner}&repo=${gitData.repo}`;
			
			const response = await fetch(apiUrl, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
			
			const data = await response.json();
			setProject(data);
		} catch (error) {
			console.error("Error fetching GitHub data:", error);
		}
	};
	
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
		const repoUrl = searchParams.get("gitLink");
		
		if (repoUrl) {
			const parsed = parseGitHubUrl(repoUrl);
			
			if (parsed) {
				setGitLink(repoUrl);
				setGitUser(parsed.owner);
				setGitRepo(parsed.repo);
				
				fetchProject({
					owner: parsed.owner,
					repo: parsed.repo,
				}).then(() => setIsLoading(false));
			} else {
				console.error("Invalid GitHub repo URL format.");
			}
		}
	}, [searchParams]);
	
	useEffect(() => {
		if (project) {
			setCardColors({
				bgColor: "#FFFFFF",
				textColor: "#000000",
				subTextColor: "#737373"
			});
		} else {
			console.log("No project found.");
		}
	}, [project]);
	
	return (
		<>
			{isLoading && !project ? (
				<div>Loading...</div>
			) : (
				<>
					{project && (
						<div className={'lg:flex lg:flex-col p-4 w-full lg:w-1/2 lg:place-self-center lg:items-center'}>
							<Card
								ref={cardRef}
								className={"w-fit sm:w-full place-self-center"}
								style={{
									backgroundColor: cardColors.bgColor,
									color: cardColors.textColor
								}}>
								<CardHeader>
									<div className={'sm:flex sm:justify-between'}>
										<div>
											<CardTitle
												className={"text-center sm:text-left text-2xl"}>{gitRepo}</CardTitle>
											<CardDescription
												className={"text-center sm:text-left"}
												style={{
													color: cardColors.subTextColor
												}}>
												{gitUser}/{gitRepo}
											</CardDescription>
										</div>
										{project.description && project.description.length > 0 && (
											<div className={"flex items-center justify-center lg:text-center max-sm:mt-4"}>
												<h2 className={"text-lg text-center"}>Seen on<br/><span
													className={"font-semibold"}>GitPortal.org</span></h2>
											</div>
										)}
									</div>
								</CardHeader>
								<CardContent className={"flex flex-col sm:flex-row gap-4"}>
									<div className={"rounded-md w-full sm:w-fit h-full overflow-hidden"}>
										<SVG
											text={gitLink ?? 'No repo url has been found'}
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
									{project.description && project.description.length > 0 ? (
										<div
											className={"text-xl text-center w-full sm:w-1/2 sm:place-self-center sm:ml-auto max-sm:hidden"}>
											{project.description.slice(0, 150)}...
										</div>
									) : (
										<div className={"flex items-center justify-center sm:ml-auto sm:mr-4"}>
											<h2 className={"text-2xl text-center"}>Seen on<br/><span
												className={"font-semibold"}>GitPortal.org</span></h2>
										</div>
									)}
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
											<div className={"flex relative"}>
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
											<div className={"flex relative"}>
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
											<div className={"flex relative"}>
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
									<Button className={"w-full"} onClick={() => saveAsImage(gitRepo ?? 'Repo')}>Save as
										Image</Button>
									<Button className={"w-full"}
									        onClick={() => shareToTwitter(gitRepo ?? 'Repo', gitLink ?? 'Link')}>Share
										on
										Twitter</Button>
								</div>
							</section>
						</div>
					)}
				</>
			)}
		</>
	)
}
