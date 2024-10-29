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
