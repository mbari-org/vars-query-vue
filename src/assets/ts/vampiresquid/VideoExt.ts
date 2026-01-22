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
import type { VideoReference } from "@/assets/ts/vampiresquid/VideoReference";
import type { Video } from "@/assets/ts/vampiresquid/Video";

export class VideoExt {
  video: Video;

  constructor(video: Video) {
    this.video = video;
  }

  get video_reference_uuid(): string {
    const m = this.mp4;
    if (m) {
      return m.uuid;
    }
    return "";
  }

  get container(): string {
    const m = this.mp4;
    if (m) {
      return m.container;
    }
    return "";
  }

  get width(): number {
    const m = this.mp4;
    if (m) {
      return m.width;
    }
    return 0;
  }

  get height(): number {
    const m = this.mp4;
    if (m) {
      return m.height;
    }
    return 0;
  }

  get uri(): string {
    const m = this.mp4;
    if (m) {
      return m.uri;
    }
    return "";
  }

  get start_timestamp(): string {
    if (this.video) {
      return this.video.start_timestamp;
    }
    return "";
  }

  get duration_millis(): number {
    if (this.video) {
      return this.video.duration_millis;
    }
    return 0;
  }

  get video_name(): string {
    if (this.video) {
      return this.video.name;
    }
    return "";
  }

  get video_uuid(): string {
    if (this.video) {
      return this.video.uuid;
    }
    return "";
  }

  get mp4(): VideoReference {
    const v = this.video;
    if (
      v !== undefined &&
      v.video_references !== undefined &&
      v.video_references.length > 0
    ) {
      const mp4s = v.video_references.filter(vr => vr.uri.startsWith("http") && vr.container && vr.container === "video/mp4")
      if (mp4s && mp4s.length > 0) {
        return mp4s[0];
      }
    }
    return {} as VideoReference;
  };

}
