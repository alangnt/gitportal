import {NextRequest, NextResponse} from "next/server";
import clientPromise from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function PATCH(req: NextRequest) {
	try {
		const client = await clientPromise;
		const db = client.db("opensourcefinder");
		const projectsCollection = db.collection("projects");
		const usersCollection = db.collection("users");
		
		const {user}: { user: string } = await req.json();
		
		let objectId;
		try {
			objectId = new ObjectId(user);
		} catch (error) {
			return NextResponse.json(
				{message: "Invalid 'user' format. Must be a valid ObjectId." + error},
				{status: 400}
			);
		}
		
		const currentUser = await usersCollection.findOne({_id: objectId});
		if (!currentUser) {
			return NextResponse.json(
				{message: "No user found."},
				{status: 409}
			)
		}
		
		const userId = currentUser._id.toString();
		const userGitHub = currentUser.github;
		
		const userProjects = await projectsCollection.find({user: userId}).toArray();
		
		for (const project of userProjects) {
			const baseUrl =
				process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
			const apiUrl = `${baseUrl}/api/github?owner=${userGitHub}&repo=${project.title}`;
			
			const response = await fetch(apiUrl, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
			
			const data = await response.json();
			
			let formattedUpdatedDate = "Never updated"
			if (data.updatedAt) {
				const updatedDate = new Date(data.updatedAt);
				const options: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'long', year: 'numeric'};
				formattedUpdatedDate = updatedDate.toLocaleDateString('en-US', options);
			}
			
			const updateData = {
				description: data.description,
				stars: data.stars,
				forks: data.forks,
				language: data.language,
				updatedAt: formattedUpdatedDate,
			}
			
			const result = await projectsCollection.updateOne(
				{_id: project._id},
				{$set: updateData},
			);
			
			if (result.matchedCount === 0) {
				return NextResponse.json(
					{message: "No matching document found."},
					{status: 404}
				);
			}
		}
		
		return NextResponse.json(
			{message: "Documents updated successfully."},
			{status: 200}
		);
	} catch (error) {
		console.error("Error updating document:", error);
		return NextResponse.json(
			{message: "Failed to update document. Please try again later."},
			{status: 500}
		);
	}
}