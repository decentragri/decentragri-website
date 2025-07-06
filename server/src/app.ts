// Load environment variables from the root .env file
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from the root directory (one level up from server/src)
const envPath = resolve(process.cwd(), '..', '.env');
config({ path: envPath });

import Elysia from "elysia";
import Auth from "./routes/auth.routes";
import SoilAi from "./routes/soil-ai.routes";
import Insight from "./routes/insight.routes";
import OnChain from "./routes/onchain.routes";
import Weather from "./routes/weather.routes";
import PlantAI from "./routes/plant-ai.routes";
import Farmer from "./routes/farmer.routes";
import Community from "./routes/community.routes";
import Profile from "./routes/profile.routes";
import PestAI from "./routes/pest.routes";
import { cors } from '@elysiajs/cors';
import { APP_PORT, NEO4J_PASSWORD, NEO4J_URI, NEO4J_USERNAME } from './utils/constants';
import { initDriver } from "./db/memgraph";

// Log the environment variables being used for debugging
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET_KEY ? 'Yes' : 'No');
console.log(process.env.JWT_SECRET_KEY)
const port: number = APP_PORT;
const hostname: string = 'localhost';

// Initialize Elysia app
const app = new Elysia({ serve: {idleTimeout: 255 }}) // 5 minutes idle timeout
  .use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "HEAD", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Expires",
      "Pragma",
      "Cache-Control",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Origin",
    ],
    credentials: true,
    maxAge: 600,
  }))
  .use(Auth)
  .use(SoilAi)
  .use(Insight)
  .use(OnChain)
  .use(Weather)
  .use(PlantAI)
  .use(Farmer)
  .use(Community)
  .use(Profile)
  .use(PestAI);

initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)
// Export the type of the fully decorated app for Eden Treaty
export type App = typeof app;
export default app;


app.listen({ port }, () => {
  console.log(`DecentrAgri HTTP server is running on http://${hostname}:${port}/`);
});

