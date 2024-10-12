// this is the context file that will be used to store the user Developer data

import { useDisclosure } from '@mantine/hooks';
import { createContext, useContext, useState } from 'react';

export const ModalsContext = createContext<{
    isBasicInfoModalOpen: boolean;
    overModalOpened: boolean;
    isIntroVideoModalOpen: boolean;
    isSkillsModalOpen: boolean;
    isEducationModalOpen: boolean;
    isExperienceModalOpen: boolean;
    isProjectsModalOpen: boolean;
    isResumeModalOpen: boolean;
    isProfileModalOpen: boolean;
    openProfileModal: any;
    closeProfileModal: any;
    openResumeModal: any;
    closeResumeModal: any;
    closeOverviewModal: any;
    openOverviewModal: any;
    closeBasicInfoModal: any;
    openBasicInfoModal: any;
    closeIntroVideoModal: any;
    openIntroVideoModal: any;
    closeSkillsModal: any;
    openSkillsModal: any;
    closeEducationModal: any;
    openEducationModal: any;
    closeExperienceModal: any;
    openExperienceModal: any;
    closeProjectsModal: any;
    openProjectsModal: any;
}>({
    isResumeModalOpen: false,
    isBasicInfoModalOpen: false,
    isProfileModalOpen: false,
    overModalOpened: true,
    isIntroVideoModalOpen: false,
    isSkillsModalOpen: false,
    isEducationModalOpen: false,
    isExperienceModalOpen: false,
    isProjectsModalOpen: false,
    openProfileModal: (value: boolean) => {},
    closeProfileModal: (value: boolean) => {},
    openResumeModal: (value: boolean) => {},
    closeResumeModal: (value: boolean) => {},
    openOverviewModal: (value: boolean) => {},
    closeOverviewModal: (value: boolean) => {},
    openBasicInfoModal: (value: boolean) => {},
    closeBasicInfoModal: (value: boolean) => {},
    openIntroVideoModal: (value: boolean) => {},
    closeIntroVideoModal: (value: boolean) => {},
    openSkillsModal: (value: boolean) => {},
    closeSkillsModal: (value: boolean) => {},
    openEducationModal: (value: boolean) => {},
    closeEducationModal: (value: boolean) => {},
    openExperienceModal: (value: boolean) => {},
    closeExperienceModal: (value: boolean) => {},
    openProjectsModal: (value: boolean) => {},
    closeProjectsModal: (value: boolean) => {}
});

export const useModals = () => {
    const context = useContext(ModalsContext);
    if (!context) {
        throw new Error('useModals must be used within a modalsProvider');
    }
    return context;
};

export const ModalsProvider = ({ children }: { children: React.ReactNode }) => {
    const [
        overModalOpened,
        { open: openOverviewModal, close: closeOverviewModal }
    ] = useDisclosure(false);
    const [] = useDisclosure(false);

    const [
        isBasicInfoModalOpen,
        { open: openBasicInfoModal, close: closeBasicInfoModal }
    ] = useDisclosure(false);
    const [
        isIntroVideoModalOpen,
        { open: openIntroVideoModal, close: closeIntroVideoModal }
    ] = useDisclosure(false);
    const [
        isSkillsModalOpen,
        { open: openSkillsModal, close: closeSkillsModal }
    ] = useDisclosure(false);
    const [
        isEducationModalOpen,
        { open: openEducationModal, close: closeEducationModal }
    ] = useDisclosure(false);
    const [
        isExperienceModalOpen,
        { open: openExperienceModal, close: closeExperienceModal }
    ] = useDisclosure(false);
    const [
        isProjectsModalOpen,
        { open: openProjectsModal, close: closeProjectsModal }
    ] = useDisclosure(false);
    const [
        isResumeModalOpen,
        { open: openResumeModal, close: closeResumeModal }
    ] = useDisclosure(false);
    const [
        isProfileModalOpen,
        { open: openProfileModal, close: closeProfileModal }
    ] = useDisclosure(false);
    return (
        <ModalsContext.Provider
            value={{
                isBasicInfoModalOpen,
                overModalOpened,
                isIntroVideoModalOpen,
                isSkillsModalOpen,
                isEducationModalOpen,
                isExperienceModalOpen,
                isProjectsModalOpen,
                isResumeModalOpen,
                isProfileModalOpen,
                openProfileModal,
                closeProfileModal,
                openResumeModal,
                closeResumeModal,
                closeOverviewModal,
                openOverviewModal,
                openBasicInfoModal,
                closeBasicInfoModal,
                openIntroVideoModal,
                closeIntroVideoModal,
                openSkillsModal,
                closeSkillsModal,
                openEducationModal,
                closeEducationModal,
                openExperienceModal,
                closeExperienceModal,
                openProjectsModal,
                closeProjectsModal
            }}
        >
            {children}
        </ModalsContext.Provider>
    );
};
