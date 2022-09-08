import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@trpc-router/index";
import { createContext } from "@trpc-router/context";
import Route from "@route";
// export API handler
export default Route.custom(async (...args) => {
	createNextApiHandler({
		router: appRouter,
		createContext,
	})(...args)
})
