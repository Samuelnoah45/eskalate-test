import {
    Alert,
    Box,
    Button,
    Checkbox,
    Grid,
    Group,
    MultiSelect,
    Text,
    TextInput
} from '@mantine/core';
import { isNotEmpty, matches, useForm } from '@mantine/form';

import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { useState } from 'react';
import Placeholder from '@tiptap/extension-placeholder';
import { useGetAllSkillsQuery } from '@/lib/redux/api/developer/skill';
import { useCreateProjectMutation } from '@/lib/redux/api/developer/project';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
import { validateURL } from '@/utils/validators';

export default function AddProjectForm({ close }: { close: () => void }) {
    const { data: skillList, isLoading: isLoadingSkills } =
        useGetAllSkillsQuery();
    const [createProject, { isLoading, isError }] = useCreateProjectMutation();

    const [message, setMessage] = useState<any>('');

    const skillDictionary: {
        [key: string]: string;
    } = {};

    const skills = skillList?.map((skill: any) => {
        skillDictionary[skill.id] = skill.name;
        return {
            label: skill.name,
            value: skill.id
        };
    });

    const form = useForm<any>({
        initialValues: {
            ProjectTitle: '',
            UrlProject: '',
            ProjectDescription: '',
            startDate: '',
            endDate: '',
            TechnicalSkill: [],
            present: false
        },

        validate: {
            ProjectTitle: isNotEmpty('This field is required'),
            UrlProject: (value: string) => {
                if (value) {
                    return validateURL(value);
                }
            },
            startDate: isNotEmpty('This field is required'),
            endDate: (value) => {
                if (!form.values.present) {
                    if (value === '') {
                        return 'This field is required';
                    }
                }
            }
            //ProjectDescription: isNotEmpty('This field is required')
        }
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const res = form.validate();
        if (res.hasErrors) {
            return;
        }

        const present = new Date().toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });

        createProject({
            title: form.values.ProjectTitle,
            link: form.values.UrlProject,
            description: form.values.ProjectDescription,
            skills: form.values.TechnicalSkill,
            startDate: form.values.startDate,
            endDate: form.values.present ? present : form.values.endDate,
            isEndDatePresent: form.values.present ? true : false
        })
            .unwrap()
            .then((result: any) => {
                close();
                toast.success('Project added successfully');
            })
            .catch((error: any) => {
                setMessage(error.error.message);
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    const projectEditor = useEditor({
        extensions: [
            StarterKit,
            Link,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            Placeholder.configure({
                placeholder: 'Write you project description here'
            })
        ],
        content: form.values.ProjectDescription,
        onUpdate: ({ editor }: { editor: any }) => {
            if (editor.getHTML().length <= 1000) {
                form.setFieldValue('ProjectDescription', editor.getHTML());
            } else {
                editor.commands.setContent(form.values.ProjectDescription);
            }
        }
    });
    return (
        <Box mx="auto" component="form" onSubmit={handleSubmit}>
            <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        withAsterisk
                        label="Project Title"
                        placeholder="Project Title"
                        {...form.getInputProps('ProjectTitle')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        label="Project url"
                        placeholder="https://example.com"
                        {...form.getInputProps('UrlProject')}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        withAsterisk
                        type="month"
                        label="Start Date"
                        {...form.getInputProps('startDate')}
                        max={new Date().toISOString().slice(0, 7)}
                        placeholder="Start Date"
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        withAsterisk
                        type="month"
                        label="End Date"
                        {...form.getInputProps('endDate')}
                        min={form.values.startDate}
                        placeholder="End Date"
                        disabled={form.values.present || !form.values.startDate}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Checkbox
                        label="Present"
                        className="font-light"
                        {...form.getInputProps('present')}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <MultiSelect
                        label="Skills"
                        placeholder="Select skills"
                        data={skills}
                        {...form.getInputProps('TechnicalSkill')}
                        searchable
                    />
                    {/*<Group wrap="wrap" mt={8} gap={4}>
                        {form?.values?.TechnicalSkill.map((skill: any) => {
                            return (
                                <Group
                                    key={skill}
                                    px={8}
                                    py={4}
                                    style={{
                                        border: '1px solid var(--mantine-color-gray-5)',
                                        borderRadius: 24
                                    }}
                                >
                                    <Text size="sm">
                                        {skillDictionary[skill]}
                                    </Text>
                                    <IconX
                                        size={14}
                                        onClick={() => {
                                            const filtered =
                                                form.values.TechnicalSkill.filter(
                                                    (value) => {
                                                        return value != skill;
                                                    }
                                                );
                                            form.setFieldValue(
                                                'TechnicalSkill',
                                                filtered
                                            );
                                        }}
                                    />
                                </Group>
                            );
                        })}
                    </Group>*/}
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                    <Text size="sm" fw={500} mb={2}>
                        Project Description
                    </Text>
                    <RichTextEditor editor={projectEditor}>
                        <RichTextEditor.Toolbar sticky>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold />
                                <RichTextEditor.BulletList />
                                <RichTextEditor.OrderedList />
                            </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>

                        <RichTextEditor.Content />
                    </RichTextEditor>
                    <Text mt={5}>
                        {projectEditor?.getText().length} /{1000} characters
                    </Text>
                    <Text mt={5} c={'red'}>
                        {form.values.ProjectDescription.length >= 1000 &&
                            "You've reached the maximum number of characters"}
                    </Text>
                    {/*  error message */}
                    <Text size="sm" c={'red'} mt={4}>
                        {form.errors.ProjectDescription &&
                            form.errors.ProjectDescription}
                    </Text>
                </Grid.Col>
            </Grid>
            <Grid.Col span={12}>
                {isError && (
                    <Alert
                        title="Error"
                        color="red"
                        mt={10}
                        onClose={() => setMessage('')}
                    >
                        {message}
                    </Alert>
                )}
            </Grid.Col>
            <Grid.Col span={12}>
                <Group gap={24} mt={24} justify="flex-end">
                    <Button
                        variant="default"
                        disabled={isLoading}
                        onClick={close}
                    >
                        Cancel
                    </Button>
                    <Button
                        justify="space-between"
                        type="submit"
                        loading={isLoading}
                    >
                        Submit
                    </Button>
                </Group>
            </Grid.Col>
        </Box>
    );
}
