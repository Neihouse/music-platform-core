import { FileUpload } from "../FileUpload";

export interface ITrackUploadProps {}

export function TrackUpload(props: ITrackUploadProps) {
  return (
    <div>
      <FileUpload bucket="tracks" />
    </div>
  );
}
