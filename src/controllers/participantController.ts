import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { confirmParticipantOnTripSchema } from "../validators/participant/confirmParticipantOnTripSchema";
import { confirmParticipantService, getParticipantByIdService } from "../services/participantService";
import { participantIdAsParamsSchema } from "../validators/global";

// Confirm Participant Request
type confirmParticipantRequest = FastifyRequest<{
  Params: z.infer<typeof confirmParticipantOnTripSchema>;
}>;

//
type getParticipantRequest = FastifyRequest<{
  Params: z.infer<typeof participantIdAsParamsSchema>;
}>

class ParticipantController {
  // Confirm participant on trip Controller
  async confirmParticipant(request: confirmParticipantRequest, reply: FastifyReply) {
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



  async getParticipant(request: getParticipantRequest, reply: FastifyReply) {
    const { participantId } = request.params;

    const participant = await getParticipantByIdService(participantId);

    if (!participant) {
      throw new Error(`Participante não encontrado!`);
    }

    return { participant };
  }
}

export { ParticipantController };