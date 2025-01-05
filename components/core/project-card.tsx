import Link from "next/link"

import { useState } from "react";

import {ExternalLink, GitFork, Star} from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

interface ProjectCardProps {
  title: string
  description: string
  language: string
  stars: number
  forks: number
  lastUpdated: string
  url: string
}

export function ProjectCard({
                              title,
                              description,
                              language,
                              stars,
                              forks,
                              lastUpdated,
                              url,
                            }: ProjectCardProps) {
  const [edit, setEdit] = useState(false)

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    language: "",
    url: ""
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <Card className={"hover:-translate-y-1 hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <div className={"flex items-center gap-2"}>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"outline"} size={"sm"} onClick={() => setEdit(true)}>Edit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogDescription>
                      Make changes to your project here. Click save when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <form>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          value={editFormData.title}
                          onChange={handleChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={editFormData.description}
                          onChange={handleChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="language" className="text-right">
                          Language
                        </Label>
                        <Input
                          id="language"
                          name="language"
                          value={editFormData.language}
                          onChange={handleChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url" className="text-right">
                          URL
                        </Label>
                        <Input
                          id="url"
                          name="url"
                          value={editFormData.url}
                          onChange={handleChange}
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
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                <ExternalLink className="h-4 w-4"/>
              </Link>
            </div>
          </CardTitle>
          <Badge className={"w-fit"}>{language}</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4"/>
            {stars}
          </span>
            <span className="flex items-center gap-1">
            <GitFork className="h-4 w-4"/>
              {forks}
          </span>
          </div>
          <div>Updated: {lastUpdated}</div>
        </CardFooter>
      </Card>

      {edit && (
        <>

        </>
      )}
    </>
  )
}

