import { Box, Button, Group, Text } from '@mantine/core';
import React from 'react';
import { LuUploadCloud } from 'react-icons/lu';
import { IconX } from '@tabler/icons-react';
import { Dropzone } from '@mantine/dropzone';

import { useDeveloper } from '@/Providers/DeveloperContext';
import {
    useUpdateDeveloperFileMutation,
    useUpdateDeveloperMutation
} from '@/lib/redux/api/developer/developer';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';

export default function IntroVideoForm({
    video,
    close
}: {
    video: any;
    close: () => void;
}) {
    const [updateDeveloperFile, { isLoading }] =
        useUpdateDeveloperFileMutation();
    const [updateDeveloper, { isLoading: isLoadingDelete }] =
        useUpdateDeveloperMutation();
    const [file, setFile] = React.useState<string>('');
    const [selectedFile, setSelectedFile] = React.useState<null>(null);

    const handleFileSelect = (files: any) => {
        const firstFile = files[0];
        setSelectedFile(firstFile);
        setFile(firstFile.name);
    };

    const handleUpload = () => {
        const formData = new FormData();
        if (!selectedFile) {
            toast.error('Please select a file');
            return;
        }
        formData.append('introVideo', selectedFile);
        updateDeveloperFile(formData)
            .unwrap()
            .then((data) => {
                setFile('');
                setSelectedFile(null);
                close();
                toast.success('Intro Video uploaded successfully');
            })
            .catch((error) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    const handleDelete = () => {
        updateDeveloper({
            introVideoUrl: ''
        })
            .unwrap()
            .then((res: any) => {
                close();
                toast.success('Intro Video deleted successfully');
            })
            .catch((err: any) => {
                const errorMessage = handleError(err);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    const {
        developer,
        isLoading: devIsLoading,
        isError: devIsError,
        error: devError
    } = useDeveloper();

    return (
        <Group w={'100%'} justify="center" h={'340px'}>
            <Dropzone
                onDrop={handleFileSelect}
                onReject={(rejections) => {
                    toast.error(rejections[0].errors[0].message);
                }}
                accept={[
                    'video/mp4',
                    'video/webm',
                    'video/quicktime',
                    'video/x-msvideo',
                    'video/x-flv'
                ]}
                maxFiles={1}
                w={'100%'}
            >
                <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: 'none' }}
                >
                    <Dropzone.Accept>
                        <LuUploadCloud
                            style={{
                                color: 'var(--mantine-color-blue-6)',
                                width: '50px',
                                height: 'auto'
                            }}
                        />

                        <p>
                            {file
                                ? file
                                : 'Invalid file type, please upload a PDF file.'}
                        </p>
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            style={{ color: 'var(--mantine-color-red-6)' }}
                            stroke={1.5}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <Box
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column'
                            }}
                        >
                            <LuUploadCloud
                                style={{
                                    color: 'var(--mantine-color-blue-6)',
                                    width: '50px',
                                    height: 'auto'
                                }}
                            />
                            <p>
                                Drag and drop your video here, or click to
                                browse
                            </p>

                            <Text
                                lineClamp={2}
                                truncate={'end'}
                                w={'fit-content'}
                                flex={1}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: '5px'
                                }}
                            >
                                {/*  */}
                                <Text truncate w={'80%'}>
                                    {file}
                                </Text>
                                .
                                {//file extension
                                file?.split('.')?.pop()}
                            </Text>
                        </Box>
                    </Dropzone.Idle>
                </Group>
            </Dropzone>

            <Box
                style={{
                    display: 'flex',
                    justifyContent: developer?.introVideoUrl
                        ? 'space-between'
                        : 'flex-end',
                    marginTop: '20px',
                    width: '100%',
                    alignSelf: 'flex-end'
                }}
            >
                {developer?.introVideoUrl && (
                    <Button
                        variant="outline"
                        color="red"
                        onClick={handleDelete}
                        loading={isLoadingDelete}
                    >
                        Delete
                    </Button>
                )}
                <Button
                    variant="filled"
                    onClick={handleUpload}
                    loading={isLoading}
                >
                    Upload
                </Button>
            </Box>
        </Group>
    );
}
