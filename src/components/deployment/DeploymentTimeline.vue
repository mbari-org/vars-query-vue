<script setup lang="ts">

import type { Media } from '@/assets/ts/vampiresquid/Media'
import type { VideoSequence } from '@/assets/ts/vampiresquid/VideoSequence'
import { computed } from 'vue'

interface Props {
    videoSequence: VideoSequence | null
}

const props = defineProps<Props>()

const videos = computed(() => {
    const xs =  props?.videoSequence?.videos || []
    return xs?.sort((a, b) => a.start_timestamp.localeCompare(b.start_timestamp))
})



</script>

<template>
    <v-timeline align="start">
        <v-timeline-item
            v-for="(video, i) in videos"
            :key="i"
        >
            <v-card>
                <v-card-title>{{video.start_timestamp}}</v-card-title>
                <v-card-text>
                    <v-btn
                        v-for="(videoReference, j) in video.video_references"
                        :key="j"
                    >
                        {{videoReference.container}} {{videoReference.width}} x {{videoReference.height}}
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-timeline-item>
    </v-timeline>
</template>

<style scoped></style>
