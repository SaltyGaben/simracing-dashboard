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
    'LMP2': { bg: 'bg-purple-500', text: 'text-purple-500' },
}

const classMap: Record<number, string> = {
    4011: 'GT3',
    4029: 'GTP',
    2423: 'LMP2',
}

const getClassColor = (className: string, type: 'bg' | 'text') => {
    return classColors[className]?.[type] || (type === 'bg' ? 'bg-gray-500' : 'text-gray-500')
}

const classes = ['GTP', 'LMP2', 'GT3'];

const tableData: Record<string, TableData[]> = {
    "GT3": [],
    "LMP2": [],
    "GTP": [],
};

props.telemetryAll.forEach(t => {
    const driver = props.drivers.find(d => d.carIdx === t.carIdx);
    if (driver) {
        if (t.lap < 0 || t.lapsCompleted < 0) {
            return
        }
        const data: TableData = {
            name: driver.userName,
            teamName: driver.teamName,
            bestLapTime: t.bestLapTime,
            lastLapTime: t.lastLapTime,
            positionClass: t.positionClass
        }

        const currentClass = classMap[t.class];
        if (!tableData[currentClass]) {
            tableData[currentClass] = [];
        }
        tableData[currentClass]?.push(data)
    }

    tableData[classMap[t.class]]?.sort((a, b) => a.positionClass - b.positionClass);
});

const formatTime = (time: number) => {
    if (time === 0) return '0:00.000';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

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
            return h('span', { class: 'text-purple-500' }, (formatTime(info.getValue() as number)))
        }
    },
    {
        accessorKey: 'lastLapTime',
        header: 'Last Lap Time',
        cell: info => (formatTime(info.getValue() as number))
    }
];
</script>

<template>
    <UCard variant="subtle">
        <template #header>
            <h1 class="text-4xl font-medium">Standings</h1>
        </template>

        <div v-for="(className, index) in classes" :key="className" class="flex flex-col">
            <span class="flex items-center gap-2 mb[-1rem]" v-if="className">
                <div :class="getClassColor(className, 'bg')" class="h-2 w-2 rounded-full" />
                <h1 :class="getClassColor(className, 'text')" class="text-xl">{{ className }}</h1>
            </span>
            <UTable v-if="className" :data="tableData[className]" :columns="columns"
                :class="index != classes.length - 1 ? 'mb-8' : ''" />
        </div>
    </UCard>
</template>