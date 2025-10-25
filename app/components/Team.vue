<script setup lang="ts">
import type { Driver } from '~~/convex/drivers';
import type { TelemetryTeam } from '~~/convex/telemetry';


const props = defineProps<{
    drivers: Driver[],
    telemetryTeam: TelemetryTeam[]
}>()

const teamDrivers = computed(() => {
    return props.drivers.filter(driver =>
        props.telemetryTeam.some(telemetry => telemetry.carIdx === driver.carIdx)
    );
});

const getIncidents = (carIdx: number) => {
    const telemetry = props.telemetryTeam.filter(t => t.carIdx === carIdx);
    if (telemetry.length === 0) return { team: 0, driver: 0 };

    const latestTelemetry = telemetry.reduce((latest, current) =>
        current._creationTime > latest._creationTime ? current : latest
    );

    return latestTelemetry.incidentsDriver;
};

const getLatestTelemetryDriver = (carIdx: number) => {
    const telemetry = props.telemetryTeam.filter(t => t.carIdx === carIdx);
    if (telemetry.length === 0) return null;

    return telemetry.sort((a, b) => b._creationTime - a._creationTime)[0];
};

const getLatestTelemetry = () => {
    return props.telemetryTeam.sort((a, b) => b._creationTime - a._creationTime)[0];
}

const formatTime = (time: number) => {
    if (time === 0) return '0:00.000';
    if (time === -1) return 'Invalid';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};
</script>

<template>
    <UCard variant="subtle">
        <template #header>
            <h1 class="text-4xl font-medium">Team Statistics</h1>
        </template>
        <div class="grid grid-cols-3 gap-4">
            <div class="flex flex-col gap-4 col-span-2">
                <h1 class="text-2xl font-medium">Drivers</h1>
                <UCard v-for="driver in teamDrivers" :key="driver.carIdx" class="transition hover:bg-slate-800/60 hover:scale-[1.01] mb" >
                    <div class="flex flex-col gap-2 items-baseline">
                        <div class="flex flex-row gap-2 items-baseline justify-between w-full">
                            <h2 class="text-xl font-medium">{{ driver.userName }}</h2>
                            <span class="bg-red-400 text-black px-2 py-1 rounded-md">Incidents:
                                {{ getLatestTelemetryDriver(driver.carIdx)?.incidentsDriver ?? 'N/A' }}
                            </span>
                        </div>
                        <div class="flex flex-row gap-10 items-baseline">
                            <span>
                                <p>Fastest Lap</p>
                                <p class="font-semibold text-purple-500">{{
                                    formatTime(getLatestTelemetryDriver(driver.carIdx)?.bestLapTime ?? 0)
                                }}</p>
                            </span>

                            <span>
                                <p>Last Lap</p>
                                <p class="font-semibold">{{
                                    formatTime(getLatestTelemetryDriver(driver.carIdx)?.lastLapTime ??
                                        0) }}</p>
                            </span>

                            <span>
                                <p>Laps Completed</p>
                                <p class="font-semibold"> {{ getLatestTelemetryDriver(driver.carIdx)?.lapsCompleted ??
                                    'N/A' }}
                                </p>
                            </span>
                        </div>
                    </div>
                </UCard>
            </div>

            <div class="flex flex-col gap-4">
                <h1 class="text-2xl font-medium">Team Statistics</h1>
                <UCard class="transition hover:bg-slate-800/60 hover:scale-[1.01]">
                    <h1 class="text-xl">Incidents</h1>
                    <h1 class="font-bold text-red-500 text-xl">{{ getLatestTelemetry()?.incidentsTeam ?? 'N/A' }}</h1>
                </UCard>
                <UCard class="transition hover:bg-slate-800/60 hover:scale-[1.01]">
                    <h1 class="text-xl">Fastest Lap Overall</h1>
                    <h1 class="font-bold text-purple-500 text-xl">{{ formatTime(getLatestTelemetry()?.bestLapTime ?? 0)
                    }}</h1>
                </UCard>
            </div>

        </div>
    </UCard>
</template>