import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { createLinksBodySchema, createLinksParamsSchema } from "../validators/links/createLinksSchema";

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/links', {
    schema: {
      body: createLinksBodySchema,
      params: createLinksParamsSchema
    }
  }, async (req) => {
    const { tripId } = req.params;
    const { title, url } = req.body;

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      }
    });

    if (!trip) {
      throw new Error("Viagem nao encontrada!");
    }


    const link = await prisma.link.create({
      data: {
        title,
        url,
        trip_id: tripId
      }
    });

    return { link };
  });
}