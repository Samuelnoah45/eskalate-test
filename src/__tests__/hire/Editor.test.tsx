import { render, screen, fireEvent } from '../../utils/test_utils';
import Editor from '@/components/Client/editor';
import { MantineProvider } from '@mantine/core';

// jest.mock('@tiptap/react', () => ({
//     useEditor: jest.fn(() => ({
//         getHTML: jest.fn(() => '<p>Test content</p>')
//     }))
// }));

const mockNextStep = jest.fn();
const mockSkipStep = jest.fn();
const mockUpdateDataStatus: any = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    reset: jest.fn()
};

describe('MainEditor Component', () => {
    beforeEach(() => {
        render(
            <Editor
                skipStep={mockSkipStep}
                nextStep={mockNextStep}
                form={{}}
                updateDataStatus={mockUpdateDataStatus}
            />
        );
    });

    it('renders the component with correct elements', () => {
        expect(
            screen.getByText('Connecting You With Skilled Talent!')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Share additional details to better assist you')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Anything else you would like our team to know ?')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Legal document you would share to team?')
        ).toBeInTheDocument();
    });

    it('triggers the next step when the Submit button is clicked', () => {
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
        expect(mockNextStep).toHaveBeenCalledWith('<p></p>', null);
    });

    it('triggers the skip step when the Previous button is clicked', () => {
        const previousButton = screen.getByText('Previous');
        fireEvent.click(previousButton);
        expect(mockSkipStep).toHaveBeenCalled();
    });

    it('displays error message if updateDataStatus isError is true', () => {
        mockUpdateDataStatus.isError = true;
        mockUpdateDataStatus.error = { data: { message: 'Error occurred' } };

        render(
            <Editor
                skipStep={mockSkipStep}
                nextStep={mockNextStep}
                form={{}}
                updateDataStatus={mockUpdateDataStatus}
            />
        );

        expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });
});
