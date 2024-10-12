import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import ReduxProvider from '@/Providers/ReduxProvider';

export function render(ui: React.ReactNode) {
    return testingLibraryRender(ui, {
        wrapper: ({ children }) => (
            <ReduxProvider>
                <MantineProvider theme={theme}>{children}</MantineProvider>
            </ReduxProvider>
        )
    });
}
