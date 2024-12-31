"use client"

// REACT
import { useEffect } from "react";

// AUTH
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

// COMPONENTS
import Header from "@/components/Header";
import { ProjectCard } from "@/components/core/project-card";

// SHADCN
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";

// LUCIDE
import {User2, MapPin, Globe, Twitter, Github, Mail, GitFork, GitPullRequest, Star, Plus } from "lucide-react";

const createdProjects = [
  {
    title: "Project A",
    description: "A revolutionary open-source project",
    language: "TypeScript",
    stars: 1200,
    forks: 300,
    lastUpdated: "2 days ago",
    url: "https://github.com/janedoe/project-a",
  },
  {
    title: "Project B",
    description: "An innovative tool for developers",
    language: "Python",
    stars: 800,
    forks: 150,
    lastUpdated: "1 week ago",
    url: "https://github.com/janedoe/project-b",
  },
]

const contributedProjects = [
  {
    title: "Famous Project X",
    description: "A popular open-source library",
    language: "JavaScript",
    stars: 10000,
    forks: 2000,
    lastUpdated: "1 day ago",
    url: "https://github.com/famous/project-x",
  },
  {
    title: "Awesome Tool Y",
    description: "A widely used developer tool",
    language: "Go",
    stars: 5000,
    forks: 800,
    lastUpdated: "3 days ago",
    url: "https://github.com/awesome/tool-y",
  },
]

export default function UserProfilePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/")
    }
  }, [status])

  if (status === "loading") {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <>
      {status === "authenticated" && (
        <>
          <Header />

          <main className={"flex flex-col place-self-center gap-4 grow w-full max-w-[1024px] px-4 max-lg:px-6 mt-4"}>
            <div className={"grid gap-8 md:grid-cols-2"}>
              <Card className={"hover:-translate-y-1 hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar size={"xl"}>
                    <AvatarImage src={session?.user?.image!} className={"cursor-pointer"}/>
                    <AvatarFallback>
                      <User2 />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>name</CardTitle>
                    <CardDescription>@username</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">bio</p>
                  <div className="mb-4 grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      location
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a href={"#"} className="text-blue-500 hover:underline">
                        website
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-gray-500" />
                      <a
                        href={"#"}
                        className="text-blue-500 hover:underline"
                      >
                        @twitter
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-gray-500" />
                      <a
                        href={"#"}
                        className="text-blue-500 hover:underline"
                      >
                        github
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a href={"#"} className="text-blue-500 hover:underline">
                        email
                      </a>
                    </div>
                  </div>
                  <Button className="w-full">Edit Profile</Button>
                </CardContent>
              </Card>

              <section className="grid gap-4 md:grid-cols-2">
                <Card className={"hover:-translate-y-1 hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <GitPullRequest className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23</div>
                  </CardContent>
                </Card>
                <Card className={"hover:-translate-y-1 hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contributions</CardTitle>
                    <GitPullRequest className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">20</div>
                  </CardContent>
                </Card>
                <Card className={"hover:-translate-y-1 hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">21</div>
                  </CardContent>
                </Card>
                <Card className={"hover:-translate-y-1 hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Forks</CardTitle>
                    <GitFork className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">20</div>
                  </CardContent>
                </Card>
              </section>
            </div>

            <Tabs defaultValue="created" className="w-full">
              <div className="flex items-center gap-2">
                <TabsList className={"shadow"}>
                  <TabsTrigger value="created">Created Projects</TabsTrigger>
                  <TabsTrigger value="contributed">Contributed Projects</TabsTrigger>
                </TabsList>

                <Button variant={"outline"} className={"shadow"}><Plus /></Button>
              </div>
              <TabsContent value="created">
                <div className="grid gap-6 md:grid-cols-2">
                  {createdProjects.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="contributed">
                <div className="grid gap-6 md:grid-cols-2">
                  {contributedProjects.map((project) => (
                    <ProjectCard key={project.title} {...project} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </>
      )}
    </>
  )
}