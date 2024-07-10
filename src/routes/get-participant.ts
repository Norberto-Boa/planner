import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { participantIdAsParamsSchema } from "../validators/global";

export async function getParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId', {
    schema: {
      params: participantIdAsParamsSchema
    }
  }, async (req) => {
    const { participantId } = req.params;

    const participant = await prisma.participant.findUnique({
      where: {
        id: participantId
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_confirmed: true
      }
    });

    if (!participant) {
      throw new Error("Participant nao existe");
    }

    return { participant };
  });
}