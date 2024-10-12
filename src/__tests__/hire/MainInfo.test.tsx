import React from 'react';
import { render, screen, fireEvent } from '../../utils/test_utils';
import MainInfo from '@/components/Client/main_info';
import { isEmail, isNotEmpty } from '@mantine/form';

describe('MainInfo Component', () => {
    let mockForm: any;
    let mockNextStep: jest.Mock;

    beforeEach(() => {
        mockForm = {
            getInputProps: jest.fn((field) => ({
                value:
                    field === 'fullName'
                        ? ''
                        : field === 'email'
                          ? ''
                          : field === 'companyName'
                            ? ''
                            : '',
                onChange: jest.fn((e) => {
                    // Mock setting the value based on the input field
                    mockForm.values[field] = e.target.value;
                }),
                error: (() => {
                    if (field === 'fullName' && !mockForm.values.fullName) {
                        return 'Name is required';
                    }
                    if (
                        field === 'email' &&
                        !/\S+@\S+\.\S+/.test(mockForm.values.email)
                    ) {
                        return 'Invalid email';
                    }
                    if (
                        field === 'companyName' &&
                        !mockForm.values.companyName
                    ) {
                        return 'Company name is required';
                    }
                    if (
                        field === 'phoneNumber' &&
                        mockForm.values.phoneNumber.length < 5
                    ) {
                        return 'Invalid phone number';
                    }
                    return null;
                })()
            })),
            setFieldValue: jest.fn(),
            validate: jest.fn(() => {
                const errors: any = {};
                if (!mockForm.values.fullName) {
                    errors.fullName = 'Name is required';
                }
                if (!isEmail(mockForm.values.email)) {
                    errors.email = 'Invalid email';
                }
                if (!mockForm.values.companyName) {
                    errors.companyName = 'Company name is required';
                }
                if (mockForm.values.phoneNumber.length < 5) {
                    errors.phoneNumber = 'Invalid phone number';
                }

                return {
                    hasErrors: Object.keys(errors).length > 0,
                    errors
                };
            }),
            values: {
                fullName: '',
                companyName: '',
                email: '',
                phoneNumber: ''
            }
        };
    });
    it('renders correctly', () => {
        render(
            <MainInfo
                form={mockForm}
                nextStep={mockNextStep}
                isLoading={false}
                error={null}
            />
        );

        expect(
            screen.getByText('Connecting You With Skilled Talent!')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Enter Your details to schedule a call')
        ).toBeInTheDocument();
        expect(screen.getByText('Full name')).toBeInTheDocument();
        expect(screen.getByText('Company Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Phone Number')).toBeInTheDocument();
    });

    it('displays an error message when invalid phone number is entered', () => {
        render(
            <MainInfo
                form={mockForm}
                started={true}
                nextStep={mockNextStep}
                isLoading={false}
                error={null}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
            target: { value: '23' }
        });

        fireEvent.click(screen.getByText('Book a call'));
        expect(screen.getByText('invalid phone number')).toBeInTheDocument();
    });

    it('displays an error message if provided', () => {
        const mockError = { data: { message: 'An error occurred' } };
        render(
            <MainInfo
                form={mockForm}
                started={true}
                nextStep={mockNextStep}
                isLoading={false}
                error={mockError}
            />
        );

        expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });

    it('shows loading state on the button when isLoading is true', () => {
        render(
            <MainInfo
                form={mockForm}
                started={true}
                nextStep={mockNextStep}
                isLoading={true}
                error={null}
            />
        );

        expect(screen.getByText('Book a call')).toHaveAttribute(
            'data-loading',
            'true'
        );
    });

    it('displays an error message when invalid inputs entered', () => {
        render(
            <MainInfo
                form={mockForm}
                started={true}
                nextStep={mockNextStep}
                isLoading={false}
                error={null}
            />
        );

        // Simulate entering an invalid email
        fireEvent.change(screen.getByPlaceholderText('Company Name'), {
            target: { value: '' }
        });

        // Update mockForm values to reflect the change
        mockForm.values.email = '';

        // Simulate clicking the "Book a call" button
        fireEvent.click(screen.getByText('Book a call'));

        // Ensure the form's validate function was called
        expect(mockForm.validate).toHaveBeenCalled();

        // Check that the appropriate validation message is displayed
        expect(
            screen.getByText('Company name is required')
        ).toBeInTheDocument();
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
    it('displays an no error message when valid inputs entered', () => {
        render(
            <MainInfo
                form={mockForm}
                started={true}
                nextStep={mockNextStep}
                isLoading={false}
                error={null}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('Company Name'), {
            target: { value: 'company' }
        });
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'abcd@gmail.com' }
        });
        fireEvent.change(screen.getByPlaceholderText('Full name'), {
            target: { value: 'Name' }
        });

        mockForm.values.email = 'abcd@gmail.com';
        mockForm.values.fullName = 'Name';
        mockForm.values.companyName = 'Name';

        fireEvent.click(screen.getByText('Book a call'));

        expect(mockForm.validate).toHaveBeenCalled();

        expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
        expect(screen.queryByText('Invalid email')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Company name is required')
        ).not.toBeInTheDocument();
    });
});
