<script setup lang="ts">

import { fauxAssociationToString, fauxAssociationToStringTrimmed } from '@/assets/ts/annosaurus/QueryResults'
import ImageThumbnail from '@/components/query/ImageThumbnail.vue'
import { useQueryResultsStore } from '@/stores/query-results'
import { computed, ref, watch } from 'vue'

const queryResultsStore = useQueryResultsStore()
const allAnnotations = queryResultsStore.annotations
const imageOnlyAnnotations = computed(() =>
    allAnnotations.filter(a => a.images && a.images.length > 0),
)
const showImagesOnly = ref(false)
const multiSelect = ref(false)
const selectionStrategy = computed(() => multiSelect.value ? 'page' : 'single')
const search = ref('')
const selectedRows = ref([] as number[])

watch(selectedRows, newVal => {
    // Find annotations that corresponds to the selected rows
    const selectedAnnotations = allAnnotations.filter(obj => selectedRows.value.includes(obj.row ?? -1))
    queryResultsStore.selectedAnnotations = selectedAnnotations
})

const viewedAnnotations = computed(() => {
    if (showImagesOnly.value) {
        return imageOnlyAnnotations.value
    } else {
        return allAnnotations
    }
})

function nestedFilter(
    value: string,
    search: string,
    item?: any,
): boolean | number | [number, number] | [number, number][] {
    if (!search) return true
    if (!value) return false

    if (Array.isArray(value)) {
        return value.some(v => nestedFilter(v, search, item))
    } else if (typeof value === 'object') {
        return Object.values(value).some(v =>
            nestedFilter(`${v}`, search, item),
        )
    } else {
        return String(value).toLowerCase().includes(search.toLowerCase())
    }
}

function handleRowClick(event: MouseEvent, row: { item: { row: number } }) {
    // console.log('click', row)
    selectedRows.value = [row.item.row]
}

const rowProps = computed(() => {
    return (item: any) => {

        const clazz = selectedRows.value.includes(item.item.row) ? 'selected-row' : ''
        const color = selectedRows.value.includes(item.item.row) ? '#014260' : ''
        const p = {
            class: clazz,
            bgcolor: color /* Dim orange color */
        }

        // console.log('rowProps', p, selectedRow.value, item.item.row)
        return p
    }
})

</script>

<template>
    <v-card :title="allAnnotations.length + ' Results'" flat>
        <template v-slot:text>
            <v-container>
                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            v-model="search"
                            label="Search"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                            clearable
                            single-line
                            density="compact"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-checkbox
                            label="Images only"
                            v-model="showImagesOnly"
                            density="compact"
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="3">
                        <v-checkbox
                            label="Multi-select"
                            v-model="multiSelect"
                            density="compact"></v-checkbox>
                    </v-col>
                </v-row>
            </v-container>
        </template>

        <v-data-table
            :items="viewedAnnotations"
            :search="search"
            :custom-filter="nestedFilter"
            :hover="true"
            @click:row="handleRowClick"
            item-value="row"
            :row-props="rowProps"
            :select-strategy="selectionStrategy"
            show-select
            show-current-page
            density="compact"
            v-model="selectedRows"
        >

            <!-- Hide the images column -->
            <template v-slot:item.images="{ item }"><span class="dimmer">&lt;hidden&gt;</span></template>

            <!-- Define the image column with hover functionality -->
            <template v-slot:item.image="{ item }">
                <image-thumbnail :annotation="item"></image-thumbnail>
            </template>

            <template v-slot:item.details="{ item }">
                <div>
                    <v-chip
                        v-for="(detail, idx) in item.details"
                        :key="idx"
                    >
                        {{
                            fauxAssociationToStringTrimmed(
                                detail,
                                40,
                            )
                        }}
                        <v-tooltip
                            activator="parent"
                            location="bottom"
                        >{{ fauxAssociationToString(detail) }}
                        </v-tooltip>
                    </v-chip>
                </div>
            </template>
        </v-data-table>
    </v-card>
</template>

<style scoped>

</style>
