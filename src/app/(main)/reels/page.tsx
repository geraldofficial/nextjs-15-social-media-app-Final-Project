import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reels | Videos",
};

const ReelsFeed = dynamic(() => import("./ReelsFeed"), { ssr: false });

export default function ReelsPage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold my-6">Reels</h1>
      <ReelsFeed />
    </main>
  );
}
