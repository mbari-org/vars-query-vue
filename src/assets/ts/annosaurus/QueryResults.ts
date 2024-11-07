import type { Annotation } from '@/assets/ts/annosaurus/QueryResponse'
import _ from 'lodash'
import { extractJpgOrFirstUrl, groupBy } from '@/assets/ts/util'

export class GeoFauxAnnotation {
    annotation: FauxAnnotation

    constructor(annotation: FauxAnnotation) {
        this.annotation = annotation
    }

    hasValidPosition(): boolean {
        return (
            'latitude' in this.annotation &&
            'longitude' in this.annotation &&
                !isNaN(this.latitude) &&
                !isNaN(this.longitude)
        )
    }

    get concept(): string {
        return this.annotation.concept ?? ''
    }

    get latitude(): number {
        return this.annotation.latitude ?? NaN
    }

    get longitude(): number {
        return this.annotation.longitude ?? NaN
    }

}

export interface MapViewBounds {
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
}

export function geoQueryResultsViewBounds(geoAnnotations: GeoFauxAnnotation[], defaultViewBounds: MapViewBounds): MapViewBounds {

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

export function crushQueryResultToAnnotations(queryResults: QueryResult[]): FauxAnnotation[] {
    // const grouped = _.groupBy(queryResults, 'observation_uuid')
    // const grouped = Map.groupBy(queryResults, (a: FauxAnnotation) => a.observation_uuid)
    const grouped = groupBy<QueryResult, string>(queryResults, (a: FauxAnnotation) => a.observation_uuid ?? '')
    // console.log(grouped)

    // combine image info
    const annotations = [] as FauxAnnotation[]
    let id = 0
    for (const [key, group] of grouped) {
    // const annotations = Object.keys(grouped).map((key) => {
    //     const group = grouped.get(key) ?? []
        // const group = grouped[key]
        // console.log(group[0])
        const main: QueryResult = {id, ...JSON.parse(JSON.stringify(group[0]))}
        id += 1
        // const main: QueryResult = structuredClone(group[0])
        //  Remove keys that would be duplicated in images and associations
        delete main['image_description']
        delete main['image_format']
        delete main['image_height']
        delete main['image_reference_uuid']
        delete main['image_url']
        delete main['image_width']
        delete main['link_name']
        delete main['link_value']
        delete main['to_concept']
        delete main['associations']


        const images: FauxImageReference[] = group.map((result) => {
            const image: FauxImageReference = {
                uuid: result.image_reference_uuid,
                description: result.image_description,
                format: result.image_format,
                height_pixels: result.image_height,
                url: result.image_url,
                width_pixels: result.image_width
            }
            return image
        })

        const tempImages = _.uniqBy(images.filter(isFaustImageReferenceValid), (i) => i.url)
        if (tempImages.length > 0) {
            main.images = _.uniqBy(images.filter(isFaustImageReferenceValid), (i) => i.url)
        }

        const associations: FauxAssociation[] = group.map((result) => {
            const association: FauxAssociation = {
                uuid: result.image_reference_uuid,
                link_name: result.link_name,
                link_value: result.link_value,
                to_concept: result.to_concept,
                media_type: result.association_mime_type
            }
            // Parse association as link_name | to_concept | link_value
            const parts = result.associations?.split('|').map(s => s.trim())
            if (parts && parts.length > 0) {
                association.link_name = parts[0]
                association.to_concept = parts[1]
                association.link_value = parts[2]
            }
            return association
        })

        const tempAssociations = _.uniqBy(associations.filter(isFauxAssociationValid),fauxAssociationToString )
        if (tempAssociations.length > 0) {
            main.details = tempAssociations
        }

        annotations.push(main)
    }

    return annotations



}

/*
    link_name
    link_value
    to_concept
 */
export interface FauxAssociation {
    uuid?: string
    link_name?: string
    to_concept?: string
    link_value?: string
    media_type?: string
}

export function fauxAssociationToString(association: FauxAssociation): string {
    return `${association.link_name} | ${association.to_concept} | ${association.link_value}`
}

export function fauxAssociationToStringTrimmed(association: FauxAssociation, length: number): string {
    const s = fauxAssociationToString(association)
    return s.length > length ? s.substring(0, length) + "..." : s
}


function isFauxAssociationValid(link: FauxAssociation): boolean {
    return !!(link.link_name?.trim() || link.to_concept?.trim() || link.link_value?.trim());
}

/*
    image_description
    image_format
    image_height
    image_reference_uuid
    image_url
    image_width
 */
export interface FauxImageReference {
    uuid?: string
    description?: string
    format?: string
    height_pixels?: number
    url?: string
    width_pixels?: number
}

function isFaustImageReferenceValid(image: FauxImageReference): boolean {
    return !!(image.url?.trim());
}

export function extractRepresentativeImage(annotation: FauxAnnotation): string | null {
    const urls = annotation.images?.map(i => i.url ?? '')
    // console.log(this.annotation, this.annotation.images, urls)
    return extractJpgOrFirstUrl(urls) ?? null
}

export interface FauxAnnotation {
    activity?: string
    altitude?: number
    association_mime_type?: string
    associations?: string
    details?: FauxAssociation[]         // These are synthetic associations generated from association strings
    audio_codec?: string
    camera_id?: string
    camera_platform?: string
    chief_scientist?: string
    concept?: string
    coordinate_reference_system?: string
    depth_meters?: number
    dive_number?: string
    duration_millis?: number
    frame_rate?: number
    id?: number                         // This is a synthetic key
    image?: string                      // This is a synthetic image generated from image references
    imaged_moment_uuid?: string
    images?: FauxImageReference[]       // These are synthetic images generated from image references
    index_elapsed_time_millis?: number
    index_recorded_timestamp?: string
    index_timecode?: string
    latitude?: number
    light_transmission?: number
    longitude?: number
    observation_group?: string
    observation_timestamp?: string
    observation_uuid?: string
    observer?: string
    oxygen_ml_per_l?: number
    phi?: number
    pressure_dbar?: number
    psi?: number
    salinity?: number
    temperature_celsius?: number
    theta?: number
    video_codec?: string
    video_container?: string
    video_description?: string
    video_duration_millis?: number
    video_height?: number
    video_name?: string
    video_reference_description?: string
    video_reference_uuid?: string
    video_sequence_description?: string
    video_sequence_name?: string
    video_sha512?: string
    video_size_bytes?: number
    video_start_timestamp?: string
    video_uri?: string
    video_width?: number
    x?: number
    xyz_position_units?: string
    y?: number
    z?: number
}

export interface QueryResult extends FauxAnnotation {
    image_description?: string
    image_format?: string
    image_height?: number
    image_reference_uuid?: string
    image_url?: string
    image_width?: number
    link_name?: string
    link_value?: string
    to_concept?: string
}

