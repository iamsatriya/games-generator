import PreGameComponent from "@/app/components/pre-game-component";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
        <Button variant={"link"} className="block mx-auto">
          <Link href={"/changelog"}>View Changelog</Link>
        </Button>
      </div>
    </main>
  );
}
