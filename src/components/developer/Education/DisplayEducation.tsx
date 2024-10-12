import { ActionIcon, Grid, Menu, Modal, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
    IconCalendarMonth,
    IconDotsVertical,
    IconPencil,
    IconTrash
} from '@tabler/icons-react';

import { useDeveloper } from '@/Providers/DeveloperContext';
import dayjs from 'dayjs';
import DeleteModal from '../DeleteModal/DeleteModal';
import EditEducationForm from './EditEducationForm';
import { useDeleteEducationMutation } from '@/lib/redux/api/developer/education';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
const DisplayEducation = ({ education }: { education: any }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [timeRange, setTimeRange] = React.useState<string>('');
    // state to control the delete modal
    const [
        deleteModalOpened,
        { open: openDeleteModal, close: closeDeleteModal }
    ] = useDisclosure(false);

    const [deleteEducation, { isLoading: isDeleting }] =
        useDeleteEducationMutation();

    const handleDelete = () => {
        let id = education.id ? education.id : '';

        deleteEducation(id)
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

    const formattedStartDate = dayjs(education.startDate).format('MMMM YYYY');
    const formattedEndDate = dayjs(education.endDate).format('MMMM YYYY');

    useEffect(() => {
        const calculateTimeRange = () => {
            const startDate = dayjs(education.startDate);
            const endDate = education.isEndDatePresent
                ? dayjs()
                : dayjs(education.endDate);
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
    }, [education]);

    const { isOwner, isView } = useDeveloper();

    return (
        <>
            <Grid pl={8} w={'100%'} gutter={'5px'}>
                <Grid.Col
                    span={'auto'}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Text fw={500}>
                        {education.institutionName
                            ? education.institutionName
                            : ''}
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
                            alignItems: 'center',
                            gap: 5
                        }}
                    >
                        {' '}
                        <IconCalendarMonth
                            color="var(--mantine-color-gray-7)"
                            size={16}
                        />
                        <Text>
                            {formattedStartDate} -{' '}
                            {education.isEndDatePresent
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
                            {education.isEndDatePresent
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
                        <Text size="md" c="gray.7">
                            {education.degree ? education.degree : ''}
                        </Text>
                    </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12 }}>
                    <Text
                        size="md"
                        c="gray.7"
                        dangerouslySetInnerHTML={{
                            __html: education.description
                                ? education.description
                                : ''
                        }}
                    />
                </Grid.Col>
            </Grid>

            <Modal
                size={'xl'}
                opened={opened}
                onClose={close}
                title="Edit Education"
                centered
            >
                <EditEducationForm education={education} close={close} />
            </Modal>
            <DeleteModal
                opened={deleteModalOpened}
                close={closeDeleteModal}
                onDelete={handleDelete}
                isLoading={isDeleting}
                title="Delete Education"
                message="Are you sure you want to delete this education?"
            />
        </>
    );
};

export default DisplayEducation;
