import { useState } from 'react';
import Cropper from 'react-easy-crop';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Box, Group } from '@mantine/core';

export default function ImageCroper({ image, isOpened, setIsOpened }: any) {
    const [opened, { open, close }] = useDisclosure(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {};
    return (
        <>
            <Modal
                opened={isOpened}
                onClose={close}
                title="Image upload"
                size="xl"
                style={{ height: '100vh' }}
            >
                <Group
                    className="flex flex-col"
                    style={{ height: '50vh', position: 'relative' }}
                >
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 3}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                    <input
                        type="range"
                        placeholder="Abcd"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => {
                            setZoom(Number(e.target.value));
                        }}
                        className="zoom-range"
                    />
                </Group>
                <Button className="mt-5">Finish</Button>
            </Modal>
        </>
    );
}
