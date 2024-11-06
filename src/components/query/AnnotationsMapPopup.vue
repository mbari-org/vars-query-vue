<script setup lang="ts">

import { computed } from 'vue'
import { GeoFauxAnnotation } from '@/assets/ts/annosaurus/QueryResults'

const props = defineProps({
    annotation: GeoFauxAnnotation
})

const image = computed(() => {
    const annotation = props.annotation
    if (annotation && 'image' in annotation) {
        return annotation.image as string
    }
    return null
})

const concept = computed(() => {
    const annotation = props.annotation
    if (annotation && 'concept' in annotation) {
        return annotation.concept
    }
    return ""
})

</script>

<template>
    <div class="annotations-map-popup">
        <h3>{{concept}}</h3>
        <img
            v-if="image"
            :src="image"
            :alt="concept"
            width="600em"
            loading="lazy" >
    </div>
</template>

<style scoped>
.annotations-map-popup {
}
</style>
