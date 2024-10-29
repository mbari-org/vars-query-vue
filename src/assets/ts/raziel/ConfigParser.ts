// import config from "@/assets/js/config.json";
import config from "../js/config.json"





function extractUrl(name: string): string {
  return normalizeUrl(
    config.filter((e: ServerConfig) => e.name === name).map((e: ServerConfig) => e.url)[0]
  );
}

export const annosaurus = extractUrl("annosaurus");
export const beholder = extractUrl("beholder")
export const charybdis = extractUrl("charybdis");
export const vampireSquid = extractUrl("vampire-squid");
export const varsKbServer = extractUrl("vars-oni-server");
