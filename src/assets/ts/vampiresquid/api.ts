import { vampireSquid as vamUrl } from "@/assets/ts/ConfigParser";
import type { Media } from "@/assets/ts/vampiresquid/Media";
import type { Video } from "@/assets/ts/vampiresquid/Video";

const endpoints = {
  media: {
    byCameraIdAndTimestamp: vamUrl + "/media/camera/", // {{cameraId/isotimestmap}}
    byVideoSequenceName: vamUrl + "/media/videosequence/", // {{videoSequenceName}}
    byVideoReferenceUuid: vamUrl + "/media/videoreference/", // {{videoReferenceUuid}}
    concurrentByVideoReferenceUuid: vamUrl + "/media/concurrent/", // {{videoReferenceUuid}}
  },
  video: {
    videosequence: vamUrl + "/videos/videoreference/", // {{videoReferenceUuid}}
  },
};


export function findConcurrentMedia(videoReferenceUuid: string): Promise<Media[]> {
  const url = endpoints.media.concurrentByVideoReferenceUuid + encodeURIComponent(videoReferenceUuid)
  return fetch(url, {
    mode: "cors",
  }).then((r) => r.json());
}

export function findMediaByVideoReferenceUuid(videoReferenceUuid: string): Promise<Media> {
  const url = endpoints.media.byVideoReferenceUuid + encodeURIComponent(videoReferenceUuid)
  return fetch(url, {
    mode: "cors",
  }).then((r) => r.json());
}

export function findMediaByVideoSequenceName(videoSequenceName: string): Promise<Media[]> {
  const url = endpoints.media.byVideoSequenceName + encodeURIComponent(videoSequenceName)
  return fetch(url, {
    mode: "cors",
  }).then((r) => r.json());
}

export function findMediaByCameraIdAndTimestamp(cameraId: string, timestamp: string): Promise<Media[]> {
  const url = endpoints.media.byCameraIdAndTimestamp + encodeURIComponent(cameraId) + "/" + encodeURIComponent(timestamp)
  return fetch(url, {
    mode: "cors",
  }).then((r) => r.json());
}

export function findSmallestConcurrentMp4(cameraId: string, timestamp: string): Promise<Media> {
  return findMediaByCameraIdAndTimestamp(cameraId, timestamp)
  .then(xs => {
    if (xs && xs.length > 0) {
      return xs
        .filter((x: Media) => x.uri.toLowerCase().endsWith(".mp4"))
        .sort((a: Media, b: Media) => b.size_bytes - a.size_bytes)[0];
    }
    return {} as Media;
  });
}

export function findVideoByVideoReferenceUuid(videoReferenceUuid: string): Promise<Video> {
  const url = endpoints.video.videosequence + encodeURIComponent(videoReferenceUuid)
  return fetch(url, {
    mode: "cors",
  }).then((r) => r.json());
}
