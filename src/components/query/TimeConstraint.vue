<script setup lang="ts">

import { useTimeStore } from '@/stores/query-params'
import DateTimePicker from '@/components/shared/DateTimePicker.vue'
import { onMounted, ref } from 'vue'

const timeStore = useTimeStore()

const startDateRef = ref<InstanceType<typeof DateTimePicker> | null>(null)
const endDateRef = ref<InstanceType<typeof DateTimePicker> | null>(null)

function updateStartTime(event: Date) {
    timeStore.setStartTimestamp(event)
}

function updateEndTime(event: Date) {
    console.log("updateEndTime", event)
    timeStore.setEndTimestamp(event)
}

function reset() {
    startDateRef.value?.reset()
    endDateRef.value?.reset()
}

function onClearStart() {
    console.log("onClearStart")
    timeStore.setStartTimestamp(null)
}

function onClearEnd() {
    timeStore.setEndTimestamp(null)
}

defineExpose({
    reset,
})

onMounted(() => {
    const bounds = timeStore.bounds
    if (bounds.startTimestamp) {
        startDateRef.value?.setDateTime(bounds.startTimestamp)
    }
    if (bounds.endTimestamp) {
        endDateRef.value?.setDateTime(bounds.endTimestamp)
    }
})


</script>

<template>
    <v-container fluid style="width:100%">
        <v-row>
            <v-col>
                <date-time-picker
                    ref="startDateRef"
                    picker-title="Start date"
                    time="00:00"
                    @update="updateStartTime"
                    @click:clear="onClearStart"> </date-time-picker>
            </v-col>



            <v-col>
                <date-time-picker
                    ref="endDateRef"
                    picker-title="End date"
                    time="23:59"
                    @update="updateEndTime"
                    @click:clear="onClearEnd"> </date-time-picker>
            </v-col>

        </v-row>
    </v-container>
</template>

<style scoped>

</style>
