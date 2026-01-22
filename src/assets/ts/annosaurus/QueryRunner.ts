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
import type { AnnosaurusApi } from '@/assets/ts/annosaurus/api'
import {
    buildColumnConstraints,
    buildSelect,
    useAssociationsStore, useDecoratorsStore,
} from '@/stores/query-params'
import type { Query } from '@/assets/ts/annosaurus/Query'
import { useQueryResultsStore } from '@/stores/query-results'
import { QUERY_TIMEOUT_MILLISECONDS } from '@/assets/ts/constants'

export class QueryRunner {
    api: AnnosaurusApi

    constructor(api: AnnosaurusApi) {
        this.api = api
    }

    /**
     * TODO:
     */
    async runQuery(progressCallback: (progress: number) => void = () => {},
                   notifyOnAbortCallback: () => void = () => {},
                   notifyOnTimeoutCallback: () => void = () => {}) {
        const queries = this.buildQueries()
        // If the all the queries where fields are empty then don't run the query
        if (queries.length === 0 || queries.every(q => (q.where === undefined || q.where.length === 0))) {
            notifyOnAbortCallback()
            return false
        }
        // console.log(queries)
        const queryResultsStore = useQueryResultsStore()
        queryResultsStore.reset()
        let i = 0
        for (const q of queries) {
            // IMPORTANT: there is a timeout of 15000 milliseconds for the query
            await this.api.pageUsingQueryWithTimeout(q,
                500000,
                progressCallback,
                notifyOnTimeoutCallback,
                QUERY_TIMEOUT_MILLISECONDS).then((response) => {
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
        return true
    }

    buildQueries(): Array<Query> {

        const decoratorStore = useDecoratorsStore()
        const selectedColumns = buildSelect()
        // console.log(selectedColumns)
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
        await api.pageUsingQuery(q, 500000, progressCallback).then((response) => {
            queryResultsStore.appendRawQueryResults(response)
        }).catch((error) => {
            console.error(error)
        })
    }
}
