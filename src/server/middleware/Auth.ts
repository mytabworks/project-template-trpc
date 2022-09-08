import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth";
import BaseMiddleware from "./BaseMiddleware"
import { nextAuthOptions } from "../../pages/api/auth/[...nextauth]";

export const getServerSession = async (ctx: {
    req: NextApiRequest;
    res: NextApiResponse;
}) => {
    return await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions)
}

export type Session = (ReturnType<typeof getServerSession> extends Promise<infer R> ? R : any)

export class Auth extends BaseMiddleware {

    public static async handle(request: NextApiRequest, response: NextApiResponse<any>, authorizeRoleIDs: number[] | null): Promise<boolean> {

        const session = await getServerSession({ req: request, res: response }) as Session

        if(!session 
            || !(session 
                && (
                    (Array.isArray(authorizeRoleIDs) 
                        && authorizeRoleIDs.length > 0
                        && session.user?.roles.some((id) => authorizeRoleIDs.includes(id)
                    ) 
                    || authorizeRoleIDs === null
                )
            ))
        ) {

            this.unauthorized(response)

            return false
        }

        return true
    }

}