export const timeoutCheck = (error: any) => {
    const check = error.error === 'Error: timeout';
    return check;
};

interface ErrorResponse {
    response?: {
        status: number;
        data: {
            message?: string;
        };
    };
}

export const handleError = (error: any): string | null => {
    // Check if the error has a response object
    if (timeoutCheck(error)) return null;
    if (error) {
        // Check if the status code is 500
        if (error.status === 500) {
            return 'Something goes wrong';
        }
        // Return the error message from the response
        return error.data.message || 'An error occurred';
    }
    // Return a generic error message if there's no response object
    return 'An unknown error occurred';
};
