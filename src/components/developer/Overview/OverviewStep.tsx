import { Center, Loader, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import OverviewForm from './OverviewForm';
import CardWrapper from '../ProfileCenter/CardWrapper';
import { useDeveloper } from '@/Providers/DeveloperContext';
import { useModals } from '@/Providers/ModalContext';

export default function OverviewStep() {
    // const [opened, { open, close }] = useDisclosure(false);

    const { developer, isLoading } = useDeveloper();
    const { overModalOpened, closeOverviewModal, openOverviewModal } =
        useModals();
    const headerProps = {
        title: 'Overview',
        add: (developer?.profileOverview?.length || 0) < 8,
        edit: (developer?.profileOverview?.length || 0) > 7,
        onAdd: openOverviewModal,
        onEdit: openOverviewModal
    };

    return (
        <CardWrapper
            headerProps={headerProps}
            noData={(developer?.profileOverview?.length || 0) < 8}
        >
            {isLoading ? (
                <Center>
                    <Loader size={34} />
                </Center>
            ) : null}
            <div
                style={{ color: 'var(--mantine-color-gray-7)' }}
                dangerouslySetInnerHTML={{
                    __html: developer?.profileOverview || ''
                }}
            ></div>
            <Modal
                p={0}
                m={0}
                opened={overModalOpened}
                onClose={closeOverviewModal}
                title={
                    developer?.profileOverview?.length
                        ? 'Edit Overview'
                        : 'Add Overview'
                }
                centered
                size={'xl'}
            >
                <OverviewForm
                    close={closeOverviewModal}
                    overviewValue={developer?.profileOverview || ''}
                />
            </Modal>
        </CardWrapper>
    );
}
