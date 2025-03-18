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
	categories: string[];
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
	addedAt: Date;
}

export type Category = "Front End"
	| "Back End"
	| "Full Stack"
	| "Android"
	| "Apple"
	| "AI"
	| "Machine Learning"
	| "Data Analysis"
	| "2D Games"
	| "3D Games"
	| "Browser Extension"
	| "Database Extension"
	| "ORM"
	| "API Development"
	| "UI Libraries"