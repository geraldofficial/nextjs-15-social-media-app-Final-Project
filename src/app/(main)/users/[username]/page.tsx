import { validateRequest } from "@/auth";
import TrendsSidebar from "@/components/TrendsSidebar";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";
import UserProfile from "./UserProfile";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

async function recordProfileView(username: string, loggedInUserId: string) {
  "use server";
  
  const targetUser = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
    },
  });

  if (!targetUser || targetUser.id === loggedInUserId) {
    return;
  }

  await prisma.user.update({
    where: { id: targetUser.id },
    data: {
      profileViews: {
        increment: 1,
      },
      lastProfileView: new Date(),
    },
  });
}

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(params.username, loggedInUser.id);

  // Record profile view if viewing someone else's profile
  if (loggedInUser.username.toLowerCase() !== params.username.toLowerCase()) {
    await recordProfileView(params.username, loggedInUser.id);
  }

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPosts username={user.username} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
