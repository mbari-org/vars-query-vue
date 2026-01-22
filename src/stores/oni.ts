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
import { useRazielStore } from '@/stores/raziel'
import { extractUrlFromConfig } from '@/assets/ts/raziel/api'
import { OniApi } from '@/assets/ts/oni/api'
import { computedAsync } from '@vueuse/core'
import _ from 'lodash'
import type { Descriptor } from '@/assets/ts/oni/Concept'

const ONI_CONCEPTS_KEY = 'oni-concept'

export const useOniStore = defineStore('oni', () => {
    const razielStore = useRazielStore()

    const url = computed(() => extractUrlFromConfig('oni', razielStore.config))
    const api = computed(() => new OniApi(url.value))

    const concepts = computedAsync(() => api.value.listAllConcepts())

    const links = computedAsync( () =>
        api.value
            .listLinks()
            .then((links) => links.filter((link) => !link.linkName.startsWith("dsg-")))
    )

    const linkNames = computed(() => _.uniq(links.value?.map((link) => link.linkName)).sort())


    return { url, api, concepts, links, linkNames }
})
