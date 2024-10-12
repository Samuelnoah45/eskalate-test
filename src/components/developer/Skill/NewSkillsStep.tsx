import { DeveloperSkill, Skill } from '@/types';
import {
    Badge,
    Box,
    Divider,
    Flex,
    Grid,
    Group,
    Modal,
    Stack,
    Text,
    em
} from '@mantine/core';
import classes from './skill.module.css';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { SkillForm } from './SkillForm';
import { SingleSkill } from './SingleSkill';
import CardWrapper from '../ProfileCenter/CardWrapper';
import { useState } from 'react';

import { useDeveloper } from '@/Providers/DeveloperContext';
import { ProfileSectionHeaderProps } from '../ProfileCenter/ProfileSectionsHeader';
import { NewSkillForm } from './NewSkillForm';
import { EditSkill } from './EditSkill';
import {
    useDeleteSkillMutation,
    useGetSkillsQuery
} from '@/lib/redux/api/developer/skill';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
import { useModals } from '@/Providers/ModalContext';

export default function NewSkillsStep() {
    // const [opened, { open, close }] = useDisclosure(false);
    const { isSkillsModalOpen, openSkillsModal, closeSkillsModal } =
        useModals();
    const [singleFormOpened, { open: openSingleForm, close: closeSingleForm }] =
        useDisclosure(false);
    const isMobile = useMediaQuery(`(max-width: ${em(500)})`);

    const {
        developer,
        isLoading: devIsLoading,
        isError: devIsError,
        error: devError,
        isView,
        isOwner
    } = useDeveloper();

    const { data: skills, isLoading } = useGetSkillsQuery(
        developer?.user.id || ''
    );

    const headerProps: ProfileSectionHeaderProps = {
        title: 'Skills',
        add: isMobile || skills?.length === 0,
        edit: !isMobile && skills?.length > 0,
        onAdd: isMobile ? openSingleForm : openSkillsModal,
        onEdit: openSkillsModal
    };

    // advanced skills
    const advancedSkills: DeveloperSkill[] = skills?.filter(
        (s: any) => s?.competencyLevel === 2
    );
    // intermediate skills
    const intermediateSkills: DeveloperSkill[] = skills?.filter(
        (s: any) => s?.competencyLevel === 1
    );
    // beginner skills
    const beginnerSkills: DeveloperSkill[] = skills?.filter(
        (s: any) => s?.competencyLevel === 0
    );

    const displayableSkills = [];
    if (advancedSkills?.length > 0) {
        displayableSkills.push(advancedSkills);
    }
    if (intermediateSkills?.length > 0) {
        displayableSkills.push(intermediateSkills);
    }
    if (beginnerSkills?.length > 0) {
        displayableSkills.push(beginnerSkills);
    }

    return (
        <CardWrapper headerProps={headerProps} noData={!skills?.length}>
            <Grid>
                {displayableSkills.map(
                    (skills: DeveloperSkill[], index: number) => (
                        <>
                            <Grid.Col span={'auto'} key={index}>
                                <DisplaySkills
                                    skills={skills}
                                    category={
                                        skills[0]?.competencyLevel === 2
                                            ? 'Advanced'
                                            : skills[0]?.competencyLevel === 1
                                              ? 'Intermediate'
                                              : 'Beginner'
                                    }
                                />
                            </Grid.Col>
                            {index < displayableSkills.length - 1 && (
                                <Grid.Col span={0.5}>
                                    <Group
                                        h={'100%'}
                                        w={'0.8px'}
                                        bg={'gray.3'}
                                        mx={'auto'}
                                    />
                                </Grid.Col>
                            )}
                        </>
                    )
                )}
            </Grid>
            <Modal
                opened={isSkillsModalOpen}
                onClose={closeSkillsModal}
                title="Add Skill"
                centered
                size={'xl'}
            >
                <NewSkillForm close={closeSkillsModal} skills={skills} />
            </Modal>
            <Modal
                opened={singleFormOpened}
                onClose={closeSingleForm}
                title="Add Skill"
                centered
                size={'md'}
            >
                <SkillForm close={closeSingleForm} />
            </Modal>
        </CardWrapper>
    );
}

const DisplaySkills = ({
    skills,
    category
}: {
    skills: DeveloperSkill[];
    category: string;
}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [skill, setSkill] = useState<DeveloperSkill>({} as DeveloperSkill);
    const [deleteSkill, { isLoading: isLoadingDelete }] =
        useDeleteSkillMutation();
    const { isView, isOwner } = useDeveloper();

    const handleDelete = () => {
        deleteSkill(skill?.skillId || '')
            .unwrap()
            .then((res: any) => {
                close();
            })
            .catch((err: any) => {
                const errorMessage = handleError(err);
                if (errorMessage) {
                    toast.error(errorMessage);
                }
            });
    };

    return (
        <>
            <Text
                size="md"
                fw={500}
                c={'gray.8'}
                style={{ textTransform: 'capitalize' }}
            >
                {category}
            </Text>

            <Flex wrap={'wrap'} mt={'md'} gap={8}>
                {skills.map((skill: DeveloperSkill) => (
                    <div
                        key={skill.skill.id}
                        className={classes.chip}
                        onClick={() => {
                            if (isOwner && !isView) {
                                setSkill(skill);
                                open();
                            }
                        }}
                    >
                        <div className="close-btn">
                            {' '}
                            {skill.skill.name} | {skill.yearsOfExperience}{' '}
                            {`Year${skill.yearsOfExperience > 1 ? 's' : ''}`}
                        </div>
                    </div>
                ))}
            </Flex>
            <Modal
                opened={opened}
                onClose={close}
                title="Edit Skill"
                centered
                size={'md'}
            >
                <EditSkill
                    close={close}
                    skill={skill}
                    handleDelete={handleDelete}
                />
            </Modal>
        </>
    );
};
