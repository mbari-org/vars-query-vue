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

export const useActivitiesStore = defineStore('activities', () => {
    const activities = ref([] as Array<string>)

    function reset() {
        activities.value = []
    }

    function remove(index: number) {
        activities.value.splice(index, 1)
    }

    function add(activity: string) {
        activities.value.push(activity)
    }

    return { activities, add, remove, reset }
})

export const useGroupsStore = defineStore('groups', () => {
    const groups = ref([] as Array<string>)

    function reset() {
        groups.value = []
    }

    function remove(index: number) {
        groups.value.splice(index, 1)
    }

    function add(group: string) {
        groups.value.push(group)
    }

    return { groups, add, remove, reset }
})

export const useObserversStore = defineStore('observers', () => {
    const observers = ref([] as Array<string>)

    function reset() {
        observers.value = []
    }

    function remove(index: number) {
        observers.value.splice(index, 1)
    }

    function add(observer: string) {
        observers.value.push(observer)
    }

    return { observers, add, remove, reset }
})

export const useChiefScientistsStore = defineStore('chiefScientists', () => {
    const chiefScientists = ref([] as Array<string>)

    function reset() {
        chiefScientists.value = []
    }

    function remove(index: number) {
        chiefScientists.value.splice(index, 1)
    }

    function add(chiefScientist: string) {
        chiefScientists.value.push(chiefScientist)
    }

    return { chiefScientists, add, remove, reset }
})


