import { charybdis as charybdisUrl } from "@/assets/ts/ConfigParser";
import type { Annotation } from "@/assets/ts/annosaurus/QueryResponse";
import type { Media } from "@/assets/ts/vampiresquid/Media";

const endpoints = {
  query: {
    byVideoSequenceName: charybdisUrl + "/query/dive/",// {{videoSequenceName}}
  },
};

export interface Dataset {
  annotations: Annotation[];
  media: Media[];
}

export function findByVideoSequenceName(videoSequenceName: string): Promise<Dataset> {
  const url = endpoints.query.byVideoSequenceName + encodeURIComponent(videoSequenceName)
  return fetch(url, {
    mode: "cors",
  }).then(r => r.json())
}
