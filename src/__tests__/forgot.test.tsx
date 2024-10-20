import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import Page from '@/app/(auth)/(signin)/forgot/page';
import { useForgotPasswordMutation } from '@/lib/redux/api/developer/auth';
import { handleError } from '@/utils/error_handler';
import ReduxProvider from '@/Providers/ReduxProvider';

jest.mock('../lib/redux/api/developer/auth', () => ({
    useForgotPasswordMutation: jest.fn()
}));

jest.mock('../utils/error_handler', () => ({
    handleError: jest.fn()
}));

describe('forgot password  Page', () => {
    let mockForgotPassword: jest.Mock;
    let mockHandleError: jest.Mock;

    beforeEach(() => {
        mockForgotPassword = jest.fn().mockResolvedValue({});
        mockHandleError = jest.fn().mockReturnValue(null);

        (useForgotPasswordMutation as jest.Mock).mockReturnValue([
            mockForgotPassword,
            { isLoading: false, isError: false, isSuccess: false, error: null }
        ]);

        (handleError as jest.Mock).mockImplementation(mockHandleError);
    });

    it('renders the forgot password page', () => {
        render(
            <ReduxProvider>
                <MantineProvider theme={theme}>
                    <Page />
                </MantineProvider>
            </ReduxProvider>
        );

        expect(screen.getByText('Forgot Password')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Please enter the email address associated with your account to initiate the password reset process.'
            )
        ).toBeInTheDocument();
    });

    it('displays validation messages when email field is empty', () => {
        render(
            <ReduxProvider>
                <MantineProvider theme={theme}>
                    <Page />
                </MantineProvider>
            </ReduxProvider>
        );

        // Click the submit button
        const submitButton = screen.getByRole('button', {
            name: /Send Reset Link/i
        });
        fireEvent.click(submitButton);

        expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('displays an error message when the email is invalid', () => {
        render(
            <ReduxProvider>
                <MantineProvider theme={theme}>
                    <Page />
                </MantineProvider>
            </ReduxProvider>
        );

        // Fill out the form with an invalid email
        fireEvent.change(screen.getByLabelText(/Email/i), {
            target: { value: 'invalid-email' }
        });

        // Click the submit button
        const submitButton = screen.getByRole('button', {
            name: /Send Reset Link/i
        });
        fireEvent.click(submitButton);

        expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('displays a success message when the reset link is sent', async () => {
        render(
            <ReduxProvider>
                <MantineProvider theme={theme}>
                    <Page />
                </MantineProvider>
            </ReduxProvider>
        );

        // Fill out the form with an invalid email
        fireEvent.change(screen.getByLabelText(/Email/i), {
            target: { value: 'test@example.com' }
        });

        (useForgotPasswordMutation as jest.Mock).mockReturnValue([
            mockForgotPassword,
            { isLoading: false, isError: false, isSuccess: true, error: null }
        ]);
        // Click the submit button
        const submitButton = screen.getByRole('button', {
            name: /Send Reset Link/i
        });

        fireEvent.click(submitButton);

        expect(
            screen.getByText(
                'A password reset link has been sent to your email address. Please Check your email.'
            )
        ).toBeInTheDocument();
    });

    it('displays an error message when the reset link fails', async () => {
        (useForgotPasswordMutation as jest.Mock).mockReturnValue([
            mockForgotPassword,
            {
                isLoading: false,
                isError: true,
                isSuccess: false,
                error: 'Error occurred'
            }
        ]);

        render(
            <ReduxProvider>
                <MantineProvider theme={theme}>
                    <Page />
                </MantineProvider>
            </ReduxProvider>
        );

        // Fill out the form with a valid email
        fireEvent.change(screen.getByLabelText(/Email/i), {
            target: { value: 'test@example.com' }
        });

        // Click the submit button
        const submitButton = screen.getByRole('button', {
            name: /Send Reset Link/i
        });
        fireEvent.click(submitButton);

        expect(mockHandleError).toHaveBeenCalledWith('Error occurred');
    });
});
