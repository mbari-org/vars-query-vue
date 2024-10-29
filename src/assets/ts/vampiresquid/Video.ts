import type {VideoReference} from "@/assets/ts/vampiresquid/VideoReference";

export interface Video {
  name: string;
  start_timestamp: string;
  duration_millis: number;
  video_references: VideoReference[];
  last_updated_time: string;
  uuid: string;
}