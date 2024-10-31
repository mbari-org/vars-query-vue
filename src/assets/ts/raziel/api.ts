
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
    }).then(r => r.json())
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

