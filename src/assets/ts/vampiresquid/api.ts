import type { Media } from "@/assets/ts/vampiresquid/Media";
import type { Video } from "@/assets/ts/vampiresquid/Video";
import type { PreviewMedia } from '@/assets/ts/vampiresquid/PreviewMedia'
import { da } from "vuetify/locale";
import { dateStringToCompactString } from "../util";


export class VampireSquidApi {

    url: string

    maxBytes: number = 100000000000

    constructor(url: string) {
        this.url = url
    }

    findConcurrentMedia(videoReferenceUuid: string): Promise<Media[]> {
        const url = `${this.url}/media/concurrent/${encodeURIComponent(videoReferenceUuid)}`
        return fetch(url, {
            mode: "cors",
        }).then((r) => r.json());
    }

    findMediaByUri(uri: string): Promise<Media> {
        const url = `${this.url}/media/uri/${encodeURIComponent(uri)}`
        return fetch(url, {
            mode: "cors",
        }).then((r) => r.json());
    }

    findMediaByVideoReferenceUuid(videoReferenceUuid: string): Promise<Media> {
        const url = `${this.url}/media/videoreference/${encodeURIComponent(videoReferenceUuid)}`
        return fetch(url, {
            mode: "cors",
        }).then((r) => r.json());
    }


    findMediaByVideoSequenceName(videoSequenceName: string): Promise<Media[]> {
        const url = `${this.url}/media/videosequence/${encodeURIComponent(videoSequenceName)}`
        return fetch(url, {
            mode: "cors",
        }).then((r) => r.json());
    }

    findMediaByCameraIdAndTimestamp(cameraId: string, timestamp: string): Promise<Media[]> {
        // console.log("findMediaByCameraIdAndTimestamp", cameraId, timestamp)
        const compactTimestamp = dateStringToCompactString(timestamp)
        const url = `${this.url}/media/camera/${encodeURIComponent(cameraId)}/${compactTimestamp}`
        return fetch(url, {
            mode: "cors",
        }).then((r) => r.json());
    }


    findSmallestConcurrentMp4(cameraId: string, timestamp: string): Promise<Media> {
        console.log("findSmallestConcurrentMp4", cameraId, timestamp)
        return this.findMediaByCameraIdAndTimestamp(cameraId, timestamp)
            .then(xs => {
                if (xs && xs.length > 0) {
                    return xs
                        .filter((x: Media) => x.uri.toLowerCase().endsWith(".mp4"))
                        .sort((a: Media, b: Media) => (b.size_bytes ?? this.maxBytes) - (a.size_bytes ?? this.maxBytes))[0];
                }
                return {} as Media;
            });
    }

    findPreviewMediaByUriAndTimestamp(mediaUri: string, timestamp: string): Promise<PreviewMedia> {
        return this.findMediaByUri(mediaUri)
            .then((m: Media) => this.findSmallestConcurrentMp4(m.camera_id, timestamp))
            .then((m: Media) => {
                let seekTimeSeconds = 0
                if (m && m.start_timestamp && timestamp) {
                    // console.log("m.start_timestamp", m.start_timestamp)
                    const seek = new Date(timestamp)
                    const start = new Date(m.start_timestamp)
                    seekTimeSeconds = (seek.getTime() - start.getTime()) / 1000 // seconds
                }
                return {
                    media: m,
                    seekTimeSeconds: seekTimeSeconds,
                }
            })

    }


    findVideoByVideoReferenceUuid(videoReferenceUuid: string): Promise<Video> {
        const url = `${this.url}/videos/videoreference/${encodeURIComponent(videoReferenceUuid)}`
        return fetch(url, {
            mode: "cors",
        }).then((r) => r.json());
    }

    listVideoSequenceNames(): Promise<string[]> {
        const url = `${this.url}/videosequences/names`
        return fetch(url, {
            mode: "cors",
        }).then((r) => r.json());
    }

    listCameraPlatforms(): Promise<string[]> {
        const url = `${this.url}/videosequences/cameras`
        return fetch(url, {
            mode: "cors",
        }).then((r) => r.json());
    }

}
