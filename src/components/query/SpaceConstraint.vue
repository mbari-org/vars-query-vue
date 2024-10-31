<script setup lang="ts">

import { listRegions } from '@/assets/ts/fathomnet/api'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useFathomnetStore } from '@/stores/fathomnet'
import { computedAsync } from '@vueuse/core'

const fathomnetStore = useFathomnetStore()

const regionNames = computedAsync(() => fathomnetStore.regions?.map(region => region.name))

const selectedRegionName = ref("")

const selectedRegion = computed(() => {
    if (regionNames.value && regionNames.value.length > 0) {
        fathomnetStore.regions?.find(region => region.name === selectedRegionName.value)
    }
    return null
})

watch(selectedRegion, (region) => {
    if (region) {
        data.minLatitude = region.minLatitude
        data.maxLatitude = region.maxLatitude
        data.minLongitude = region.minLongitude
        data.maxLongitude = region.maxLongitude
    }
})

interface SpaceData {
    minLatitude: number | null
    maxLatitude: number | null
    minLongitude: number | null
    maxLongitude: number | null
}

const data = reactive<SpaceData>({
    minLatitude: null,
    maxLatitude: null,
    minLongitude: null,
    maxLongitude: null
})



</script>

<template>
    <div>
        <h2>Space</h2>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-autocomplete
                        clearable
                        label="Groups"
                        v-model=selectedRegionName
                        :items=regionNames
                    ></v-autocomplete>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="3">
                    <v-text-field label="Latitude Min" v-model="data.minLatitude"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field label="Latitude Max" v-model="data.maxLatitude"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field label="Longitude Min" v-model="data.minLongitude"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field label="Longitude Max" v-model="data.maxLongitude"></v-text-field>
                </v-col>

            </v-row>
        </v-container>
    </div>
</template>

<style scoped>

</style>
