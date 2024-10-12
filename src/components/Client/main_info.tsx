import React, { useState } from 'react';

import {
    Box,
    Button,
    Container,
    Grid,
    Group,
    Select,
    SelectProps,
    Text,
    TextInput
} from '@mantine/core';
import SignupStyle from './Signup.module.css';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { getIcons, getCode } from '@/country_codes';
import { Image } from '@mantine/core';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const MainInfo = ({ form, nextStep, isLoading, error }: any) => {
    const [started, setStarted] = useState(false);
    const next = () => {
        setStarted(true);
        const error = form.validate();
        if (error.hasErrors) return;
        nextStep();
    };
    return (
        <Group className={SignupStyle.main_info}>
            <Text fw={500} className={SignupStyle.signupText}>
                Connecting You With Skilled Talent!
            </Text>
            <Text size="lg" style={{ width: '100%' }}>
                Enter Your details to schedule a call
            </Text>

            <Grid gutter={20}>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <TextInput
                        size="md"
                        label="Full name"
                        withAsterisk
                        mt="md"
                        placeholder="Full name"
                        {...form.getInputProps('fullName')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <TextInput
                        size="md"
                        label="Company Name"
                        withAsterisk
                        placeholder="Company Name"
                        mt="md"
                        {...form.getInputProps('companyName')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <TextInput
                        size="md"
                        label="Email"
                        placeholder="Email"
                        withAsterisk
                        {...form.getInputProps('email')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Box style={{ marginBottom: '5px' }}>
                        Phone Number
                        <span style={{ color: 'red' }}> *</span>
                    </Box>
                    <PhoneInput
                        country={'us'}
                        isValid={(value, country) => {
                            if (started == true && value.length < 5) {
                                return false;
                            }
                            return true;
                        }}
                        containerStyle={{ width: '100%', border: 'none' }}
                        inputStyle={{
                            width: '100%'
                        }}
                        onChange={(phone) => {
                            form.setFieldValue('phoneNumber', phone);
                        }}
                        placeholder="Phone Number"
                    />
                    {started &&
                        form.getInputProps('phoneNumber').value.length < 5 && (
                            <Text
                                style={{ fontSize: '13px' }}
                                mt="1px"
                                color="red"
                            >
                                invalid phone number
                            </Text>
                        )}
                </Grid.Col>
                {error && (
                    <Grid.Col span={{ base: 12, lg: 12 }}>
                        <Text
                            style={{
                                color: 'red'
                            }}
                        >
                            {(error as any).data?.message}
                        </Text>
                    </Grid.Col>
                )}
                <Grid.Col
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                    <Button
                        size="md"
                        className={SignupStyle.applyBtn}
                        // type="submit"
                        loading={isLoading}
                        onClick={next}
                    >
                        Book a call
                    </Button>
                </Grid.Col>
            </Grid>
        </Group>
    );
};

export default MainInfo;
