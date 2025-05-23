import { Uploader } from "./Uploader";
import { useMediaQuery } from "@mantine/hooks";
import { Box } from "@mantine/core";

export interface ITrackUploadProps { }

export function TrackUpload({ }: ITrackUploadProps) {
  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Box w="100%">
      <Uploader bucket="tracks" isMobile={isMobile} />
    </Box>
  );
}
