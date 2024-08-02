import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { confirmParticipantOnTripSchema } from "../validators/participant/confirmParticipantOnTripSchema";
import { confirmParticipantService, getParticipantByIdService, getParticipantByTripIdService } from "../services/participantService";
import { participantIdAsParamsSchema, tripIdAsParamsSchema } from "../validators/global";
import { getTripByIdService } from "../services/tripService";

// Confirm Participant Request
type ParticipantIdAsParamRequest = FastifyRequest<{
  Params: z.infer<typeof confirmParticipantOnTripSchema>;
}>;

// getParticipantRequest

type tripIdAsParamRequest = FastifyRequest<{
  Params: z.infer<typeof tripIdAsParamsSchema>;
}>;

class ParticipantController {
  // Confirm participant on trip Controller
  async confirmParticipant(request: ParticipantIdAsParamRequest, reply: FastifyReply) {
    const { participantId } = request.params;

    const participant = await getParticipantByIdService(participantId);

    if (!participant) {
      throw new Error(`Participante não encontrado!`);
    }

    if (participant.is_confirmed) {
      return reply.redirect(`${process.env.FRONT_END_BASE_URL}/trips/${participant.trip_id}`);
    }

    await confirmParticipantService(participantId);

    return { participant };
  }

  // Get participant by Id Controller
  async getParticipant(request: ParticipantIdAsParamRequest, reply: FastifyReply) {
    const { participantId } = request.params;

    const participant = await getParticipantByIdService(participantId);

    if (!participant) {
      throw new Error(`Participante não encontrado!`);
    }

    return { participant };
  }

  // Get all participants controller
  async getAllParticipants(request: tripIdAsParamRequest) {
    const { tripId } = request.params;

    const participants = await getParticipantByTripIdService(tripId);

    return { participants: participants }
  }
}

export { ParticipantController };