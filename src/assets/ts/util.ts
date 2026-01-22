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
import type { FauxAnnotation } from '@/assets/ts/annosaurus/QueryResults'
import JSZip from 'jszip'


export function tabDelimitedToObject(lines: string[]): Record<string, string | null>[] {
    // Extract the header row and split it into fields
    if (lines.length < 2) {
        return [];
    }

    const headers = lines[0].split("\t");

    // Iterate over remaining rows and create objects
    const data = lines.slice(1).map(line => {
        const values = line.split("\t");
        const rowObj: Record<string, string | null> = {};

        headers.forEach((header, index) => {
            const value = values[index];
            // Convert "null" strings to actual null values
            rowObj[header] = value === "null" ? null : value;
        });

        return rowObj;
    });

    return data;
}


export function groupBy<T, K>(array: T[], keyMapper: (item: T) => K): Map<K, T[]> {
    const groupedMap = new Map<K, T[]>();

    array.forEach(item => {
        const key = keyMapper(item);
        const group = groupedMap.get(key);

        if (group) {
            group.push(item);
        } else {
            groupedMap.set(key, [item]);
        }
    });

    return groupedMap;
}

export function extractJpgOrFirstUrl(images: string[] | undefined): string | undefined {
    if (!images) {
        return undefined;
    }

    const jpgUrl = images.find(url => url.endsWith('.jpg'));
    return jpgUrl || images[0];
}

export function nowAsCompactString(): string {
    return new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '') + 'Z';
}

export function dateStringToCompactString(dateString: string): string {
    console.log(dateString)
    const date = new Date(dateString);
    console.log(date)
    // if (isNaN(date.getTime())) {
    //     throw new Error("Invalid date format");
    // }
    return date.toISOString().replace(/[-:]/g, '').replace(/\..+/, '') + 'Z';
}


export interface HistogramBin {
    index: number;
    min: number;
    max: number
    count: number;
}

export function histogram(data: number[], numBins: number): HistogramBin[] {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / numBins;

    const bins = Array.from({ length: numBins }, (_, i) => {
        const binMin = min + i * binWidth;
        const binMax = binMin + binWidth;
        const count = data.filter(value => value >= binMin && value < binMax).length;
        return {
            index: i,
            min: binMin,
            max: binMax,
            count,
        }
    });

    return bins;
}

export function depthHistogram(data: number[]): HistogramBin[] {
    const min = 0;
    const max = 4000;
    const numBins = 40;
    const binWidth = (max - min) / numBins;

    const bins = Array.from({ length: numBins }, (_, i) => {
        const binMin = min + i * binWidth;
        const binMax = binMin + binWidth;
        const count = data.filter(value => value >= binMin && value < binMax).length;
        return {
            index: i,
            min: binMin,
            max: binMax,
            count,
        }
    });

    return bins;
}

export function yearHistogram(data: Date[]): HistogramBin[] {
    const years = data.map(d => d.getUTCFullYear());
    const minYear = 1985;
    const maxYear = new Date().getUTCFullYear();
    const numBins = maxYear - minYear + 1;
    const bins = Array.from({ length: numBins }, (_, i) => {
        const year = minYear + i;
        const count = years.filter(y => y === year).length;
        return {
            index: i,
            min: year,
            max: year,
            count,
        }
    })
    return bins;
}

// https://www.cjoshmartin.com/blog/creating-zip-files-with-javascript
export async function generateZipDownloadFromAnnotations(xs: Array<FauxAnnotation>) {
    const zip = new JSZip();
    const folder = zip.folder('annotations');

    for (const a of xs) {
        const filename = `${a.video_sequence_name}-${a.observation_uuid}.json`;
        const content = JSON.stringify(a, null, 2);
        folder?.file(filename, content);

        // fetch image if it exists
        if (a.images) {
            for (const image of a.images) {
                const url = image.url;
                if (url) {
                    const ext = url.split('.').pop();
                    const file = await fetch(url, {mode: 'cors'}).then(r => r.blob())
                    folder?.file(`${a.video_sequence_name}-${a.observation_uuid}.${ext}`, file);
                }
            }
        }
    };

    return await zip.generateAsync({ type: 'blob', streamFiles: true })

    // zip.generateAsync({ type: 'blob' }).then(content => {
    //     const url = URL.createObjectURL(content);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = zipName;
    //     a.click();
    // });

}

