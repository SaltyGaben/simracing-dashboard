<script setup lang="ts">
import type { Driver } from '~~/convex/drivers';
import type { TelemetryTeam } from '~~/convex/telemetry';

const props = defineProps<{
    drivers: Driver[],
    telemetryTeam: TelemetryTeam[]
}>()

interface AreaChartItem {
    lap: number
    lapTime: number
}

const categories = computed(() => {
    const result: Record<string, { name: string; color: string }> = {}
    driverKeys.value.forEach((driver, idx) => {
        result[driver] = {
            name: driver,
            color: pickColor(idx)  // some function to pick distinct color
        }
    })
    return result
})

const driverKeys = computed(() => {
    const carIdxs = new Set(props.telemetryTeam.map(c => c.userID))

    // Return unique driver names for drivers that have telemetry entries
    return Array.from(new Set(props.drivers
        .filter(d => carIdxs.has(d.userID))
        .map(d => d.userName)
    ))
})

const pickColor = (idx: number) => {
    const palette = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#6b7280']
    return palette[idx % palette.length] ?? '#3b82f6'
}

const formatTime = (time: number) => {
    if (time === 0) return '0:00.000';
    if (time === -1) return 'Invalid';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

const calculateLapTimes = computed(() => {

    const { telemetryTeam, drivers } = props;

    const keys = driverKeys.value;

    const driverLapMap: Record<string, Map<number, TelemetryTeam>> = {};
    keys.forEach(driverName => {
        driverLapMap[driverName] = new Map<number, TelemetryTeam>();
    });

    telemetryTeam.forEach(entry => {
        // Filter out entries with invalid lap times
        if (entry.lastLapTime === -1 || entry.lastLapTime == null) return;

        const driverObj = drivers.find(d => d.userID === entry.userID);
        if (!driverObj) return;
        const driverName = driverObj.userName;
        if (!driverLapMap[driverName]) return;

        const lap = entry.lap;
        const lapMap = driverLapMap[driverName];
        const existing = lapMap.get(lap);
        if (!existing) {
            lapMap.set(lap, entry);
        } else {
            const existingTime = new Date(existing._creationTime).getTime();
            const entryTime = new Date(entry._creationTime).getTime();
            if (entryTime < existingTime) {
                lapMap.set(lap, entry);
            }
        }
    })

    const allLapsSet = new Set<number>();
    keys.forEach(driverName => {
        driverLapMap[driverName]?.forEach((_, lap) => {
            allLapsSet.add(lap);
        });
    });
    const allLaps = Array.from(allLapsSet).sort((a, b) => a - b);

    const chartData: Array<Record<string, any>> = allLaps.map(lap => {
        const row: Record<string, any> = { lap };
        keys.forEach(driverName => {
            row[driverName] = null;
        });
        return row;
    });

    keys.forEach(driverName => {
        const lapMap = driverLapMap[driverName];
        const sortedEntries = Array.from(lapMap?.values() ?? []).sort((a, b) => a.lap - b.lap);

        sortedEntries.forEach(entry => {
            const lap = entry.lap
            const lastLapTime = entry.lastLapTime

            const row = chartData.find(r => r.lap === lap);
            if (row && lastLapTime != null && lastLapTime != -1) {
                row[driverName] = lastLapTime;
            }
        })
    })

    return { chartData }
})

const AreaChartData = computed(() => calculateLapTimes.value.chartData)
</script>

<template>
    <UCard variant="subtle">
        <template #header>
            <h1 class="text-4xl font-medium">Lap Times</h1>
        </template>
        <div>
            <AreaChart :data="AreaChartData" :categories="categories" y-label="'Lap Time (m:ss:ms)'" x-label="Laps"
                :height="300" :legend-position="LegendPosition.TopRight" :y-formatter="formatTime" />
        </div>
    </UCard>
</template>