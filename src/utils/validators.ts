export function validateURL(value: string): string | null {
    try {
        new URL(value);
        return null; // Valid URL
    } catch (_) {
        return 'Please enter a valid URL';
    }
}
