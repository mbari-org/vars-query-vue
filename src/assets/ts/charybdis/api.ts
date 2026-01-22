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

