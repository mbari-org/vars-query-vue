import type { Media } from "@/assets/ts/vampiresquid/Media";
import type { Video } from "@/assets/ts/vampiresquid/Video";


export class VampireSquidApi {

    url: string

    constructor(url: string) {
        this.url = url
    }

    findConcurrentMedia(videoReferenceUuid: string): Promise<Media[]> {
        const url = `${this.url}/media/concurrent/${encodeURIComponent(videoReferenceUuid)}`
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
        const url = `${this.url}/media/camera/${encodeURIComponent(cameraId)}/${encodeURIComponent(timestamp)}`
        return fetch(url, {
            mode: "cors",
        }).then((r) => r.json());
    }


    findSmallestConcurrentMp4(cameraId: string, timestamp: string): Promise<Media> {
        return this.findMediaByCameraIdAndTimestamp(cameraId, timestamp)
            .then(xs => {
                if (xs && xs.length > 0) {
                    return xs
                        .filter((x: Media) => x.uri.toLowerCase().endsWith(".mp4"))
                        .sort((a: Media, b: Media) => b.size_bytes - a.size_bytes)[0];
                }
                return {} as Media;
            });
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
