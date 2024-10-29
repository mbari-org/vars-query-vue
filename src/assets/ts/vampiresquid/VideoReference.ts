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