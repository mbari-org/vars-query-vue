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
export interface Media {
  video_sequence_uuid: string;
  video_reference_uuid: string; //"3b595823-103b-4581-952c-c4a017f39638";
  video_uuid: string;           //"0347adcc-9854-4001-86c8-eaf8d42f4a3d";
  video_sequence_name: string;  //"Doc Ricketts 1234";
  camera_id: string;            //"Doc Ricketts";
  video_name: string;           //"Doc Ricketts 1234 20191216T182204Z";
  uri: string;                  //"http://m3.shore.mbari.org/videos/M3/master/DocRicketts/2019/12/1234/D1234_20191216T182204Z_prores.mov";
  start_timestamp: string;      //"2019-12-16T18:22:04Z";
  duration_millis?: number;      //900070;
  container?: string;            // "video/quicktime";
  width?: number;                //1920;
  height?: number;               //1080;
  frame_rate?: number;           // 0;
  size_bytes?: number;           //25959073985;
  sha512?: string;               //"AED13DC3EB51A334D3662E90625E0E6B009C89E280F39B8B0E7AC96882D466F3886411D53ADD661575D771ECDBCF9272E46A80902D23A80B6A9FB08FADBC6D82";
}
