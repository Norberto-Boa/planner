import z from "zod";

export const tripIdAsParamsSchema = z.object({
  tripId: z.string().uuid(),
});
export const participantIdAsParamsSchema = z.object({
  participantId: z.string().uuid(),
});