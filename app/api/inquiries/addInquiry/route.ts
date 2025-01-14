import {NextRequest, NextResponse} from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
	try {
		const client = await clientPromise;
		const db = client.db("opensourcefinder");
		const collection = db.collection("inquiries");
		
		const {_id, name, email, subject, message}: {
			_id: string,
			name: string,
			email: string,
			subject: string,
			message: string
		} = await req.json();
		
		if (!_id || !name || !email || !subject || !message) {
			return NextResponse.json(
				{message: "All fields are required"},
				{status: 400}
			);
		}
		
		const newInquiry = {
			user: _id,
			name: name,
			email: email,
			subject: subject,
			message: message,
			addedAt: new Date(),
		};
		
		const result = await collection.insertOne(newInquiry);
		
		return NextResponse.json(
			{message: "Message created successfully", documentId: result.insertedId},
			{status: 201}
		);
	} catch (error) {
		console.error("Error adding message:", error);
		return NextResponse.json(
			{message: "Failed to add a message"},
			{status: 500}
		);
	}
}
