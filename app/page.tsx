"use client"

// REACT
import { useState, useEffect,  } from "react"

// NEXT
import Link from "next/link";

// AUTH
import { useSession } from "next-auth/react";

// SHADCN
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// LUCIDE
import {Star, GitFork, ExternalLink} from "lucide-react";

// HEADER
import Header from "@/components/Header";
import {Badge} from "@/components/ui/badge";

export default function Home() {
  const { data: session, status } = useSession();

  // USERS
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // PROJECTS
  const [projects, setProjects] = useState(undefined);

  // SEARCHBAR
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      // TODO: think about keeping the filtered projects or not
      // const userProjects = data.data.filter((project: any) => project.user === "6771474072a98abcc8c860fd");

      if (searchQuery.trim() !== "") {
        const filteredBySearch = data.data.filter((project: any) => project.title && project.title.toLowerCase().includes(searchQuery));
        setProjects(filteredBySearch);
      } else {
        setProjects(data.data);
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const createUserProfile = async () => {
    const data = { name: session?.user?.name, email: session?.user?.email, image: session?.user?.image };

    const response = await fetch("/api/users/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
  }

  useEffect(() => {
    if (status === "authenticated") {
      createUserProfile();
    }

    fetchProjects();
  }, [status, searchQuery]); // Empty dependency array ensures this runs once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Header />

      <main className={"flex flex-col gap-4 grow w-full max-w-[1280px] max-lg:px-6 mt-4"}>
        <section className={"w-full"}>
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder={"Find an open source project now..."}
            className={"w-full shadow"}
          />
        </section>

        {projects && projects.length > 0 ? (
          <section className={"grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
            {projects.map((project: any) => (
              <Card className={"hover:-translate-y-1 hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"} key={project._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{project.title}</span>
                    <Link
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <ExternalLink className="h-4 w-4"/>
                    </Link>
                  </CardTitle>
                  <Badge className={"w-fit"}>{project.language}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4"/>
                      {project.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-4 w-4"/>
                      {project.forks}
                    </span>
                  </div>
                  <div>Updated: {project.lastUpdated}</div>
                </CardFooter>
              </Card>
            ))}
          </section>
        ) : (
          <div>No projects found</div>
        )}
      </main>
    </>
  )
}