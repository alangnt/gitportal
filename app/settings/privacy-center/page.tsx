import Link from "next/link"
import {ArrowRight, Cookie, FileText} from 'lucide-react'

import Header from "@/components/Header"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"

export default function PrivacyCenterPage() {
	return (
		<>
			<Header/>
			
			<main className="flex flex-col gap-4 grow w-full md:max-w-[1280px] px-4 max-lg:px-6 mt-4 mb-6">
				<h1 className="text-3xl font-bold">Privacy Center</h1>
				<div className="grid gap-6 md:grid-cols-2">
					<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
						<CardHeader>
							<CardTitle>Your Privacy Rights</CardTitle>
							<CardDescription>Learn about your data privacy rights</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="mb-4">We respect your privacy and give you control over your data. You have the right
								to:</p>
							<ul className="list-disc pl-5 flex flex-col gap-2">
								<li>Access your personal data</li>
								<li>Correct inaccurate data</li>
								<li>Delete your data</li>
								<li>Restrict processing of your data</li>
								<li>Object to processing of your data</li>
								<li>Data portability</li>
							</ul>
						</CardContent>
					</Card>
					<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
						<CardHeader>
							<CardTitle>Data We Collect</CardTitle>
							<CardDescription>Understand what data we collect and why</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="mb-4">We collect and process the following types of data:</p>
							<ul className="list-disc pl-5 flex flex-col gap-2">
								<li>Account information (e.g., name, email)</li>
								<li>Profile information</li>
								<li>Project data</li>
								<li>Usage data</li>
								<li>Communication data</li>
							</ul>
							<p className="mt-4">We use this data to provide and improve our services, and to personalize your
								experience.</p>
						</CardContent>
					</Card>
				</div>
				<div className="mb-12">
					<h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="h-5 w-5"/>
									Terms of Service
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4">Review our Terms of Service to understand the rules and regulations governing the
									use of our platform.</p>
								<Link href="/settings/terms-of-service">
									<Button variant="outline" className="w-full">
										View Terms of Service <ArrowRight className="ml-2 h-4 w-4"/>
									</Button>
								</Link>
							</CardContent>
						</Card>
						<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Cookie className="h-5 w-5"/>
									Cookie Policy
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4">Learn about how we use cookies and similar technologies on our website.</p>
								<Link href="/settings/cookie-policy">
									<Button variant="outline" className="w-full">
										View Cookie Policy <ArrowRight className="ml-2 h-4 w-4"/>
									</Button>
								</Link>
							</CardContent>
						</Card>
					</div>
				</div>
				<div className="flex justify-center space-x-4">
					<Link href="/settings/privacy-policy">
						<Button variant="outline">View Full Privacy Policy</Button>
					</Link>
				</div>
			</main>
		</>
	)
}

