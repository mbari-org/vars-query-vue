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
import { VampireSquidApi } from '@/assets/ts/vampiresquid/api'
import { computedAsync } from '@vueuse/core'

export const useVampireSquidStore = defineStore('vampire-squid', () => {

    const razielStore = useRazielStore()
    const url = computed(() => extractUrlFromConfig('vampire-squid', razielStore.config))
    const api = computed(() => new VampireSquidApi(url.value))
    const videoSequenceNames = computedAsync(async () => {
        return api.value.listVideoSequenceNames()
    })

    const cameraPlatforms = computedAsync(async () => {
        return api.value.listCameraPlatforms()
    })

    return {url, api, videoSequenceNames, cameraPlatforms}
})
