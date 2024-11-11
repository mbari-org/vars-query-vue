

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
    return new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
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
