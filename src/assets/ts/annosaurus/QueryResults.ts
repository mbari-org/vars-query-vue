import type { Annotation } from '@/assets/ts/annosaurus/QueryResponse'
import _ from 'lodash'

export class GeoQueryResult {
    queryResult: Record<string, string | null >

    constructor(queryResult: Record<string, string | null>) {
        this.queryResult = queryResult
    }

    hasValidPosition(): boolean {
        return (
            'latitude' in this.queryResult &&
            'longitude' in this.queryResult &&
                !isNaN(this.latitude) &&
                !isNaN(this.longitude)
        )
    }

    get concept(): string {
        if ('concept' in this.queryResult) {
            return this.queryResult.concept ?? ''
        }
        return ''
    }

    get latitude(): number {
        if ('latitude' in this.queryResult) {
            return parseFloat(this.queryResult.latitude ?? '')
        }
        return NaN
    }

    get longitude(): number {
        if ('longitude' in this.queryResult) {
            return parseFloat(this.queryResult.longitude ?? '')
        }
        return NaN
    }


    get image(): string | null | undefined {
        if ('image_url' in this.queryResult) {
            return this.queryResult.image_url
        }
        return undefined
    }

}

export interface MapViewBounds {
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
}

export function geoQueryResultsViewBounds(geoAnnotations: GeoQueryResult[], defaultViewBounds: MapViewBounds): MapViewBounds {

    if ( geoAnnotations && geoAnnotations.length > 0) {

        const lats = geoAnnotations
            .map(a => a.latitude)
            .filter(v => v !== undefined && !isNaN(v))
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)

        const lons = geoAnnotations
            .map(a => a.longitude)
            .filter(v => v !== undefined && !isNaN(v))
        const minLon = Math.min(...lons)
        const maxLon = Math.max(...lons)

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
                maxLon: maxLon
            }
        }
    }
    // console.log("Using default view bounds")
    return defaultViewBounds
}

/** ****************************************************************************
 *
 * @param bounds
 * @param defaultViewBounds
 * @returns {((number|number|*)[]|(number|number|*)[])[]|{minLon: number, maxLat: number, minLat: number, maxLon: number}}
 */
export function formatBoundsForLeaflet(bounds: MapViewBounds, defaultViewBounds: MapViewBounds): [number, number][] {
    if (bounds) {
        return [[bounds.minLat, bounds.minLon], [bounds.maxLat, bounds.maxLon]]
    }
    return formatBoundsForLeaflet(defaultViewBounds, defaultViewBounds)
}

export function crushQueryResultToAnnotations(queryResults: Record<string, string | null>[]): Annotation {
    const grouped = _.groupBy(queryResults, 'observation_uuid')
    // combine image info
    const annotations = Object.keys(grouped).map((key) => {
        const group = grouped[key]
        const main = structuredClone(group[0])
        // TODO remove keys that would be duplicated in images and associations

        
        const annotation: Annotation = {
            uuid: key,
            concept: group[0].concept ?? '<not loaded>',
            observer: group[0].observer ?? '<not loaded>',
            observation_timestamp: group[0].observation_timestamp ?? '<not loaded>',
            video_reference_uuid: group[0].video_reference_uuid ?? '<not loaded>',
            annotations: group.map((qr) => new GeoQueryResult(qr))
        }
        return annotation
    })

    // combine association info

}

