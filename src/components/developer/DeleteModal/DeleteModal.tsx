import { Button, Flex, Grid, Modal, Text } from '@mantine/core';
import { useEffect } from 'react';

interface Props {
    opened: boolean;
    close: () => void;
    onDelete: () => void;
    isLoading: boolean;
    title: string;
    message: string;
}

function DeleteModal({
    opened,
    close,
    onDelete,
    title,
    message,
    isLoading
}: Props) {
    return (
        <Modal
            opened={opened}
            onClose={close}
            title={title}
            centered
            size={'sm'}
        >
            <Grid>
                <Grid.Col span={12}>
                    <Text c={'gray.7'}>{message}</Text>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Flex justify="flex-end" mt={24} gap={24}>
                        <Button
                            disabled={isLoading}
                            variant="default"
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button
                            w={'fit-content'}
                            loading={isLoading}
                            onClick={onDelete}
                            color="red"
                            variant="filled"
                            disabled={isLoading}
                        >
                            Delete
                        </Button>
                    </Flex>
                </Grid.Col>
            </Grid>
        </Modal>
    );
}

export default DeleteModal;
