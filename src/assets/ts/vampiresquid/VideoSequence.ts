import type {Video} from '@/assets/ts/vampiresquid/Video'

export interface VideoSequence {
    uuid: string;
    name: string;
    camera_id: string;
    videos: Video[];
    last_updated_time: string;
}
