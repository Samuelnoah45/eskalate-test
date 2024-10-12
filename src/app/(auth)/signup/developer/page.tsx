'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    Center,
    Grid,
    PasswordInput,
    Text,
    TextInput,
    createTheme,
    Input,
    Select
} from '@mantine/core';
import SignupStyle from './Signup.module.css';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRegisterMutation } from '@/lib/redux/api/developer/auth';
import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
const Page = () => {
    const router = useRouter();
    const [register, { isLoading, isError, isSuccess, error }] =
        useRegisterMutation();
    const theme = createTheme({
        components: {
            Input: Input.extend({
                classNames: {
                    input: SignupStyle.input
                }
            })
        }
    });

    const [started, setStarted] = useState(false);

    const form = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            country: '',
            phoneNumber: '',
            role: ''
        },

        validate: {
            firstName: isNotEmpty('First name is required'),
            lastName: isNotEmpty('Last name is required'),
            email: isEmail('Email is required'),
            country: isNotEmpty('Country is required'),
            phoneNumber: (value): any =>
                value.length < 5 ? 'Invalid phone number' : null,
            password: (value) => {
                if (value.length < 8)
                    return 'Password must have at least 8 characters';
                if (!/[A-Z]/.test(value))
                    return 'Password must have at least one uppercase letter';
                if (!/[a-z]/.test(value))
                    return 'Password must have at least one lowercase letter';
                if (!/[0-9]/.test(value))
                    return 'Password must have at least one number';
                if (!/[!@#$%^&*]/.test(value))
                    return 'Password must have at least one special character';
                return null;
            },
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords did not match' : null
        }
    });

    const handleSignup = (values: any) => {
        const error = form.validate() as any;
        if (error.hasErrors) return;

        const newValue = {
            fullName: (values.firstName + ' ' + values.lastName)
                .trim()
                .split(' ')
                .slice(0, 2)
                .join(' '),
            email: values.email,
            password: values.password,
            country: values.country,
            phoneNumber: '+' + values.phoneNumber,
            role: 'developer'
        };
        // delete the confirmPassword field

        register(newValue)
            .unwrap()
            .then((res: any) => {
                toast.success('Signup successful');
                router.push('/signup/developer/verify');
            })
            .catch((err) => {
                const errorMessage = handleError(err);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    return (
        // <Center h={'100%'} w={'100%'}>
        //     <Alert
        //         style={{ height: 'fit-content', width: '50%' }}
        //         variant="light"
        //         color="blue"
        //         title="Sorry"
        //         icon={icon}
        //     >
        //         <Text size="lg">
        //             Sign up for developers is currently under development.{' '}
        //             <Link href="/">Go back to home page.</Link>
        //         </Text>
        //     </Alert>
        // </Center>
        <Box
            component="form"
            className={SignupStyle.signupForm}
            onSubmit={form.onSubmit((values: any) =>
                handleSignup(values ? values : {})
            )}
        >
            <Text fw={500} className={SignupStyle.signupText}>
                Apply as a freelancer
            </Text>

            <Grid>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <TextInput
                        label="First Name"
                        withAsterisk
                        mt="md"
                        {...form.getInputProps('firstName')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <TextInput
                        label="last Name"
                        withAsterisk
                        mt="md"
                        {...form.getInputProps('lastName')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <TextInput
                        label="Email"
                        withAsterisk
                        {...form.getInputProps('email')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Select
                        searchable
                        withAsterisk
                        label="Country"
                        data-testid="country-input"
                        data={['Ethiopia', 'Ghana']}
                        {...form.getInputProps('country')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    {/* <TextInput
                        label="Phone number"
                        withAsterisk
                        {...form.getInputProps('phoneNumber')}
                    /> */}
                    <Box fw={450} mb={8}>
                        Phone number <span style={{ color: 'red' }}>*</span>{' '}
                    </Box>
                    <PhoneInput
                        country={'et'}
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
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <PasswordInput
                        label="Password"
                        withAsterisk
                        data-testid="password-input"
                        {...form.getInputProps('password')}
                    />
                    {form.values.password && (
                        <PasswordStrengthIndicator
                            password={form.values.password}
                        />
                    )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <PasswordInput
                        label="Confirm password"
                        withAsterisk
                        {...form.getInputProps('confirmPassword')}
                    />
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
                {/* <Group></Group> */}
                <Grid.Col
                    span={{ base: 12, lg: 12 }}
                    className="flex justify-center"
                >
                    <Box className={SignupStyle.buttonBox}>
                        <Button
                            loading={isLoading}
                            className={SignupStyle.applyBtn}
                            type="submit"
                            onClick={() => {
                                setStarted(true);
                            }}
                        >
                            <Text>Sign up</Text>
                        </Button>
                    </Box>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Center>
                        <Text fw={400} size="sm">
                            Already have an account?{' '}
                            <Link
                                href={'/signin'}
                                style={{
                                    color: '#2195F3',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                            >
                                Sign in
                            </Link>
                        </Text>
                    </Center>
                </Grid.Col>
            </Grid>
        </Box>
    );
};

export default Page;
