<script setup lang="ts">
import { api } from '~~/convex/_generated/api';

const exampleData = {
    drivers: [
        { userName: "Max Verstappen", teamName: "Red Bull Racing", carIdx: 1 },
        { userName: "Lewis Hamilton", teamName: "Mercedes AMG", carIdx: 2 },
        { userName: "Charles Leclerc", teamName: "Ferrari", carIdx: 3 },
        { userName: "George Russell", teamName: "Mercedes AMG", carIdx: 4 },
    ],
    telemetryTeam: [
        {
            carIdx: 1,
            lap: 1,
            fuelLevel: 150,
            incidentsTeam: 2,
            incidentsDriver: 1,
            bestLapTime: 82.456,
            lastLapTime: 83.123,
            position: 1,
            positionClass: 1,
            lapsCompleted: 15,
        },
        {
            carIdx: 1,
            lap: 2,
            fuelLevel: 147.3,
            incidentsTeam: 2,
            incidentsDriver: 1,
            bestLapTime: 82.456,
            lastLapTime: 83.123,
            position: 1,
            positionClass: 1,
            lapsCompleted: 15,
        },
        {
            carIdx: 1,
            lap: 3,
            fuelLevel: 144.2,
            incidentsTeam: 2,
            incidentsDriver: 1,
            bestLapTime: 82.456,
            lastLapTime: 83.123,
            position: 1,
            positionClass: 1,
            lapsCompleted: 15,
        },
        {
            carIdx: 1,
            lap: 4,
            fuelLevel: 141.5,
            incidentsTeam: 2,
            incidentsDriver: 1,
            bestLapTime: 82.456,
            lastLapTime: 83.123,
            position: 1,
            positionClass: 1,
            lapsCompleted: 15,
        },
        {
            carIdx: 1,
            lap: 5,
            fuelLevel: 138.7,
            incidentsTeam: 2,
            incidentsDriver: 1,
            bestLapTime: 82.456,
            lastLapTime: 83.123,
            position: 1,
            positionClass: 1,
            lapsCompleted: 15,
        },
        {
            carIdx: 1,
            lap: 6,
            fuelLevel: 135,
            incidentsTeam: 2,
            incidentsDriver: 1,
            bestLapTime: 82.456,
            lastLapTime: 83.123,
            position: 1,
            positionClass: 1,
            lapsCompleted: 15,
        },
        {
            carIdx: 1,
            lap: 7,
            fuelLevel: 131.2,
            incidentsTeam: 2,
            incidentsDriver: 1,
            bestLapTime: 82.456,
            lastLapTime: 83.123,
            position: 1,
            positionClass: 1,
            lapsCompleted: 15,
        }
    ],
    telemetryAll: [
        {
            carIdx: 1,
            lap: 15,
            lapsCompleted: 15,
            position: 1,
            positionClass: 1,
            lastLapTime: 83.123,
            bestLapTime: 82.456,
            class: "GT3",
        },
        {
            carIdx: 2,
            lap: 15,
            lapsCompleted: 15,
            position: 2,
            positionClass: 2,
            lastLapTime: 83.445,
            bestLapTime: 82.789,
            class: "GT3",
        },
        {
            carIdx: 3,
            lap: 15,
            lapsCompleted: 15,
            position: 1,
            positionClass: 1,
            lastLapTime: 83.123,
            bestLapTime: 82.456,
            class: "GTP",
        },
        {
            carIdx: 4,
            lap: 15,
            lapsCompleted: 15,
            position: 2,
            positionClass: 2,
            lastLapTime: 83.445,
            bestLapTime: 82.789,
            class: "GTP",
        },
    ]
}

const { data: telemetryAll, isPending: allPending } = useConvexQuery(api.telemetry.getTelemetryAll)
const { data: telemetryTeam, isPending: teamPending } = useConvexQuery(api.telemetry.getTelemetryTeam)
const { data: drivers, isPending: driversPending } = useConvexQuery(api.drivers.getDrivers)
</script>

<template>
    <div class="flex flex-row items-baseline gap-2 p-4">
        <UIcon name="i-lucide-flag" size="30" />
        <h1 class="text-4xl mb-8">
            Sim Racing Dashboard
        </h1>
    </div>
    <div v-if="!allPending && !teamPending && !driversPending" class="p-4 grid grid-cols-3 gap-4 h-full">
        <div class="flex flex-col gap-4 mb-8 col-span-2">
            <Fuel :drivers="exampleData.drivers!" :telemetry-team="exampleData.telemetryTeam!" />
        </div>
        <div class="col-span-1 flex flex-col gap-4 mb-8">
            <Standings :drivers="exampleData.drivers!" :telemetryAll="exampleData.telemetryAll!" />
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