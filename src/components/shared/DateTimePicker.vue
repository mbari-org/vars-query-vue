<script setup lang="ts">

import { computed, ref, watch } from 'vue'

interface Props {
    pickerTitle: string
    time: string // hours:min
}

const { pickerTitle = "Time", time = "00:00" } = defineProps<Props>()


const date = ref<string | null>(null)
const dateDialog = ref<boolean>(false)

// const time = ref<string | null>(null)
// const timeDialog = ref<boolean>(false)

// Close the date dialog
function closeDateDialog() {
    dateDialog.value = false
}

// Update the date
function updateDate(newDate: string) {
    date.value = newDate
}

// Close the time dialog
// function closeTimeDialog() {
//     timeDialog.value = false
// }

// Update the time
// function updateTime(newTime: string) {
//     time.value = newTime
// }

const selectedDateTime = computed(() => {
    if (date.value) {
        const localDate = new Date(date.value)

        if (time) {
            // convert to UTC
            const [hours, minutes] = time.split(':').map(Number)
            return new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), hours, minutes))
        }
        else {
            // convert to UTC at midnight
            return new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate()))
        }
    }
    return null
})

watch(selectedDateTime, (value) => {
    if (value) {
        emitUpdate()
    }
})

// Confirm the selected date
function confirmDate() {
    dateDialog.value = false
}

const emit = defineEmits<{
    (e: 'update', value: Date): void
}>()

function emitUpdate() {
    if (selectedDateTime.value) {
        emit('update', selectedDateTime.value)
    }
}

// Confirm the selected time
// function confirmTime() {
//     if (selectedDateTime.value && time.value) {
//         const [hours, minutes] = time.value.split(':').map(Number)
//         selectedDateTime.value.setHours(hours)
//         selectedDateTime.value.setMinutes(minutes)
//     }
//     timeDialog.value = false
// }
</script>


<template>
    <div>
        <!-- Buttons to open date and time pickers -->
        <v-btn @click="dateDialog = true">{{pickerTitle}}</v-btn>
<!--        <v-btn @click="timeDialog = true">Select Time</v-btn>-->

        <!-- Date Picker Dialog -->
        <v-dialog v-model="dateDialog" max-width="400">
            <v-card>
                <v-card-title>{{pickerTitle}}</v-card-title>
                <v-card-text>
                    <v-date-picker v-model="date" @input="updateDate"></v-date-picker>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDateDialog">Cancel</v-btn>
                    <v-btn @click="confirmDate">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Time Picker Dialog -->
<!--        <v-dialog v-model="timeDialog" max-width="400">-->
<!--            <v-card>-->
<!--                <v-card-title>Select Time</v-card-title>-->
<!--                <v-card-text>-->
<!--                    <v-time-picker v-model="time" @input="updateTime"></v-time-picker>-->
<!--                </v-card-text>-->
<!--                <v-card-actions>-->
<!--                    <v-spacer></v-spacer>-->
<!--                    <v-btn @click="closeTimeDialog">Cancel</v-btn>-->
<!--                    <v-btn @click="confirmTime">OK</v-btn>-->
<!--                </v-card-actions>-->
<!--            </v-card>-->
<!--        </v-dialog>-->

        <!-- Display the selected Date and Time -->
        <div v-if="selectedDateTime">
            <p> {{ selectedDateTime.toUTCString() }}</p>
        </div>
    </div>
</template>


<style scoped>
/* Add any custom styles here */
</style>
