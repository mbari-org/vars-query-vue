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
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useQueryResultsStore } from '@/stores/query-results'
import { MAX_NUMBER_OF_ANNOTATIONS } from '@/assets/ts/constants'

// const queryResultsStore = useQueryResultsStore()

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/config',
            name: 'config',
            component: () => import('../views/query/ConfigurationVue.vue'),
        },
        {
            path: '/deployment-videos',
            name: 'deployment-videos',
            component: () => import('../views/deployment/DeploymentVideosView.vue')
        },
        {
            path: '/query',
            name: 'query',
            component: () => import('../views/query/QueryView.vue'),
        },
        {
            path: '/results-table-view',
            name: 'results-table-view',
            component: () => import('../views/query/ResultsTableView.vue'),
        },
        {
            path: '/results-image-grid-view',
            name: 'results-image-grid-view',
            component: () => import('../views/query/ResultsImageGridView.vue'),
        },
        {
            path: '/results-summary-view',
            name: 'results-summary-view',
            component: () => import('../views/query/ResultsSummaryView.vue'),
        },
        {
            path: '/large-results-view',
            name: 'large-results-view',
            component: () => import('../views/query/LargeResultsView.vue'),
        },
        // {
        //     path: '/smart-results-view',
        //     name: 'smart-results-view',
        //     component: () => {
        //         if (queryResultsStore.queryResults?.length > MAX_NUMBER_OF_ANNOTATIONS) {
        //             return import('../views/query/LargeResultsView.vue')
        //         }
        //         return  import('../views/query/ResultsTableView.vue')
        //     }
        // },
        {
            path: '/deployment/:name',
            name: 'deployment',
            component: () => import('../views/query/DeploymentLookup.vue')
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/query',
        },
    ],
})

export default router
