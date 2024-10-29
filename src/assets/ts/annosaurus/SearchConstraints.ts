import { newEmptyQueryConstraint, QueryConstraints } from "@/assets/ts/annosaurus/QueryConstraints";
import  * as kbApi  from "@/assets/ts/oni/api";
import { listDescendants } from "@/assets/ts/oni/api";

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
  if (searchConstraint.conceptConstraints !== undefined && searchConstraint.conceptConstraints.length > 0) {
    const promises = searchConstraint.conceptConstraints.map(cc => {
      if (cc.concept) {
        const constraintPromises = [Promise.resolve([cc.concept])];
        if (cc.extendToDescendant) {
          /*
            [
              {
                "name": "Nanomia",
                "rank": "genus"
              },
              ...
            ]
           */
          constraintPromises.push(listDescendants(cc.concept)
            .then(taxa => taxa.map(t => t.name)))
        }
        if (cc.extendToParent) {
          /*
            {
              "name": "Agalmatidae",
              "alternateNames": [
                "Agalmidae"
              ],
              ...
            }
          */
          constraintPromises.push(kbApi.findParentByConceptName(cc.concept)
            .then(taxaNode => {
              const names = [taxaNode.name];
              if (taxaNode.alternateNames && taxaNode.alternateNames.length > 0) {
                names.push(taxaNode.alternateNames);
              }
              return names;
            }))
        }
        if (cc.extendToSiblings) {
          constraintPromises.push(kbApi.findSiblings(cc.concept)
            .then(taxaNodes => {
              const names: string[] = [];
              taxaNodes.forEach(taxaNode => {
                names.push(taxaNode.name)
                if (taxaNode.alternateNames && taxaNode.alternateNames.length > 0) {
                  names.push(taxaNode.alternateNames);
                }
              })
              return names
            }))
        }
        return Promise.all(constraintPromises)
          .then(xs => [cc.concept].concat(xs).flat()) // Concat/Flatten arrays
          .then(xs => [...new Set(xs)]) // get unique values
      }
      else {
        return Promise.resolve([]);
      }
    })
    return Promise.all(promises)
      .then(xs => [].concat(xs).flat()) // Concat/Flatten arrays
      .then(xs => [...new Set(xs)]) // get unique values
  }
  else {
    return Promise.resolve([]);
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
