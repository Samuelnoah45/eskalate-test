'use client';

import { Container, Text, Button, Group, Center } from '@mantine/core';
import Image from 'next/image';
import error404 from '@/../public/images/errors/500.svg'; // Error boundaries must be Client Components

export default function GlobalError({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        // global-error must include html and body tags
        <html>
            <body>
                <Container>
                    <Center
                        style={{ height: '100vh', flexDirection: 'column' }}
                    >
                        {/* Image */}
                        <Image
                            src={error404} // Replace with the path to your image
                            alt="404 Illustration"
                            width={400}
                            height={400}
                        />
                        <Text size="xl" fw={500}>
                            Internal Server Error
                        </Text>

                        {/* Description */}

                        {/* Back to Home Button */}
                        <Group mt="lg">
                            <Button onClick={() => reset()} variant="outline">
                                Try Again
                            </Button>
                        </Group>
                    </Center>
                </Container>
            </body>
        </html>
    );
}
