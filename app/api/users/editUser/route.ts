import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("opensourcefinder");
    const collection = db.collection("users");

    // Parse the request body
    const { _id, bio, location, website, twitter, github } = await req.json() as {
      _id: string;
      bio?: string;
      location?: string;
      website?: string;
      twitter?: string;
      github?: string;
    };

    // Ensure _id is provided
    if (!_id) {
      return NextResponse.json({ message: "The '_id' field is required." }, { status: 400 });
    }

    // Prepare the update object dynamically (only including fields that were provided)
    const updateData = Object.fromEntries(
      Object.entries({ bio, location, website, twitter, github }).filter(([_, value]) => value !== undefined)
    );

    // Ensure there is something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No fields to update." }, { status: 400 });
    }

    // Perform the update
    const result = await collection.updateOne(
      { item: _id },
      { $set: updateData }
    );

    // Handle the result of the update
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "No matching document found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Document updated successfully.", modifiedCount: result.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { message: "Failed to update document. Please try again later." },
      { status: 500 }
    );
  }
}