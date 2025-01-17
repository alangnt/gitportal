import {ArrowRight, Cookie, Info, Lock} from 'lucide-react'
import Link from 'next/link'

import Header from "@/components/Header"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"

export default function CookiePolicyPage() {
	return (
		<>
			<Header/>
			
			<main className="flex flex-col gap-4 grow w-full md:max-w-[1280px] px-4 max-lg:px-6 mt-4 mb-6">
				<h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
				<p className="text-muted-foreground mb-8">Last updated: January 14, 2025</p>
				
				<div className="grid gap-6 md:grid-cols-2 mb-12">
					<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Cookie className="h-5 w-5"/>
								What are Cookies?
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p>Cookies are small text files that are placed on your computer or mobile device when you visit a
								website. They are widely used to make websites work more efficiently and provide information to the
								owners of the site.</p>
						</CardContent>
					</Card>
					<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Info className="h-5 w-5"/>
								How We Use Cookies
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p>We use cookies to understand how you use our website and to improve your experience. This includes
								personalizing content, providing social media features and analyzing our traffic.</p>
						</CardContent>
					</Card>
				</div>
				
				<Accordion type="single" collapsible className="w-full mb-12">
					<AccordionItem value="item-1">
						<AccordionTrigger>Types of Cookies We Use</AccordionTrigger>
						<AccordionContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Cookie Type</TableHead>
										<TableHead>Purpose</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>Essential Cookies</TableCell>
										<TableCell>These cookies are necessary for the website to function properly. They enable core
											functionality such as security, network management, and accessibility.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Analytics Cookies</TableCell>
										<TableCell>These cookies help us understand how visitors interact with our website by collecting
											and reporting information anonymously.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Functional Cookies</TableCell>
										<TableCell>These cookies enable the website to provide enhanced functionality and personalization.
											They may be set by us or by third party providers whose services we have added to our
											pages.</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Advertising Cookies</TableCell>
										<TableCell>These cookies are used to make advertising messages more relevant to you. They perform
											functions like preventing the same ad from continuously reappearing, ensuring that ads are
											properly displayed, and in some cases selecting advertisements that are based on your
											interests.</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>Managing Cookies</AccordionTrigger>
						<AccordionContent>
							<p className="mb-4">Most web browsers allow you to manage your cookie preferences. You can set your
								browser to refuse cookies, or to alert you when cookies are being sent. The following links show how
								to adjust your browser settings on the most popular browsers:</p>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li><a
									href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
									className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Microsoft
									Edge</a></li>
								<li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
								       className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Mozilla
									Firefox</a></li>
								<li><a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline"
								       target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
								<li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
								       className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Safari</a>
								</li>
							</ul>
							<p className="mt-4">Please note that restricting cookies may impact the functionality of our
								website.</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger>Third-Party Cookies</AccordionTrigger>
						<AccordionContent>
							<p className="mb-4">In some special cases, we also use cookies provided by trusted third parties. The
								following section details which third party cookies you might encounter through this site:</p>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>This site uses Google Analytics which is one of the most widespread and trusted analytics
									solutions on the web for helping us to understand how you use the site and ways that we can improve
									your experience. These cookies may track things such as how long you spend on the site and the pages
									that you visit so we can continue to produce engaging content.
								</li>
								<li>We also use social media buttons and/or plugins on this site that allow you to connect with your
									social network in various ways. For these to work, social media sites including Facebook, Twitter,
									and LinkedIn, will set cookies through our site which may be used to enhance your profile on their
									site or contribute to the data they hold for various purposes outlined in their respective privacy
									policies.
								</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				
				<Card className="mb-12">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Lock className="h-5 w-5"/>
							Your Privacy
						</CardTitle>
						<CardDescription>We respect your right to privacy</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="mb-4">We are committed to being transparent about the technologies we use. We hope that this
							Cookie Policy has helped you understand our use of cookies. If you have any questions or concerns,
							please contact us.</p>
						<p>For more information about how we protect your privacy, please review our Privacy Policy.</p>
					</CardContent>
				</Card>
				
				<div className="mb-12">
					<h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
					<ul className="flex flex-col gap-2">
						<li>
							<Link href="/settings/privacy-policy" className="text-primary hover:underline flex items-center gap-1">
								Privacy Policy <ArrowRight className="h-4 w-4"/>
							</Link>
						</li>
						<li>
							<Link href="/settings/terms-of-service"
							      className="text-primary hover:underline flex items-center gap-1">
								Terms of Service <ArrowRight className="h-4 w-4"/>
							</Link>
						</li>
						<li>
							<Link href="/settings/privacy-center" className="text-primary hover:underline flex items-center gap-1">
								Privacy Center <ArrowRight className="h-4 w-4"/>
							</Link>
						</li>
					</ul>
				</div>
			</main>
		</>
	)
}

