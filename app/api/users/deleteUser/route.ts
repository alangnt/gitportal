import {NextRequest, NextResponse} from "next/server";
import clientPromise from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function DELETE(req: NextRequest) {
	try {
		const client = await clientPromise;
		const db = client.db("opensourcefinder");
		
		const collection = db.collection("users");
		
		const {_id}: { _id: string } = await req.json();
		
		let objectId;
		try {
			objectId = new ObjectId(_id);
		} catch (error) {
			return NextResponse.json(
				{message: "Invalid '_id' format. Must be a valid ObjectId." + error},
				{status: 400}
			);
		}
		
		const result = await collection.deleteOne({_id: objectId});
		
		if (result.deletedCount === 1) {
			return NextResponse.json(
				{message: "User deleted successfully"},
				{status: 200}
			);
		} else {
			return NextResponse.json(
				{message: "Failed to delete the user"},
				{status: 500}
			);
		}
	} catch (error) {
		console.error("Error deleting user:", error);
		return NextResponse.json(
			{message: "Internal server error"},
			{status: 500}
		);
	}
}