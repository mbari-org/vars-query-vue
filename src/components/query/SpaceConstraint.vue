<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFathomnetStore } from '@/stores/fathomnet'
import { computedAsync } from '@vueuse/core'
import { useRegionStore } from '@/stores/query-params'

const fathomnetStore = useFathomnetStore()
const regionStore = useRegionStore()
const regionNames = computedAsync(() =>
    fathomnetStore.regions?.map(region => region.name),
)
const selectedRegionName = ref('')

const selectedRegion = computed(() => {
    if (regionNames.value && regionNames.value.length > 0) {
        return fathomnetStore.regions?.find(
            region => region.name === selectedRegionName.value,
        )
    }
    return null
})

watch(selectedRegion, region => {
    if (region) {
        regionStore.setBounds(region)
    } else {
        // regionStore.reset()
    }
})

const numberRule = (value: string) => {
    return !isNaN(Number(value)) || 'Please enter a valid number'
}

function stringToNumber(value: string) {
    if (value === '' || value === null) {
        return null
    }
    const n = Number(value)
    if (isNaN(n)) {
        return null
    }
    return n
}

/* sanitize the input */
const maxDepthProxy = computed({
        get: () => regionStore.bounds.maxDepth,
        set: val => {
            regionStore.bounds.maxDepth = stringToNumber(val)
        }
    })

const minDepthProxy = computed({
        get: () => regionStore.bounds.minDepth,
        set: val => {
            regionStore.bounds.minDepth = stringToNumber(val)
        }
    })

const minLatProxy = computed({
    get: () => regionStore.bounds.minLatitude,
    set: val => {
        regionStore.bounds.minLatitude = stringToNumber(val)
    }
})

const maxLatProxy = computed({
    get: () => regionStore.bounds.maxLatitude,
    set: val => {
        regionStore.bounds.maxLatitude = stringToNumber(val)
    }
})

const minLonProxy = computed({
    get: () => regionStore.bounds.minLongitude,
    set: val => {
        regionStore.bounds.minLongitude = stringToNumber(val)
    }
})

const maxLonProxy = computed({
    get: () => regionStore.bounds.maxLongitude,
    set: val => {
        regionStore.bounds.maxLongitude = stringToNumber(val)
    }
})

</script>

<template>
    <v-container fluid style="width: 100%">
        <v-row>
            <v-col cols="6">
                <v-autocomplete
                    clearable
                    label="Region"
                    v-model="selectedRegionName"
                    :items="regionNames"
                    @click:clear="regionStore.reset"
                ></v-autocomplete>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    label="Depth Min"
                    v-model="minDepthProxy"
                    :rules="[numberRule]"
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    label="Depth Max"
                    v-model="maxDepthProxy"
                    :rules="[numberRule]"
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3">
                <v-text-field
                    label="Latitude Min"
                    v-model="minLatProxy"
                    :rules="[numberRule]"
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    label="Latitude Max"
                    v-model="maxLatProxy"
                    :rules="[numberRule]"
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    label="Longitude Min"
                    v-model="minLonProxy"
                    :rules="[numberRule]"
                    clearable
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    label="Longitude Max"
                    v-model="maxLonProxy"
                    :rules="[numberRule]"
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped></style>
