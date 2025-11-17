"use client";

import { Button } from "@/components/ui/button";
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
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { GAME_DATA_KEY } from "../constant";
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

  function onSubmit(values: z.infer<typeof schema>) {
    console.log("values", values);

    const gameID = uuidv4();
    localStorage.setItem(GAME_DATA_KEY, JSON.stringify(values));
    router.replace(`/game-board/${gameID}`);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
        <Button type="submit">Enter game</Button>
      </form>
    </FormProvider>
  );
}
