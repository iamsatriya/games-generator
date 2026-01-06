"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, MinusIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Player() {
  const [numOfPlayer, setNumOfPlayer] = useState(4);

  const disabledMinus = numOfPlayer <= 3;

  const disabledPlus = numOfPlayer >= 4;

  function handleMinus() {
    setNumOfPlayer((prev) => prev - 1);
  }

  function handlePlus() {
    setNumOfPlayer((prev) => prev + 1);
  }

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <>
      <CardContent>
        <div className="flex space-x-2">
          <Button disabled={disabledMinus} onClick={handleMinus}>
            <MinusIcon />
          </Button>
          <Input disabled value={numOfPlayer} className="text-center" />
          <Button disabled={disabledPlus} onClick={handlePlus}>
            <PlusIcon />
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/pre-game/${numOfPlayer}`} className="w-full">
          <Button className="flex items-center w-full">
            Continue <ArrowRight />
          </Button>
        </Link>
      </CardFooter>
    </>
  );
}
