import type { Annotation } from '@/assets/ts/annosaurus/QueryResponse'
import _, { isString } from 'lodash'
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
                !isNaN(this.longitude)  &&
                this.latitude < 90 && this.latitude > -90 &&
                this.longitude < 180 && this.longitude > -180
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
            .filter(v => v !== undefined && !isNaN(v) && v !== 0)
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)

        const lons = geoAnnotations
            .map(a => a.longitude)
            .filter(v => v !== undefined && !isNaN(v) && v !== 0)
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
    if (queryResults.length === 0) {
        return []
    }

    const grouped = groupBy<QueryResult, string>(queryResults, (a: FauxAnnotation) => a.observation_uuid ?? '')
    // console.log(grouped)

    // combine image info
    const annotations = [] as FauxAnnotation[]
    let row = 0
    for (const [key, group] of grouped) {
    // const annotations = Object.keys(grouped).map((key) => {
    //     const group = grouped.get(key) ?? []
        // const group = grouped[key]
        // console.log(group[0])
        const main: QueryResult = {row, ...JSON.parse(JSON.stringify(group[0]))}
        row += 1
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
        }) || []

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
        }) || []

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
    const a = association.link_name ?? ''
    const b = association.to_concept ?? ''
    const c = association.link_value ?? ''
    return `${a} | ${b} | ${c}`
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

export function parseFauxAnnotation(data: { [key: string]: any }): FauxAnnotation {
    const fauxAnnotation: FauxAnnotation = {};

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            // Check if the field is a number field and convert strings to numbers as needed
            if (
                typeof value === "string" &&
                [
                    "altitude",
                    "depth_meters",
                    "duration_millis",
                    "frame_rate",
                    "index_elapsed_time_millis",
                    "latitude",
                    "longitude",
                    "oxygen_ml_per_l",
                    "phi",
                    "pressure_dbar",
                    "psi",
                    "row",
                    "salinity",
                    "temperature_celsius",
                    "theta",
                    "video_duration_millis",
                    "video_height",
                    "video_size_bytes",
                    "video_width",
                    "x",
                    "y",
                    "z"
                ].includes(key)
            ) {
                fauxAnnotation[key] = parseFloat(value);
            } else {
                // Otherwise, assign the value as-is
                fauxAnnotation[key] = value;
            }
        }
    }
    return fauxAnnotation;
}

export interface FauxAnnotation {

    // Need to SaveOptions.vue saveTab method to use properties as keys
    [key: string]: string | string[] | number | number[] | FauxAssociation[] | FauxImageReference[] | undefined

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
    row?: number                         // This is a synthetic key
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
    preview_media_uri?: string
    preview_media_index_seconds?: number
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

export function extractLinkNames(annotations: FauxAnnotation[]): string[] {
    const linkNames = _.uniq(annotations.flatMap(a => a.details?.map(d => d.link_name) ?? []))
    return linkNames as string[]
}

/**
 * Convert FauxAnnotations to TSV format. Associations are represented
 * as semi-colon separated strings in the 'details' column.
 * @param annotations
 */
export function fauxAnnotationsToTsv(annotations: FauxAnnotation[]): string {
    if (annotations.length === 0) {
        return ''
    }

    const headers = Object.keys(annotations[0])
    const headerRow = headers.join('\t')

    const dataRows = annotations.map((a) => {
        const values = headers.map((h) => {
            const value = a[h]
            if (h === 'details' && value) {
                return (value as FauxAssociation[]).map(fauxAssociationToString).join(';')
            }
            if (h === 'images' && value) {
                return (value as FauxImageReference[]).map(i => i.url).join(';')
            }
            if (Array.isArray(value)) {
                return value.join(';')
            }
            return value
        })
        return values.join('\t')
    })

    return [headerRow, ...dataRows].join('\n')
}


/**
 * When we write association fields, we want to simplify it for import into
 * spreadsheets. This allows us to skip 'self' and 'nil' values which might be
 * just noise
 * @param value
 */
function isWritableAssociationFieldValue(value: string): boolean {
    if (_.isString(value?.trim())) {
        const v = value?.trim()?.toLowerCase()
        return v !== 'self' && v !== 'nil'
    }
    return false
}

/**
 * Simplify an association into a string for TSV export. We're separating associations
 * into columns by link_name. Often, either to_concept or link_value may be 'self' or 'nil',
 * which is not useful in a spreadsheet context. This function omits those values when possible.
 * @param association
 */
function simplifyAssocation(association: FauxAssociation): string {
    const writeToConcept = isWritableAssociationFieldValue(association.to_concept ?? '')
    const writeLinkValue = isWritableAssociationFieldValue(association.link_value ?? '')
    if (writeToConcept && writeLinkValue) {
        return `${association.to_concept} | ${association.link_value}`
    }
    else if (writeToConcept) {
        return `${association.to_concept}`
    }
    else if (writeLinkValue) {
        return `${association.link_value}`
    }
    else {
        return ''
    }
}

/**
 * Convert FauxAnnotations to TSV format, separating associations into their own columns
 * by link_name.
 * @param annotations
 */
export function fauxAnnotationsToTsvSeparateAssociations(annotations: FauxAnnotation[]): string {
    if (annotations.length === 0) {
        return ''
    }

    // Collect all unique link_names from all annotations' details arrays
    const detailKeys = Array.from(
        new Set(
            annotations
                .flatMap(a => (a.details ?? []).map(d => d.link_name).filter((n): n is string => !!n))
        )
    )

    // Base headers, excluding 'details' itself
    const baseHeaders = Object.keys(annotations[0]).filter(h => h !== 'details')

    // Combine base headers + dynamic detail columns
    const headers = [...baseHeaders, ...detailKeys]
    const headerRow = headers.join('\t')

    const dataRows = annotations.map(a => {
        // Build a lookup from link_name → link_value for this annotation
        const detailMap: Record<string, string> = {}
        for (const d of a.details ?? []) {
            if (d.link_name) {
                detailMap[d.link_name] = simplifyAssocation(d)
            }
        }

        const values = headers.map(h => {
            if (detailKeys.includes(h)) {
                // Dynamic detail column
                return detailMap[h] ?? ''
            }

            const value = a[h]
            if (h === 'images' && value) {
                return (value as FauxImageReference[]).map(i => i.url).join(';')
            }
            if (Array.isArray(value)) {
                return value.join(';')
            }
            return value ?? ''
        })

        return values.join('\t')
    })

    return [headerRow, ...dataRows].join('\n')
}


