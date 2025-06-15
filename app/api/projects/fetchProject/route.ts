import {NextRequest, NextResponse} from "next/server";
import clientPromise from "@/lib/mongodb";
import {Category} from "@/types/types";

export async function POST(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("opensourcefinder");
        const collection = db.collection("projects");

        const {_id, user, title, category, categories}: {
            _id: string;
            user: string,
            title: string,
            category: Category,
            categories: string[]
        } = await req.json();
        if (!_id || !user || !category || !categories) {
            console.log(_id, user, title, category, categories);
            return NextResponse.json(
                {message: "User and title are required"},
                {status: 400}
            );
        }

        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL;
        const apiUrl = `${baseUrl}/api/github?owner=${user}&repo=${title}`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        if (!response.ok) {
            return NextResponse.json(
                {message: "Failed to fetch GitHub data", status: response.status},
                {status: 400}
            );
        }

        const data = await response.json();

        if (response.status !== 200) {
            return NextResponse.json(
                {message: "Project doesn't exist"},
                {status: 410}
            );
        }

        const projectUrl = `https://github.com/${user}/${title}`;

        const project = {
            title: title,
            description: data.description,
        };

        const existingProject = await collection.findOne({url: projectUrl});
        if (existingProject) {
            return NextResponse.json(
                {message: "Project already exists"},
                {status: 409}
            );
        }

        return NextResponse.json(
            {message: project.description || ''},
            {status: 201}
        );
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json(
            {message: "Failed to find a project"},
            {status: 500}
        );
    }
}
