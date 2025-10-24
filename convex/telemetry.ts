import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server"

export type TelemetryTeam = Doc<"telemetry_team">
export type TelemetryAll = Doc<"telemetry_all">

export const getTelemetryTeam = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("telemetry_team").collect();
    }
})

export const getTelemetryAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("telemetry_all").collect();
    }
})