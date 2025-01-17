import {ArrowRight, BookOpen, Eye, Lock, Shield} from 'lucide-react'
import Link from 'next/link'

import Header from "@/components/Header"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"

export default function PrivacyPolicyPage() {
	return (
		<>
			<Header/>
			
			<main className="flex flex-col gap-4 grow w-full md:max-w-[1280px] px-4 max-lg:px-6 mt-4 mb-6">
				<h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
				<p className="text-muted-foreground mb-8">Last updated: January 13, 2025</p>
				
				<div className="grid gap-6 md:grid-cols-2 mb-12">
					<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5"/>
								Your Privacy Matters
							</CardTitle>
							<CardDescription>We are committed to protecting your personal information</CardDescription>
						</CardHeader>
						<CardContent>
							<p>At GitPortal, we value your trust and are dedicated to safeguarding your privacy. This policy
								outlines our practices regarding the collection, use, and protection of your personal information.</p>
						</CardContent>
					</Card>
					<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Eye className="h-5 w-5"/>
								Transparency
							</CardTitle>
							<CardDescription>We believe in being open about our data practices</CardDescription>
						</CardHeader>
						<CardContent>
							<p>We strive to be transparent about the data we collect and how we use it. If you have any questions or
								concerns, please don&apos;t hesitate to contact us.</p>
						</CardContent>
					</Card>
				</div>
				
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="item-1">
						<AccordionTrigger>1. Information We Collect</AccordionTrigger>
						<AccordionContent>
							<p className="mb-4">We collect information that you provide directly to us, such as when you create an
								account, update your profile, or communicate with us. This may include:</p>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>Name and contact information</li>
								<li>Account credentials</li>
								<li>Profile information</li>
								<li>Project data</li>
								<li>Communications with us</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>2. How We Use Your Information</AccordionTrigger>
						<AccordionContent>
							<p className="mb-4">We use the information we collect for various purposes, including:</p>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>Providing and maintaining our services</li>
								<li>Improving and personalizing our services</li>
								<li>Communicating with you</li>
								<li>Ensuring the security of our services</li>
								<li>Complying with legal obligations</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger>3. Sharing Your Information</AccordionTrigger>
						<AccordionContent>
							<p className="mb-4">We may share your information in the following situations:</p>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>With your consent</li>
								<li>With service providers</li>
								<li>For legal reasons</li>
								<li>In connection with a business transaction</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-4">
						<AccordionTrigger>4. Your Rights and Choices</AccordionTrigger>
						<AccordionContent>
							<p className="mb-4">You have certain rights regarding your personal information, including:</p>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>Accessing and updating your information</li>
								<li>Deleting your account</li>
								<li>Opting out of marketing communications</li>
								<li>Objecting to certain uses of your information</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-5">
						<AccordionTrigger>5. Security</AccordionTrigger>
						<AccordionContent className={"p-6"}>
							<p>We implement appropriate technical and organizational measures to protect your personal information.
								However, no method of transmission over the Internet or electronic storage is 100% secure, so we
								cannot guarantee absolute security.</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-6">
						<AccordionTrigger>6. Changes to This Privacy Policy</AccordionTrigger>
						<AccordionContent className={"p-6"}>
							<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
								new Privacy Policy on this page and updating the &quot;Last updated&quot; date.</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				
				<div className="flex flex-col gap-6 mt-12">
					<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Lock className="h-5 w-5"/>
								Data Protection
							</CardTitle>
							<CardDescription>Learn more about how we protect your data</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="mb-4">We take data protection seriously and have implemented various measures to ensure
								the security of your information. These include:</p>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>Encryption of sensitive data</li>
								<li>Regular security audits</li>
								<li>Employee training on data protection</li>
								<li>Strict access controls</li>
							</ul>
						</CardContent>
					</Card>
					
					<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BookOpen className="h-5 w-5"/>
								Further Reading
							</CardTitle>
							<CardDescription>Additional resources to understand our privacy practices</CardDescription>
						</CardHeader>
						
						<CardContent>
							<ul className="flex flex-col gap-2">
								<li>
									<Link href="/settings/privacy-center"
									      className="text-primary hover:underline flex items-center gap-1">
										Privacy Center <ArrowRight className="h-4 w-4"/>
									</Link>
								</li>
								<li>
									<Link href="/settings/terms-of-service"
									      className="text-primary hover:underline flex items-center gap-1">
										Terms of Service <ArrowRight className="h-4 w-4"/>
									</Link>
								</li>
								<li>
									<Link href="/settings/cookie-policy"
									      className="text-primary hover:underline flex items-center gap-1">
										Cookie Policy <ArrowRight className="h-4 w-4"/>
									</Link>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</main>
		</>
	)
}

