import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@server/trpc";
import { createContext } from "@server/trpc/context";
import Route from "@server/route";
// export API handler
export default Route.custom(async (...args) => {
	createNextApiHandler({
		router: appRouter,
		createContext,
	})(...args)
})
