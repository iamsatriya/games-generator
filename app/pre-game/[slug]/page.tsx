import PreGameComponent from "@/app/components/pre-game-component";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  const numOfPlayer = Number(slug);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>
        <PreGameComponent numOfPlayer={numOfPlayer} />
      </div>
    </main>
  );
}
