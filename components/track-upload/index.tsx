import { TrackUpload: } from "./Uploader";

export interface ITrackUploadProps {}

export function TrackUpload(props: ITrackUploadProps) {
  return (
    <div>
      <Upload bucket="tracks" />
    </div>
  );
}
