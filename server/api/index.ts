import Elysia from "elysia";
import { treaty } from "@elysiajs/eden";
import { fileRouter } from "./file";
import { questionsRouter } from "./routers/questionsroute";
import { answersRouter } from "./routers/answersroute";
import { blocksRouter } from "./routers/blocksroute";
import { userRouter } from "./routers/userroute";


export const app = new Elysia({
    prefix: "/api"
})
.use(fileRouter)
.use(questionsRouter)
.use(answersRouter)
.use(blocksRouter)
.use(userRouter)


export type App = typeof app;
export const api = treaty(app).api;