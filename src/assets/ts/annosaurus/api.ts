import { annosaurus as annoUrl } from "@/assets/ts/ConfigParser";
import { minify } from "./QueryConstraints";
import type { QueryConstraints } from "./QueryConstraints";
import type {
  Annotation,
  Count, DepthHistogram,
  GeoRange,
  QueryResponse,
  QueryResponseAnno,
  QueryResponseCount,
  QueryResponseGeoRange, StringHistogram, TimeHistogram
} from "./QueryResponse";

const endpoints = {
  analysis: {
    depthRange: annoUrl + "/analysis/histogram/depth",
    timeRange: annoUrl + "/analysis/histogram/time"
  },
  fast: {
    count: annoUrl + "/fast/count", // POST query constraints JSON body
    geoRange: annoUrl + "/fast/georange", // POST query constraints JSON bocy
    images: annoUrl + "/fast/concept/images/", // {{concept}} and ?data=true
    query: annoUrl + "/fast/", // POST query constraints JSON body
  },
};

function executeQuery<Type>(url: string, queryConstraints: QueryConstraints): Promise<Type> {
  return fetch(url, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(minify(queryConstraints)),
  })
    .then((r) => r.json())
    .then((json) => json.content);
}

function compareAnnotations(a: Annotation, b: Annotation) {
  let at = a.recorded_timestamp
  if (at === undefined || at === null) {
    at = "1900-01-01T00:00:00Z"
  }
  let bt = b.recorded_timestamp
  if (bt === undefined || bt === null) {
    bt = "1900-01-01T00:00:00Z"
  }
  return at.localeCompare(bt)
}

export async function pagedSearch(q: QueryConstraints, pageSize: number) {
  const annotations = [] as Annotation[]
  const n = await count(q)
  const pages = Math.ceil(n.count / pageSize)
  for (let i = 0; i < pages; i++) {
    q.limit = pageSize
    q.offset = pageSize * i
    const xs = await search(q)
    annotations.push(...xs)
  }
  annotations.sort(compareAnnotations) // sort by recorded_timestamp
  return annotations
}

export function count(q: QueryConstraints): Promise<Count> {
  return executeQuery(endpoints.fast.count, q);
}

export function geoRange(q: QueryConstraints): Promise<GeoRange> {
  // {min_latitude: 0, max_latitude: 0, min_longitude: 0, max_longitude: 0, min_depth_meters: 0, max_depth_meters: 0}
  return executeQuery(endpoints.fast.geoRange, q);
}

export function depthHistogram(q: QueryConstraints, size=100): Promise<DepthHistogram> {
  return executeQuery(endpoints.analysis.depthRange + "?size=" + size, q)
}

export function timeHistogram(q: QueryConstraints, size=180): Promise<TimeHistogram> {
  return executeQuery(endpoints.analysis.timeRange + "?size=" + size, q)
      .then(hist => {
        // @ts-ignore
        const mins = hist.bins_min.map(s => Date.parse(s))
        // @ts-ignore
        const maxs = hist.bins_max.map(s => Date.parse(s))
        // @ts-ignore
        // @ts-ignore
        return {
          bins_min: mins,
          bins_max: maxs,
          values: hist.values
        }
      })
}

export function search(q: QueryConstraints): Promise<Annotation[]> {
  return executeQuery(endpoints.fast.query, q);
}

export function images(conceptName: string): Promise<Annotation[]> {
  const url =
    endpoints.fast.images + encodeURIComponent(conceptName) + "?data=true";
  return fetch(url, {
    mode: "cors",
  }).then((r) => r.json());
}

