import {NextRequest, NextResponse} from "next/server";
import {ObjectId} from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
	try {
		const client = await clientPromise;
		const db = client.db("opensourcefinder");
		const collection = db.collection("users");
		
		const {_id, username, bio, location, website, twitter, github} = await req.json();
		
		if (!_id) {
			return NextResponse.json(
				{message: "The '_id' field is required."},
				{status: 400}
			);
		}
		
		let objectId;
		try {
			objectId = new ObjectId(_id);
		} catch (error) {
			return NextResponse.json(
				{message: "Invalid '_id' format. Must be a valid ObjectId." + error},
				{status: 400}
			);
		}
		
		let updateData = null
		
		if (!username) {
			const existingUsername = await collection.findOne({username})
			if (existingUsername) {
				return NextResponse.json(
					{message: "User with this username already exists"},
					{status: 409}
				);
			}
			
			updateData = {
				username: username,
			}
		} else {
			updateData = Object.fromEntries(
				Object.entries({username, bio, location, website, twitter, github}).filter(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					([_, value]) => value !== undefined
				)
			);
		}
		
		if (Object.keys(updateData).length === 0) {
			return NextResponse.json(
				{message: "No fields to update."},
				{status: 400}
			);
		}
		
		const result = await collection.updateOne(
			{_id: objectId},
			{$set: updateData}
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
