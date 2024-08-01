import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { confirmParticipantOnTripSchema } from "../validators/participant/confirmParticipantOnTripSchema";
import { ParticipantController } from "../controllers/participantController";
import { participantIdAsParamsSchema } from "../validators/global";

const participant = new ParticipantController();

export async function participantRoutes(fastify: FastifyInstance) {
  // Confirm participant on trip Route
  fastify.withTypeProvider<ZodTypeProvider>().get(`/participants/:participantId/confirm`, {
    schema: {
      params: confirmParticipantOnTripSchema
    }
  }, participant.confirmParticipant);

  // Get participant Route
  fastify.withTypeProvider<ZodTypeProvider>().get(`/participants/:participantId`, {
    schema: {
      params: participantIdAsParamsSchema
    }
  }, participant.getParticipant);
}

