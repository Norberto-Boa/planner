import z from "zod";


export const createActivityBodySchema = z.object({
  title: z.string().min(4),
  occurs_at: z.coerce.date(),
});

export const createActivityParamsSchema = z.object({
  tripId: z.string().uuid(),
})