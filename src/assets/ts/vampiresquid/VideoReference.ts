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
export interface VideoReference {
  uri: string;        //"http://m3.shore.mbari.org/videos/M3/mezzanine/DocRicketts/2019/12/1234/D1234_20191216T182204Z_h264.mp4",
  container: string;  //"video/mp4",
  width: number;      //1920,
  height: number;     //1080,
  frame_rate: number; //0,
  size_bytes: number; //2516065108,
  sha512: string;     //"3956ECA1C66B806F120EACA792E1DCDE7810F8B595FDFD9B9EEAF702AEACCBCD7B80EEDED4E7F5763E4C203413BD75832CBA4C9D454722160B02642AE3754735",
  last_updated_time: string; //"2019-12-20T09:36:14Z",
  uuid: string;       //"b3f7cb31-d7f6-4e99-a446-0014566d66cc"
}