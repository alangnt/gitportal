import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("opensourcefinder");

        const collection = db.collection("projects");

        const { user, title }: { user: string; title: string } = await req.json();

        const projectUrl = `https://github.com/${user}/${title}`;

        const checkIfAuthorized = await collection.findOne({ url: projectUrl });
        if (!checkIfAuthorized) {
            return NextResponse.json(
                { message: "User not authorized" },
                { status: 409 }
            );
        }

        const result = await collection.deleteOne({ url: projectUrl });

        if (result.deletedCount === 1) {
            return NextResponse.json(
                { message: "Project deleted successfully" },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "Failed to delete the project" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}