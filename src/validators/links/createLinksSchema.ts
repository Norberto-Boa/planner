import z from "zod"


export const createLinksBodySchema = z.object({
  title: z.string().min(4),
  url: z.string().url()
});
export const createLinksParamsSchema = z.object({
  tripId: z.string().uuid()
})