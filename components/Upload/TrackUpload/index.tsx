import { Uploader } from "./Uploader";

export interface ITrackUploadProps { }

export function TrackUpload({ }: ITrackUploadProps) {
  return (
    <div>
      <Uploader bucket="tracks" />
    </div>
  );
}
