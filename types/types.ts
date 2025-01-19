export interface User {
	_id: string;
	name: string;
	username: string;
	image: string;
	bio: string;
	location: string;
	website: string;
	twitter: string;
	github: string;
	email: string;
	bookmarks: string[];
	totalProjects: number;
	totalContributions: number;
	totalStars: number;
	totalForks: number;
}

export interface Project {
	_id: string;
	title: string;
	category: string;
	completeTitle: string;
	description: string;
	stars: number;
	forks: number;
	language: string;
	url: string;
	user: string;
	user_github: string;
	updatedAt: string;
	likes: string[];
	totalLikes: number;
	contributions: string[];
}

export type Category = {
	frontend: "Front End",
	backend: "Back End",
	fullstack: "Full Stack",
	android: "Android",
	apple: "Apple",
	ai: "AI",
	machineLearning: "Machine Learning",
	dataAnalysis: "Data Analysis",
	twoD: "2D Games",
	threeD: "3D Games",
	extension: "Browser Extension",
	database: "Database Management",
	orm: "ORM",
	api: "API Development",
	ui: "UI Libraries",
}