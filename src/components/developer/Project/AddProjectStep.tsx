import React from 'react';
import { Modal, Stack, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import CardWrapper from '../ProfileCenter/CardWrapper';
import { ProfileSectionHeaderProps } from '../ProfileCenter/ProfileSectionsHeader';
import DisplayProject from './ProjectDisplay';
import { useAppSelector } from '@/lib/redux/hooks';
import AddProjectForm from './AddProjectForm';
import { useDeveloper } from '@/Providers/DeveloperContext';
import { useGetProjectsByDeveloperIdQuery } from '@/lib/redux/api/developer/project';
import { useModals } from '@/Providers/ModalContext';

const AddProjectStep = () => {
    // const [opened, { open, close }] = useDisclosure(false);
    const { isProjectsModalOpen, openProjectsModal, closeProjectsModal } =
        useModals();
    const { developer, isLoading, isError, error } = useDeveloper();
    const loginState = useAppSelector((state: any) => state.login);

    const { data: projectData, isLoading: isProjectLoading } =
        useGetProjectsByDeveloperIdQuery(developer?.id ? developer.id : '');

    const headerProps: ProfileSectionHeaderProps = {
        title: 'Project',
        add: true,
        onAdd: openProjectsModal,
        onEdit: openProjectsModal
    };

    return (
        <CardWrapper
            headerProps={headerProps}
            noData={projectData?.length == 0}
        >
            <Stack>
                {projectData?.map((project: any, index: number) => (
                    <Stack key={index}>
                        <DisplayProject project={project} />
                        {index < projectData.length - 1 && <Divider />}
                    </Stack>
                ))}
            </Stack>

            <Modal
                size={'lg'}
                opened={isProjectsModalOpen}
                onClose={closeProjectsModal}
                title="Project"
                centered
            >
                <AddProjectForm close={closeProjectsModal} />
            </Modal>
        </CardWrapper>
    );
};

export default AddProjectStep;
