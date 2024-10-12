'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Flex, Grid } from '@mantine/core';
import SignupStyle from './Signup.module.css';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
const Calendly = ({ form, skipStep, nextStep, show }: any) => {
    const [showButton, setShowButton] = useState(false);
    useCalendlyEventListener({
        onEventScheduled: (e) => {
            nextStep();
        }
    });
    return (
        <Box hidden={!show} className={SignupStyle.calendlyStyle}>
            <InlineWidget
                prefill={{
                    name: form.values.fullName,
                    email: form.values.email
                }}
                // url="https://calendly.com/contact-eskalate/30min"
                url="https://calendly.com/brian-a2sv/eskalate"
                styles={{
                    width: '100%',
                    height: '100vh',
                    padding: '0',
                    margin: '0'
                }}
            />
            <Grid.Col
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <Box></Box>
                <Box>
                    {showButton && (
                        <Button size="lg" onClick={() => nextStep()}>
                            Continue
                        </Button>
                    )}
                </Box>
            </Grid.Col>
        </Box>
    );
};

export default Calendly;
