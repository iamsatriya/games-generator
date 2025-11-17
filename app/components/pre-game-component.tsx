"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { createStandaloneGame } from "../actions/standalone-game";
import { schema } from "../schema";

type Props = {
  numOfPlayer: number;
};

export default function PreGame(props: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      player: Array.from({ length: props.numOfPlayer }, () => ({
        name: "",
        totalScore: 0,
      })),
      round: [],
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const game = await createStandaloneGame(values.player);

    router.replace(`/game-board/${game.id}`);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="min-w-sm">
          <CardHeader>
            <CardTitle>Enter Player Detail</CardTitle>
          </CardHeader>
          <CardContent>
            {form.getValues().player.map((player, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`player.${index}.name` as const}
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Player #{index + 1} name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`Enter player #${index + 1} name`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Enter game
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
