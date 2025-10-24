<script setup lang="ts">
import type { Driver } from '~~/convex/drivers';
import type { TelemetryTeam } from '~~/convex/telemetry';

const props = defineProps<{
    drivers: Driver[],
    telemetryTeam: TelemetryTeam[]
}>()

interface AreaChartItem {
    lap: number
    fuelUsed: number
}

const categories: Record<string, BulletLegendItemInterface> = {
    fuelUsed: { name: 'Fuel Used', color: '#ee2828' },
}

const calculateFuelUsage = computed(() => {
    const ROLLING_AVG_LAPS = 5;
    const fuelData: AreaChartItem[] = [];
    const sortedTelemetry = [...props.telemetryTeam].sort((a, b) => a.lap - b.lap);

    let previousFuel = sortedTelemetry[0]?.fuelLevel;
    let fuelUsageHistory: number[] = [];

    for (let i = 1; i < sortedTelemetry.length; i++) {
        const current = sortedTelemetry[i];

        if (previousFuel !== undefined) {
            const fuelUsed = previousFuel - current.fuelLevel;

            if (fuelUsed > 0.1 && fuelUsed < 100) {
                fuelUsageHistory.push(fuelUsed);
                if (fuelUsageHistory.length > ROLLING_AVG_LAPS) {
                    fuelUsageHistory.shift();
                }

                fuelData.push({
                    lap: current.lap,
                    fuelUsed: fuelUsed
                });
            }
        }

        previousFuel = current.fuelLevel;
    }

    const rollingAverageFuelPerLap = fuelUsageHistory.length > 0
        ? fuelUsageHistory.reduce((sum, val) => sum + val, 0) / fuelUsageHistory.length
        : 0;

    return {
        fuelData,
        rollingAverageFuelPerLap
    };
});

const AreaChartData = computed(() => calculateFuelUsage.value.fuelData);
const averageFuelUsage = computed(() => calculateFuelUsage.value.rollingAverageFuelPerLap);
</script>

<template>
    <UCard>
        <template #header>
            <h1 class="text-4xl font-medium">Fuel Usage</h1>
        </template>
        <div>
            <AreaChart :data="AreaChartData" :categories="categories" y-label="'Fuel Used (L)'" x-label="Laps"
                :height="300" />
        </div>
    </UCard>
</template>