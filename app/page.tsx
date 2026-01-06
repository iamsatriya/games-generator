import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Player from "./components/player";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex-row items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Card>
        <CardHeader>
          <CardTitle>Enter Player</CardTitle>
        </CardHeader>
        <Player />
      </Card>
      <Button variant={"link"} className="block mx-auto">
        <Link href={"/changelog"}>View Changelog</Link>
      </Button>
    </main>
  );
}
