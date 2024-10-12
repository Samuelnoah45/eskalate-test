import React from 'react';
import { render, screen, fireEvent } from '../utils/test_utils';
import SignIn from '@/app/(auth)/signin/page';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useLoginMutation } from '@/lib/redux/api/developer/auth';
import { handleError } from '@/utils/error_handler';
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn()
}));

jest.mock('../lib/redux/hooks.ts', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

jest.mock('../lib/redux/api/developer/auth', () => ({
    useLoginMutation: jest.fn()
}));

jest.mock('../utils/error_handler', () => ({
    handleError: jest.fn()
}));

describe('Page', () => {
    let mockForm: any;
    let mockRouterPush: jest.Mock;
    let mockDispatch: jest.Mock;
    let mockLogin: jest.Mock;
    let mockHandleError: jest.Mock;
    beforeEach(() => {
        mockForm = {
            getInputProps: jest.fn((field) => ({
                value: '',
                onChange: jest.fn(),
                error: null
            })),
            onSubmit: jest.fn(),
            values: {
                email: '',
                password: ''
            }
        };

        mockRouterPush = jest.fn();
        mockDispatch = jest.fn();
        mockLogin = jest.fn().mockResolvedValue({});
        mockHandleError = jest.fn().mockReturnValue(null);

        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockImplementation((key) => {
                if (key === 'verify') return null;
                if (key === 'error') return null;
                return null;
            })
        });
        (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as jest.Mock).mockReturnValue({});
        (useLoginMutation as jest.Mock).mockReturnValue([
            mockLogin,
            { isLoading: false, isError: false, isSuccess: false, error: null }
        ]);
        (handleError as jest.Mock).mockImplementation(mockHandleError);
    });
    it('Reader sign in page', () => {
        render(<SignIn />);
        // expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    });

    it('displays validation messages when fields are empty', () => {
        render(<SignIn />);

        // Click the button
        const loginButton = screen.getByTestId('signin-button');
        fireEvent.click(loginButton);
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('displays validation messages when email is invalid', () => {
        render(<SignIn />);
        // Fill out the form fields
        fireEvent.change(screen.getByTestId('email-input'), {
            target: { value: 'test@example' }
        });

        // Click the button
        const loginButton = screen.getByTestId('signin-button');
        fireEvent.click(loginButton);
        expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
});
