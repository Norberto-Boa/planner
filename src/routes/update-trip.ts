import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { createTripSchema } from "../validators/trips/createTripSchema";
import { dayjs } from "../lib/formatDate";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import nodemailer from 'nodemailer';
import { formatDate } from "../lib/formatDate";
import { tripIdAsParamsSchema } from "../validators/global";
import { updateTripSchema } from "../validators/trips/updateTripSchema";

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put('/trips/:tripId', {
    schema: {
      body: updateTripSchema,
      params: tripIdAsParamsSchema
    }
  }, async (req) => {
    const { tripId } = req.params;
    const { destination, starts_at, ends_at } = req.body;

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      }
    });

    if (!trip) {
      throw new Error("Viagem nao encontrada!");
    }

    if (dayjs(starts_at).isBefore(new Date())) {
      throw new Error("Date cannot be in the past");
    }

    if (dayjs(ends_at).isBefore(starts_at)) {
      throw new Error("End date must not be before the start date");
    }

    const mail = await getMailClient();

    const Upadatedtrip = await prisma.trip.update({
      where: {
        id: tripId
      },
      data: {
        destination,
        starts_at,
        ends_at,
      }
    });

    return Upadatedtrip;
  });
}