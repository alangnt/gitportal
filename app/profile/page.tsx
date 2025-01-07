"use client"

// REACT
import { useEffect, useState } from "react";

// AUTH
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

// COMPONENTS
import Header from "@/components/Header";

// SHADCN
import {
  Card,
  CardContent,
  CardDescription, CardFooter,
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
import {
  User2,
  MapPin,
  Globe,
  Twitter,
  Github,
  Mail,
  GitFork,
  GitPullRequest,
  Star,
  Plus,
  ExternalLink,
  Trash2
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";

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

export default function UserProfilePage() {
  const { data: session, status } = useSession();

  // USERS
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userFetched, setUserFetched] = useState(false);

  // EDIT USER PROFILE
  const [editUserInfo, setEditUserInfo] = useState<User | null>(null);

  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      setUserFetched(true);

      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  // PROJECTS
  const [projects, setProjects] = useState(undefined);
  const [contributedProjects, setContributedProjects] = useState(undefined);
  const [selectedProject, setSelectedProject] = useState(null);

  // FETCH USER'S PROJECTS
  const fetchCreatedProjects = async () => {
    if (!userInfo) return;

    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();

      const contributedProjects = data.data.filter(
        (project: any) => project.contributions && project.contributions[userInfo._id] === true
      );
      const userProjects = data.data.filter(
        (project: any) => project.user === userInfo._id
      );

      setProjects(userProjects);
      setContributedProjects(contributedProjects);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const [addProjectFormData, setAddProjectFormData] = useState({
    title: ''
  })

  const [editProjectFormData, setEditProjectFormData] = useState({
    _id: "",
    title: "",
  })

  const [editUserFormData, setEditUserFormData] = useState({
    bio: '',
    location: '',
    website: '',
    twitter: '',
    github: '',
  })

  const handleAddProjectInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setAddProjectFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditProjectInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditProjectFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUserInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditUserFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [editUserLoading, setEditUserLoading] = useState<boolean>(false);

  const handleSubmitEditUserForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditUserLoading(true);

    const data = {
      _id: userInfo?._id,
      ...editUserFormData
    };

    try {
      const response = await fetch('/api/users/editUser', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Error updating:', result.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
    } finally {
      setEditUserLoading(false);
    }
  };

  // ADD PROJECT ERROR MESSAGE
  const [addProjectError, setAddProjectError] = useState<string | null>(null);
  const [addProjectLoading, setAddProjectLoading] = useState(false);

  const handleSubmitAddProjectForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddProjectLoading(true);

    const data = {
      _id: userInfo?._id,
      user: userInfo?.github,
      ...addProjectFormData
    }

    try {
      const response = await fetch('/api/projects/addProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        window.location.reload();
      } else {
        if (response.status === 409) {
          setAddProjectError("Project already exists");
        }
        console.error('Error adding:', result.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
    } finally {
      setAddProjectLoading(false);
    }
  }

  const handleSubmitEditProjectForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      userId: userInfo?._id,
      user: userInfo?.github,
      ...editProjectFormData
    }

    try {
      const response = await fetch('/api/projects/editProject', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Error updating:', result.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  }

  const [deleteProjectLoading, setDeleteProjectLoading] = useState(false);

  const handleDeleteProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDeleteProjectLoading(true);

    const data = {
      user: userInfo?.github,
      title: selectedProject?.title
    }

    try {
      const response = await fetch('/api/projects/deleteProject', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Error deleting:', result.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
    } finally {
      setDeleteProjectLoading(false);
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    } else if (status === "authenticated") {
      if (userFetched) {
        fetchCreatedProjects()
      } else {
        fetchUserProfile();
      }
    }
  }, [status, userFetched]);

  useEffect(() => {
    if (selectedProject) {
      setEditProjectFormData({
        _id: selectedProject._id || '',
        title: selectedProject.title || ''
      })
    }

    if (editUserInfo) {
      setEditUserFormData({
        bio: userInfo?.bio || "",
        location: userInfo?.location || "",
        website: userInfo?.website || "",
        twitter: userInfo?.twitter || "",
        github: userInfo?.github || "",
      })
    }
  }, [selectedProject, editUserInfo]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {status === "authenticated" && (
        <>
          <Header />

          <main className={"flex flex-col place-self-center gap-4 grow w-full max-w-[1024px] px-4 max-lg:px-6 mt-4 mb-10"}>
            <div className={"grid gap-8 md:grid-cols-2"}>
              <Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar size={"xl"}>
                    <AvatarImage src={session?.user?.image || userInfo?.image}/>
                    <AvatarFallback>
                      <User2 />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{userInfo?.name || 'User'}</CardTitle>
                    <CardDescription>@{userInfo?.username || 'username'}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">{userInfo?.bio || "Hey, I'm new here"}</p>
                  <div className="mb-4 grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {userInfo?.location || 'Location not provided'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <Link
                          // TODO: add a callback if links are not provided
                          href={userInfo?.website || '#'}
                          target="_blank"
                          className="text-blue-500 hover:underline"
                      >
                        {userInfo?.website || 'Website not provided'}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-gray-500" />
                      <Link
                        href={`https://twitter.com/${userInfo?.twitter || '#'}`}
                        target={"_blank"}
                        className="text-blue-500 hover:underline"
                      >
                        @{userInfo?.twitter || 'Account not provided'}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-gray-500" />
                      <Link
                        href={`https://github.com/${userInfo?.github || '#'}`}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        @{userInfo?.github || 'Account not provided'}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Link
                          href={`mailto:${userInfo?.email || ''}`}
                          className="text-blue-500 hover:underline"
                      >
                        {userInfo?.email || 'Email not provided'}
                      </Link>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full"
                        onClick={() => setEditUserInfo(userInfo ? userInfo : null)}
                      >Edit Profile</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitEditUserForm}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">
                              Bio
                            </Label>
                            <Textarea
                              id="bio"
                              name="bio"
                              value={editUserFormData.bio}
                              onChange={handleUserInfoChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">
                              Location
                            </Label>
                            <Input
                              id="location"
                              name="location"
                              value={editUserFormData.location}
                              onChange={handleUserInfoChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="website" className="text-right">
                              Website
                            </Label>
                            <Input
                              id="website"
                              name="website"
                              value={editUserFormData.website}
                              onChange={handleUserInfoChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="twitter" className="text-right">
                              Twitter
                            </Label>
                            <Input
                              id="twitter"
                              name="twitter"
                              value={editUserFormData.twitter}
                              onChange={handleUserInfoChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="github" className="text-right">
                              GitHub
                            </Label>
                            <Input
                              id="github"
                              name="github"
                              value={editUserFormData.github}
                              onChange={handleUserInfoChange}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">{editUserLoading ? <span className={"animate-spin rounded-full w-4 h-4 border-t-blue-500 border-2"}></span> : "Save changes"}</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <section className="grid gap-4 md:grid-cols-2">
                <Card
                  className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <GitPullRequest className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{projects?.length || '0'}</div>
                  </CardContent>
                </Card>
                <Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contributions</CardTitle>
                    <GitPullRequest className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userInfo?.totalContributions || '0'}</div>
                  </CardContent>
                </Card>
                <Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userInfo?.totalStars || '0'}</div>
                  </CardContent>
                </Card>
                <Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Forks</CardTitle>
                    <GitFork className="h-4 w-4 text-muted-foreground"/>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userInfo?.totalForks || '0'}</div>
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

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={"shadow"}
                    ><Plus /></Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add a project</DialogTitle>
                      <DialogDescription>
                        Add your project here. Click save when you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitAddProjectForm}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="title"
                            name="title"
                            value={addProjectFormData.title}
                            onChange={handleAddProjectInfoChange}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">{addProjectLoading ? <span className={"animate-spin rounded-full w-4 h-4 border-t-blue-500 border-2"}></span> : "Save changes"}</Button>
                      </DialogFooter>

                      {addProjectError ? (
                          <div className={"text-sm text-center text-red-500 mt-4"}>{addProjectError}</div>
                      ) : null}
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <TabsContent value="created">
                  {projects ? (
                    <section className={"grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                      {projects.map((project: any) => (
                        <Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow h-46"} key={project._id}>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>{project.title}</span>
                              <div className={"flex items-center gap-2"}>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                        size={"sm"}
                                        variant={"outline"}
                                        className={"bg-red-300 text-red-500 hover:bg-red-400 hover:text-red-600"}
                                        onClick={() => setSelectedProject(project)}
                                    ><Trash2 /></Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Are you sure ?</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleDeleteProject}>
                                      <DialogFooter>
                                        <Button type="submit">{deleteProjectLoading ? <span className={"animate-spin rounded-full w-4 h-4 border-t-blue-500 border-2"}></span> : "Delete project"}</Button>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      size={"sm"}
                                      onClick={() => setSelectedProject(project)}
                                    >Edit</Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit Project</DialogTitle>
                                      <DialogDescription>
                                        Make changes to your project here. Click save when you&apos;re done.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmitEditProjectForm}>
                                      <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <Label htmlFor="title" className="text-right">
                                            Title
                                          </Label>
                                          <Input
                                            id="title"
                                            name="title"
                                            value={editProjectFormData.title}
                                            onChange={handleEditProjectInfoChange}
                                            className="col-span-3"
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button type="submit">Save changes</Button>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>
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
                            <Badge className={"w-fit"}>{project.language ? project.language : "No particular language"}</Badge>
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
                            <div>Updated: {project.lastUpdated}</div>
                          </CardFooter>
                        </Card>
                      ))}
                    </section>
                  ) : (
                    <div>No projects created</div>
                  )}
              </TabsContent>
              <TabsContent value="contributed">
                {contributedProjects && contributedProjects.length > 0 ? (
                  <section className={"grid md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                    {contributedProjects.map((project: any) => (
                      <Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"} key={project._id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{project.title}</span>
                          </CardTitle>
                          <Badge className={"w-fit"}>{project.language ? project.language : "No particular language"}</Badge>
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
                  <div>No projects contributed</div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </>
      )}
    </>
  )
}