import {
    Box,
    Button,
    Grid,
    Group,
    TextInput,
    NativeSelect,
    Checkbox,
    Modal,
    Loader,
    Center,
    Flex,
    Text
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import EducationTimeline from './EducationTimeline';
import CardWrapper from '../ProfileCenter/CardWrapper';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';

import { useAppSelector } from '@/lib/redux/hooks';
import { useDeveloper } from '@/Providers/DeveloperContext';
import Placeholder from '@tiptap/extension-placeholder';
import { Select } from '@mantine/core';
import {
    useCreateEducationMutation,
    useGetEducationByDeveloperIdQuery
} from '@/lib/redux/api/developer/education';
import { useGetDeveloperQuery } from '@/lib/redux/api/developer/developer';
import { toast } from 'react-toastify';
import { handleError } from '@/utils/error_handler';
import { useModals } from '@/Providers/ModalContext';
import { COUNTRIES } from '@/constants';

const AddEducationStep = () => {
    const [content, setContent] = React.useState('');
    // const [opened, { open, close }] = useDisclosure(false);
    const { isEducationModalOpen, openEducationModal, closeEducationModal } =
        useModals();

    const { developer, isLoading, isError, error, isOwner } = useDeveloper();
    const loginState = useAppSelector((state: any) => state.login);

    const {
        data: educationData,
        error: educationError,
        isLoading: isEducationLoading
    } = useGetEducationByDeveloperIdQuery(developer?.id ? developer.id : '');
    const [
        addEducation,
        { isLoading: isAdding, isError: isAddingError, isSuccess: isAdded }
    ] = useCreateEducationMutation();
    const {
        data: userData,
        isLoading: isUserDataLoading,
        error: isUserDataError
    } = useGetDeveloperQuery(developer?.id ? developer.id : '');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            Placeholder.configure({
                placeholder: 'Write you education description here'
            })
        ],
        content: content,
        onUpdate: ({ editor }: { editor: any }) => {
            if (editor.getHTML().length <= 1000) {
                setContent(editor.getHTML());
            } else {
                editor.commands.setContent(content);
            }
        }
    });

    const form = useForm({
        initialValues: {
            collageName: '',
            degree: 'Others',
            present: false,
            country: '',
            city: '',
            department: '',
            startDate: '',
            endDate: ''
        },

        validate: {
            collageName: isNotEmpty('This field is required'),
            department: isNotEmpty('This field is required'),
            startDate: (value) => {
                if (value === '') {
                    return 'This field is required';
                }
            },
            endDate: (value) => {
                if (!form.values.present) {
                    if (value === '') {
                        return 'This field is required';
                    }
                }
            }
        }
    });

    const handleSubmit = () => {
        const present = new Date().toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });

        const addedEducation = {
            institutionName: form.values.collageName,
            field: form.values.department,
            degree: form.values.degree,
            startDate: form.values.startDate,
            endDate: form.values.present ? present : form.values.endDate,
            isEndDatePresent: form.values.present ? true : false,
            description: content,
            userId: loginState?.id ? loginState.id : '',
            country: form.values.country,
            city: form.values.city
        };

        addEducation(addedEducation)
            .unwrap()
            .then((data) => {
                setContent('');
                editor?.commands.setContent('');
                form.reset();
                closeEducationModal();
                toast.success('Education added successfully');
            })
            .catch((error) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    const headerProps = {
        title: 'Education',
        add: true,
        onAdd: openEducationModal
    };
    return (
        <CardWrapper headerProps={headerProps} noData={!educationData?.length}>
            {isEducationLoading ? (
                <Center>
                    <Loader size={34} />
                </Center>
            ) : null}
            <EducationTimeline
                educations={educationData ? educationData : []}
            />

            <Modal
                size={'xl'}
                opened={isEducationModalOpen}
                onClose={() => {
                    closeEducationModal();
                    form.reset();
                    setContent('');
                    editor?.commands.setContent('');
                }}
                title="Add Education"
                centered
            >
                <Box
                    maw={900}
                    mx="auto"
                    component="form"
                    onSubmit={form.onSubmit((values) => handleSubmit())}
                >
                    <Grid gutter={'lg'}>
                        <Grid.Col span={{ base: 12 }}>
                            <TextInput
                                withAsterisk
                                label="School"
                                placeholder="AASTU"
                                {...form.getInputProps('collageName')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                withAsterisk
                                label="Department"
                                placeholder="Computer Science"
                                {...form.getInputProps('department')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Select
                                label="Degree"
                                data={[
                                    'Coding Academy',
                                    "Associate's Degree",
                                    "Bachelor's Degree",
                                    "Master's Degree",
                                    'Doctoral or Professional Degree',
                                    'Others'
                                ]}
                                {...form.getInputProps('degree')}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Select
                                label="Country"
                                searchable
                                placeholder="Ethiopia"
                                data={COUNTRIES}
                                {...form.getInputProps('country')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                label="City"
                                placeholder="Addis Ababa"
                                {...form.getInputProps('city')}
                            />
                        </Grid.Col>
                        {/* <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                type="month"
                                label="Start Date"
                                withAsterisk
                                {...form.getInputProps('startDate')}
                                mah={form.values.endDate}
                            />
                        </Grid.Col> */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                type="month"
                                label="Start date"
                                withAsterisk
                                {...form.getInputProps('startDate')}
                                max={new Date().toISOString().slice(0, 7)}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                type="month"
                                label="End date"
                                withAsterisk
                                disabled={
                                    form.values.present ||
                                    !form.values.startDate
                                }
                                {...form.getInputProps('endDate')}
                                min={form.values.startDate}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 0, md: 6 }}></Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Checkbox
                                label="Present"
                                className="font-light"
                                {...form.getInputProps('present')}
                                checked={form.values.present}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12 }}>
                            <h3
                                style={{
                                    marginBottom: '2px',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                Description
                            </h3>
                            <RichTextEditor editor={editor}>
                                <RichTextEditor.Toolbar sticky>
                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.Bold />
                                        <RichTextEditor.BulletList />
                                        <RichTextEditor.OrderedList />
                                    </RichTextEditor.ControlsGroup>
                                </RichTextEditor.Toolbar>

                                <RichTextEditor.Content />
                            </RichTextEditor>
                            {/* maximum number of characters */}
                            <Text mt={5}>
                                {editor?.getText().length} /{1000} characters
                            </Text>
                            <Text mt={5} c={'red'}>
                                {content.length >= 1000 &&
                                    "You've reached the maximum number of characters"}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Flex gap={24} mt={24} justify={'flex-end'}>
                                <Button
                                    disabled={isLoading}
                                    variant="default"
                                    onClick={closeEducationModal}
                                >
                                    Cancel
                                </Button>
                                <Button loading={isAdding} type="submit">
                                    Submit
                                </Button>
                            </Flex>
                        </Grid.Col>
                    </Grid>
                </Box>
            </Modal>
        </CardWrapper>
    );
};

export default AddEducationStep;
