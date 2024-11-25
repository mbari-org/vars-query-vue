<script setup lang="ts">
import VideoPlayer from '@/components/shared/VideoPlayer.vue'
import { useVampireSquidStore } from '@/stores/vampire-squid'
import { computed } from 'vue'
import { computedAsync } from '@vueuse/core'

interface Props {
    sourceVideoUri: string | undefined
    recordedTimestamp: string | undefined
}

const props  = defineProps<Props>()
const vampireSquidStore = useVampireSquidStore()

const previewMedia = computedAsync(async () => {
    if (props.sourceVideoUri && props.recordedTimestamp) {
        return await vampireSquidStore.api
            .findPreviewMediaByUriAndTimestamp(props.sourceVideoUri, props.recordedTimestamp)
    }
    return null
})

const mediaType = computed(() => {
    if (previewMedia.value) {
        return previewMedia.value.media.container
    }
    return 'video/mp4'
})


</script>

<template>
    <video-player
        v-if="previewMedia"
        :video-url="previewMedia.media.uri"
        :media-type="mediaType || 'video/mp4'"
        :seek-time-seconds="previewMedia.seekTimeSeconds"></video-player>
</template>

<style scoped>

</style>
