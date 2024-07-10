import { z } from "zod";

export const confirmParticipantOnTripSchema = z.object({
  participantId: z.string().uuid()
});