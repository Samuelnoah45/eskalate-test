import { AspectRatio, Modal, Text } from '@mantine/core';
import CardWrapper from '../ProfileCenter/CardWrapper';
import { useDisclosure } from '@mantine/hooks';
import { ProfileSectionHeaderProps } from '../ProfileCenter/ProfileSectionsHeader';
import IntroVideoForm from './IntroVideoForm';
import { useDeveloper } from '@/Providers/DeveloperContext';
import { useModals } from '@/Providers/ModalContext';

export default function IntroVideoStep() {
    // const [opened, { open, close }] = useDisclosure(false);
    const { isIntroVideoModalOpen, openIntroVideoModal, closeIntroVideoModal } =
        useModals();
    const { developer, isLoading } = useDeveloper();
    const headerProps: ProfileSectionHeaderProps = {
        title: 'Intro video',
        add: !developer?.introVideoUrl,
        edit: !!developer?.introVideoUrl,
        onAdd: openIntroVideoModal,
        onEdit: openIntroVideoModal,
        upload: true
    };

    return (
        <CardWrapper
            headerProps={headerProps}
            noData={!developer?.introVideoUrl}
        >
            {developer?.introVideoUrl && (
                // video player here
                <AspectRatio ratio={1080 / 500} mx="auto">
                    <video
                        width="320"
                        height="240"
                        style={{ objectFit: 'contain' }}
                        controls
                        src={developer.introVideoUrl}
                    />
                </AspectRatio>
            )}
            <Modal
                opened={isIntroVideoModalOpen}
                onClose={closeIntroVideoModal}
                title="Add Intro Video"
                centered
                size={'lg'}
            >
                <IntroVideoForm
                    video={developer?.introVideoUrl}
                    close={closeIntroVideoModal}
                />
            </Modal>
        </CardWrapper>
    );
}
