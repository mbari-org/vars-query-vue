<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
    pickerTitle: string
    time: string // hours:min
}

const { pickerTitle = 'Time', time = '00:00' } = defineProps<Props>()

const selectedDate = ref<Date | null>(null)
const dateInput = ref<string>('') // Text field for date input in YYYY-MM-DD format

function reset() {
    selectedDate.value = null
    dateInput.value = ''
}

function setDateTime(dateTime: Date) {
    selectedDate.value = dateTime
}

defineExpose({
    reset,
    setDateTime,
})

// Computed value for the combined date and time
const selectedDateTime = computed(() => {
    if (selectedDate.value) {
        const localDate = selectedDate.value
        if (time) {
            // Convert to UTC
            const [hours, minutes] = time.split(':').map(Number)
            return new Date(
                Date.UTC(
                    localDate.getUTCFullYear(),
                    localDate.getUTCMonth(),
                    localDate.getUTCDate(),
                    hours,
                    minutes,
                ),
            )
        } else {
            // Convert to UTC at midnight
            return new Date(
                Date.UTC(
                    localDate.getUTCFullYear(),
                    localDate.getUTCMonth(),
                    localDate.getUTCDate(),
                ),
            )
        }
    }
    return null
})

const selectedDateTimeString = computed(() => {
    if (selectedDateTime.value) {
        //string as iso8601 UTC
        return selectedDateTime.value.toISOString()
    }
    return ''
})

// Watch the selectedDate and update the text field with the formatted date
watch(selectedDate, newDate => {
    // const textField = document.getElementById('textfield') as HTMLInputElement
    // console.log('textField', textField)
    if (newDate) {
        dateInput.value = newDate.toISOString().split('T')[0]
    } else {
        dateInput.value = ''
    }
})

// Function to update selectedDate from the text field input
function updateSelectedDate(event: Event) {
    const dateInput = event.target as HTMLInputElement
    const dateString = dateInput.value

    // Validate that the date string is in the format YYYY-MM-DD
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateString)

    if (!isValidFormat) {
        // console.error('Invalid date format: Must be YYYY-MM-DD');
        return
    }

    try {
        const parsedDate = new Date(dateString)

        // Ensure it's a valid date
        if (!isNaN(parsedDate.getTime())) {
            selectedDate.value = parsedDate
        } else {
            console.error('Invalid date: Not a real date')
        }
    } catch (error) {
        console.error('Error parsing date', error)
    }
}

const dateDialog = ref<boolean>(false)

// Close the date dialog
function closeDateDialog() {
    dateDialog.value = false
}

function confirmDate() {
    dateDialog.value = false
}

// Emit event to the parent component
const emit = defineEmits<{
    (e: 'update', value: Date): void
}>()

watch(selectedDateTime, value => {
    if (value) {
        emit('update', value)
    }
})
</script>

<template>
    <div>
        <v-row>
            <!-- Text field to input the date -->
            <v-col>
            <v-text-field
                :label="`${pickerTitle} (YYYY-MM-DD)`"
                id="textfield"
                outlined
                clearable
                v-model="dateInput"
                @blur="updateSelectedDate"
                @input="updateSelectedDate"
                @click:clear="reset"
            >
                <v-tooltip v-if="selectedDateTime" activator="parent" location="top">{{selectedDateTimeString}}</v-tooltip>
            </v-text-field>
            </v-col>

            <!-- Button to open date picker -->
            <v-col cols="2">
                <v-btn @click="dateDialog = true" icon="mdi-calendar" variant="tonal" color="primary">
                    <v-icon icon="mdi-calendar"></v-icon>
                    <v-tooltip activator="parent" location="top">Select {{pickerTitle}}</v-tooltip>
                </v-btn>
            </v-col>

        </v-row>

        <!-- Date Picker Dialog -->
        <v-dialog v-model="dateDialog" max-width="400">
            <v-card>
                <v-card-title>{{ pickerTitle }}</v-card-title>
                <v-card-text>
                    <v-date-picker v-model="selectedDate"></v-date-picker>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDateDialog">Cancel</v-btn>
                    <v-btn @click="confirmDate">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Display the selected Date and Time -->
<!--        <div v-if="selectedDateTime">-->
<!--            <p>{{ selectedDateTimeString }}</p>-->
<!--        </div>-->
    </div>
</template>

<style scoped></style>
