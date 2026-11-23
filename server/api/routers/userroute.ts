import Elysia, { Context } from "elysia";
import { auth } from "../../auth/auth";

const betterAuthView = async (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
    if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
        return auth.handler(context.request)
    } else {
        return new Response("Method Not Allowed", { status: 405 })
    }
}



export const userRouter = new Elysia({
    name: 'user',
})

.mount(auth.handler)

.derive({as: 'global'}, async ({request: {headers}}) => {
    const session = await auth.api.getSession({headers})
    return {session}
})

.macro({auth: {
    async resolve({status, request: { headers }}) {
        const session = auth.api.getSession({headers})
        if (!session) return status(401)
        return {session}
    }}})

.get('/me', async ({session}) => {
    return session
}, {
    auth: true
})



export const userRoute = new Elysia().all("/auth/*", betterAuthView);