import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";

const HomeLayout = async ({ children }: { children: ReactNode }) => {
	const isUserAuthenticated = await isAuthenticated();

	if (!isUserAuthenticated) {
		await redirect("/sign-in");
	}
	return (
		<div className="root-layout">
			<div className="flex flex-row justify-between items-center">
				<nav>
					<Link href="/" className="flex text-center gap-2">
						<Image
							src="/logo.svg"
							alt="Logo"
							width={38}
							height={38}
						/>
						<h2 className="text-primary">PrepWise</h2>
					</Link>
				</nav>
				<Image
					src="/user-avatar.png"
					alt="user avatar"
					width={50}
					height={50}
					className="rounded-full object-cover"
				/>
			</div>
			{children}
		</div>
	);
};

export default HomeLayout;
