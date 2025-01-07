import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("opensourcefinder");
    const collection = db.collection("projects");

    const { _id, user, title }: { _id: string, user: string, title: string } = await req.json();
    if (!user || !title) {
      return NextResponse.json(
        { message: "User and title are required" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/github?owner=${user}&repo=${title}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch GitHub data", status: response.status },
        { status: 400 }
      );
    }

    const data = await response.json();

    if (!data) {
      return NextResponse.json({ status: 400 });
    }

    const projectUrl = `https://github.com/${user}/${title}`;

    const newProject = {
      title: title,
      description: data.description,
      stars: data.stars,
      forks: data.forks,
      language: data.language,
      url: projectUrl,
      user: _id,
      addedAt: new Date(),
      updatedAt: data.updatedAt,
    };

    const result = await collection.insertOne(newProject);

    return NextResponse.json(
      { message: "User created successfully", documentId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding project:", error);
    return NextResponse.json(
      { message: "Failed to add a project" },
      { status: 500 }
    );
  }
}
