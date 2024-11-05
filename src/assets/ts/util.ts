export function tabDelimitedToObject(lines: string[]): Record<string, string | null>[] {
    // Extract the header row and split it into fields
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
