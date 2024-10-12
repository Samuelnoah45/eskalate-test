import { Box, Button, Container, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect } from 'react';
import { LuUploadCloud } from 'react-icons/lu';
import { IconX } from '@tabler/icons-react';
import { Dropzone, FileWithPath, PDF_MIME_TYPE } from '@mantine/dropzone';
import { AiOutlineFilePdf } from 'react-icons/ai';
import CardWrapper from '../ProfileCenter/CardWrapper';

import Link from 'next/link';
import { useAppSelector } from '@/lib/redux/hooks';
import { useDeveloper } from '@/Providers/DeveloperContext';
import classes from './resume.module.css';
import {
    useUpdateDeveloperFileMutation,
    useUpdateDeveloperMutation
} from '@/lib/redux/api/developer/developer';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
import { useModals } from '@/Providers/ModalContext';
const UploadResumeStep = () => {
    // const [opened, { open, close }] = useDisclosure(false);
    const { isResumeModalOpen, openResumeModal, closeResumeModal } =
        useModals();
    const [file, setFile] = React.useState<any>(null);
    const [updateDeveloperFile, { isLoading: isUpdating }] =
        useUpdateDeveloperFileMutation();
    const [updateDeveloper, { isLoading: isDeleting }] =
        useUpdateDeveloperMutation();

    const { developer, isLoading, isError, error } = useDeveloper();

    const uploadResume = () => {
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        updateDeveloperFile(formData)
            .unwrap()
            .then((data) => {
                toast.success('Resume uploaded successfully');
                setFile(null);
                closeResumeModal();
            })
            .catch((error) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    const deleteResume = () => {
        updateDeveloper({
            resumeUrl: ''
        })
            .unwrap()
            .then((data) => {
                close();
            })
            .catch((error) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    const headerProps = {
        title: 'Upload resume',
        add: !developer?.resumeUrl,
        edit: !!developer?.resumeUrl,
        onAdd: openResumeModal,
        onEdit: openResumeModal,
        upload: true
    };

    return (
        <CardWrapper headerProps={headerProps} noData={!developer?.resumeUrl}>
            <Modal
                size={'lg'}
                opened={isResumeModalOpen}
                onClose={closeResumeModal}
                title="Upload Resume"
                centered
            >
                <Dropzone
                    onDrop={(files) => setFile(files[0])}
                    onReject={(rejections) => {
                        if (rejections[0].errors[0].code === 'file-too-large')
                            toast.error('File is larger than 5MB');
                        else toast.error(rejections[0].errors[0].message);
                    }}
                    maxSize={5 * 1024 ** 2}
                    accept={PDF_MIME_TYPE}
                    maxFiles={1}
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
                                    ? file.name
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
                                {file === null ? (
                                    <>
                                        <LuUploadCloud
                                            style={{
                                                color: 'var(--mantine-color-blue-6)',
                                                width: '50px',
                                                height: 'auto'
                                            }}
                                        />
                                        <p>
                                            Drag and drop your resume here, or
                                            click to browse
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <LuUploadCloud
                                            style={{
                                                color: 'var(--mantine-color-blue-6)',
                                                width: '50px',
                                                height: 'auto'
                                            }}
                                        />

                                        <Box
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <AiOutlineFilePdf
                                                style={{
                                                    height: '20px',
                                                    width: 'auto',
                                                    color: 'red'
                                                }}
                                            />
                                            <p>{file.name}</p>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Dropzone.Idle>
                    </Group>
                </Dropzone>

                <Box
                    style={{
                        display: 'flex',
                        justifyContent: developer?.resumeUrl
                            ? 'space-between'
                            : 'flex-end',
                        marginTop: '20px'
                    }}
                >
                    {developer?.resumeUrl ? (
                        <Button
                            variant="outline"
                            style={{
                                borderColor: '#ff4d4f',
                                color: '#ff4d4f',
                                '&:hover': {
                                    backgroundColor: '#ffe8e6',
                                    borderColor: '#ff4d4f',
                                    color: '#ff4d4f'
                                }
                            }}
                            onClick={deleteResume}
                            loading={isDeleting}
                        >
                            Delete
                        </Button>
                    ) : (
                        ''
                    )}

                    <Button
                        variant="filled"
                        color="#2195F3"
                        onClick={uploadResume}
                        loading={isUpdating}
                    >
                        Upload
                    </Button>
                </Box>
            </Modal>

            {developer?.resumeUrl ? (
                <Group gap={5} px={16}>
                    <AiOutlineFilePdf
                        style={{
                            height: '20px',
                            width: 'auto',
                            color: 'red'
                        }}
                    />
                    <Text>
                        <Link
                            href={developer.resumeUrl}
                            style={{
                                textDecoration: 'none',
                                color: 'black'
                            }}
                            target="_blank"
                            className={classes.resume_title}
                        >
                            Resume.pdf
                        </Link>
                    </Text>
                </Group>
            ) : null}
        </CardWrapper>
    );
};

export default UploadResumeStep;
