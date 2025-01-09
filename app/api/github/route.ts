import { NextRequest, NextResponse } from "next/server";

const GITHUB_API_URL = "https://api.github.com/repos";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    if (!owner || !repo) {
      return NextResponse.json(
        {message: "owner and repo are required"},
        {status: 400}
      );
    }

    const response = await fetch(`${GITHUB_API_URL}/${owner}/${repo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch GitHub data", status: response.status },
        { status: 400 }
      );
    }

    const { stargazers_count, forks_count, language, description, updated_at } = await response.json();

    return NextResponse.json({
      stars: stargazers_count,
      forks: forks_count,
      language,
      description,
      updatedAt: updated_at,
    });
  } catch (error) {
    console.error("Error fetching GitHub repo:", error);
    return NextResponse.json(
      { message: "Failed fetching GitHub repo. Please try again later." },
      { status: 500 }
    );
  }
}
