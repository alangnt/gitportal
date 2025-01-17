import {ArrowRight, FileText, Scale, ShieldCheck} from 'lucide-react'
import Link from 'next/link'

import Header from "@/components/Header"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"

export default function TermsOfServicePage() {
	return (
		<>
			<Header/>
			
			<main className="flex flex-col gap-4 grow w-full md:max-w-[1280px] px-4 max-lg:px-6 mt-4 mb-6">
				<h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
				<p className="text-muted-foreground mb-8">Last updated: January 14, 2025</p>
				
				<div className="grid gap-6 md:grid-cols-2 mb-12">
					<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5"/>
								Agreement
							</CardTitle>
							<CardDescription>Your use of our service is subject to these terms</CardDescription>
						</CardHeader>
						<CardContent>
							<p>By accessing or using GitPortal, you agree to be bound by these Terms of Service and all
								applicable laws and regulations.</p>
						</CardContent>
					</Card>
					<Card className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black cursor-pointer duration-150 transition-all shadow"}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Scale className="h-5 w-5"/>
								Fair Use
							</CardTitle>
							<CardDescription>We expect responsible and ethical use of our platform</CardDescription>
						</CardHeader>
						<CardContent>
							<p>You agree to use GitPortal only for lawful purposes and in a way that does not infringe the
								rights of, restrict or inhibit anyone else&apos;s use and enjoyment of the platform.</p>
						</CardContent>
					</Card>
				</div>
				
				<Accordion type="single" collapsible className="w-full mb-12">
					<AccordionItem value="item-1">
						<AccordionTrigger>1. Account Terms</AccordionTrigger>
						<AccordionContent>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>You must be 13 years or older to use this Service.</li>
								<li>You must provide your legal full name, a valid email address, and any other information requested
									in order to complete the signup process.
								</li>
								<li>Your login may only be used by one person - a single login shared by multiple people is not
									permitted.
								</li>
								<li>You are responsible for maintaining the security of your account and password. GitPortal
									cannot and will not be liable for any loss or damage from your failure to comply with this security
									obligation.
								</li>
								<li>You are responsible for all Content posted and activity that occurs under your account.</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>2. API Terms</AccordionTrigger>
						<AccordionContent>
							<p className="mb-4">Customers may access their GitPortal account data via an API (Application
								Program Interface). Any use of the API, including use of the API through a third-party product that
								accesses GitPortal, is bound by these Terms of Service plus the following specific terms:</p>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>You expressly understand and agree that GitPortal shall not be liable for any direct,
									indirect, incidental, special, consequential or exemplary damages, including but not limited to,
									damages for loss of profits, goodwill, use, data or other intangible losses resulting from the use
									of or inability to use the API.
								</li>
								<li>Abuse or excessively frequent requests to GitPortal via the API may result in the
									temporary or permanent suspension of your account&apos;s access to the API.
								</li>
								<li>GitPortal, in its sole discretion, may set rate limits for API usage.</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger>3. Payment, Refunds, Upgrading and Downgrading Terms</AccordionTrigger>
						<AccordionContent>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>All paid plans must enter a valid payment account before the trial period ends.</li>
								<li>For any upgrade or downgrade in plan level, your credit card will automatically be charged the new
									rate on your next billing cycle.
								</li>
								<li>Downgrading your Service may cause the loss of Content, features, or capacity of your Account.
									GitPortal does not accept any liability for such loss.
								</li>
								<li>Refunds are processed according to our fair refund policy.</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-4">
						<AccordionTrigger>4. Cancellation and Termination</AccordionTrigger>
						<AccordionContent>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>You are solely responsible for properly canceling your account. An email or phone request to
									cancel your account is not considered cancellation.
								</li>
								<li>All of your Content will be immediately deleted from the Service upon cancellation. This
									information can not be recovered once your account is cancelled.
								</li>
								<li>If you cancel the Service before the end of your current paid up month, your cancellation will
									take effect immediately and you will not be charged again.
								</li>
								<li>GitPortal, in its sole discretion, has the right to suspend or terminate your account and
									refuse any and all current or future use of the Service, or any other GitPortal service, for
									any reason at any time.
								</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-5">
						<AccordionTrigger>5. Modifications to the Service and Prices</AccordionTrigger>
						<AccordionContent>
							<ul className="list-disc p-6 flex flex-col gap-2">
								<li>GitPortal reserves the right at any time and from time to time to modify or discontinue,
									temporarily or permanently, the Service (or any part thereof) with or without notice.
								</li>
								<li>Prices of all Services, including but not limited to monthly subscription plan fees to the
									Service, are subject to change upon 30 days notice from us.
								</li>
								<li>GitPortal shall not be liable to you or to any third party for any modification, price
									change, suspension or discontinuance of the Service.
								</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				
				<Card className="mb-12">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ShieldCheck className="h-5 w-5"/>
							Your Responsibilities
						</CardTitle>
						<CardDescription>As a user of GitPortal, you agree to:</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="list-disc p-6 flex flex-col gap-2">
							<li>Comply with all applicable laws and regulations</li>
							<li>Respect the intellectual property rights of others</li>
							<li>Maintain the confidentiality of your account credentials</li>
							<li>Use the service in a manner that does not disrupt or interfere with its functionality</li>
							<li>Report any security vulnerabilities or breaches you become aware of</li>
						</ul>
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
							<Link href="/settings/cookie-policy" className="text-primary hover:underline flex items-center gap-1">
								Cookie Policy <ArrowRight className="h-4 w-4"/>
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

