import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function PATCH(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("opensourcefinder");
        const collection = db.collection("projects");

        const { _id, userId } : { _id: string, userId: string } = await req.json();
        if (!_id || !userId) {
            return NextResponse.json(
                {message: "_id and userId are required"},
                {status: 400}
            );
        }

        let objectId;
        try {
            objectId = new ObjectId(_id);
        } catch (error) {
            return NextResponse.json(
                { message: "Invalid '_id' format. Must be a valid ObjectId." },
                { status: 400 }
            );
        }

        const existingLike = await collection.findOne({
            _id: objectId,
            [`likes.${userId}`]: { $exists: true },
        });

        if (existingLike) {
            const result = await collection.updateOne(
                { _id: objectId },
                {
                    $unset: { [`likes.${userId}`]: "" },
                    $inc: { totalLikes: -1 }
                },
            )
        } else {
            const result = await collection.updateOne(
                { _id: objectId },
                {
                    $set: { [`likes.${userId}`]: true },
                    $inc: { totalLikes: 1 }
                },
            )
        }

        return NextResponse.json(
            { message: "Document updated successfully." },
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