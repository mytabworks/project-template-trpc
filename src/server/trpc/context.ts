// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { Session } from "next-auth";
import { getServerSession } from "../session";

type CreateContextOptions = {
	session: Session | null;
};

/** Use this helper for:
 *  - testing, where we don't have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
	return {
		session: opts.session,
	};
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
	opts: trpcNext.CreateNextContextOptions,
) => {
	const { req, res } = opts;

	// Get the session from the server using the unstable_getServerSession wrapper function
	const session = await getServerSession({ req, res });

	return await createContextInner({
		session,
	});
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 **/
export function createAuthRouter(authorizeRoleIDs: number[] | null = null) {
	return createRouter().middleware(({ ctx, next }) => {
		const session = ctx.session

		if(!session 
			|| !session?.user
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
			throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				...ctx,
				// infers that `session` is non-nullable to downstream resolvers
				session: { ...ctx.session, user: ctx.session?.user },
			},
		});
	});
}
