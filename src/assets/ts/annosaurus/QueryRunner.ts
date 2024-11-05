import type { AnnosaurusApi } from '@/assets/ts/annosaurus/api'
import {
    buildColumnConstraints,
    buildSelect,
    useAssociationsStore,
    useSelectedColumnsStore
} from '@/stores/query-params'
import type { Query } from '@/assets/ts/annosaurus/Query'
import { tabDelimitedToObject } from '@/assets/ts/util'
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
    runQuery() {
        const query = this.buildQueries()
        console.log(query)
        query.forEach(q => {
            this.api.pageUsingQuery(q, 5000).then((response) => {
                // console.log(response)
                // console.log(tabDelimitedToObject(response))
                useQueryResultsStore().updateQueryResults(tabDelimitedToObject(response))
                router.push({name: 'results-table-view'})
            })
        })
    }

    buildQueries(): Array<Query> {


        const selectedColumns = buildSelect()
        console.log(selectedColumns)
        const wheres = buildColumnConstraints()
        const query = {
            select: selectedColumns,
            where: wheres,
            distinct: true,
            strict: false
        }
        // console.log(query)
        const associationStore = useAssociationsStore()
        const associationConstraints = associationStore.buildColumnConstraints()
        if (associationConstraints.length > 0) {
            if (!associationStore.useAnd) {
                return associationConstraints.map(c => {
                    const copy = structuredClone(query)
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
