import { Box, Button, Group, Stack, Text } from '@mantine/core';
import React from 'react';
import RelatedProductCard from './RelatedProductCard';
import product1 from '@/../public/images/engineering/Product 1.png';
import product2 from '@/../public/images/engineering/Product 2.png';
import product3 from '@/../public/images/engineering/Product 3.png';
import product4 from '@/../public/images/engineering/Product 4.png';
import Link from 'next/link';

const RelatedProducts = () => {
    const relatedProducts = [
        {
            headerImage: product1,
            headerText: 'Adot',
            bodyText:
                'Adot is a comprehensive pregnancy tracking platform that empowers expectant parents with accurate, localized information. From tracking vital signs to offering personalized guidance on prenatal care and wellbeing,',
            headerColor: '#AE709F',
            websiteLink: 'https://www.adot.life/en'
        },
        {
            headerImage: product2,
            headerText: 'RateEat',
            bodyText:
                'RateEat empowers diners in Ethiopia with menu, price, ingredient, and review information for local restaurants. It promotes informed dining choices and restaurant feedback through user ratings, enriching the local culinary scene.',
            headerColor: '#FF3008',
            websiteLink: 'https://rateeat.app/'
        },
        {
            headerImage: product3,
            headerText: 'SkillBridge',
            bodyText:
                'SkillBridge empowers students to conquer learning challenges with AI. It offers a personalized learning hub with adaptable study materials, exam prep tools, and practice questions.',
            headerColor: '#1A7A6C',
            websiteLink: 'https://skillbridge.academy/'
        },
        {
            headerImage: product4,
            headerText: 'Akil',
            bodyText:
                'Akil is a user-friendly platform that connects NGOs with qualified volunteers. It is a centralized platform that streamlines volunteer management process and fosters efficient communication between NGOs and volunteers.',
            headerColor: '#8D3AD0',
            websiteLink: 'http://akilconnect.org/'
        }
    ];

    return (
        <Stack gap={30}>
            <Stack gap={30} align="center">
                <Text
                    size="36px"
                    fw="600"
                    c="gray.8"
                    inline
                    style={{ textAlign: 'center' }}
                >
                    Related Products
                </Text>
                <Text
                    style={{
                        textAlign: 'center',
                        lineHeight: '1.5',
                        maxWidth: '800px'
                    }}
                    size="lg"
                    fw="normal"
                    c="#262626"
                >
                    Explore how we are tackling real-world challenges and turn
                    ideas into reality.
                </Text>
            </Stack>
            <Stack
                align="center"
                style={{
                    width: '100%'
                }}
            >
                <Group
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    px={{
                        base: 80,
                        sm: 80,
                        md: 80,
                        lg: 80
                    }}
                >
                    {relatedProducts.map((product, index) => (
                        <RelatedProductCard
                            key={index}
                            headerImage={product.headerImage}
                            headerText={product.headerText}
                            bodyText={product.bodyText}
                            websiteLink={product.websiteLink}
                            headerColor={product.headerColor}
                        />
                    ))}
                </Group>
                <Box
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        //paddingRight: '2rem', // Adjust the padding value as needed
                        boxSizing: 'border-box'
                    }}
                    pr={{
                        base: 16,
                        sm: 80,
                        md: 80,
                        lg: 80
                    }}
                >
                    <Button component={Link} href={'https://a2sv.org/stories'}>
                        More Products
                    </Button>
                </Box>
            </Stack>
        </Stack>
    );
};

export default RelatedProducts;
