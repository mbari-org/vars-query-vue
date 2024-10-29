export interface Media {
  video_sequence_uuid: string;
  video_reference_uuid: string; //"3b595823-103b-4581-952c-c4a017f39638";
  video_uuid: string;           //"0347adcc-9854-4001-86c8-eaf8d42f4a3d";
  video_sequence_name: string;  //"Doc Ricketts 1234";
  camera_id: string;            //"Doc Ricketts";
  video_name: string;           //"Doc Ricketts 1234 20191216T182204Z";
  uri: string;                  //"http://m3.shore.mbari.org/videos/M3/master/DocRicketts/2019/12/1234/D1234_20191216T182204Z_prores.mov";
  start_timestamp: string;      //"2019-12-16T18:22:04Z";
  duration_millis: number;      //900070;
  container: string;            // "video/quicktime";
  width: number;                //1920;
  height: number;               //1080;
  frame_rate: number;           // 0;
  size_bytes: number;           //25959073985;
  sha512: string;               //"AED13DC3EB51A334D3662E90625E0E6B009C89E280F39B8B0E7AC96882D466F3886411D53ADD661575D771ECDBCF9272E46A80902D23A80B6A9FB08FADBC6D82";
}