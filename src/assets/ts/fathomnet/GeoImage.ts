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
export interface GeoImage {
  uuid: string;        //"2bae1c5b-3c17-4882-a3ab-eb2eb3c351cb",
  url: string;         // "https://fathomnet.org/static/m3/framegrabs/Doc%20Ricketts/images/0747/00_44_02_00.png",
  latitude: number;    //23.655652,
  longitude: number;   //-108.41491,
  depthMeters: number; //2429.64990234375,
  contributorsEmail: string; //"brian@mbari.org",
  valid: boolean;      //true,
  lastValidation: string; //"2022-04-01T07:18:12.866192100Z",
  timestamp: string;   //"2015-04-11T15:29:53Z"
};

export interface Constraints {
  concept: string;
}

export interface Count {
  constraints: Constraints;
  count: number;
}
