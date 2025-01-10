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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

// LUCIDE
import { Star, GitFork, ExternalLink, Heart } from "lucide-react";

// HEADER
import Header from "@/components/Header";

interface User {
  _id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  github: string;
  email: string;
  totalProjects: number;
  totalContributions: number;
  totalStars: number;
  totalForks: number;
}

export default function Home() {
  const { data: session, status } = useSession();

  // USERS
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // PROJECTS
  const [projects, setProjects] = useState(undefined);
  const [selectedProject, setSelectedProject] = useState(null);

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

  const [userInfo, setUserInfo] = useState<User | null>(null);

  // FETCH USER INFO
  const fetchUserProfile = async () => {
    try {
      if (!session?.user?.email) {
        throw new Error("User session is not available.");
      }

      const response = await fetch('/api/users');
      if (!response?.ok) {
        throw new Error('Failed to fetch user infos');
      }

      const data = await response.json();
      const userInfos = data.data.filter(
          (user: any) => user.email === session?.user?.email
      );

      if (userInfos.length === 0) {
        throw new Error("No user found with the given email.");
      }

      const user = userInfos[0];
      setUserInfo(user);

      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLikeProject = async (_id: string) => {
    try {
      const data = {
        _id: _id,
        userId: userInfo?._id,
      }

      const response = await fetch('/api/projects/likeProject', {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
    } catch (error) {
      console.error('Request failed:', error);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      createUserProfile();
      fetchUserProfile();
    }

    fetchProjects();
  }, [status, searchQuery]);

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
                    <div className={"flex items-center gap-1"}>
                      <Button
                          variant={"ghost"}
                          onClick={() => {
                            handleLikeProject(project._id);
                          }}
                      ><Heart className={"text-red-500"} fill={"red"} /></Button>
                      <Link
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink className="h-4 w-4"/>
                      </Link>
                    </div>
                  </CardTitle>
                  <Badge className={"w-fit"}>{project.language}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 truncate">{project.description}</p>
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
                  <div>Updated: {project.updatedAt}</div>
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