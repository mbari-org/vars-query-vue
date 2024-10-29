import * as _ from "lodash";

export interface Concept {
  alternateNames?: string[];
  author?: string;
  descriptors: Descriptor[];
  media: Media[];
  name: string;
  rank: string;
}

export interface Media {
  caption?: string;
  credit?: string;
  isPrimary: boolean;
  mimeType: string;
  url: string;
}

export interface Descriptor {
  linkName: string;
  linkValue: string;
  toConcept: string;
  displayedName?: string;
}

export interface Image extends Media {
  name: string;
}

type DescriptorFilter = (d: Descriptor) => boolean;

/** ****************************************************************************
 * When provided with a list of concept objects from the VARS oni, sorts them
 * by name and removes any objects that have duplicate names.
 * @param concepts
 * @returns {unknown[]|*}
 */
export function distinctConcepts(concepts: Concept[]): Concept[] {
  if (concepts) {
    const sortedByName = _.sortBy(concepts, (c: Concept) => c.name);
    return _.sortedUniqBy(sortedByName, (c: Concept) => c.name);
  }
  return concepts;
}

/** ****************************************************************************
 * Does what it says ... sorts concept objects by name
 * @param concepts The KB concept object
 * @returns {unknown[]|*} The concepts sorted by name as an array
 */
export function sortConceptsByName(concepts: Concept[]): Concept[] {
  if (concepts) {
    return _.sortBy(concepts, (c: Concept) => c.name);
  }
  return concepts;
}

/****************************************************************************
--- Concept Extension stuff
*/
const geoDescriptorKeys = ["dsg-depth-distribution", "dsg-range"];
const descriptionKeys = [
  "dsg-size",
  "dsg-color",
  "dsg-shape",
  "dsg-description",
];
const referenceKeys = ["dsg-reference"];
const consultantKeys = ["dsg-consulting-taxonomist"];

/** ****************************************************************************
 *
 * @param descriptors
 * @returns {*[]|*}
 */
export function conceptDescriptorsToNameValue(
  descriptors: Descriptor[]
): Descriptor[] {
  if (descriptors) {
    return descriptors.map((d) => {
      let name = d.linkName;
      if (d.linkName.startsWith("dsg-")) {
        name = d.linkName.substring(4);
      }
      const parts = name.split("-");
      return {
        displayedName: parts.join(" "),
        linkValue: d.linkValue,
        linkName: d.linkName,
        toConcept: d.toConcept,
      };
    });
  }
  return [];
}

/** ****************************************************************************
 *
 * @param concept
 * @param aFilter
 * @returns {*|[]|*[]}
 */
function extractDescriptors(concept: Concept, aFilter: DescriptorFilter) {
  if (concept && concept.descriptors) {
    let dsgDescriptions = concept.descriptors.filter((d) => aFilter(d));
    dsgDescriptions = _.sortBy(dsgDescriptions, (d: Descriptor) => d.linkName);
    return conceptDescriptorsToNameValue(dsgDescriptions);
  }
  return [];
}

/** ****************************************************************************
 *
 * @param descriptors
 * @param remap
 */
function renameDescriptors(
  descriptors: Descriptor[],
  remap: Map<string, string>
) {
  descriptors.forEach((d) => {
    if (remap.has(d.linkName)) {
      d.displayedName = remap.get(d.linkName);
    }
  });
}

/**
 * Wrapper that adds methods to a KB Concept object
 */
export class ConceptExt {
  concept: Concept;

  constructor(concept: Concept) {
    this.concept = concept;
  }

  author(): string {
    const c = this.concept
    if (c?.author) {
      const a = c.author
      if (a?.startsWith("(")) {
        return a
      }
      else {
        return `(${a})`
      }
    }
    return ""
  }


  primaryMedia(defaultMediaUrl: string): string {
    const c = this.concept;
    let picture = defaultMediaUrl;
    if (c && c.media && c.media.length > 0) {
      const media = c.media.filter((m) => m.isPrimary);
      if (media.length > 0) {
        picture = media[0].url;
      }
    }
    return picture;
  }

  hasImages(): boolean {
    return this.concept && this.concept.media && this.concept.media.length > 0;
  }

  images(defaultMediaUrl = ""): Media[] {
    if (this.hasImages()) {
      return this.concept.media.filter((m) => m.mimeType.startsWith("image"));
    } else if (defaultMediaUrl) {
      return [
        {
          url: defaultMediaUrl,
          caption: "",
          credit: "",
          isPrimary: true,
          mimeType: "",
        },
      ];
    }
    return [];
  }

  get consultingTaxonomists(): Descriptor[] {
    const refs = extractDescriptors(this.concept, (d) =>
      consultantKeys.includes(d.linkName)
    );
    return _.sortBy(refs, (d: Descriptor) => d.linkValue);
  }

  get references(): Descriptor[] {
    const refs = extractDescriptors(this.concept, (d) =>
      referenceKeys.includes(d.linkName)
    );
    return _.sortBy(refs, (d: Descriptor) => d.linkValue);
  }

  get descriptions(): Descriptor[] {
    return extractDescriptors(this.concept, (d) =>
      descriptionKeys.includes(d.linkName)
    );
  }

  get geographicInfo(): Descriptor[] {
    const remap = new Map([
      ["dsg-range", "Ocean range (global)"],
      ["dsg-depth-distribution", "Published depth range"],
    ]);
    const xs = extractDescriptors(this.concept, (d) =>
      geoDescriptorKeys.includes(d.linkName)
    );
    renameDescriptors(xs, remap);
    return xs;
  }

  get otherDescriptions(): Descriptor[] {
    return extractDescriptors(
      this.concept,
      (d) =>
        !descriptionKeys.includes(d.linkName) &&
        !referenceKeys.includes(d.linkName) &&
        !geoDescriptorKeys.includes(d.linkName) &&
        !consultantKeys.includes(d.linkName)
    );
  }
}
