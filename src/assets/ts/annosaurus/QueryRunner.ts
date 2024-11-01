import type { AnnosaurusApi } from '@/assets/ts/annosaurus/api'
import { buildColumnConstraints, useAssociationsStore } from '@/stores/query-params'
import type { Query } from '@/assets/ts/annosaurus/Query'

export class QueryRunner {
    api: AnnosaurusApi

    constructor(api: AnnosaurusApi) {
        this.api = api
    }

    runQuery() {
        const query = this.buildQueries()
        console.log(query)
        query.forEach(q => {
            this.api.pageUsingQuery(q, 5000).then((response) => {
                console.log(response)
            })
        })
    }

    buildQueries(): Array<Query> {

        const wheres = buildColumnConstraints()
        const query = {
            select: ['observation_uuid', 'concept', 'associations'],
            where: wheres,
            distinct: true,
        }
        // console.log(query)
        const associationStore = useAssociationsStore()
        const associationConstraints = associationStore.buildColumnConstraints()
        if (associationConstraints.length > 0) {
            if (!associationStore.useAnd.value) {
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
