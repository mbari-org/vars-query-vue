<script setup lang="ts">

import DateTimePicker from '@/components/shared/DateTimePicker.vue'
import { useTimeStore } from '@/stores/query-params'

const timeStore = useTimeStore()

function updateStartTime(event: Date) {
    timeStore.setStartTimestamp(event)
}

function updateEndTime(event: Date) {
    timeStore.setEndTimestamp(event)
}


</script>

<template>
    <v-container fluid style="width:100%">
        <v-row>
            <v-col>
                <date-time-picker picker-title="Start date" time="00:00" @update="updateStartTime"> </date-time-picker>
            </v-col>

            <v-col>
                <date-time-picker picker-title="End date" time="23:59" @update="updateEndTime"> </date-time-picker>
            </v-col>

        </v-row>
    </v-container>
</template>

<style scoped>

</style>
