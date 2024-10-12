'use client';

import { Container, Text, Button, Group, Center } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import error404 from '@/../public/images/errors/404.svg';
export default function Custom404() {
    const router = useRouter();

    const handleBackToHome = () => {
        router.back();
    };
    return (
        <Container>
            <Center style={{ height: '100vh', flexDirection: 'column' }}>
                {/* Image */}
                <Image
                    src={error404} // Replace with the path to your image
                    alt="404 Illustration"
                    width={400}
                    height={400}
                />
                <Text size="xl" fw={500}>
                    Page not found
                </Text>

                {/* Description */}

                {/* Back to Home Button */}
                <Group mt="lg">
                    <Button onClick={handleBackToHome} variant="outline">
                        Go Back
                    </Button>
                </Group>
            </Center>
        </Container>
    );
}
