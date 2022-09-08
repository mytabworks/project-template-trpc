import User from "@model/User";
import { createAuthRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = createAuthRouter([3])
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query("getSecretMessage", {
    async resolve({ ctx }) {
      const user = await User.find(ctx.session.user?.id!)
      return user.toJSON();
    },
  });
