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
import { defineStore } from 'pinia'
import { computed, type Ref, ref, watch } from 'vue'
import { RazielApi } from '@/assets/ts/raziel/api'
import { computedAsync } from '@vueuse/core'

const KEY = 'vars-query-raziel-url'

export const useRazielStore = defineStore('raziel', () => {
    const initialUrl: string = localStorage.getItem(KEY) || ''
    const url = ref(initialUrl)
    const api = computed(() => new RazielApi(url.value))
    const config = computedAsync(() => api.value.getEndpoints())
    const isLoading = ref(true)

    function $updateUrl(newUrl: string) {
        localStorage.setItem(KEY, newUrl)
        isLoading.value = true
        url.value = newUrl
    }

    watch(config, () => {
        if (config.value) {
            isLoading.value = false
        }
    })

    if (initialUrl) $updateUrl(initialUrl)
    return { url, api, config, isLoading, $updateUrl }
})
