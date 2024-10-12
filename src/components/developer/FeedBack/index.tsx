import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Center,
    FileInput,
    Grid,
    Group,
    Skeleton,
    Stack,
    Textarea,
    TextInput,
    Affix,
    Image,
    CloseButton
} from '@mantine/core';
import classes from './review.module.css';
import { isNotEmpty, useForm } from '@mantine/form';
import { BiUpload } from 'react-icons/bi';
import Cropper from 'react-easy-crop';
import ImageCroper from './ImageCroper';
import SuccessNotification from '@/components/common/success_notification';
import { useAddFeedBackMutation } from '@/lib/redux/api/developer/feedback';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
const FeedBack = ({ setSuccess, setOpenReview }: any) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {};
    const [feedBack, { isLoading, isError, isSuccess, reset }] =
        useAddFeedBackMutation();
    const form = useForm({
        initialValues: {
            topic: '',
            review: ''
        },
        validate: {
            topic: isNotEmpty('This field is required'),
            review: isNotEmpty('This field is required')
        }
    });
    if (isSuccess) {
        // alert("Works")
        setOpenReview(false);
        setSuccess(true);
        reset();
        toast.success('You have successfully submitted your feedback!');
    }
    if (isError) {
        // alert("Sorry something goes wrong!")
        // reset();
        toast.error('Sorry, something went wrong!');
    }
    const [isOpened, setIsOpened] = useState(false);
    const [values, setValues] = useState<File[]>([]);
    const [preview, setPreview] = useState<string[]>([]);
    const fileInputRef = useRef<any>(null);
    const handleFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);
        setValues((data: any) => [...data, ...selectedFiles]);
    };
    const deleteImg = (ind: number) => {
        setValues((data: any) => {
            return data.filter((val: any, i: number) => i != ind);
        });
    };
    const submit = () => {
        const error = form.validate();
        if (error.hasErrors) {
            return;
        }

        const datas = form.values;
        const formData = new FormData();
        datas.topic.trim() && formData.append('title', datas.topic);
        datas.review.trim() && formData.append('description', datas.review);
        values.map((d) => {
            formData.append('image', d);
        });
        feedBack(formData);
    };
    useEffect(() => {
        const generatePreview = async () => {
            const previewUrls = await Promise.all(
                values.map((file) => {
                    const reader = new FileReader();
                    return new Promise<string>((resolve) => {
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });
                })
            );
            setIsOpened(previewUrls.length > 0);
            setPreview(previewUrls);
        };

        generatePreview();
    }, [values]);
    return (
        <Group className={`${classes.review} flex flex-col`}>
            <Group
                className={`${classes.head} flex flex-col  items-start gap-10  pb-4`}
            >
                <TextInput
                    withAsterisk
                    label="Subject"
                    {...form.getInputProps('topic')}
                    placeholder="Add subject"
                    style={{
                        width: '100%'
                    }}
                />
                <Textarea
                    withAsterisk
                    label="Description"
                    {...form.getInputProps('review')}
                    placeholder="Add description"
                    style={{
                        width: '100%'
                    }}
                    autosize
                    minRows={6}
                    maxRows={6}
                />
                <div
                    className={`${classes.imageUpload} py-10 text-xl bg-gray-200 border border-dashed cursor-pointer flex justify-center`}
                    onClick={handleFileSelect}
                >
                    Upload Image here
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    onChange={handleFileChange}
                    multiple
                />
                {isSuccess && (
                    <div className="text-green-500 my-1 text-lg">
                        You have successfully submitted your feedback!
                    </div>
                )}
                {isError && (
                    <div className="text-red-500 my-1 text-lg">
                        Sorry, something went wrong!
                    </div>
                )}
            </Group>

            {/* {isOpened && 
                <ImageCroper 
                    isOpened={isOpened} 
                    image={preview.length > 0 && preview[0]} 
                    setIsOpened={setIsOpened} 
                />
            } */}
            {preview && (
                <div
                    className="py-2 grid grid-cols-2 "
                    style={{ width: '100%', gap: '10px' }}
                >
                    {preview.map((url, index) => (
                        <Box
                            key={index}
                            style={{
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            w={'100%'}
                            h={'200px'}
                        >
                            <Image
                                key={index}
                                src={url}
                                width={'100%'}
                                height={'200px'}
                                style={{
                                    borderRadius: '10px'
                                }}
                                alt={`Preview ${index + 1}`}
                            />
                            <CloseButton
                                onClick={() => deleteImg(index)}
                                bg={'gray'}
                                c={'white'}
                                // className={classes.deleteImg}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '5px'
                                }}
                            />
                        </Box>
                    ))}
                </div>
            )}

            <Box
                className={`${classes.bottom} flex flex-row-reverse bg-white shadow border`}
            >
                <Button
                    my={'10px'}
                    className={`${classes.button}  `}
                    onClick={submit}
                    loading={isLoading}
                >
                    Submit
                </Button>
            </Box>
        </Group>
    );
};

export default FeedBack;
