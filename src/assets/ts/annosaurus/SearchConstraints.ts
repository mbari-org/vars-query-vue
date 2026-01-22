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
