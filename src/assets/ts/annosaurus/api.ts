import { minify } from './QueryConstraints'
import type { QueryConstraints } from './QueryConstraints'
import type {
  Annotation,
  Count,
  DepthHistogram,
  GeoRange,
  QueryResponse,
  QueryResponseAnno,
  QueryResponseCount,
  QueryResponseGeoRange,
  StringHistogram,
  TimeHistogram,
} from './QueryResponse'
import type { Query } from '@/assets/ts/annosaurus/Query'

export class AnnosaurusApi {

    url: string
  constructor(annoUrl: string) {
    this.url = annoUrl
  }

  executeQuery<Type>(
    url: string,
    queryConstraints: QueryConstraints,
  ): Promise<Type> {
    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(minify(queryConstraints)),
    })
      .then(r => r.json())
      .then(json => json.content)
  }

  compareAnnotations(a: Annotation, b: Annotation) {
    let at = a.recorded_timestamp
    if (at === undefined || at === null) {
      at = '1900-01-01T00:00:00Z'
    }
    let bt = b.recorded_timestamp
    if (bt === undefined || bt === null) {
      bt = '1900-01-01T00:00:00Z'
    }
    return at.localeCompare(bt)
  }

  async pagedSearch(q: QueryConstraints, pageSize: number) {
    const annotations = [] as Annotation[]
    const n = await this.count(q)
    const pages = Math.ceil(n.count / pageSize)
    for (let i = 0; i < pages; i++) {
      q.limit = pageSize
      q.offset = pageSize * i
      const xs = await this.search(q)
      annotations.push(...xs)
    }
    annotations.sort(this.compareAnnotations) // sort by recorded_timestamp
    return annotations
  }

  count(q: QueryConstraints): Promise<Count> {
    return this.executeQuery(`${this.url}/fast/count`, q)
  }

  geoRange(q: QueryConstraints): Promise<GeoRange> {
    // {min_latitude: 0, max_latitude: 0, min_longitude: 0, max_longitude: 0, min_depth_meters: 0, max_depth_meters: 0}
    return this.executeQuery(`${this.url}/fast/georange`, q)
  }

  depthHistogram(q: QueryConstraints, size = 100): Promise<DepthHistogram> {
    return this.executeQuery(`${this.url}/analysis/histogram/depth?size=${size}`, q)
  }

  timeHistogram(q: QueryConstraints, size = 180): Promise<TimeHistogram> {
    return this.executeQuery(
      `${this.url}/analysis/histogram/time?size=${size}`,
      q,
    ).then(hist => {
      // @ts-ignore
      const mins = hist.bins_min.map(s => Date.parse(s))
      // @ts-ignore
      const maxs = hist.bins_max.map(s => Date.parse(s))
      // @ts-ignore
      // @ts-ignore
      return {
        bins_min: mins,
        bins_max: maxs,
        values: hist.values,
      }
    })
  }

  search(q: QueryConstraints): Promise<Annotation[]> {
    return this.executeQuery(`${this.url}/fast/`, q)
  }

  images(conceptName: string): Promise<Annotation[]> {
    const url = `${this.url}/fast/concept/images/${encodeURIComponent(conceptName)}?data=true`
    return fetch(url, {
      mode: 'cors',
    }).then(r => r.json())
  }

  runUsingQuery(q: Query): Promise<string> {
    return fetch(`${this.url}/query/run`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(q),
    }).then(r => r.text())
  }

  countUsingQuery(q: Query): Promise<Count> {
    return fetch(`${this.url}/query/count`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(q),
    }).then(r => r.json())
  }

  async pageUsingQuery(q: Query, pageSize: number): Promise<Annotation[]> {
    const rows = [] as string[]
    const n = await this.countUsingQuery(q)
    const pages = Math.ceil(n.count / pageSize)
    for (let i = 0; i < pages; i++) {
      q.limit = pageSize
      q.offset = pageSize * i
      const xs = await this.runUsingQuery(q)
      const newRows = xs.split('\n')
      if (i === 0) {
        rows.push(...newRows)
      }
      else {
        // Drop the header row from subsequent pages
        const [head, ...tail] = newRows
        rows.push(...tail)
      }
    }

    // TODO assemble annotations from rows
    return []

  }
}
