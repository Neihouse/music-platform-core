import { redirect } from "next/navigation";

export interface IUploadTrackPageProps { }

export default async function UploadTrackPage({ }: IUploadTrackPageProps) {
  return redirect("/upload/tracks");
}