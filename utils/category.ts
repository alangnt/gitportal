import {Category} from "@/types/types";

export const categoryPipe = (categoryKey: keyof Category): string => {
	const categories: Category = {
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
	};
	
	return categories[categoryKey];
};