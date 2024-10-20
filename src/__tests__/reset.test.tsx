import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import Page from '@/app/(auth)/(signin)/reset/page'; // Adjust path if necessary
import { useResetPasswordMutation } from '@/lib/redux/api/developer/auth';
import { handleError } from '@/utils/error_handler';
import ReduxProvider from '@/Providers/ReduxProvider';
import { useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn()
}));

jest.mock('../lib/redux/hooks.ts', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));
jest.mock('../lib/redux/api/developer/auth', () => ({
    useResetPasswordMutation: jest.fn()
}));

jest.mock('../utils/error_handler', () => ({
    handleError: jest.fn()
}));

describe('reset password Page', () => {
    let mockResetPassword: jest.Mock;
    let mockHandleError: jest.Mock;
    // Mock for useSearchParams

    beforeEach(() => {
        mockResetPassword = jest.fn().mockResolvedValue({
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken',
            user: { id: 'mockUserId' }
        });
        // Mock implementation of useSearchParams
        const mockSearchParams = new URLSearchParams('token=mockToken');

        // Returning a mock object with a get method
        (useSearchParams as jest.Mock).mockReturnValue({
            get: (key: string) => mockSearchParams.get(key)
        });
        mockHandleError = jest.fn().mockReturnValue(null);

        (useResetPasswordMutation as jest.Mock).mockReturnValue([
            mockResetPassword,
            { isLoading: false, isError: false, isSuccess: false, error: null }
        ]);

        (handleError as jest.Mock).mockImplementation(mockHandleError);
    });

    it('renders the reset password page', () => {
        render(
            <ReduxProvider>
                <MantineProvider theme={theme}>
                    <Page />
                </MantineProvider>
            </ReduxProvider>
        );

        expect(screen.getByText('Reset Password')).toBeInTheDocument();
        expect(
            screen.getByText('Please enter your new password.')
        ).toBeInTheDocument();
    });

    it('displays validation messages when passwords do not match', async () => {
        render(
            <ReduxProvider>
                <MantineProvider theme={theme}>
                    <Page />
                </MantineProvider>
            </ReduxProvider>
        );

        // Fill out the form with mismatched passwords
        fireEvent.change(screen.getByTestId('new-password-input'), {
            target: { value: 'Str0ngP@ssw0rd' }
        });
        fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
            target: { value: 'DifferentP@ssw0rd' }
        });

        // Click the submit button
        const submitButton = screen.getByRole('button', {
            name: /Reset/i
        });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText('Passwords did not match')
            ).toBeInTheDocument();
        });
    });

    // it('displays a success message when password is reset', async () => {
    //     render(
    //         <ReduxProvider>
    //             <MantineProvider theme={theme}>
    //                 <Page />
    //             </MantineProvider>
    //         </ReduxProvider>
    //     );

    //     // Fill out the form with matching passwords
    //     fireEvent.change(screen.getByTestId('new-password-input'), {
    //         target: { value: 'Str0ngP@ssw0rd' }
    //     });
    //     fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
    //         target: { value: 'Str0ngP@ssw0rd' }
    //     });

    //     (useResetPasswordMutation as jest.Mock).mockReturnValue([
    //         mockResetPassword,
    //         { isLoading: false, isError: false, isSuccess: true, error: null }
    //     ]);

    //     // Click the submit button
    //     const submitButton = screen.getByRole('button', {
    //         name: /Reset/i
    //     });
    //     fireEvent.click(submitButton);

    //     await waitFor(() => {
    //         expect(
    //             screen.getByText('Password reset successful')
    //         ).toBeInTheDocument(); // Adjust message if necessary
    //     });
    // });

    // it('displays an error message when password reset fails', async () => {
    //     (useResetPasswordMutation as jest.Mock).mockReturnValue([
    //         mockResetPassword,
    //         {
    //             isLoading: false,
    //             isError: true,
    //             isSuccess: false,
    //             error: { data: { message: 'Reset failed' } }
    //         }
    //     ]);

    //     render(
    //         <ReduxProvider>
    //             <MantineProvider theme={theme}>
    //                 <Page />
    //             </MantineProvider>
    //         </ReduxProvider>
    //     );

    //     // Fill out the form with matching passwords
    //     fireEvent.change(screen.getByTestId('new-password-input'), {
    //         target: { value: 'Str0ngP@ssw0rd' }
    //     });
    //     fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
    //         target: { value: 'Str0ngP@ssw0rd' }
    //     });

    //     // Click the submit button
    //     const submitButton = screen.getByRole('button', {
    //         name: /Reset/i
    //     });
    //     fireEvent.click(submitButton);

    //     await waitFor(() => {
    //         expect(mockHandleError).toHaveBeenCalledWith('Reset failed');
    //     });
    // });
});
