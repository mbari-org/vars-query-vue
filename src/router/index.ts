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
