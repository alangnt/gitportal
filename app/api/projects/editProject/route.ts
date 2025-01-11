import {NextRequest, NextResponse} from "next/server";
import clientPromise from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function PATCH(req: NextRequest) {
	try {
		const client = await clientPromise;
		const db = client.db("opensourcefinder");
		const collection = db.collection("projects");
		
		const {_id, userId, user, title}: { _id: string, userId: string, user: string, title: string } = await req.json();
		if (!_id || !title) {
			return NextResponse.json(
				{message: "_id and title are required"},
				{status: 400}
			);
		}
		
		let objectId;
		try {
			objectId = new ObjectId(_id);
		} catch (error) {
			return NextResponse.json(
				{message: "Invalid '_id' format. Must be a valid ObjectId."},
				{status: 400}
			);
		}
		
		const baseUrl =
			process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const apiUrl = `${baseUrl}/api/github?owner=${user}&repo=${title}`;
		
		const response = await fetch(apiUrl, {
			method: "GET",
			headers: {"Content-Type": "application/json"},
		});
		
		const data = await response.json();
		
		if (response.status !== 200) {
			return NextResponse.json(
				{message: "Project doesn't exist"},
				{status: 410}
			);
		}
		
		const projectUrl = `https://github.com/${user}/${title}`;
		
		let formattedUpdatedDate = "Never updated"
		if (data.updatedAt) {
			const updatedDate = new Date(data.updatedAt);
			const options: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'long', year: 'numeric'};
			formattedUpdatedDate = updatedDate.toLocaleDateString('en-US', options);
		}
		
		const updateData = {
			title: title,
			description: data.description,
			stars: data.stars,
			forks: data.forks,
			language: data.language,
			url: projectUrl,
			user: userId,
			likes: {},
			totalLikes: 0,
			addedAt: new Date(),
			updatedAt: formattedUpdatedDate,
		}
		
		const existingProject = await collection.findOne({url: projectUrl});
		if (existingProject) {
			return NextResponse.json(
				{message: "Project already exists"},
				{status: 409}
			);
		}
		
		const result = await collection.updateOne(
			{_id: objectId},
			{$set: updateData},
		);
		
		if (result.matchedCount === 0) {
			return NextResponse.json(
				{message: "No matching document found."},
				{status: 404}
			);
		}
		
		return NextResponse.json(
			{message: "Document updated successfully.", modifiedCount: result.modifiedCount},
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