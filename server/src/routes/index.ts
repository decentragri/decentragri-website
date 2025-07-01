//** ROUTE FILES
import SoilAi from "./soil-ai.routes";
import Auth from "./auth.routes";
import Insight from "./insight.routes";
import OnChain from "./onchain.routes";
import Weather from "./weather.routes";
import PlantAI from "./plant-ai.routes";
import Farmer from "./farmer.routes";
import Community from "./community.routes";
import type { Elysia } from "elysia";


const routes = (app: Elysia) => {
    app
    .use(Auth)
    .use(SoilAi)
    .use(PlantAI)
    .use(Insight)
    .use(OnChain)
    .use(Weather)
    .use(Farmer)
    .use(Community);
}



export default routes;
