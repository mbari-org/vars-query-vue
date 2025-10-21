import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
        },
        {
            path: '/config',
            name: 'config',
            component: () => import('../views/query/ConfigurationVue.vue'),
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
