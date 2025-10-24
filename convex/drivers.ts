import type { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server"

export type Driver = Doc<"drivers">

export const getDrivers = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("drivers").collect();
    }
})