import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { confirmParticipantOnTripSchema } from "../validators/participant/confirmParticipantOnTripSchema";
import { ParticipantController } from "../controllers/participantController";
import { participantIdAsParamsSchema, tripIdAsParamsSchema } from "../validators/global";

const participant = new ParticipantController();

export async function participantRoutes(fastify: FastifyInstance) {
  // Confirm participant on trip Route
  fastify.withTypeProvider<ZodTypeProvider>().get(`/participants/:participantId/confirm`, {
    schema: {
      params: participantIdAsParamsSchema
    }
  }, participant.confirmParticipant);

  // Get participant By Id Route
  fastify.withTypeProvider<ZodTypeProvider>().get(`/participants/:participantId`, {
    schema: {
      params: participantIdAsParamsSchema
    }
  }, participant.getParticipant);

  // Get participants By Trip Id Route
  fastify.withTypeProvider<ZodTypeProvider>().get(`/trips/:tripId/participants`, {
    schema: {
      params: tripIdAsParamsSchema
    }
  }, participant.getAllParticipants);
}

