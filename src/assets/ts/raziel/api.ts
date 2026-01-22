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
export interface ServerConfig {
  name: string;
  url: string;
  timeoutMillis: number;
  proxyPath: string;
}

export class RazielApi {
  url: string

  constructor(url: string) {
    this.url = url
  }

  async getEndpoints(): Promise<Array<ServerConfig>> {
    // console.log("Getting endpoints from " + this.endpoints.config.endpoints)
    return fetch(this.url + "/endpoints", {
      mode: "cors",
    }).then(r =>
        r.ok ? r.json() : Promise.reject(r))
  }

}


export function normalizeUrl(url: string): string {
  if (!url) {
    return "http://localhost:8080";
  }
  if (url.endsWith("/")) {
    return url.substring(0, url.length - 1);
  }
  return url;
}

export function extractUrlFromConfig(name: string, config: Array<ServerConfig> | undefined): string {
  if (!config) {
    return "http://localhost:8080";
  }
  return normalizeUrl(
    config.filter((e: ServerConfig) => e.name === name).map((e: ServerConfig) => e.url)[0]
  );
}

