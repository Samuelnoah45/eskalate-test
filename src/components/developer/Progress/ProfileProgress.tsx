import { Card, Divider, Group, Progress, Stack, Text } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';
import { IconCircleCheck } from '@tabler/icons-react';
import React from 'react';
import styles from './ProfileProgress.module.css';
import { useRouter } from 'next/navigation';
import { useGetProgressBarQuery } from '@/lib/redux/api/developer/developer';
import { useModals } from '@/Providers/ModalContext';

export default function ProfileProgress() {
    const router = useRouter();
    const { data: progress, isLoading } = useGetProgressBarQuery({});
    const {
        openOverviewModal,
        openBasicInfoModal,
        openProfileModal,
        openResumeModal,
        openIntroVideoModal,
        openSkillsModal,
        openEducationModal,
        openExperienceModal,
        openProjectsModal
    } = useModals();

    const profileCompleted: any = [
        {
            title: 'Profile picture',
            completed: progress?.ProfileStatus?.basicInfo.profilePictureUrl,
            openModal: openProfileModal
        },
        {
            title: 'Basic Info',
            completed: progress?.ProfileStatus?.basicInfo
                ? Object.keys(progress?.ProfileStatus?.basicInfo).every(
                      (key: string) =>
                          progress?.ProfileStatus?.basicInfo[`${key}`] > 0
                  )
                : false,
            openModal: openBasicInfoModal
        },
        {
            title: 'Resume',
            completed: progress?.ProfileStatus?.resumeUrl,
            openModal: openResumeModal
        },
        {
            title: 'Overview',
            completed: progress?.ProfileStatus?.profileOverview,
            openModal: openOverviewModal
        },
        {
            title: 'Intro Video',
            completed: progress?.ProfileStatus?.introVideoUrl,
            openModal: openIntroVideoModal
        },
        {
            title: 'Experience',
            completed: progress?.ProfileStatus?.experiences,
            openModal: openExperienceModal
        },
        {
            title: 'Education',
            completed: progress?.ProfileStatus?.educations,
            openModal: openEducationModal
        },
        {
            title: 'Projects',
            completed: progress?.ProfileStatus?.projects,
            openModal: openProjectsModal
        },
        {
            title: 'Skills',
            completed: progress?.ProfileStatus?.skills,
            openModal: openSkillsModal
        }
    ];

    return (
        <Card
            radius="md"
            style={{
                width: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: 'fit-content',
                gap: 2
            }}
            px={'xl'}
        >
            {/*<Card.Section py="xs" style={{ width: '100%' }} mb={4}>*/}
            <Text size="lg" c={'gray.6'} mb={10}>
                Profile Progress
            </Text>
            {/*</Card.Section>*/}
            <Stack>
                <Stack gap={'2px'}>
                    <Text
                        w={'100%'}
                        size="xs"
                        c="gray.6"
                        style={{
                            width: '200px',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text>Complete profile</Text>
                        <Text fw={500}>{progress?.Progress}%</Text>
                    </Text>
                    <Progress value={progress?.Progress} />
                </Stack>
                {profileCompleted.map((item: any, index: number) => (
                    <Stack
                        key={index}
                        gap={'2px'}
                        //onClick={() => router.push(`#${item.href}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Group
                            w={'100%'}
                            //c={item.completed ? 'gray.8' : 'gray.4'}
                            justify="space-between"
                            onClick={item.openModal}
                        >
                            <Text
                                className={
                                    item.completed
                                        ? styles.completed
                                        : styles.incomplete
                                }
                            >
                                {item.title}{' '}
                            </Text>
                            {item.completed ? (
                                <IconCircleCheck
                                    style={{
                                        color: 'var(--mantine-color-green-6)'
                                    }}
                                />
                            ) : (
                                <IconHelp
                                    style={{
                                        color: 'var(--mantine-color-gray-5)'
                                    }}
                                />
                            )}
                        </Group>
                        {index < profileCompleted.length - 1 && (
                            <Divider size="xs" />
                        )}
                        {/*<Progress value={item.completed ? 100 : 0} />*/}
                    </Stack>
                ))}
            </Stack>
        </Card>
    );
}
