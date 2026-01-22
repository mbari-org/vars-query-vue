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
import { accumulateNamesFromTaxaNodes, type Taxa, type TaxaNode } from '@/assets/ts/oni/ConceptTree'
import {
    accumulateNamesFromConcepts,
    type Concept,
    ConceptExt,
    type Descriptor,
    type Image
} from '@/assets/ts/oni/Concept'
import { distinctConcepts } from "@/assets/ts/oni/Concept";


export class OniApi {

  url: string

  constructor(oniUrl: string) {
    this.url = oniUrl
  }


  findTree(name: string): Promise<TaxaNode> {
    return this.treeUp(name);
  }

  findAllContaining(glob: string): Promise<Concept[]> {
    return fetch(this.url + "/concept/find/" + encodeURIComponent(glob),
      {
        mode: 'cors'
      })
      .then((r) => r.json())
      .then((concepts) => distinctConcepts(concepts));
  }

  findByConceptName(conceptName: string): Promise<Concept> {
    return fetch(this.url + "/concept/" + encodeURIComponent(conceptName),
      {
        mode: 'cors'
      })
      .then(r => r.json())
  }

  findParentByConceptName(conceptName: string): Promise<Concept> {
    return fetch(this.url + "/concept/parent/" + encodeURIComponent(conceptName),
      {
        mode: 'cors'
      })
      .then(r => r.json())
  }

  findRepresentativeImagesByName(
    conceptName: string,
    count = 12
  ): Promise<Image[]> {
    return fetch(this.url + "/dsg/images/representative/" + encodeURIComponent(conceptName) + "?limit=" + count, {
      mode: 'cors'
    })
      .then(r => r.json())
  }

  findSiblings(conceptName: string): Promise<Concept[]> {
    return fetch(this.url + "/phylogeny/siblings/" + encodeURIComponent(conceptName),
      {
        mode: "cors",
      })
      .then(r => r.json())
  }

  listAllConcepts(): Promise<string[]> {
    return fetch(this.url + "/concept",
      {
        mode: 'cors',
      })
      .then(r => r.json())
  }

  listAncestors(concept: string): Promise<Taxa[]> {
    return fetch(this.url + "/phylogeny/basic/" + encodeURIComponent(concept),
      {
        mode: 'cors',
      })
      .then(r => r.json())
  }

  listChildren(concept: string): Promise<Concept[]> {
    return fetch(this.url + "/concept/children/" + encodeURIComponent(concept),
      {
        mode: 'cors',
      })
      .then(r => r.json())
  }

  listDescendants(concept: string): Promise<Taxa[]> {
    return fetch(this.url + "/phylogeny/taxa/" + encodeURIComponent(concept),
      {
        mode: 'cors',
      })
      .then(r => r.json())
  }

  treeDown(concept: string): Promise<TaxaNode> {
    return fetch(this.url + "/phylogeny/down/" + encodeURIComponent(concept),
      {
        mode: 'cors',
      })
      .then(r => r.json())
  }

  treeUp(concept: string): Promise<TaxaNode> {
    return fetch(this.url + "/phylogeny/up/" + encodeURIComponent(concept),
      {
        mode: 'cors'
      })
      .then(r => r.json())
  }

  accumulateNames(concept: string, extendTo: string = ""): Promise<Array<string>> {
    switch (extendTo) {
      case "parent":
        return this.findByConceptName(concept).then((thisConcept) => {
          return this.findParentByConceptName(concept).then((parent) => accumulateNamesFromConcepts([thisConcept, parent]))
        })
        // return this.findParentByConceptName(concept).then((parent) => new ConceptExt(parent).names())
      case "children":
        return this.findByConceptName(concept).then((thisConcept) => {
          return this.listChildren(concept).then((children) => {
            children.push(thisConcept)
            return accumulateNamesFromConcepts(children)
          })
        })
      case "siblings":
        // TODO This is broken. Oni is returning nodes with blank names
        return this.findByConceptName(concept).then((thisConcept) => {
          return this.findSiblings(concept).then((siblings) => {
            siblings.push(thisConcept)
            return accumulateNamesFromConcepts(siblings)
          })
        })
      case "descendants":
        return this.listDescendants(concept).then((descendants) =>  accumulateNamesFromTaxaNodes(descendants))
      default:
        return this.findByConceptName(concept).then((concept) => new ConceptExt(concept).names())
    }
  }


  listLinks(): Promise<Descriptor[]> {
    return fetch(this.url + "/links",
      {
        mode: 'cors',
      })
      .then(r => r.json())
  }


}
