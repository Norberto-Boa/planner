import { z } from "zod";

export const createTripSchema = z.object({
  destination: z.string({ required_error: "Required Error" }).min(4),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  owner_name: z.string(),
  owner_email: z.string().email(),
  emails_to_invite: z.array(z.string().email())
});