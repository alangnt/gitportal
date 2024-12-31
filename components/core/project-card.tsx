import Link from "next/link"

import { ExternalLink, GitFork, Star } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
  return (
    <Card className={"hover:-translate-y-1 hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className={"flex items-center gap-2"}>
            <Button variant={"outline"} size={"sm"}>Edit</Button>
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              <ExternalLink className="h-4 w-4" />
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
            <Star className="h-4 w-4" />
            {stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            {forks}
          </span>
        </div>
        <div>Updated: {lastUpdated}</div>
      </CardFooter>
    </Card>
  )
}

