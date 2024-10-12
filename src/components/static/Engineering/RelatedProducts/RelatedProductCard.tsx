import { Box, Card, Text } from '@mantine/core';
import Image from 'next/image';
import React, { FC } from 'react';
import headerImage from '@/../public/images/engineering/Product 1.png';
import Link from 'next/link';

interface RelatedProductCardProps {
    headerImage: any;
    headerColor: string;
    headerText: string;
    bodyText: string;
    websiteLink: string;
}

const RelatedProductCard: FC<RelatedProductCardProps> = (props) => {
    const { headerImage, headerText, bodyText, websiteLink, headerColor } =
        props;

    return (
        <Card
            w={'384px'}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                gap: '10px',
                boxShadow: '0 8px 14px rgba(135, 206, 235, 0.5)'
            }}
        >
            <Card.Section>
                <Box style={{ padding: '3px', background: headerColor }}></Box>
                <Box>
                    <Image
                        src={headerImage}
                        alt="Why Hire Frontend Developers from Eskalate?"
                        width={384}
                    />
                </Box>
            </Card.Section>

            <Text fw={500} size="lg" mt="md">
                {headerText}
            </Text>

            <Text mt="xs" c="dimmed" size="sm">
                {bodyText}
            </Text>
            <a
                href={websiteLink}
                target="_blank"
                style={{ alignSelf: 'flex-end', textDecoration: 'none' }}
            >
                <Text span inherit c="var(--mantine-color-anchor)">
                    Visit Site
                </Text>
            </a>
        </Card>
    );
};

export default RelatedProductCard;
