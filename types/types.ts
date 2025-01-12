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
	completeTitle: string;
	description: string;
	stars: number;
	forks: number;
	language: string;
	url: string;
	user: string;
	updatedAt: string;
	likes: string[];
	totalLikes: number;
	contributions: string[];
}