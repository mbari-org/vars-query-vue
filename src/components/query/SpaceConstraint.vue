<script setup lang="ts">

import { computed, reactive, ref, watch } from 'vue'
import { useFathomnetStore } from '@/stores/fathomnet'
import { computedAsync } from '@vueuse/core'
import { useRegionStore } from '@/stores/query-params'

const fathomnetStore = useFathomnetStore()
const regionStore = useRegionStore()
const regionNames = computedAsync(() => fathomnetStore.regions?.map(region => region.name))
const selectedRegionName = ref("")

const selectedRegion = computed(() => {
    if (regionNames.value && regionNames.value.length > 0) {
        return fathomnetStore.regions?.find(region => region.name === selectedRegionName.value)
    }
    return null
})

watch(selectedRegion, (region) => {
    if (region) {
        regionStore.setBounds(region)
    }
    else {
        regionStore.reset()
    }
})


const numberRule = (value: string) => {
    return !isNaN(Number(value)) || 'Please enter a valid number';
};

</script>

<template>
    <v-container fluid style="width:100%">
        <v-row>
            <v-col cols="6">
                <v-autocomplete
                    clearable
                    label="Region"
                    v-model=selectedRegionName
                    :items=regionNames
                ></v-autocomplete>
            </v-col>
            <v-col cols="3">
                <v-text-field label="Depth Min" v-model="regionStore.bounds.minDepth" :rules="[numberRule]"></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field label="Depth Max" v-model="regionStore.bounds.maxDepth" :rules="[numberRule]"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3">
                <v-text-field label="Latitude Min" v-model="regionStore.bounds.minLatitude" :rules="[numberRule]"></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field label="Latitude Max" v-model="regionStore.bounds.maxLatitude" :rules="[numberRule]"></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field label="Longitude Min" v-model="regionStore.bounds.minLongitude" :rules="[numberRule]"></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field label="Longitude Max" v-model="regionStore.bounds.maxLongitude" :rules="[numberRule]"></v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>

</style>
