'use client';
import React from 'react';
import ForgotStyle from './Forgot.module.css';
import { Alert, Box, Button, Text, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useForgotPasswordMutation } from '@/lib/redux/api/developer/auth';
import { handleError } from '@/utils/error_handler';

interface FormValue {
    email: string;
}

const Page: React.FC<{}> = () => {
    const [forgotPassword, { isLoading, error, isError, isSuccess }] =
        useForgotPasswordMutation();

    const form = useForm<FormValue>({
        initialValues: {
            email: ''
        },
        validate: {
            email: isEmail('Email is required')
        }
    });

    const handleSubmit = async (values: FormValue) => {
        const value = form.values;

        await forgotPassword(value);
    };

    return (
        <Box
            component="form"
            className={ForgotStyle.forgotForm}
            onSubmit={form.onSubmit((values: FormValue) => {
                handleSubmit(values ? values : { email: '' });
            })}
        >
            {isSuccess ? (
                <Alert
                    variant="light"
                    color="blue"
                    radius="md"
                    title="Check your email"
                    icon={<IconAlertCircle />}
                >
                    A password reset link has been sent to your email address.
                    Please Check your email.
                </Alert>
            ) : (
                <>
                    <Text fw={500} className={ForgotStyle.forgotText}>
                        Forgot Password
                    </Text>
                    <Text className={ForgotStyle.forgotParagraph}>
                        Please enter the email address associated with your
                        account to initiate the password reset process.
                    </Text>
                    <TextInput
                        label="Email"
                        placeholder="example@company.com"
                        withAsterisk
                        mt="md"
                        {...form.getInputProps('email')}
                    />
                    {error && handleError(error) && (
                        <Text color="red">{handleError(error)}</Text>
                    )}

                    <Button
                        fullWidth
                        style={{
                            backgroundColor: 'var(--mantine-color-primary-6)'
                        }}
                        type="submit"
                        loading={isLoading}
                    >
                        {isSuccess ? (
                            <IconCheck color="#ffff" />
                        ) : (
                            'Send Reset Link'
                        )}
                    </Button>
                </>
            )}
        </Box>
    );
};

export default Page;
