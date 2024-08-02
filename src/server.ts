import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trip";
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { createActivity } from "./routes/create-activity";
import { getActivities } from "./routes/get-activities";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/get-trip-details";
import { participantRoutes } from "./routes/participantRoutes";

const app = fastify();

app.register(cors, {
  origin: "*"
});

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


// Registering routes
app.register(participantRoutes);
app.register(createTrip);
app.register(confirmTrip);
app.register(createActivity);
app.register(getActivities);
app.register(createLink);
app.register(getLinks);
app.register(createInvite);
app.register(updateTrip);
app.register(getTripDetails);

app.listen({ port: 3333 }).then(() => {
  console.log("Server Running...");
});