import { Button, Center, Group, Modal, Stack, Text, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { useUpdateDeveloperFileMutation } from '@/lib/redux/api/developer/developer';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
interface Props {
    close: () => void;
}

export default function UploadProfilePicture({ close }: Props) {
    const [updateDeveloperFile, { isLoading }] =
        useUpdateDeveloperFileMutation();

    const openRef = useRef<() => void>(null);
    const imageRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState<any>(null);

    const uploadProfilePicture = () => {
        if (!selectedImage) {
            toast.error('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', selectedImage);

        updateDeveloperFile(formData)
            .unwrap()
            .then((data: any) => {
                close();
            })
            .catch((error: any) => {
                const errorMessage = handleError(error);
                if (errorMessage) {
                    toast.error(errorMessage);
                }
            });
    };

    return (
        <Stack
            style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Dropzone
                openRef={openRef}
                onDrop={(files: any) => {
                    const selectedFile = files[0];
                    setSelectedImage(selectedFile);
                }}
                onReject={(rejections: any) => {
                    if (rejections[0].errors[0].code === 'file-too-large')
                        toast.error('File is larger than 5MB');
                    else toast.error(rejections[0].errors[0].message);
                }}
                maxSize={5 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                style={{
                    borderRadius: '50%',
                    overflow: 'hidden',
                    width: 200,
                    height: 200,
                    padding: selectedImage ? 0 : rem(20),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                }}
            >
                <Group
                    justify="center"
                    gap="xl"
                    display={'column'}
                    style={{ pointerEvents: 'none' }}
                >
                    {selectedImage ? (
                        <Image
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected"
                            width={200}
                            height={200}
                            objectFit="cover"
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                                objectPosition: 'center'
                            }}
                        />
                    ) : (
                        <>
                            <Dropzone.Accept>
                                <IconUpload
                                    style={{
                                        width: rem(52),
                                        height: rem(52),
                                        color: 'var(--mantine-color-primary-6)'
                                    }}
                                    stroke={1.5}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX
                                    style={{
                                        width: rem(52),
                                        height: rem(52),
                                        color: 'var(--mantine-color-red-6)'
                                    }}
                                    stroke={1.5}
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <Stack>
                                    <IconPhoto
                                        style={{
                                            width: 100,
                                            height: 100,
                                            color: 'var(--mantine-color-dimmed)'
                                        }}
                                        stroke={1.5}
                                        ref={imageRef}
                                    />
                                </Stack>
                            </Dropzone.Idle>
                        </>
                    )}
                </Group>
            </Dropzone>
            <p>Drag and drop your profile picture here, or click to browse</p>
            <Group justify="end" w={'100%'} pos={'relative'}>
                {/*<Button onClick={() => {}} variant="outline" color="red">
                    Delete
                </Button>*/}

                <Button onClick={uploadProfilePicture} loading={isLoading}>
                    Save
                </Button>
            </Group>
        </Stack>
    );
}
