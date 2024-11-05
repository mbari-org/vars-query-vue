import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRazielStore } from '@/stores/raziel'
import { extractUrlFromConfig } from '@/assets/ts/raziel/api'
import { computedAsync } from '@vueuse/core'
import { AnnosaurusApi } from '@/assets/ts/annosaurus/api'
import type { Query } from '@/assets/ts/annosaurus/Query'


export const useAnnosaurusStore = defineStore('annosaurus', () => {
    const razielStore = useRazielStore()
    const url = computed(() => extractUrlFromConfig('annosaurus', razielStore.config))
    const api = computed(() => new AnnosaurusApi(url.value))
    const activities = computedAsync(async () => {
        return api.value.listActivities()
    })

    const groups = computedAsync(async () => {
        return api.value.listGroups()
    })

    const observers = computedAsync(async () => {
        return api.value.listObservers()
    })

    const chiefScientists = computedAsync(async () => {
        return api.value.listChiefScientists()
    })

    const selectableColumns = computedAsync(async () => {
        return (await api.value.lisQueryColumns()).map((column) => column.columnName)
    })

    return {url, api, activities, groups, observers, chiefScientists, selectableColumns}

})
