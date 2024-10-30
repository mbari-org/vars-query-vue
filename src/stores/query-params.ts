import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useOniStore } from '@/stores/oni'


export interface SelectedConcept {
    concept: string
    extendTo: string
    conceptNames: Array<string>
}

export const useSelectedConceptsStore = defineStore('selectedConcepts', () => {
    const selectedConcepts = ref([] as Array<SelectedConcept>)
    const oniStore = useOniStore()

    function add(concept: string, extendTo: string) {
        const selectedConcept = {
            concept: concept,
            extendTo: extendTo,
            conceptNames: [] as Array<string>
        }
        oniStore.api.accumulateNames(concept, extendTo).then((conceptNames) => {
            selectedConcept.conceptNames = conceptNames
            selectedConcepts.value.push(selectedConcept)
        })
    }

    function reset() {
        selectedConcepts.value = []
    }

    function remove(index: number) {
        selectedConcepts.value.splice(index, 1)
    }

    return { selectedConcepts, add, remove, reset }
})

export const useAssociationsStore = defineStore('association', () => {
    const associations = ref([] as Array<string>)
    const exactMatch = ref(false)
    const useAnd = ref(false) // alse is 'or'

    function add(association: string) {
        associations.value.push(association)
    }

    function reset() {
        associations.value = []
    }

    function remove(index: number) {
        associations.value.splice(index, 1)
    }

    return { associations: associations, exactMatch, useAnd, add, remove, reset }
})

/**
 * Store for the selected video sequence names to be used in the query. If a video sequence name is added, the camera
 * platform store is reset.
 */
export const useVideoSequenceNameStore = defineStore('videoSequenceName', () => {
    const videoSequenceNames = ref([] as Array<string>)
    const cameraPlatforms = useCameraPlatformStore()

    function reset() {
        videoSequenceNames.value = []
    }

    function remove(index: number) {
        videoSequenceNames.value.splice(index, 1)
    }

    function add(videoSequenceName: string) {
        cameraPlatforms.reset()
        videoSequenceNames.value.push(videoSequenceName)
    }

    return { videoSequenceNames, add, remove, reset }
})

/**
 * Store for the selected camera platforms to be used in the query. If a camera platform is added, the video sequence
 * name store is reset.
 */
export const useCameraPlatformStore = defineStore('cameraPlatform', () => {
    const cameraPlatforms = ref([] as Array<string>)
    const videoSequenceNames = useVideoSequenceNameStore()

    function reset() {
        cameraPlatforms.value = []
    }

    function remove(index: number) {
        cameraPlatforms.value.splice(index, 1)
    }

    function add(cameraPlatform: string) {
        videoSequenceNames.reset()
        cameraPlatforms.value.push(cameraPlatform)
    }

    return { cameraPlatforms, add, remove, reset }
})
