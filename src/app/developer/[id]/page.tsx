'use client';

import {
    Box,
    Button,
    Center,
    Grid,
    Group,
    Modal,
    Notification,
    Skeleton,
    Stack,
    Text
} from '@mantine/core';

import BasicInfo, { ViewBasicInfo } from '@/components/developer/BasicInfo';
import { ProfileCenter } from '@/components/developer/ProfileCenter';
import ProfileProgress from '@/components/developer/Progress/ProfileProgress';
import Review from '@/components/developer/FeedBack';
import classes from '@/components/styles/DeveloperProfile.module.css';
import SuccessNotification from '@/components/common/success_notification';

import { useAppSelector } from '@/lib/redux/hooks';
import { useDeveloper } from '@/Providers/DeveloperContext';
import { IconExclamationCircle, IconPlayerPlay } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    useGetDeveloperByIdQuery,
    useGetProgressBarQuery
} from '@/lib/redux/api/developer/developer';
import { IoWarning } from 'react-icons/io5';
import Custom404 from '@/app/not-found';

export default function Profile({ params }: { params: { id: string } }) {
    const { data, isLoading, isError, error } = useGetDeveloperByIdQuery(
        params.id
    );
    const loginState = useAppSelector((state: any) => state.login);
    const urlParams = useSearchParams();
    const [openReview, setOpenReview] = useState(false);
    const view = urlParams.get('view');
    const [success, setSuccess] = useState(false);
    const { data: progress, isLoading: isProgressLoading } =
        useGetProgressBarQuery({});
    const [showSkeleton, setShowSkeleton] = useState(false);
    // use the developer context
    const {
        setDeveloper,
        setIsOwner,
        isOwner,
        developer,
        setIsLoading,
        setIsError,
        setError,
        isLoading: devIsLoading,
        isError: devIsError,
        error: devError,
        isView,
        setIsView
    } = useDeveloper();

    //useEffect(() => {
    setDeveloper(data);
    setIsOwner(loginState?.id == developer?.user.id);
    setIsView(view ? true : false);
    setIsLoading(isLoading);
    setIsError(isError);
    setError(devError);
    //}, []);

    useEffect(() => {
        if (
            loginState?.id == developer?.user.id ||
            isOwner ||
            isView ||
            view === 'view'
        ) {
            setShowSkeleton(false);
        } else {
            setShowSkeleton(true);
        }
    }, [loginState, developer, isOwner, isView, view]);

    if (isLoading) {
        return (
            <Grid py={40} pos={'relative'} justify="center">
                <Grid.Col
                    span={{ xs: 12, md: 3 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Skeleton h={'450px'} w={'350px'} />
                </Grid.Col>
                <Grid.Col
                    span={{ xs: 12, md: 6 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Stack w={'100%'}>
                        <Skeleton h={'100px'} w={'100%'} />
                        <Skeleton h={'200px'} w={'100%'} />
                        <Skeleton h={'200px'} w={'100%'} />
                        <Skeleton h={'200px'} w={'100%'} />
                        <Skeleton h={'200px'} w={'100%'} />
                        <Skeleton h={'200px'} w={'100%'} />
                    </Stack>
                </Grid.Col>
                {showSkeleton && (
                    <Grid.Col
                        span={{ xs: 12, md: 3 }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Skeleton h={'450px'} w={'350px'} />
                    </Grid.Col>
                )}
            </Grid>
        );
    } else if (
        !developer?.user ||
        isError ||
        (developer?.user?.isAccountVerified === false && !isOwner)
    ) {
        return (
            <Box
                h={'100%'}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}
            >
                <Custom404 />
            </Box>
        );
    }

    // if (isLoading) {
    //     return (
    //         <Grid py={40} pos={'relative'} justify="center">
    //             <Grid.Col
    //                 span={{ xs: 12, md: 3 }}
    //                 style={{
    //                     display: 'flex',
    //                     justifyContent: 'center'
    //                 }}
    //             >
    //                 <Skeleton h={'450px'} w={'350px'} />
    //             </Grid.Col>
    //             <Grid.Col
    //                 span={{ xs: 12, md: 6 }}
    //                 style={{
    //                     display: 'flex',
    //                     justifyContent: 'center'
    //                 }}
    //             >
    //                 <Stack w={'100%'}>
    //                     <Skeleton h={'100px'} w={'100%'} />
    //                     <Skeleton h={'200px'} w={'100%'} />
    //                     <Skeleton h={'200px'} w={'100%'} />
    //                     <Skeleton h={'200px'} w={'100%'} />
    //                     <Skeleton h={'200px'} w={'100%'} />
    //                     <Skeleton h={'200px'} w={'100%'} />
    //                 </Stack>
    //             </Grid.Col>
    //             <Grid.Col
    //                 span={{ xs: 12, md: 3 }}
    //                 style={{
    //                     display: 'flex',
    //                     justifyContent: 'center'
    //                 }}
    //             >
    //                 <Skeleton h={'450px'} w={'350px'} />
    //             </Grid.Col>
    //         </Grid>
    //     );
    // }
    return (
        <Grid
            py={40}
            pos={'relative'}
            style={{
                scrollBehavior: 'smooth' //transition: 'all ease 0.5s'
            }}
            //bg={'red'}
            justify="center"
        >
            <Box
                onClick={() => {
                    setOpenReview((data) => !data);
                }}
                style={{
                    position: 'fixed',
                    top: 300,
                    right: -40,
                    zIndex: 10000,
                    height: 'fit-content',
                    letterSpacing: '2px',
                    border: '.5px solid rgb(229 231 235)',
                    transform: 'rotate(-90deg)',
                    background: 'white',
                    cursor: 'pointer',
                    borderRadius: '4px 0 0 4px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                bg="red"
                className="px-3 bg-white-400   py-3 border-gray-200  "
            >
                <Text>Feedback</Text>
            </Box>
            {success && (
                <SuccessNotification
                    title={'Review Submitted Successfully!'}
                    description={
                        'Thank you, Your review has been successfully submitted.'
                    }
                    onClose={() => setSuccess(false)}
                />
            )}
            <Grid.Col
                span={{ xs: 12, md: 3 }}
                style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Stack
                    className={classes.basic_info}
                    //w={'100%'}
                    justify="center"
                >
                    {isOwner && !isView && <BasicInfo />}
                    {(isView || !isOwner) && <ViewBasicInfo />}
                    {!isView && isOwner && (
                        <Link
                            href={`./${developer?.id}?view=true`}
                            target="_blank"
                        >
                            <Button
                                size="md"
                                bg={'white'}
                                c={'dark'}
                                style={{
                                    fontWeight: 400,
                                    borderLeft:
                                        '2px solid var(--mantine-primary-color-filled)',
                                    fontSize: 'var(--mantine-font-size-md)'
                                }}
                                rightSection={
                                    <IconPlayerPlay color=" var(--mantine-primary-color-filled)" />
                                }
                            >
                                Preview
                            </Button>
                        </Link>
                    )}
                    <Modal
                        opened={openReview}
                        title="Feedback"
                        size="lg"
                        style={{
                            position: 'relative',
                            zIndex: 10001
                        }}
                        onClose={() => setOpenReview(false)}
                    >
                        <Review
                            setSuccess={setSuccess}
                            setOpenReview={setOpenReview}
                        />
                    </Modal>
                </Stack>
            </Grid.Col>
            <Grid.Col span={{ sm: 12, md: 6 }}>
                {!isView &&
                    isOwner &&
                    !isProgressLoading &&
                    progress?.Progress < 100 && (
                        <Notification
                            mb={10}
                            icon={<IoWarning />}
                            withCloseButton={false}
                            color="yellow"
                            title="Profile incomplete!"
                        >
                            <Text>
                                Your profile is incomplete, kindly complete your
                                profile to get listed for opportunities.
                            </Text>
                        </Notification>
                    )}
                <ProfileCenter />
            </Grid.Col>
            {isOwner && !isView && (
                <Grid.Col
                    span={{ xs: 12, sm: 6, md: 3 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                    visibleFrom="md"
                    pos={'relative'}
                >
                    <Group pos={'fixed'} justify="center" px={0}>
                        <ProfileProgress />
                    </Group>
                </Grid.Col>
            )}
        </Grid>
    );
}
