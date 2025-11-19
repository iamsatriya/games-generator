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
    <main className="flex items-center justify-center">
      <div>
        <PreGameComponent numOfPlayer={numOfPlayer} />
      </div>
    </main>
  );
}
