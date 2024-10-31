export interface Region {
    id?: number;
    MRGID?: number;
    name?: string;
    minLatitude: number | null;
    maxLatitude: number | null;
    minLongitude: number | null;
    maxLongitude: number | null;
    minDepth?: number | null;
    maxDepth?: number | null;
    createdTimestamp?: string;
}
