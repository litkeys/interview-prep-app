"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
	const { uid, name, email } = params;

	try {
		const userRecord = await db.collection("users").doc(uid).get();

		if (userRecord.exists) {
			return {
				success: false,
				message: "User already exists. Please sign in instead.",
			};
		}

		await db.collection("users").doc(uid).set({
			name,
			email,
			createdAt: new Date(), // NECESSARY
			updatedAt: new Date(), // NECESSARY
		});

		return {
			success: true,
			message: "Account created successfully. Please sign in.",
		};
	} catch (error: any) {
		console.log("Error creating the user", error);

		if (error.code === "auth/email-already-exists") {
			return {
				success: false,
				message: "This email is already in use.",
			};
		}
	}
}

export async function signIn(params: SignInParams) {
	const { email, idToken } = params;

	try {
		const userRecord = await auth.getUserByEmail(email);

		if (!userRecord) {
			return {
				success: false,
				message: "User does not exist. Create an account instead.",
			};
		}

		await setSessionCookie(idToken);
	} catch (error: any) {
		console.log(error);

		return {
			success: false,
			message: "Failed to log into an account.",
		};
	}
}

export async function setSessionCookie(idToken: string) {
	const cookieStore = await cookies();

	const sessionCookie = await auth.createSessionCookie(idToken, {
		expiresIn: ONE_WEEK * 1000,
	});

	cookieStore.set("session", sessionCookie, {
		maxAge: ONE_WEEK,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		sameSite: "lax",
	});
}

export async function getCurrentUser() {
	const cookieStore = await cookies();

	const sessionCookie = cookieStore.get("session")?.value;

	if (!sessionCookie) {
		return null;
	}

	try {
		const decodedClaims = await auth.verifySessionCookie(
			sessionCookie,
			true
		);

		const userRecord = await db
			.collection("users")
			.doc(decodedClaims.uid)
			.get();

		if (!userRecord.exists) {
			return null;
		}

		return {
			...userRecord.data(),
			id: userRecord.id,
		} as User;
	} catch (error: any) {
		console.log(error);

		return null;
	}
}

export async function isAuthenticated() {
	const user = await getCurrentUser();

	return !!user;
}

export async function getInterviewByUserId(
	userId: string
): Promise<Interview[] | null> {
	const interview = await db
		.collection("interviews")
		.where("userId", "==", userId)
		.orderBy("createdAt", "desc")
		.get();
	return interview.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	})) as Interview[];
}
