import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useOniStore } from '@/stores/oni'
import type { Region } from '@/assets/ts/fathomnet/Region'
import type { ColumnConstraint } from '@/assets/ts/annosaurus/Query'


export interface SelectedConcept {
    concept: string
    extendTo: string
    conceptNames: Array<string>
}

export interface TimeBounds {
    startTimestamp: Date | null
    endTimestamp: Date | null
}

export function buildColumnConstraints(): Array<ColumnConstraint> {
    const constraints = [] as Array<ColumnConstraint>
    const selectedConcepts = useSelectedConceptsStore().buildColumnConstraints()
    // const associations = useAssociationsStore().buildColumnConstraints()
    const cameraPlatforms = useCameraPlatformStore().buildColumnConstraints()
    const videoSequenceNames = useVideoSequenceNameStore().buildColumnConstraints()
    const activities = useActivitiesStore().buildColumnConstraints()
    const groups = useGroupsStore().buildColumnConstraints()
    const observers = useObserversStore().buildColumnConstraints()
    const chiefScientists = useChiefScientistsStore().buildColumnConstraints()
    const region = useRegionStore().buildColumnConstraints()
    const time = useTimeStore().buildColumnConstraints()

    constraints.push(...selectedConcepts)
    // constraints.push(...associations)
    constraints.push(...cameraPlatforms)
    constraints.push(...videoSequenceNames)
    constraints.push(...activities)
    constraints.push(...groups)
    constraints.push(...observers)
    constraints.push(...chiefScientists)
    constraints.push(...region)
    constraints.push(...time)

    return constraints
}

export function resetStores() {
    useActivitiesStore().reset()
    useAssociationsStore().reset()
    useCameraPlatformStore().reset()
    useChiefScientistsStore().reset()
    useGroupsStore().reset()
    useObserversStore().reset()
    useRegionStore().reset()
    useSelectedConceptsStore().reset()
    useTimeStore().reset()
    useVideoSequenceNameStore().reset()
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

    function buildColumnConstraints(): Array<ColumnConstraint> {

        if (selectedConcepts.value.length !== 0) {
            const names = [] as Array<string>
            selectedConcepts.value.forEach((selectedConcept) => {
                names.push(...selectedConcept.conceptNames)
            })
            // return distinct names
            const distinctNames = Array.from(new Set(names))
            return [{
                column: 'concept',
                in: distinctNames
            }]
        }
        return []
    }

    return { selectedConcepts, add, remove, reset, buildColumnConstraints }
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

    function buildColumnConstraints(): Array<ColumnConstraint> {

        if (associations.value.length > 0) {

            if (exactMatch.value && useAnd.value) {
                return [{
                    column: 'associations',
                    in: associations.value
                }]
            }
            else {
                return associations.value.map((association) => {
                    return {
                        column: 'associations',
                        contains: association
                    }
                })
            }

        }
        return []
    }

    return { associations: associations, exactMatch, useAnd, add, remove, reset, buildColumnConstraints }
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

    /**
     * Build the column constraints for the query. This is used to filter the results based on the selected dive or
     * video platform names. Note that only one or the other can be selected at a time.
     */
    function buildColumnConstraints(): Array<ColumnConstraint> {
        if (videoSequenceNames.value.length > 0) {
            return [{
                column: 'video_sequence_name',
                in: videoSequenceNames.value
            }]
        }
        return []
    }

    return { videoSequenceNames, add, remove, reset, buildColumnConstraints }
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

    function buildColumnConstraints(): Array<ColumnConstraint> {
        if (cameraPlatforms.value.length > 0) {
            return [{
                column: 'camera_platform',
                in: cameraPlatforms.value
            }]
        }
        return []
    }

    return { cameraPlatforms, add, remove, reset, buildColumnConstraints }
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

    function buildColumnConstraints(): Array<ColumnConstraint> {
        if (activities.value.length > 0) {
            return [{
                column: 'activity',
                in: activities.value
            }]
        }
        return []
    }

    return { activities, add, remove, reset, buildColumnConstraints }
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

    function buildColumnConstraints(): Array<ColumnConstraint> {
        if (groups.value.length > 0) {
            return [{
                column: 'group',
                in: groups.value
            }]
        }
        return []
    }

    return { groups, add, remove, reset, buildColumnConstraints }
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

    function buildColumnConstraints(): Array<ColumnConstraint> {
        if (observers.value.length > 0) {
            return [{
                column: 'observer',
                in: observers.value
            }]
        }
        return []
    }

    return { observers, add, remove, reset, buildColumnConstraints }
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

    function buildColumnConstraints(): Array<ColumnConstraint> {
        if (chiefScientists.value.length > 0) {
            return [{
                column: 'chief_scientist',
                in: chiefScientists.value
            }]
        }
        return []
    }

    return { chiefScientists, add, remove, reset, buildColumnConstraints }
})

export const useRegionStore = defineStore('region', () => {
    const bounds = ref({ minLatitude: null, maxLatitude: null, minLongitude: null, maxLongitude: null, minDepth: null, maxDepth: null } as Region)

    function reset() {
        bounds.value = { minLatitude: null, maxLatitude: null, minLongitude: null, maxLongitude: null, minDepth: null, maxDepth: null }
    }

    function setBounds(region: Region) {
        // copy the region object to avoid reactivity issues
        bounds.value = { ...region }
    }

    function setMinDepth(minDepth: number) {
        bounds.value.minDepth = minDepth
    }

    function setMaxDepth(maxDepth: number) {
        bounds.value.maxDepth = maxDepth
    }

    function buildColumnConstraints(): Array<ColumnConstraint> {
        const constraints = [] as Array<ColumnConstraint>
        if (bounds.value.minLatitude !== null) {
            constraints.push({ column: 'latitude', min: bounds.value.minLatitude })
        }
        if (bounds.value.maxLatitude !== null) {
            constraints.push({ column: 'latitude', max: bounds.value.maxLatitude })
        }
        if (bounds.value.minLongitude !== null) {
            constraints.push({ column: 'longitude', min: bounds.value.minLongitude })
        }
        if (bounds.value.maxLongitude !== null) {
            constraints.push({ column: 'longitude', max: bounds.value.maxLongitude })
        }
        if (bounds.value.minDepth !== null) {
            constraints.push({ column: 'depth', min: bounds.value.minDepth })
        }
        if (bounds.value.maxDepth !== null) {
            constraints.push({ column: 'depth', max: bounds.value.maxDepth })
        }
        return constraints
    }


    return { bounds, setBounds, reset, setMinDepth, setMaxDepth, buildColumnConstraints }
})

export const useTimeStore = defineStore('time', () => {
    const bounds = ref({
        startTimestamp: null,
        endTimestamp:  null
    } as TimeBounds)

    function reset() {
        bounds.value = {
            startTimestamp: null,
            endTimestamp: null
        }
    }

    function setStartTimestamp(startTimestamp: Date) {
        bounds.value.startTimestamp = startTimestamp
    }

    function setEndTimestamp(endTimestamp: Date) {
        bounds.value.endTimestamp = endTimestamp
    }

    function buildColumnConstraints(): Array<ColumnConstraint> {

        let startTimestamp = bounds.value.startTimestamp
        let endTimestamp = bounds.value.endTimestamp
        if (startTimestamp === null && endTimestamp === null) {
            return []
        }
        if (startTimestamp === null) {
            startTimestamp = new Date("1900-01-01T00:00:00Z")
        }
        if (endTimestamp === null) {
            endTimestamp = new Date(Date.now())
        }
        return [{
            column: 'index_recorded_timestamp',
            between: [startTimestamp.toISOString(), endTimestamp.toISOString()]
        }]
    }

    return { bounds, setStartTimestamp, setEndTimestamp, reset, buildColumnConstraints }
})


