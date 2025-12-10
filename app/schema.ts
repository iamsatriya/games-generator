import z from "zod";

export const schema = z.object({
  id: z.string(),
  player: z.array(
    z.object({
      name: z.string().min(1),
      totalScore: z.number(),
    })
  ),
  round: z.array(z.array(z.number())),
  star: z.array(z.array(z.number())),
});
