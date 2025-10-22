<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    type FauxAnnotation,
    fauxAssociationToString,
    fauxAssociationToStringTrimmed,
} from '@/assets/ts/annosaurus/QueryResults'
import ImageThumbnail from '@/components/results/ImageThumbnail.vue'
import type { PreviewMedia } from '@/assets/ts/vampiresquid/PreviewMedia'
import { useVampireSquidStore } from '@/stores/vampire-squid'

const props = defineProps<{
    annotation: FauxAnnotation
}>()

const vampireSquidStore = useVampireSquidStore()

function openVideo(a: FauxAnnotation) {
    if (a.video_uri && a.index_recorded_timestamp) {

        vampireSquidStore.api
            .findPreviewMediaByUriAndTimestamp(a.video_uri, a.index_recorded_timestamp)
            .then((pm: PreviewMedia) => {
                if (pm.media && pm.media.uri) {
                    const start = pm.seekTimeSeconds ?? 0
                    const seekUri = `${pm.media.uri}#t=${start}`
                    window.open(seekUri, '_blank')?.focus()
                }
            })
    }
}
</script>

<template>
    <tr class="annotation-row">
        <td class="nowrap">{{ annotation.row }}</td>

        <!-- Thumbnail -->
        <td class="thumbnail" style="text-align: right">
            <image-thumbnail v-if="annotation.image" :annotation="annotation" />
            <v-icon
                v-else
                size="small"
                class="video-icon"
                @click="() => openVideo(props.annotation)">mdi-video</v-icon>
        </td>

        <!-- Concept / Activity -->
        <td class="nowrap">{{ annotation.concept }}</td>
        <td class="nowrap">{{ annotation.video_sequence_name }}</td>
        <td class="nowrap">{{ annotation.index_recorded_timestamp }}</td>
        <td class="nowrap">{{ annotation.observer }}</td>

        <!-- Coordinates (example) -->
        <!--        <td class="nowrap">{{ annotation.latitude?.toFixed(4) }}</td>-->
        <!--        <td class="nowrap">{{ annotation.longitude?.toFixed(4) }}</td>-->
        <td class="nowrap">{{ annotation.depth_meters }}</td>

        <td class="nowrap">
            <div class="details-column">
                <v-chip v-for="(detail, idx) in annotation?.details" :key="idx">
                    {{ fauxAssociationToStringTrimmed(detail, 40) }}
                    <v-tooltip activator="parent" location="bottom"
                        >{{ fauxAssociationToString(detail) }}
                    </v-tooltip>
                </v-chip>
            </div>
        </td>

        <!-- Video info -->
        <!--        <td class="nowrap">{{ annotation.video_name }}</td>-->
        <!--        <td class="nowrap">{{ annotation.video_start_timestamp }}</td>-->

        <!--        &lt;!&ndash; Observer &ndash;&gt;-->
        <!--        <td class="nowrap">{{ annotation.observer }}</td>-->
    </tr>
</template>

<style scoped>
.annotation-row {
    white-space: nowrap;
}

.nowrap {
    white-space: nowrap;
    padding: 0.25rem 0.5rem;
    text-overflow: ellipsis;
    overflow: hidden;
}

.details-column {
    display: flex;
    flex-direction: column;
    gap: 4px; /* optional: space between chips */
    align-items: flex-start; /* keeps chips aligned to the left */
}
</style>
