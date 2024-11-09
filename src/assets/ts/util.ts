

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

