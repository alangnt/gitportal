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

    if (response.status !== 200) {
      return NextResponse.json(
        { message: "Project doesn't exist"},
        { status: 410 }
      );
    }

    const projectUrl = `https://github.com/${user}/${title}`;

    let formattedUpdatedDate = "Never updated"
    if (data.updatedAt) {
      const updatedDate = new Date(data.updatedAt);
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      formattedUpdatedDate = updatedDate.toLocaleDateString('en-US', options);
    }

    const newProject = {
      title: title,
      description: data.description,
      stars: data.stars,
      forks: data.forks,
      language: data.language,
      url: projectUrl,
      user: _id,
      likes: {},
      totalLikes: 0,
      addedAt: new Date(),
      updatedAt: formattedUpdatedDate,
    };

    const existingProject = await collection.findOne({ url: projectUrl });
    if (existingProject) {
      return NextResponse.json(
          { message: "Project already exists"},
          { status: 409 }
      );
    }

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
