import z from "zod";


export const confirmTripSchema = z.object({
  tripId: z.string().uuid()
})