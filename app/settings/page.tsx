"use client"

import Header from "@/components/Header";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {User} from "@/types/types";
import {redirect} from "next/navigation";

export default function SettingsPage() {
	const {data: session, status} = useSession();
	
	const [loading, setLoading] = useState<boolean>(true);
	
	const [userInfo, setUserInfo] = useState<User | null>(null);
	const [userFetched, setUserFetched] = useState(false);
	
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
				(user: User) => user.email === session?.user?.email
			);
			
			if (userInfos.length === 0) {
				throw new Error("No user found with the given email.");
			}
			
			const user = userInfos[0];
			setUserInfo(user);
			setUserFetched(true);
			
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};
	
	useEffect(() => {
		if (status === "unauthenticated") {
			redirect("/");
		} else if (status === "authenticated") {
			fetchUserProfile();
		}
	}, [status, userFetched]);
	
	if (loading) return <div>Loading...</div>;
	
	return (
		<>
			{status === "authenticated" && (
				<>
					<Header/>
					
					<main className={"flex flex-col gap-4 grow w-full md:max-w-[1280px] px-4 max-lg:px-6 mt-4"}></main>
				</>
			)}
		</>
	)
}