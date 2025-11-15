<script setup lang="ts">
import type { TelemetryTeam } from '~~/convex/telemetry';

const props = defineProps<{
  telemetryTeam: TelemetryTeam[]
}>()

interface AreaChartItem {
  lap: number
  fuelUsed: number
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
  const userNames = new Set(props.telemetryTeam.map(c => c.userName))

  // Return unique driver names for drivers in telemetryTeam
  return Array.from(userNames)
})

const pickColor = (idx: number) => {
  const palette = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#6b7280']
  return palette[idx % palette.length] ?? '#3b82f6'
}

const calculateFuelUsage = computed(() => {
  const { telemetryTeam } = props;

  const keys = driverKeys.value;

  const driverLapMap: Record<string, Map<number, TelemetryTeam>> = {};
  keys.forEach(driverName => {
    driverLapMap[driverName] = new Map<number, TelemetryTeam>();
  });

  telemetryTeam.forEach(entry => {
    const driverName = entry.userName;
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
  });

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
    let prevFuelLevel: number | undefined = undefined;

    sortedEntries.forEach(entry => {
      const lap = entry.lap;
      const fuelLevel = entry.fuelLevel;
      if (prevFuelLevel !== undefined) {
        const used = prevFuelLevel - fuelLevel;
        if (used > 0.1 && used < 100) {
          const row = chartData.find(r => r.lap === lap);
          if (row) {
            row[driverName] = used;
          }
        }
      }
      prevFuelLevel = fuelLevel;
    });
  });

  return {
    chartData,
  };
});

const AreaChartData = computed(() => calculateFuelUsage.value.chartData);
</script>

<template>
  <UCard variant="subtle">
    <template #header>
      <h1 class="text-4xl font-medium">Fuel Usage</h1>
    </template>
    <div>
      <AreaChart :data="AreaChartData" :categories="categories" y-label="'Fuel Used (L)'" x-label="Laps" :height="300"
        :legend-position="LegendPosition.TopRight" />
    </div>
  </UCard>
</template>