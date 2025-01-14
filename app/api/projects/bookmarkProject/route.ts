import {NextRequest, NextResponse} from "next/server";
import clientPromise from "@/lib/mongodb";
import {Collection, ObjectId} from "mongodb";

type Document = {
	_id: ObjectId;
	bookmarks: string[]; // Explicitly define bookmarks as an array of strings
};

export async function PATCH(req: NextRequest) {
	try {
		const client = await clientPromise;
		const db = client.db("opensourcefinder");
		const collection: Collection<Document> = db.collection("users");
		
		const {_id, projectId}: { _id: string, projectId: string } = await req.json();
		if (!_id || !projectId) {
			return NextResponse.json(
				{message: "_id and projectId are required"},
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
		
		const user = await collection.findOne({_id: objectId});
		const existingBookmark = user?.bookmarks?.includes(projectId);
		
		if (existingBookmark) {
			const result = await collection.updateOne(
				{_id: objectId},
				{
					$pull: {bookmarks: projectId},
				},
			)
			
			if (!result) {
				return NextResponse.json(
					{message: "Document failed updating."},
					{status: 400}
				);
			}
		} else {
			const result = await collection.updateOne(
				{_id: objectId},
				{
					$addToSet: {bookmarks: projectId},
				},
			)
			
			if (!result) {
				return NextResponse.json(
					{message: "Document failed updating."},
					{status: 400}
				);
			}
		}
		
		return NextResponse.json(
			{message: "Document updated successfully."},
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