// Import necessary libraries
import { render, screen, fireEvent } from '../../utils/test_utils';
import { useRouter } from 'next/navigation';
import DeveloperSignup from '@/app/(auth)/signup/developer/page';
import { useRegisterMutation } from '@/lib/redux/api/developer/auth';

// Mock the next/router module
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

jest.mock('../../lib/redux/hooks.ts', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

jest.mock('../../lib/redux/api/developer/auth', () => ({
    useRegisterMutation: jest.fn()
}));

// Define a type for the router mock
const mockUseRouter = useRouter as jest.Mock<any>;
const mockUseRegisterMutation = useRegisterMutation as jest.Mock;

describe('DeveloperSignup Component', () => {
    const pushMock = jest.fn(); // Create a mock for the push function

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRouter.mockReturnValue({
            push: pushMock
        });
        mockUseRegisterMutation.mockReturnValue([
            jest.fn().mockReturnValue({
                unwrap: jest.fn().mockResolvedValue({})
            }),
            { isLoading: false, isError: false, isSuccess: false, error: null }
        ]);
    });

    it('should render correctly with the router', () => {
        render(<DeveloperSignup />);
        expect(screen.getByText('Apply as a freelancer')).toBeInTheDocument();
    });

    it('displays validation messages when form is submitted with empty fields', async () => {
        render(<DeveloperSignup />);
        fireEvent.click(screen.getByText('Sign up'));
        expect(
            await screen.findByText('First name is required')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Email is required')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Country is required')
        ).toBeInTheDocument();
    });

    it('submits the form with valid inputs and shows no validation messages', async () => {
        render(<DeveloperSignup />);

        // Fill in the input fields with valid values
        fireEvent.change(screen.getByLabelText(/first name/i), {
            target: { value: 'John' }
        });
        fireEvent.change(screen.getByLabelText(/last name/i), {
            target: { value: 'Doe' }
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'john@example.com' }
        });
        fireEvent.change(screen.getByTestId('password-input'), {
            target: { value: 'Password1!' }
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: 'Password1!' }
        });
        fireEvent.change(screen.getByTestId('country-input'), {
            target: { value: 'Ethiopia!' }
        });
        fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
            target: { value: '1234567890' } // Replace with appropriate phone number format if necessary
        });

        // Click the submit button
        fireEvent.click(screen.getByText('Sign up'));

        // Check that there are no validation messages displayed
        expect(
            screen.queryByText('First name is required')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Last name is required')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Invalid phone number')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Password must have at least 8 characters')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Passwords did not match')
        ).not.toBeInTheDocument();
    });
});
