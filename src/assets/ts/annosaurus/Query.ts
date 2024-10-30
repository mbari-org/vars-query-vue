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
