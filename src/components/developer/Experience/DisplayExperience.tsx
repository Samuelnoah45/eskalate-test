import {
    ActionIcon,
    Autocomplete,
    Badge,
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    Group,
    Menu,
    Modal,
    MultiSelect,
    Select,
    Text,
    TextInput,
    Textarea
} from '@mantine/core';
import { SlCalender } from 'react-icons/sl';
import { FaRegEdit } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { GiGraduateCap } from 'react-icons/gi';
import React, { useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { isNotEmpty, matches, useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { RichTextEditor, Link as MantineLink } from '@mantine/tiptap';
import { useDeveloper } from '@/Providers/DeveloperContext';
import { IconCalendarMonth } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { IconDotsVertical } from '@tabler/icons-react';
import DeleteModal from '../DeleteModal/DeleteModal';
import {
    useDeleteExperienceMutation,
    useUpdateExperienceMutation
} from '@/lib/redux/api/developer/experience';
import { useGetAllSkillsQuery } from '@/lib/redux/api/developer/skill';
import EditExperienceForm from './EditExperienceForm';
import classes from './experience.module.css';
import Link from 'next/link';
import { isAbsoluteUrl } from 'next/dist/shared/lib/utils';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
import { validateURL } from '@/utils/validators';

const DisplayExperience = ({ experience }: { experience: any }) => {
    const [companyDescriptionEditor, setCompanyDescriptionEditor] =
        React.useState(experience?.companyDescription || '');
    const [projectResponsibilitiesEditor, setProjectResponsibilitiesEditor] =
        React.useState(experience?.description || '');
    const [timeRange, setTimeRange] = React.useState<string>('');
    const [opened, { open, close }] = useDisclosure(false);
    const [
        updateExperience,
        { isLoading: isUpdating, isSuccess: isUpdatingSuccess }
    ] = useUpdateExperienceMutation();
    const [deleteExperience, { isLoading: isDeleting }] =
        useDeleteExperienceMutation();
    // state to control the delete modal
    const [
        deleteModalOpened,
        { open: openDeleteModal, close: closeDeleteModal }
    ] = useDisclosure(false);

    const { data: skillList, isLoading: isLoadingSkills } =
        useGetAllSkillsQuery();

    const skills = skillList?.reduce((acc: any, skill: any) => {
        const existingSkill = acc.find((s: any) => s.label === skill.name);

        if (!existingSkill) {
            acc.push({ label: skill.name, value: skill.id });
        }

        return acc;
    }, []);

    const formattedStartDate = dayjs(experience.startDate).format('MMMM YYYY');
    const formattedEndDate = dayjs(experience.endDate).format('MMMM YYYY');
    const form = useForm({
        initialValues: {
            designation: experience?.title,
            collageName: experience?.company,
            companyWebsite: experience?.companyWebsiteUrl,
            present: experience.isEndDatePresent ? true : false,
            favoriteLibraries: experience?.skills.map(
                (skill: any) => skill.name
            ),
            country: experience?.country,
            city: experience?.city,
            startDate: dayjs(experience.startDate).format('YYYY-MM'),
            endDate: dayjs(experience.endDate).format('YYYY-MM')
        },

        validate: {
            designation: isNotEmpty('This field is required'),
            collageName: isNotEmpty('This field is required'),
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

    //

    const companyEditor = useEditor({
        extensions: [
            StarterKit,
            MantineLink,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color
        ],
        content: companyDescriptionEditor || '',
        onUpdate: ({ editor }: { editor: any }) => {
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
            MantineLink,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color
        ],
        content: projectResponsibilitiesEditor || '',
        onUpdate: ({ editor }: { editor: any }) => {
            if (editor.getHTML().length <= 1000) {
                setProjectResponsibilitiesEditor(editor.getHTML());
            } else {
                editor.commands.setContent(projectResponsibilitiesEditor);
            }
        }
    });

    const handleSubmit = (e: any) => {
        const error = form.validate() as any;
        if (error.hasErrors) {
            return;
        }

        const present = new Date().toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });

        const newExperience = {
            id: experience.id,
            title: form.values.designation,
            company: form.values.collageName,
            description: projectResponsibilitiesEditor,
            companyWebsiteUrl: form.values.companyWebsite,
            companyDescription: companyDescriptionEditor,
            startDate:
                form.values.startDate.length === 0
                    ? experience.startDate
                    : form.values.startDate,
            endDate: form.values.present
                ? present
                : form.values.endDate.length === 0
                  ? experience.endDate
                  : form.values.endDate,
            isEndDatePresent: form.values.present,
            skills: form.values.favoriteLibraries
                ? form.values.favoriteLibraries.map((skill: string) => {
                      const selectedSkill = skills.find(
                          (s: any) => s.label === skill
                      );
                      return selectedSkill ? selectedSkill.value : null;
                  })
                : null,
            country: form.values.country,
            city: form.values.city
            // userId: experience?.userId
        };

        updateExperience(newExperience)
            .unwrap()
            .then((data: any) => {
                close();
                toast.success('Experience updated successfully');
            })
            .catch((error: any) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    const handleDelete = () => {
        const id = experience.id ? experience.id : '';

        deleteExperience(id)
            .unwrap()
            .then((data: any) => {
                closeDeleteModal();
            })
            .catch((error: any) => {
                const errorMessage = handleError(error);
                if (errorMessage) {
                    toast.error(errorMessage);
                }
            });
    };

    useEffect(() => {
        const calculateTimeRange = () => {
            const startDate = dayjs(experience.startDate);
            const endDate = experience.isEndDatePresent
                ? dayjs()
                : dayjs(experience.endDate);
            const duration = endDate.diff(startDate, 'month');
            const years = Math.floor(duration / 12);
            const months = duration % 12;

            let timeRange = '';
            if (years > 0) {
                timeRange += `${years} ${years === 1 ? 'Year' : 'Years'}`;
            }
            if (months > 0) {
                timeRange += `${timeRange ? ' ' : ''}${months} ${months === 1 ? 'Month' : 'Months'}`;
            }

            setTimeRange(timeRange);
        };

        calculateTimeRange();
    }, [experience]);

    const { isOwner, isView } = useDeveloper();
    return (
        <>
            <Grid pl={16} align="center" pt={0} w={'100%'} gutter={'xs'}>
                <Grid.Col
                    span={'auto'}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                        //background: 'red'
                    }}
                >
                    <Text fw={500}>
                        {experience?.title}
                        <Text
                            style={{
                                display: 'inline'
                            }}
                            ml={12}
                            size="xs"
                            c="gray.6"
                        >
                            {timeRange}
                        </Text>
                    </Text>
                </Grid.Col>
                <Grid.Col
                    visibleFrom="sm"
                    span={4}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                    <Text
                        c="dimmed"
                        size="xs"
                        style={{
                            display: 'flex',
                            gap: 5,
                            alignItems: 'center'
                        }}
                    >
                        {' '}
                        <IconCalendarMonth
                            color="var(--mantine-color-gray-7)"
                            size={16}
                        />
                        <Text>
                            {formattedStartDate} -{' '}
                            {experience.isEndDatePresent
                                ? 'Present'
                                : formattedEndDate}{' '}
                        </Text>
                    </Text>
                </Grid.Col>
                {isOwner && !isView && (
                    <Grid.Col
                        span={1}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                        //bg={'red'}
                        pr={2}
                    >
                        <Menu position="right-start">
                            <Menu.Target>
                                <ActionIcon
                                    variant="subtle"
                                    c={'dimmed'}
                                    p={2}
                                    //onClick={open}
                                >
                                    <IconDotsVertical size={18} />
                                </ActionIcon>
                            </Menu.Target>
                            {/*<MdDeleteOutline size={25} />*/}
                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={<IconPencil size={16} />}
                                    onClick={open}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconTrash size={16} />}
                                    onClick={openDeleteModal}
                                >
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Grid.Col>
                )}
                <Grid.Col span={12} hiddenFrom="sm">
                    <Text
                        c="dimmed"
                        size="xs"
                        style={{
                            display: 'flex',
                            gap: 5,
                            alignItems: 'center'
                        }}
                    >
                        {' '}
                        <IconCalendarMonth
                            color="var(--mantine-color-gray-7)"
                            size={16}
                        />
                        <Text>
                            {formattedStartDate} -{' '}
                            {experience.isEndDatePresent
                                ? 'Present'
                                : formattedEndDate}{' '}
                        </Text>
                    </Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12 }}>
                    <Text
                        style={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                            gap: 5
                        }}
                    >
                        {/* if there is website url */}
                        {experience?.companyWebsiteUrl ? (
                            <Link
                                href={experience?.companyWebsiteUrl}
                                target="_blank"
                                className={classes.experience_link}
                            >
                                <Text size="xs">{experience.company}</Text>
                            </Link>
                        ) : (
                            <Text size="xs">{experience.company}</Text>
                        )}
                    </Text>
                </Grid.Col>
                <Grid.Col
                    span={{ base: 12 }}
                    style={{
                        display: 'flex',
                        gap: 10,
                        flexWrap: 'wrap'
                    }}
                >
                    {experience.skills?.map((library: any, index: number) => {
                        return (
                            <div key={index} className={classes.chip}>
                                <div className="close-btn">{library.name}</div>
                            </div>
                        );
                    })}
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12 }}>
                    <Text
                        size="md"
                        c="gray.7"
                        dangerouslySetInnerHTML={{
                            __html: experience?.description
                                ? experience?.description
                                : ''
                        }}
                    />
                </Grid.Col>
            </Grid>
            <Modal
                size={'xl'}
                opened={opened}
                onClose={close}
                title="Update Experience"
                centered
                radius={8}
                padding={32}
            >
                <EditExperienceForm
                    form={form}
                    handleSubmit={handleSubmit}
                    companyEditor={companyEditor}
                    companyDescriptionEditor={companyDescriptionEditor}
                    projectEditor={projectEditor}
                    projectResponsibilitiesEditor={
                        projectResponsibilitiesEditor
                    }
                    isUpdating={isUpdating}
                    skills={skills}
                    close={close}
                />
            </Modal>
            <DeleteModal
                opened={deleteModalOpened}
                close={closeDeleteModal}
                onDelete={handleDelete}
                isLoading={isDeleting}
                title="Delete Experience"
                message="Are you sure you want to delete this experience?"
            />
        </>
    );
};

export default DisplayExperience;
