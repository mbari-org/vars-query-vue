import type { AnnosaurusApi } from '@/assets/ts/annosaurus/api'
import {
    buildColumnConstraints,
    buildSelect,
    useAssociationsStore, useDecoratorsStore,
} from '@/stores/query-params'
import type { Query } from '@/assets/ts/annosaurus/Query'
import router from '@/router'
import { useQueryResultsStore } from '@/stores/query-results'

export class QueryRunner {
    api: AnnosaurusApi

    constructor(api: AnnosaurusApi) {
        this.api = api
    }

    /**
     * TODO:
     */
    async runQuery(progressCallback: (progress: number) => void = () => {}) {
        const queries = this.buildQueries()
        console.log(queries)
        const queryResultsStore = useQueryResultsStore()
        queryResultsStore.reset()
        // query.forEach(q => {
        //     this.api.pageUsingQuery(q, 5000, progressCallback).then((response) => {
        //         // console.log(response)
        //         // console.log(tabDelimitedToObject(response))
        //         queryResultsStore.appendRawQueryResults(response)
        //         // useQueryResultsStore().updateQueryResults(tabDelimitedToObject(response))
        //     }).catch((error) => {
        //         console.error(error)
        //     })
        // })
        let i = 0
        for (const q of queries) {
            await this.api.pageUsingQuery(q, 5000, progressCallback).then((response) => {
                // only use the header row for the first query
                if (i === 0) {
                    queryResultsStore.appendRawQueryResults(response)
                }
                else {
                    queryResultsStore.appendRawQueryResults(response.slice(1))
                }
                i++
            }).catch((error) => {
                console.error(error)
            })
        }
    }

    buildQueries(): Array<Query> {

        const decoratorStore = useDecoratorsStore()
        const selectedColumns = buildSelect()
        console.log(selectedColumns)
        const wheres = buildColumnConstraints()
        const query = {
            select: selectedColumns,
            where: wheres,
            distinct: true,
            strict: false,
            concurrentObservations: decoratorStore.concurrentObservations,
            relatedAssociations: decoratorStore.relatedAssociations,
        }
        // console.log(query)
        const associationStore = useAssociationsStore()
        const associationConstraints = associationStore.buildColumnConstraints()
        if (associationConstraints.length > 0) {
            if (!associationStore.useAnd) {
                return associationConstraints.map(c => {
                    // const copy = structuredClone(query)
                    const copy = JSON.parse(JSON.stringify(query))
                    copy.where.push(c)
                    return copy
                })
            } else {
                query.where.push(...associationConstraints)
                return [query]
            }
        }
        return [query]

    }
}

export async function runQuery(api: AnnosaurusApi, queries: Array<Query>, progressCallback: (progress: number) => void = () => {}) {
    const queryResultsStore = useQueryResultsStore()
    queryResultsStore.reset()
    for (const q of queries) {
        await api.pageUsingQuery(q, 5000, progressCallback).then((response) => {
            queryResultsStore.appendRawQueryResults(response)
        }).catch((error) => {
            console.error(error)
        })
    }
}
