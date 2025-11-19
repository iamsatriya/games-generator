import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Player from "./components/player";

export default async function Home() {
  
  return (
    <main className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Card>
        <CardHeader>
          <CardTitle>Enter Player</CardTitle>
        </CardHeader>
        <Player />
      </Card>
    </main>
  );
}
