import {Coffee, Github, Linkedin, Mail, TrelloIcon, Twitter} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import Header from "@/components/Header"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"

export default function AboutPage() {
	return (
		<>
			<Header/>
			<main className={"flex flex-col gap-4 grow w-full max-w-[1280px] px-4 max-lg:px-6 mt-4 mb-10"}>
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold mb-6">About GitPortal</h1>
					
					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
						<Card
							className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
							<CardContent className="pt-6">
								<p className="mb-4">
									GitPortal is dedicated to empowering developers by providing a platform to showcase their
									open-source contributions and projects. We believe in the power of collaboration and the impact of
									open-source software on the tech community.
								</p>
								<p>
									Our goal is to create a space where developers can build their professional identity, connect with
									like-minded individuals, and contribute to the growth of the open-source ecosystem.
								</p>
							</CardContent>
						</Card>
					</section>
					
					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">Meet the Founder</h2>
						<Card
							className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
							<CardHeader>
								<div className="flex items-center gap-4">
									<Image
										src="/icons/profile.png"
										alt="Alan Geirnaert"
										width={80}
										height={80}
										className="rounded-full"
									/>
									<div>
										<CardTitle>Alan Geirnaert</CardTitle>
										<CardDescription>Founder & Lead Developer</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="mb-4">
									Hi there! I&apos;m Alan Geirnaert, the founder and lead developer of GitPortal. With over six months
									of experience in development and a passion for open-source, I created this platform to
									address the need for a centralized space where developers can showcase their contributions and connect
									with others in the community.
								</p>
								<p className="mb-4">
									My journey in tech has been driven by the belief that open collaboration leads to innovation and
									growth. Through GitPortal, I aim to foster a supportive environment that encourages developers
									to share their work, learn from each other, and make meaningful connections.
								</p>
								<div className="flex space-x-4">
									<Link href="https://github.com/alangnt" target="_blank" rel="noopener noreferrer">
										<Button variant="outline" size="icon">
											<Github className="h-4 w-4"/>
											<span className="sr-only">GitHub</span>
										</Button>
									</Link>
									<Link href="https://x.com/gnt_alan" target="_blank" rel="noopener noreferrer">
										<Button variant="outline" size="icon">
											<Twitter className="h-4 w-4"/>
											<span className="sr-only">Twitter</span>
										</Button>
									</Link>
									<Link href="https://www.linkedin.com/in/alan-geirnaert/" target="_blank" rel="noopener noreferrer">
										<Button variant="outline" size="icon">
											<Linkedin className="h-4 w-4"/>
											<span className="sr-only">LinkedIn</span>
										</Button>
									</Link>
									<Link href="mailto:contact@gitportal.org">
										<Button variant="outline" size="icon">
											<Mail className="h-4 w-4"/>
											<span className="sr-only">Email</span>
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					</section>
					
					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
						<Card
							className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
							<CardContent className="pt-6">
								<p className="mb-4">
									At GitPortal, we envision a future where:
								</p>
								<ul className="list-disc pl-6 space-y-2 mb-4">
									<li>Every developer has a platform to showcase their open-source contributions and build their
										professional brand.
									</li>
									<li>Collaboration in the open-source community is streamlined and more accessible than ever before.
									</li>
									<li>Companies can easily discover talented developers based on their real-world contributions to
										open-source projects.
									</li>
									<li>The open-source ecosystem continues to thrive and grow, driving innovation in the tech industry.
									</li>
								</ul>
								<p>
									We&apos;re committed to continuously improving GitPortal to meet the evolving needs of
									developers and the open-source community.
								</p>
							</CardContent>
						</Card>
					</section>
					
					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">Contribute</h2>
						<Card
							className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
							<CardContent className="pt-6">
								<p className="mb-6">
									GitPortal is a labor of love, and we&apos;re always looking for support to help us grow and
									improve. If you believe in our mission and want to contribute to our project, you can do so in the
									following ways:
								</p>
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<h3 className="text-lg font-semibold mb-2">Support our Patreon</h3>
										<p className="mb-4">Help us reach our funding goals and bring new features to life.</p>
										<Link
											href="https://www.patreon.com/c/gitportal"
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button className="w-full">
												<TrelloIcon className="mr-2 h-4 w-4"/>
												Back us on Patreon
											</Button>
										</Link>
									</div>
									<div>
										<h3 className="text-lg font-semibold mb-2">Buy us a coffee</h3>
										<p className="mb-4">
											Your small contribution can make a big difference in keeping us caffeinated and coding.
										</p>
										<Link
											href="https://www.buymeacoffee.com/gitportal"
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button variant="outline" className="w-full">
												<Coffee className="mr-2 h-4 w-4"/>
												Buy us a coffee
											</Button>
										</Link>
									</div>
								</div>
							</CardContent>
						</Card>
					</section>
					
					<section>
						<h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
						<Card
							className={"sm:hover:-translate-y-1 sm:hover:-translate-x-1 hover:border-black duration-150 transition-all shadow"}>
							<CardContent className="pt-6">
								<p className="mb-4">
									GitPortal is more than just a platform – it&apos;s a community. We welcome contributions,
									feedback, and collaboration from developers around the world.
								</p>
								<p className="mb-6">
									If you&apos;re passionate about open-source and want to help shape the future of GitPortal,
									consider getting involved:
								</p>
								<div>
									<Link href="https://github.com/alangnt/gitportal" target="_blank"
									      rel="noopener noreferrer">
										<Button className="w-full">
											<Github className="mr-2 h-4 w-4"/>
											Contribute on GitHub
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					</section>
				</div>
			</main>
		</>
	)
}