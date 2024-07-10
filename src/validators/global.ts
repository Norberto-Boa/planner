import z from "zod";

export const tripIdAsParamsSchema = z.object({
  tripId: z.string().uuid(),
});