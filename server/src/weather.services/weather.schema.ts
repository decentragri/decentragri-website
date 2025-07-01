import { t } from "elysia";



export const currentWeatherSchema = {
    headers: t.Object({ authorization: t.String() }),
    params: t.Object({
        location: t.String()
    }),

}

export const forecastSchema = {
    headers: t.Object({ authorization: t.String() }),
    params: t.Object({
        location: t.String()
    }),

}