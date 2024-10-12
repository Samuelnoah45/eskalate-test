import { ActionIcon, Badge, Grid, Menu, Modal, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import EditProjectForm from './EditProjectForm';
import { useDeveloper } from '@/Providers/DeveloperContext';
import { IconCalendarMonth } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { IconDotsVertical } from '@tabler/icons-react';
import classes from './project.module.css';
import DeleteModal from '../DeleteModal/DeleteModal';
import { useDeleteProjectMutation } from '@/lib/redux/api/developer/project';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
const DisplayProject = ({ project }: { project: any }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [timeRange, setTimeRange] = React.useState<string>('');
    const [deleteProject, { isLoading, isError }] = useDeleteProjectMutation();
    const { isOwner, isView } = useDeveloper();

    // state to control the delete modal
    const [
        deleteModalOpened,
        { open: openDeleteModal, close: closeDeleteModal }
    ] = useDisclosure(false);

    const handleDelete = () => {
        // delete project
        deleteProject(project.id)
            .unwrap()
            .then((response: any) => {
                toast.success('Project deleted successfully');
                closeDeleteModal();
            })
            .catch((error: any) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    const formattedStartDate = dayjs(project.startDate).format('MMM YYYY');
    const formattedEndDate = dayjs(project.endDate).format('MMM YYYY');

    useEffect(() => {
        const calculateTimeRange = () => {
            const startDate = dayjs(project.startDate);
            const endDate = project.isEndDatePresent
                ? dayjs()
                : dayjs(project.endDate);
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
    }, [project]);

    return (
        <>
            <Grid align="center">
                <Grid.Col
                    span={'auto'}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                    pl={0}
                >
                    <Text fw={500} size="lg">
                        {/* if there is project link */}
                        {project?.link ? (
                            <Link
                                href={project?.link}
                                target="_blank"
                                className={classes.project_title}
                            >
                                {project.title}
                            </Link>
                        ) : (
                            <Text className={classes.project_title}>
                                {project.title}
                            </Text>
                        )}
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
                            {project.isEndDatePresent
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
                        {/*<MdDeleteOutline size={25} />*/}
                    </Grid.Col>
                )}
                <Grid.Col span={12} hiddenFrom="sm" pl={0}>
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
                            {project.isEndDatePresent
                                ? 'Present'
                                : formattedEndDate}{' '}
                        </Text>
                    </Text>
                </Grid.Col>

                <Grid.Col span={12} pl={0}>
                    <Text
                        size="md"
                        c="gray.7"
                        dangerouslySetInnerHTML={{
                            __html: project?.description
                        }}
                    ></Text>
                </Grid.Col>
                <Grid.Col
                    span={12}
                    style={{
                        display: 'flex',
                        gap: 10,
                        flexWrap: 'wrap'
                    }}
                >
                    {project?.skills.map((library: any, index: number) => {
                        //const icon = skillIcons[library];
                        return (
                            <div key={index} className={classes.chip}>
                                <div className="close-btn">{library.name}</div>
                            </div>
                        );
                    })}
                </Grid.Col>
            </Grid>
            {/*  form */}
            <Modal
                size={'lg'}
                opened={opened}
                onClose={close}
                title="Edit Project"
                centered
            >
                <EditProjectForm project={project} close={close} />
            </Modal>
            <DeleteModal
                opened={deleteModalOpened}
                close={closeDeleteModal}
                onDelete={handleDelete}
                isLoading={isLoading}
                title="Delete Project"
                message="Are you sure you want to delete this project?"
            />
        </>
    );
};

export default DisplayProject;
