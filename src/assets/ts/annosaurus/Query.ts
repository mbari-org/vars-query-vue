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
export interface Query {
    select?: string[]
    distinct?: boolean
    where?: Array<ColumnConstraint>
    orderby?: string[]
    limit?: number
    offset?: number
    concurrentObservations?: boolean
    relatedAssociations?: boolean
    strict?: boolean
}

export interface ColumnConstraint {
    column: string
    between?: string[]
    contains?: string
    equals?: string
    in?: string[]
    isnull?: boolean
    like?: string
    max?: number
    min?: number
    minmax?: number[]
}

function queryBuilder1(
    selects: string[],
    concepts: string[],
    associationContains: string,
): Query {
    const wheres = [] as Array<ColumnConstraint>
    if (concepts.length > 0) {
        wheres.push({ column: 'concept', in: concepts })
    }
    if (associationContains) {
        wheres.push({ column: 'associations', contains: associationContains })
    }
    return {
        select: selects,
        where: wheres,
        distinct: true,
    }
}

export function queryBuilder(
    selects: string[],
    concepts: string[],
    associationContains: string[],
): Array<Query> {
    const queries = [] as Query[]
    const names = Array.from(new Set(concepts))

    for (const ass of associationContains) {
        queryBuilder1(selects, names, ass)
    }
    return queries
}
