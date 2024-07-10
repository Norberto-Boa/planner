import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { dayjs } from "../lib/formatDate";
import { prisma } from "../lib/prisma";
import { createActivityBodySchema, createActivityParamsSchema } from "../validators/activity/createActivity";

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/activities', {
    schema: {
      body: createActivityBodySchema,
      params: createActivityParamsSchema
    }
  }, async (req) => {
    const { tripId } = req.params;
    const { title, occurs_at } = req.body;

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      }
    });

    if (!trip) {
      throw new Error("Viagem nao encontrada!");
    }

    if (dayjs(occurs_at).isBefore(trip.starts_at)) {
      throw new Error("Actividade deve acontecer dentro do periodo da viagem!");
    }
    if (dayjs(occurs_at).isAfter(trip.ends_at)) {
      throw new Error("Actividade deve acontecer dentro do periodo da viagem!");
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        occurs_at,
        trip_id: tripId
      }
    });

    return { activity };
  });
}