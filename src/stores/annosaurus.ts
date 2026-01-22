/**
 * Copyright 2017 Monterey Bay Aquarium Research Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
        const columns = (await api.value.listQueryColumns()).map((column) => column.columnName)
        return columns.sort()
    })


    return {url, api, activities, groups, observers, chiefScientists, selectableColumns}

})
