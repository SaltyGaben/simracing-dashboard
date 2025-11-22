<script setup lang="ts">
import { api } from '~~/convex/_generated/api';

const { data: telemetryAll, isPending: allPending } = useConvexQuery(api.telemetry.getTelemetryAll)
const { data: telemetryTeam, isPending: teamPending } = useConvexQuery(api.telemetry.getTelemetryTeam)
const { data: drivers, isPending: driversPending } = useConvexQuery(api.drivers.getDrivers)
</script>

<template>
    <div class="flex flex-row items-baseline gap-2 p-4 border-b">
        <UIcon name="i-lucide-flag" size="30" />
        <h1 class="text-4xl">
            Sim Racing Dashboard
        </h1>
    </div>
    <div v-if="!allPending && !teamPending && !driversPending" class="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        <div class="flex flex-col gap-4 mb-8 col-span-1 lg:col-span-2">
            <Team :telemetry-team="telemetryTeam!" />
            <Fuel :telemetry-team="telemetryTeam!" />
            <LapTimes :telemetry-team="telemetryTeam!" />
        </div>
        <div class="col-span-1 flex flex-col gap-4 mb-8">
            <Standings :drivers="drivers!" :telemetryAll="telemetryAll!" />
        </div>
    </div>
    <div class="flex flex-row items-center justify-center gap-2 h-screen"
        v-if="allPending || teamPending || driversPending">
        <UIcon name="i-lucide-loader" size="30" class="animate-spin" />
        <h1 class="text-center text-3xl">
            Loading Dashboard Data
        </h1>
    </div>
</template>