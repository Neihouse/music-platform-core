"use client";
import { createClient } from "@/utils/supabase/client";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IAudioMetadata, parseBlob, parseBuffer } from "music-metadata";
import {
	Affix,
	Button,
	Card,
	Group,
	Space,
	Stack,
	Paper,
	ThemeIcon,
	Text,
	Badge
} from "@mantine/core";
import { MetadataDisplay } from "./MetadataDisplay";
import { IconUpload } from "@tabler/icons-react";
import { handleInsertTrack } from "@/app/upload/actions";
import { ArtUpload } from "./ArtUpload";

export interface IUploaderProps {
	bucket: string;
	isMobile?: boolean;
}

export interface FileWithMetadata {
	metadata: IAudioMetadata;
	file: FileWithPath;
}

export function Uploader({ bucket, isMobile = false }: IUploaderProps) {
	const [uploadState, setUploadState] = useState<
		"initial" | "pending" | "error" | "success"
	>();
	const [filesWithMetadata, setFilesWithMetadata] = useState<
		FileWithMetadata[]
	>([]);

	return (
		<>
			<Stack>
				{filesWithMetadata.map((fM, i) => (
					<Card
						key={fM.file.name + i}
						withBorder
						shadow="sm"
						radius="lg"
						p={isMobile ? "xs" : "md"}
						style={{
							backgroundColor: 'var(--mantine-color-body)',
							borderColor: 'var(--mantine-color-blue-2)',
							transition: 'transform 0.2s ease, box-shadow 0.2s ease',
						}}
						className="hover:shadow-md"
					>
						<Group align="flex-start" gap={isMobile ? "md" : "xl"} wrap={isMobile ? "wrap" : "nowrap"}>
							<ArtUpload isMobile={isMobile} />
							<MetadataDisplay
								isMobile={isMobile}
								onDelete={() =>
									setFilesWithMetadata(filesWithMetadata.filter((f) => f !== fM))
								}
								fileWithMetadata={fM}
								onUpdate={(key: string, value: string) =>
									updateFileMetadata(fM, key, value)
								}
							/>
						</Group>
					</Card>
				))}
			</Stack>
			<Space my={isMobile ? 12 : 16} />
			<Paper shadow="sm" p={isMobile ? "md" : "xl"} withBorder radius="lg" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--mantine-color-blue-4)' }}>
				<Dropzone
					loading={uploadState === "pending"}
					onDrop={onDrop}
					style={{
						border: 'none',
						backgroundColor: 'transparent',
						minHeight: isMobile ? '150px' : '200px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Stack align="center" justify="center" gap="md">
						<ThemeIcon size={isMobile ? 50 : 70} radius={isMobile ? 25 : 35} color="blue" variant="light">
							<IconUpload size={isMobile ? 30 : 40} />
						</ThemeIcon>
						<Text size={isMobile ? "md" : "lg"} fw={500} ta="center">
							Drop your audio files here
						</Text>
						<Text size="sm" c="dimmed" ta="center">
							Drag and drop your audio files or click to browse
						</Text>
						<Badge variant="light" color="blue" size={isMobile ? "md" : "lg"}>
							MP3, WAV, FLAC, and more
						</Badge>
					</Stack>
				</Dropzone>
			</Paper>
			<Affix
				hidden={!filesWithMetadata.length}
				position={{ bottom: isMobile ? 20 : 100, right: isMobile ? 20 : 80 }}
			>
				<Button
					disabled={uploadState === "pending"}
					onClick={() => uploadFiles(filesWithMetadata)}
					size={isMobile ? "md" : "lg"}
					radius="xl"
					leftSection={<IconUpload size={isMobile ? 16 : 20} />}
					variant="gradient"
					gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
					px={isMobile ? 20 : 30}
					style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
				>
					Upload Tracks
				</Button>
			</Affix>
		</>
	);

	async function onDrop(files: FileWithPath[]) {
		try {
			setUploadState("pending");

			const newFilesWithMetadata = await Promise.all(
				files.map(async (file) => {
					const metadata = await parseBlob(file);
					return { file, metadata };
				}),
			);

			setFilesWithMetadata((prev) => [...prev, ...newFilesWithMetadata]);
			setUploadState("initial");
		} catch (error) {
			handleError(error as string);
		}
	}

	async function uploadFiles(filesWithMetadata: FileWithMetadata[]) {
		setUploadState("pending");
		const supabase = await createClient();

		try {
			for await (const file of filesWithMetadata) {
				const {
					metadata: { common },
					file: { size, name },
				} = file;
				const title = common.title || name;

				common.title = title;

				const track = await handleInsertTrack(file.metadata, size);

				if (!track) throw new Error("No ID to upload to");

				const { error } = await supabase.storage
					.from(bucket)
					.upload(track.id, file.file);

				if (error) {
					throw new Error(error.message);
				}
			}
		} catch (error: any) {
			return handleError(error);
		}

		setUploadState("success");
		notifications.show({
			message: "Successfully uploaded track",
			color: "green",
		});

		setFilesWithMetadata([]);
	}

	function updateFileMetadata(
		file: FileWithMetadata,
		key: string,
		value: string,
	) {
		try {
			const selectedFile = filesWithMetadata.find((f) => f === file);

			if (!selectedFile) {
				throw new Error("No file found");
			}

			if (key === "title") {
				selectedFile.metadata.common.title = value;
			}

			setFilesWithMetadata((filesWithMetadata) => [
				...filesWithMetadata.filter((f) => f.file.name !== file.file.name),
				selectedFile,
			]);
		} catch (error: any) {
			handleError(error.message || error);
		}
	}

	function handleError(error: string) {
		setUploadState("error");
		notifications.show({
			title: "Upload Error",
			message: `${error}`,
			color: "red",
		});
	}
}
