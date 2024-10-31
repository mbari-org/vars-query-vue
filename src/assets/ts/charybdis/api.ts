import type { Annotation } from "@/assets/ts/annosaurus/QueryResponse";
import type { Media } from "@/assets/ts/vampiresquid/Media";

export interface Dataset {
    annotations: Annotation[];
    media: Media[];
}

export class CharbydisApi {
    url: string;

    constructor(url: string) {
        this.url = url;
    }


    findByVideoSequenceName(videoSequenceName: string): Promise<Dataset> {
        const url = `${this.url}/query/dive/${encodeURIComponent(videoSequenceName)}`
        return fetch(url, {
            mode: "cors",
        }).then(r => r.json())
    }

}

