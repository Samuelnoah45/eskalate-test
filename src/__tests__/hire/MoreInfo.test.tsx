import { render, screen, fireEvent } from '../../utils/test_utils';
import MoreInfo from '@/components/Client/more_info'; // Adjust the import path as necessary

// Mock form object
const mockForm = {
    getInputProps: jest.fn().mockReturnValue({
        value: ''
    }),
    setFieldValue: jest.fn()
};

const mockNextStep = jest.fn();
const mockSkipStep = jest.fn();

describe('MoreInfo Component', () => {
    beforeEach(() => {
        render(
            <MoreInfo
                form={mockForm}
                skipStep={mockSkipStep}
                nextStep={mockNextStep}
            />
        );
    });

    it('renders the component with correct elements', () => {
        expect(
            screen.getByText('Connecting You With Skilled Talent!')
        ).toBeInTheDocument();
        expect(
            screen.getByText('What level of time commitment will you require?')
        ).toBeInTheDocument();
        expect(
            screen.getByText('How long do you expect this engagement to last?')
        ).toBeInTheDocument();
        expect(
            screen.getByText('When do you want to start ?')
        ).toBeInTheDocument();
    });

    it('handles commitment selection correctly', () => {
        const commitmentButton = screen.getByText('Part Time');
        fireEvent.click(commitmentButton);
        expect(mockForm.setFieldValue).toHaveBeenCalledWith(
            'commitment',
            'Part Time'
        );
    });

    it('handles howLong selection correctly', () => {
        const howLongButton = screen.getByText('1 Month');
        fireEvent.click(howLongButton);
        expect(mockForm.setFieldValue).toHaveBeenCalledWith(
            'howLong',
            '1 Month'
        );
    });

    it('triggers the next step when the Next button is clicked', () => {
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        expect(mockNextStep).toHaveBeenCalled();
    });

    it('triggers the skip step when the Previous button is clicked', () => {
        const previousButton = screen.getByText('Previous');
        fireEvent.click(previousButton);
        expect(mockSkipStep).toHaveBeenCalled();
    });
});
