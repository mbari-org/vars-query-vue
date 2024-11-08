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

const media = computedAsync(async () => {
    if (props.sourceVideoUri && props.recordedTimestamp) {
        return await vampireSquidStore.api
            .findMediaByUri(props.sourceVideoUri)
            .then((m) => vampireSquidStore.api.findSmallestConcurrentMp4(m.camera_id, props.recordedTimestamp || '' ))
    }
    return null
})

const seekTimeSeconds = computed( () => {
    if (media.value && props.recordedTimestamp) {
        const seek = new Date(props.recordedTimestamp)
        const start = new Date(media.value.start_timestamp)
        return (seek.getTime() - start.getTime()) / 1000
    }
    return 0
})

const mediaType = computed(() => {
    if (media.value) {
        return media.value.container
    }
    return 'video/mp4'
})

</script>

<template>
    <video-player
        v-if="media"
        :video-url="media.uri"
        :media-type="mediaType || 'video/mp4'"
        :seek-time-seconds="seekTimeSeconds"></video-player>
</template>

<style scoped>

</style>
