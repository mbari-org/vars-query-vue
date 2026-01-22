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
import type { QueryConstraints } from "./QueryConstraints";

export interface QueryResponse<Type> {
  content: Type;
  query_constraints: QueryConstraints;
}

export interface QueryResponseAnno extends QueryResponse<Annotation[]> {
  content: Annotation[];
}

export interface QueryResponseCount extends QueryResponse<Count> {
  content: Count;
}

export interface QueryResponseGeoRange extends QueryResponse<GeoRange> {
  content: GeoRange;
}

export interface Count {
  count: number;
}

export interface GeoRange {
  max_depth_meters: number;
  max_latitude: number;
  max_longitude: number;
  min_depth_meters: number;
  min_latitude: number;
  min_longitude: number;
}

export interface Histogram<Type> {
  bins_min: Type[];
  bins_max: Type[];
  values: number[]
}

export interface DepthHistogram extends Histogram<number> {
  bins_min: number[];
  bins_max: number[];
}

export interface StringHistogram extends Histogram<string> {
  bins_min: string[];
  bins_max: string[];
}

export interface TimeHistogram extends Histogram<Date>{
  bins_min: Date[];
  bins_max: Date[];
}


export interface Association {
  uuid: string;
  link_name: string;
  link_value: string;
  mime_type: string;
  to_concept: string;
}

export interface ImageReference {
  uuid: string;
  description?: string;
  format?: string;
  height_pixels?: number;
  url: string;
  width_pixels?: number;
}

export interface Annotation {
  uuid: string;
  concept: string;
  observer?: string;
  observation_timestamp?: string;
  video_reference_uuid: string;
  imaged_moment_uuid: string;
  recorded_timestamp?: string;
  timecode?: string;
  elapsed_time_millis?: number;
  group?: string;
  activity?: string;
  ancillary_data?: AncillaryData;
  associations?: Association[];
  image_references?: ImageReference[];
}

export interface AncillaryData {
  uuid: string;
  oxygen_ml_l?: number;
  depth_meters?: number;
  latitude?: number;
  longitude?: number;
  temperature_celsius?: number;
  theta?: number;
  phi?: number;
  psi?: number;
  pressure_dbar?: number;
  salinity?: number;
  altitude?: number;
  light_transmission?: number;
}

export interface ViewBounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

/** ****************************************************************************
 *
 * @param annotations
 * @returns {*}
 */
export function filterAnnotationsForSelectImages(
  annotations: Annotation[]
): Annotation[] {
  return annotations.filter(
    (a) =>
      a.associations !== undefined &&
      a.associations.length > 0 &&
      a.associations
        .map((b) => b.link_name)
        .filter((c) => c === "image-quality").length > 0
  );
}

/** ****************************************************************************
 *
 */
export class GeoAnnotation {
  annotation: Annotation;

  constructor(annotation: Annotation) {
    this.annotation = annotation;
  }

  hasValidPosition(): boolean {
    const a = this.annotation;
    return (
      a !== undefined &&
      a.ancillary_data !== undefined &&
      a.ancillary_data.latitude !== undefined &&
      a.ancillary_data.longitude !== undefined
    );
  }

  get latitude(): number {
    if (this.hasValidPosition()) {
      return <number>this?.annotation?.ancillary_data?.latitude;
    }
    return NaN;
  }

  get longitude(): number {
    if (this.hasValidPosition()) {
      return <number>this?.annotation?.ancillary_data?.longitude;
    }
    return NaN;
  }

  get depth(): number {
    if (this.hasValidPosition() && this?.annotation?.ancillary_data?.depth_meters !== undefined) {
      return <number>this?.annotation?.ancillary_data?.depth_meters;
    }
    return NaN;
  }

  get image(): string {
    if (this.annotation && this.annotation.image_references) {
      const ir = this.annotation
        .image_references.filter(i => i.format === "image/jpg" || i.format === "image/jpeg");
      if (ir && ir.length > 0) {
        return ir[0].url;
      }
    }
    return "";
  }
}

// Greater Monterey Bay
const defaultViewBounds = {
  minLat: 35.380000002245765,
  maxLat: 37.199015745450694,
  minLon: -123.84791000001266,
  maxLon: -121.00463934203816,
};

/** ****************************************************************************
 *
 * @param geoAnnotations
 * @returns {{minLon: number, maxLat: number, minLat: number, maxLon: number}}
 */
export function geoAnnotationBounds(geoAnnotations: GeoAnnotation[]): ViewBounds {
  if (geoAnnotations !== undefined && geoAnnotations.length > 0) {
    const lats = geoAnnotations
      .map((a) => a.latitude)
      .filter((v) => v !== undefined && !isNaN(v));
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const lons = geoAnnotations
      .map((a) => a.longitude)
      .filter((v) => v !== undefined && !isNaN(v));
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    // console.log(lats)
    // console.log(minLon)
    // console.log(maxLon)
    // console.log(minLat)
    // console.log(maxLat)

    if (minLat && minLon && maxLat && maxLon) {
      // isFinite(minLat) && isFinite(minLon) && isFinite(maxLat) && isFinite(maxLon) &&
      // !isNaN(minLat) && !isNaN(minLon) && !isNaN(maxLat) && !isNaN(maxLon)) {
      return {
        minLat: minLat,
        maxLat: maxLat,
        minLon: minLon,
        maxLon: maxLon,
      };
    }
  }

  // console.log("Using default view bounds")
  return defaultViewBounds;
}

/** ****************************************************************************
 *
 * @param bounds
 * @returns {((number|number|*)[]|(number|number|*)[])[]|{minLon: number, maxLat: number, minLat: number, maxLon: number}}
 */
 
export function formatBoundsForLeaflet(bounds: ViewBounds) {
  if (bounds) {
    return [
      [bounds.minLat, bounds.minLon],
      [bounds.maxLat, bounds.maxLon],
    ];
  }
  return defaultViewBounds;
}

/** ****************************************************************************
 * Description text blocks often contain external links. This function formats
 * the first url in a text block to be an anchor
 * @param s
 * @returns {*}
 */
export function textToHtmlWithLinks(s: string): string {
  const urlRegex = /(https?:\/\/[^ ]*)/;
  const match = s.match(urlRegex);
  if (match) {
    // console.log(match)
    let url = match[0];
    if (url.endsWith(".")) {
      url = url.substring(0, url.length - 1);
    }
    const link = `<a href=${url}>${url}</a>`;
    return `${s.replace(url, link)}`;
  }
  return s;
}
