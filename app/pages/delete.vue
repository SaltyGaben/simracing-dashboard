<script setup lang="ts">
import { api } from '~~/convex/_generated/api'

const secretPassword = 'jambulani'

const password = ref('')
const isCorrectPassword = computed(() => password.value === secretPassword)
const open = ref(false)

const { mutate: deleteAllDrivers } = useConvexMutation(api.drivers.deleteAllDrivers)
const { mutate: deleteAllTelemetry } = useConvexMutation(api.telemetry.deleteAllTelemetry)

const deleteAllDocuments = async () => {
    await deleteAllDrivers({})
    await deleteAllTelemetry({})
    open.value = false
    password.value = ''
}
</script>

<template>
    <div class="flex justify-center items-center h-screen flex-col gap-4">
        <h1>Delete all documents</h1>
        <UInput v-model="password" type="password" />
        <UModal title="Delete all documents" description="Are you sure you want to delete all documents?" :open="open">
            <UButton class="text-xl hover:cursor-pointer" label="Delete" color="error" variant="solid"
                :disabled="!isCorrectPassword" size="xl" @click="open = true" />

            <template #footer>
                <UButton class="text-xl hover:cursor-pointer" label="Delete All Documents" color="error" variant="solid"
                    size="xl" @click="deleteAllDocuments" />
            </template>
        </UModal>
    </div>
</template>