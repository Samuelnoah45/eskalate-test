import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Group,
    TextInput,
    Checkbox,
    Textarea,
    MultiSelect,
    Center,
    Container,
    Modal,
    Card,
    Text,
    Autocomplete,
    Select,
    Flex
} from '@mantine/core';
import { isNotEmpty, matches, useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import ExperienceTimeline from './ExperienceTimeline';
import CardWrapper from '../ProfileCenter/CardWrapper';
import styles from './AddEducation.module.css';
import { PiPlusCircleBold } from 'react-icons/pi';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { useAppSelector } from '@/lib/redux/hooks';

import { useDeveloper } from '@/Providers/DeveloperContext';
import Placeholder from '@tiptap/extension-placeholder';
import {
    useCreateExperienceMutation,
    useGetExperienceByDeveloperIdQuery
} from '@/lib/redux/api/developer/experience';
import { useGetAllSkillsQuery } from '@/lib/redux/api/developer/skill';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
import { validateURL } from '@/utils/validators';
import { useModals } from '@/Providers/ModalContext';

const AddExperienceStep = () => {
    const [companyDescriptionEditor, setCompanyDescriptionEditor] =
        React.useState('');
    const [projectResponsibilitiesEditor, setProjectResponsibilitiesEditor] =
        React.useState('');

    // const [opened, { open, close }] = useDisclosure(false);
    const { isExperienceModalOpen, openExperienceModal, closeExperienceModal } =
        useModals();
    const { developer, isLoading, isError, error } = useDeveloper();
    const loginState: any = useAppSelector((state: any) => state?.login);
    const {
        data: experiencesData,
        isLoading: isExperienceLoading,
        error: experienceError
    } = useGetExperienceByDeveloperIdQuery(developer?.id ? developer.id : '');

    const [
        addExperience,
        { isLoading: isAddingExperience, isSuccess: isAdded }
    ] = useCreateExperienceMutation();

    const { data: skillList, isLoading: isLoadingSkills } =
        useGetAllSkillsQuery();

    const skills = skillList?.reduce((acc: any, skill: any) => {
        const existingSkill = acc.find((s: any) => s.label === skill.name);

        if (!existingSkill) {
            acc.push({ label: skill.name, value: skill.id });
        }

        return acc;
    }, []);

    // useEffect(() => {
    //     if (isAdded) {
    //         close();
    //         form.reset();
    //     }
    // }, [isAdded]);

    const companyEditor = useEditor({
        extensions: [
            StarterKit,
            Link,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            Placeholder.configure({ placeholder: 'Company Description' })
        ],
        content: companyDescriptionEditor,
        onUpdate: ({ editor }: { editor: any }) => {
            //setCompanyDescriptionEditor(editor.getHTML());
            if (editor.getHTML().length <= 1000) {
                setCompanyDescriptionEditor(editor.getHTML());
            } else {
                editor.commands.setContent(companyDescriptionEditor);
            }
        }
    });

    const projectEditor = useEditor({
        extensions: [
            StarterKit,
            Link,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            Placeholder.configure({
                placeholder: 'Write you experience description'
            })
        ],
        content: projectResponsibilitiesEditor,
        onUpdate: ({ editor }: { editor: any }) => {
            if (editor.getHTML().length <= 1000) {
                setProjectResponsibilitiesEditor(editor.getHTML());
            } else {
                editor.commands.setContent(projectResponsibilitiesEditor);
            }
        }
    });

    const form = useForm({
        initialValues: {
            designation: '',
            collageName: '',
            companyWebsite: '',
            present: false,
            favoriteLibraries: [],
            country: '',
            city: '',
            startDate: '',
            endDate: ''
        },

        validate: {
            designation: isNotEmpty('This field is required'),
            collageName: isNotEmpty('This field is required'),
            //favoriteLibraries: isNotEmpty('This field is required'),
            companyWebsite: (value) => {
                if (value !== '') {
                    return validateURL(value);
                }
                return null;
            },
            startDate: isNotEmpty('This field is required'),
            endDate: (value) => {
                if (!form.values.present) {
                    if (value === '') {
                        return 'This field is required';
                    }
                }
            }
        }
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const error = form.validate() as any;
        if (error.hasErrors) {
            return;
        }

        const present = new Date().toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });

        const newExperience = {
            title: form.values.designation,
            company: form.values.collageName,
            description: projectResponsibilitiesEditor,
            companyWebsiteUrl: form.values.companyWebsite,
            companyDescription: companyDescriptionEditor,
            startDate: form.values.startDate,
            endDate: form.values.present ? present : form.values.endDate,
            isEndDatePresent: form.values.present,
            skills: form.values.favoriteLibraries
                ? form.values.favoriteLibraries.map((skill: string) => {
                      const selectedSkill = skills.find(
                          (s: any) => s.label === skill
                      );
                      return selectedSkill ? selectedSkill.value : null;
                  })
                : null,
            // userId: loginState?.id ? loginState.id : '',
            country: form.values.country,
            city: form.values.city
        };

        addExperience(newExperience)
            .unwrap()
            .then((data) => {
                projectEditor?.commands.setContent('');
                companyEditor?.commands.setContent('');
                setProjectResponsibilitiesEditor('');
                setCompanyDescriptionEditor('');
                form.reset();
                closeExperienceModal();
                toast.success('Experience added successfully');
            })
            .catch((error) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    const headerProps = {
        title: 'Experience',
        add: true,
        onAdd: openExperienceModal
    };

    return (
        <CardWrapper
            headerProps={headerProps}
            noData={!experiencesData?.length}
        >
            <ExperienceTimeline
                experiences={experiencesData ? experiencesData : []}
            />

            <Modal
                size={'xl'}
                opened={isExperienceModalOpen}
                onClose={() => {
                    closeExperienceModal();
                    form.reset();
                }}
                title="Add Experience"
                centered
            >
                <Box
                    maw={900}
                    mx="auto"
                    component="form"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <Grid maw={900} mx="auto" gutter={'lg'}>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                withAsterisk
                                label="Company name"
                                placeholder="A2SV"
                                {...form.getInputProps('collageName')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                label="Company website"
                                placeholder="http://example.com"
                                {...form.getInputProps('companyWebsite')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12 }}>
                            <h3
                                style={{
                                    marginBottom: '2px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Company description
                            </h3>

                            <RichTextEditor editor={companyEditor}>
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
                                {companyEditor?.getText().length} /{1000}{' '}
                                characters
                            </Text>
                            <Text mt={5} c={'red'}>
                                {companyDescriptionEditor.length >= 1000 &&
                                    "You've reached the maximum number of characters"}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                withAsterisk
                                label="Designation"
                                placeholder="Full Stack Developer"
                                {...form.getInputProps('designation')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <MultiSelect
                                label="Skills"
                                searchable
                                placeholder="Select skills"
                                data={
                                    skills
                                        ? skills.map(
                                              (skill: any) => skill.label
                                          )
                                        : []
                                }
                                clearable
                                {...form.getInputProps('favoriteLibraries')}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Select
                                label="Country"
                                placeholder="Ethiopia"
                                data={[
                                    'Algeria',
                                    'Angola',
                                    'Benin',
                                    'Botswana',
                                    'Burkina Faso',
                                    'Burundi',
                                    'Cabo Verde',
                                    'Cameroon',
                                    'Central African Republic',
                                    'Chad',
                                    'Comoros',
                                    'Democratic Republic of the Congo',
                                    'Republic of the Congo',
                                    'Djibouti',
                                    'Egypt',
                                    'Equatorial Guinea',
                                    'Eritrea',
                                    'Eswatini',
                                    'Ethiopia',
                                    'Gabon',
                                    'Gambia',
                                    'Ghana',
                                    'Guinea',
                                    'Guinea-Bissau',
                                    'Ivory Coast',
                                    'Kenya',
                                    'Lesotho',
                                    'Liberia',
                                    'Libya',
                                    'Madagascar',
                                    'Malawi',
                                    'Mali',
                                    'Mauritania',
                                    'Mauritius',
                                    'Morocco',
                                    'Mozambique',
                                    'Namibia',
                                    'Niger',
                                    'Nigeria',
                                    'Rwanda',
                                    'Sao Tome and Principe',
                                    'Senegal',
                                    'Seychelles',
                                    'Sierra Leone',
                                    'Somalia',
                                    'South Africa',
                                    'South Sudan',
                                    'Sudan',
                                    'Tanzania',
                                    'Togo',
                                    'Tunisia',
                                    'Turkey',
                                    'Uganda',
                                    'Zambia',
                                    'Zimbabwe'
                                ]}
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
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                type="month"
                                label={'Start date'}
                                {...form.getInputProps('startDate')}
                                max={new Date().toISOString().slice(0, 7)}
                                withAsterisk
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <TextInput
                                type="month"
                                label="End date"
                                disabled={
                                    form.values.present ||
                                    !form.values.startDate
                                }
                                {...form.getInputProps('endDate')}
                                min={form.values.startDate}
                                withAsterisk
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
                        <Grid.Col span={{ base: 12 }}>
                            <h3
                                style={{
                                    marginBottom: '2px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Project description
                            </h3>

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
                                {projectResponsibilitiesEditor.length} /{1000}{' '}
                                characters
                            </Text>
                            <Text mt={5} c={'red'}>
                                {projectResponsibilitiesEditor.length >= 1000 &&
                                    "You've reached the maximum number of characters"}
                            </Text>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Flex gap={24} mt={24} justify={'flex-end'}>
                                <Button
                                    disabled={isAddingExperience}
                                    variant="default"
                                    onClick={closeExperienceModal}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={isAddingExperience}
                                >
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

export default AddExperienceStep;
