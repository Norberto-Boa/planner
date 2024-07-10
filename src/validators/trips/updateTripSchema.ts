import z from "zod";

export const updateTripSchema = z.object({
  destination: z.string().min(4),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date()
});