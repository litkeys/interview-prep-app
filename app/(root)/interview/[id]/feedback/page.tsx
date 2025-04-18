import { getCurrentUser } from "@/lib/actions/auth.action";
import {
	getFeedbackByInterviewId,
	getInterviewById,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = async ({ params }: RouteParams) => {
	const { id } = await params;
	const user = await getCurrentUser();

	const interview = await getInterviewById(id);
	if (!interview) {
		redirect("/");
	}

	const feedback = await getFeedbackByInterviewId({
		interviewId: id,
		userId: user?.id!,
	});

	return (
		<div className="flex flex-col gap-5 items-center">
			<h2 className="mt-5 text-center">
				Feedback on the Interview -{" "}
				<span className="capitalize">{interview.role} Interview</span>
			</h2>
			<div className="flex flex-row gap-5">
				<div className="flex flex-row gap-2 items-center">
					<Image src="/star.svg" alt="star" width={22} height={22} />
					<p>
						Overall Impression:
						<span className="font-bold">
							{" " + feedback?.totalScore || "---"}
						</span>
						/100
					</p>
				</div>
				<div className="flex flex-row gap-2">
					<Image
						src="/calendar.svg"
						alt="calendar"
						width={22}
						height={22}
					/>
					<p>
						{feedback?.createdAt
							? dayjs(feedback.createdAt).format(
									"MMM D, YYYY h:mm A"
							  )
							: "---"}
					</p>
				</div>
			</div>

			<div className="w-full mt-5 space-y-5">
				<p>{feedback?.finalAssessment || "---"}</p>

				<div className="flex flex-col gap-4">
					<h2>Breakdown of Evaluation:</h2>
					{feedback?.categoryScores?.map((category, index) => {
						return (
							<div key={index}>
								<p className="font-bold">
									{index + 1}. {category.name} (
									{category.score}
									/100)
								</p>
								<p>{category.comment || "---"}</p>
							</div>
						);
					})}
				</div>

				<div className="flex flex-col gap-4">
					<h2>Strengths</h2>
					{feedback?.strengths?.length! > 0 ? (
						<ul className="list-disc list-inside">
							{feedback?.strengths?.map((strength, index) => {
								return <li key={index}>{strength}</li>;
							})}
						</ul>
					) : (
						<p>N/A</p>
					)}
				</div>

				<div className="flex flex-col gap-4">
					<h2>Areas for Improvement</h2>
					{feedback?.areasForImprovement?.length! > 0 ? (
						<ul className="list-disc list-inside">
							{feedback?.areasForImprovement?.map(
								(area, index) => {
									return <li key={index}>{area}</li>;
								}
							)}
						</ul>
					) : (
						<p>N/A</p>
					)}
				</div>
			</div>
			<div className="flex flex-row justify-between gap-4 w-full">
				<Button className="btn-secondary flex-1">
					<Link
						href={`/`}
						className="flex w-full h-full items-center justify-center"
					>
						<p className="text-sm font-semibold text-primary-200 text-center">
							Back to Dashboard
						</p>
					</Link>
				</Button>
				<Button className="btn-primary flex-1">
					<Link
						href={`/interview/${id}`}
						className="flex w-full h-full items-center justify-center"
					>
						Retake Interview
					</Link>
				</Button>
			</div>
		</div>
	);
};

export default Page;
