'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Text, PasswordInput, Stack } from '@mantine/core';
import ResetStyle from './Reset.module.css';
import { useForm, isNotEmpty } from '@mantine/form';
import { IconCheck } from '@tabler/icons-react';
// import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setUser } from '@/lib/redux/slices/loginSlice';
import { useResetPasswordMutation } from '@/lib/redux/api/developer/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
const Page = () => {
    const [
        resetPassword,
        {
            isLoading: isResetting,
            isError: resetError,
            isSuccess: resetSuccess,
            error: error
        }
    ] = useResetPasswordMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const loginState = useAppSelector((state: any) => state.login);
    const token = useSearchParams().get('token');

    const form = useForm({
        initialValues: {
            newPassword: '',
            confirmPassword: ''
        },
        validate: {
            newPassword: (value) => {
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
                value !== values.newPassword ? 'Passwords did not match' : null
        }
    });

    const handleSubmit = () => {
        const values = form.values;
        resetPassword({ token, password: values.newPassword })
            .unwrap()
            .then((res) => {
                const data = {
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    ...res.user
                };

                dispatch(setUser(data));

                toast.success('Password reset successfully');
                router.push(`/developer/${loginState.developerId}`);
            })
            .catch((error) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    useEffect(() => {
        if (loginState?.developerId) {
            router.push(`/developer/${loginState.developerId}`);
        }
    }, [loginState]);

    return (
        <Box
            component="form"
            className={ResetStyle.resetForm}
            onSubmit={form.onSubmit((values) => {
                handleSubmit();
            })}
        >
            <Text fw={500} className={ResetStyle.resetText}>
                Reset Password
            </Text>

            <Text className={ResetStyle.resetParagraph}>
                Please enter your new password.
            </Text>

            <Stack gap={0}>
                <PasswordInput
                    type="password"
                    label="New Password"
                    placeholder="Your new password"
                    withAsterisk
                    data-testid="new-password-input"
                    mt="sm"
                    {...form.getInputProps('newPassword')}
                />

                {form.values.newPassword && (
                    <PasswordStrengthIndicator
                        password={form.values.newPassword}
                    />
                )}
            </Stack>

            <PasswordInput
                label="Confirm New Password"
                placeholder="Confirm your password"
                withAsterisk
                mt="sm"
                {...form.getInputProps('confirmPassword')}
            />

            {error && (
                <Text
                    style={{
                        color: 'red'
                    }}
                >
                    {(error as any)?.data?.message ?? 'Something goes wrong!'}
                </Text>
            )}

            <Button
                mt="sm"
                fullWidth
                style={{ backgroundColor: '#2195F3' }}
                type="submit"
                loading={isResetting}
            >
                {resetSuccess ? <IconCheck color="#ffff" /> : 'Reset'}
            </Button>
        </Box>
    );
};

export default Page;
