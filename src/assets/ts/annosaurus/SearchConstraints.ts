import { newEmptyQueryConstraint, type QueryConstraints } from "@/assets/ts/annosaurus/QueryConstraints";
import  * as kbApi  from "@/assets/ts/oni/api";
import { useOniStore } from '@/stores/oni'

export interface ConceptConstraints {
  concept?: string;
  extendToDescendant: boolean;
  extendToParent: boolean;
  extendToSiblings: boolean;
}

export interface SearchConstraints {
  conceptConstraints: ConceptConstraints[];
  queryConstraints: QueryConstraints;
}
export function newEmptySearchConstraints(): SearchConstraints {
  return {
    conceptConstraints: [
      {
        extendToDescendant: false,
        extendToParent: false,
        extendToSiblings: false,
      },
    ],
    queryConstraints: newEmptyQueryConstraint(),
  };
}

/**
 * Convert a searchConstraint to all applicable concepts as an array
 * @return a promise with a list of all the distinct concept names in the
 *         searchConstraints
 */
function searchConstraintToConceptNames(searchConstraint: SearchConstraints): Promise<string[]> {
    const api = useOniStore().api;
    if (api && searchConstraint.conceptConstraints !== undefined && searchConstraint.conceptConstraints.length > 0) {

        const constraintPromises: Array<Promise<string[]>> = []
        for (const cc of searchConstraint.conceptConstraints) {
            if (cc.concept) {
                constraintPromises.push(api.accumulateNames(cc.concept));
                if (cc.extendToParent) {
                    constraintPromises.push(api.accumulateNames(cc.concept, "parent"));
                }
                if (cc.extendToDescendant) {
                    constraintPromises.push(api.accumulateNames(cc.concept, "descendant"));
                }
                if (cc.extendToSiblings) {
                    constraintPromises.push(api.accumulateNames(cc.concept, "siblings"));
                }
            }
        }
        return Promise.all(constraintPromises)
            .then(xs => xs.flat()) // Concat/Flatten arrays
            .then(xs => [...new Set(xs)]) // get unique values

    }
    else {
        return Promise.resolve([])
    }
}

export function searchConstraintToQueryConstraint(searchConstraint: SearchConstraints): Promise<QueryConstraints> {
  return searchConstraintToConceptNames(searchConstraint)
    .then((concepts: string[]) => {
      searchConstraint.queryConstraints.concepts = concepts;
      return searchConstraint;
    })
    .then((sc) => sc.queryConstraints);
}
