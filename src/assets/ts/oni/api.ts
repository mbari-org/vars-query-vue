import type { Taxa, TaxaNode } from "@/assets/ts/oni/ConceptTree";
import type { Concept, Image } from "@/assets/ts/oni/Concept";
import { distinctConcepts } from "@/assets/ts/oni/Concept";


export class OniApi {

  url: string

  constructor(oniUrl: string) {
    this.url = oniUrl
  }

  // endpoints = {
  //   concepts: {
  //     find: this.url + "/concept/find/", // {glob}
  //     findByName: this.url + "/concept/", // {concept}
  //     findParent: this.url + "/concept/parent/", //{concept}
  //     listAll: this.url + "/concept",
  //     listChildren: this.url + "/concept/children/" // {concept}
  //   },
  //   dsg: {
  //     images: this.url + "/dsg/images/representative/" // {concept}
  //   },
  //   phylogeny: {
  //     listAncestors: this.url + "/phylogeny/basic/", // {concept}
  //     listDescendants: this.url + "/phylogeny/taxa/", // {concept}
  //     down: this.url + "/phylogeny/down/", // {concept}
  //     siblings: this.url + "/phylogeny/siblings/", // {concept}
  //     up: this.url + "/phylogeny/up/", // {concept}
  //   },
  // };


  findTree(name: string): Promise<TaxaNode> {
    return treeUp(name);
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

  treeDown(concept = rootName): Promise<TaxaNode> {
    return fetch(this.url + "/phylogeny/down/" + encodeURIComponent(concept),
      {
        mode: 'cors',
      })
      .then(r => r.json())
  }

  treeUp(concept = rootName): Promise<TaxaNode> {
    return fetch(this.url + "/phylogeny/up/" + encodeURIComponent(concept),
      {
        mode: 'cors'
      })
      .then(r => r.json())
  }



}
