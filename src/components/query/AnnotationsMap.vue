<script setup lang="ts">
// If you need to reference 'L', such as in 'L.icon', then be sure to
// explicitly import 'leaflet' into your component
import { map, tileLayer, LayerGroup, circleMarker, layerGroup, canvas, Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import 'leaflet-providers'
import { computed, createApp, h, onMounted, ref, watch, getCurrentInstance, type App } from 'vue'
import { useQueryResultsStore } from '@/stores/query-results'
import {
    formatBoundsForLeaflet,
    geoQueryResultsViewBounds,
    type MapViewBounds
} from '@/assets/ts/annosaurus/QueryResults'
import AnnotationsMapPopup from '@/components/query/AnnotationsMapPopup.vue'


const instance = getCurrentInstance()
const app = instance?.appContext.app
const myMap = ref(null as LeafletMap | null)

const myLayerGroup: LayerGroup = layerGroup()
const defaultViewBounds: MapViewBounds = {
    minLon: -122.2,
    maxLon: -121.9,
    minLat: 36.6,
    maxLat: 36.8
}


const emit = defineEmits(['selected-annotation'])

onMounted(() => {
    const aMap = map("annotations-map").setView([36.8, -122.0], 13)

    const myTileLayer = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
        maxZoom: 13
    });
    myTileLayer.addTo(aMap)
    myLayerGroup.addTo(aMap)
    const renderer = canvas({padding: 0.5})
    renderer.addTo(aMap)
    myMap.value = aMap
    redraw()
})

const queryResultsStore = useQueryResultsStore()

const geoAnnotations = computed(() => queryResultsStore.geoAnnotations
    .filter(g => g.hasValidPosition()))

watch(geoAnnotations, redraw, { immediate: true })


function redraw() {
    myLayerGroup.clearLayers()
    console.log('redrawing')
    if (geoAnnotations.value && geoAnnotations.value.length > 0) {
        geoAnnotations.value.forEach(a => {
            if (a.hasValidPosition()) {
                const color = a.annotation.image ? "#3333FF" : "#FF3333"
                const marker = circleMarker([a.latitude, a.longitude], { radius: 5, color: color })
                marker.addTo(myLayerGroup)
                // https://forum.vuejs.org/t/how-can-i-get-rendered-html-code-of-vue-component/19421
                // build popup vue component


                const popup = createApp({
                    render: () => {
                        return h(AnnotationsMapPopup, { annotation: a })
                    }
                })
                Object.assign(popup._context, app?._context)
                const wrapper = document.createElement('div')
                wrapper.classList.add('annotations-map-popup-wrapper')
                popup.mount(wrapper)
                marker.bindPopup(wrapper)
                marker.on({
                    mouseover: () => marker.openPopup(),
                    mouseout: () => marker.closePopup(),
                    click: () => emit('selected-annotation', a.annotation)
                })
            }
        })
    }

    if (myMap.value) {
        const viewBounds = formatBoundsForLeaflet(geoQueryResultsViewBounds(geoAnnotations.value, defaultViewBounds), defaultViewBounds)
        console.log('fitting bounds', viewBounds)
        myMap.value.fitBounds(viewBounds)
    }

}



</script>

<template>
    <div class="map-box" id="annotations-map"></div>
</template>



<style scoped>
.map-box {
    height: 600px;
    width: 100%;
    z-index: 0;
}
.annotations-map-popup-wrapper {
    background-color: rgba(255, 255, 255, 0.6);
}
</style>
