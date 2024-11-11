<script setup lang="ts">
import { useQueryResultsStore } from '@/stores/query-results'
import { computed, ref } from 'vue'

const queryResultsStore = useQueryResultsStore()
const allAnnotations = computed(() =>
    queryResultsStore.annotations.map(a => a.annotation),
)
const imageOnlyAnnotations = computed(() =>
    allAnnotations.value.filter(a => a.images && a.images.length > 0),
)

const hoveredImage = ref<string | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

function showImagePreview(image: string | undefined, event: MouseEvent) {
    if (image) {
        hoveredImage.value = image
        mouseX.value = event.clientX
        mouseY.value = event.clientY
    }
}


function hideImagePreview() {
    hoveredImage.value = null
}
</script>

<!-- https://blog.logrocket.com/responsive-image-gallery-css-flexbox/ -->
<template>
    <router-link to="/results-table-view">Back to results table</router-link>
    <div class="img-gallery">
        <div class="img-gallery__item" v-for="i in imageOnlyAnnotations" :key="i.row ?? 1">
            <img :src="i.image" :alt="i.image" class="img-gallery__img" @mouseenter="(event: MouseEvent) =>showImagePreview(i.image, event)" @mouseleave="hideImagePreview">
            <div class="img-gallery__overlay" v-if="hoveredImage && hoveredImage !== i.image"></div>
        </div>
    </div>

</template>

<style scoped>
:root {
    --body-leading: 1.6;
    --container-padding: 1.5em;
    --container-width: 1260px;
}

* {
    &,
    &::before,
    &::after {
        box-sizing: border-box;
    }
}

body {
    margin: 0;
    font: 1em/var(--body-leading) sans-serif;
}

img {
    max-width: 100%;
    vertical-align: middle;
    height: auto;
}

.page-container {
    padding: var(--container-padding);
    max-width: var(--container-width);
    margin-right: auto;
    margin-left: auto;
}

:root {
    --gallery-gap: 1.5em;
}

.img-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gallery-gap);
}

:root {
    --gallery-item-border-radius: .4em;
    --gallery-items-per-row: 4;
}

.img-gallery__item {
    img {
        aspect-ratio: 3 / 2;
        object-fit: cover;
        border-radius: var(--gallery-item-border-radius);
    }
    flex: 0 0
        calc(
            100% / var(--gallery-items-per-row) - var(--gallery-gap) *
            (var(--gallery-items-per-row) - 1) / var(--gallery-items-per-row)
        );
    figure { margin: 0 }

    figcaption {
        margin-top: .5rem;
        font-weight: bold;
    }
}

@media only screen and (width >= 1024px) {
    .img-gallery {
        --gallery-items-per-row: 4;
    }
}
@media only screen and (768px < width < 1024px) {
    .img-gallery {
        --gallery-items-per-row: 3;
    }
}
@media only screen and (540px < width < 768px) {
    .img-gallery {
        --gallery-items-per-row: 3;
    }
}
</style>
