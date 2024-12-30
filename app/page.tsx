"use client"

// REACT
import { useState, useEffect } from "react"

// NEXT
import Link from "next/link";

// SHADCN
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// LUCIDE
import { Star, GitFork } from "lucide-react";

// HEADER
import Header from "@/components/Header";

export default function Home() {
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
      // const userProjects = data.data.filter((project: any) => project.user === "6771474072a98abcc8c860fd");

      if (searchQuery.trim() !== "") {
        const filteredBySearch = data.data.filter((project: any) => project.title && project.title.toLowerCase().includes(searchQuery));
        setProjects(filteredBySearch);
      } else {
        setProjects(data.data); // If searchQuery is empty, just set the filtered by user projects
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchQuery]); // Empty dependency array ensures this runs once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Header />

      <main className={"flex flex-col place-self-center gap-4 grow w-full max-w-[1024px] max-lg:px-6 mt-4"}>
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
              <Card key={project._id}
                    className={"hover:-translate-y-1 hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
                <CardHeader>
                  <CardTitle>
                    <Link href={"#"} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {project.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>projectTitle/projectTitle</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm mb-4">This is a small description of the project</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4"/>
                    45.000
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-4 h-4"/>
                    50.0000
                  </span>
                  {project.language && <span>{project.language}</span>}
                  <span>TypeScript</span>
                  </div>
                </CardContent>
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