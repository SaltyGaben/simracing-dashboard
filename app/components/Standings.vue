<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { Driver } from '~~/convex/drivers.ts';
import type { TelemetryAll } from '~~/convex/telemetry';

const props = defineProps<{
    drivers: Driver[],
    telemetryAll: TelemetryAll[]
}>()

type TableData = {
    name: string;
    teamName: string;
    bestLapTime: number;
    lastLapTime: number;
    positionClass: number;
}

const classColors: Record<string, { bg: string, text: string }> = {
    'GT3': { bg: 'bg-blue-500', text: 'text-blue-500' },
    'GTP': { bg: 'bg-yellow-500', text: 'text-yellow-500' },
    'TCX': { bg: 'bg-purple-500', text: 'text-purple-500' },
    'TC': { bg: 'bg-orange-500', text: 'text-orange-500' },
}

const getClassColor = (className: string, type: 'bg' | 'text') => {
    return classColors[className]?.[type] || (type === 'bg' ? 'bg-gray-500' : 'text-gray-500')
}

const classes = Array.from(new Set(props.telemetryAll.map(d => d.class))).sort();

const tableData: Record<string, TableData[]> = {};

props.telemetryAll.forEach(t => {
    const driver = props.drivers.find(d => d.carIdx === t.carIdx);
    if (driver) {
        if (t.lap < 0 || t.lapsCompleted < 0 || t.lastLapTime < 0 || t.bestLapTime < 0) {
            return
        }
        const data: TableData = {
            name: driver.userName,
            teamName: driver.teamName,
            bestLapTime: t.bestLapTime,
            lastLapTime: t.lastLapTime,
            positionClass: t.position
        }

        const currentClass = t.class;
        if (!tableData[currentClass]) {
            tableData[currentClass] = [];
        }
        tableData[currentClass]?.push(data)
    }
});

const columns: TableColumn<TableData>[] = [
    {
        accessorKey: 'positionClass',
        header: 'Position',
    },
    {
        accessorKey: 'name',
        header: 'Driver',
    },
    {
        accessorKey: 'teamName',
        header: 'Team',
    },
    {
        accessorKey: 'bestLapTime',
        header: 'Best Lap Time',
        cell: info => {
            return h('span', { class: 'text-purple-500' }, (info.getValue() as number / 1000).toFixed(3) + ' s')
        }
    },
    {
        accessorKey: 'lastLapTime',
        header: 'Last Lap Time',
        cell: info => (info.getValue() as number / 1000).toFixed(3) + ' s'
    }
];
</script>

<template>
    <UCard>
        <template #header>
            <h1 class="text-4xl font-medium">Standings</h1>
        </template>

        <div v-for="(className, index) in classes" :key="className" class="flex flex-col">
            <span class="flex items-center gap-2 mb[-1rem]">
                <div :class="getClassColor(className, 'bg')" class="h-2 w-2 rounded-full" />
                <h1 :class="getClassColor(className, 'text')" class="text-xl">{{ className }}</h1>
            </span>
            <UTable :data="tableData[className]" :columns="columns"
                :class="index != classes.length - 1 ? 'mb-8' : ''" />
        </div>
    </UCard>
</template>