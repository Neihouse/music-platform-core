import { useMediaQuery } from "@mantine/hooks";
import { Box } from "@mantine/core";
import { AlbumUploader } from "./AlbumUploader";

export interface IAlbumUploadProps { }

export function AlbumUpload({ }: IAlbumUploadProps) {
  const isMobile = useMediaQuery("(max-width: 48em)");

  return (
    <Box w="100%">
      <AlbumUploader bucket="albums" isMobile={isMobile} />
    </Box>
  );
}
