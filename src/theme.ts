import {
    Input,
    Modal,
    createTheme,
    TextInput,
    Select,
    MultiSelect,
    Button,
    PasswordInput,
    NumberInput,
    MantineColorsTuple
} from '@mantine/core';

const primary: MantineColorsTuple = [
    '#1A1A1D',
    '#1C1C20',
    '#1E1E23',
    '#202024',
    '#222226',
    '#18181B',
    '#141418',
    '#101012',
    '#0C0C0E',
    '#000000'
];

const secondary: MantineColorsTuple = [
    '#fff4e1',
    '#ffe8cc',
    '#fed09b',
    '#fdb766',
    '#fca13a',
    '#fc931d',
    '#fc8c0c',
    '#e17800',
    '#c86a00',
    '#af5a00'
];

export const theme = createTheme({
    colors: {
        primary: primary,
        secondary: secondary
    },
    primaryColor: 'primary',
    fontSizes: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
        '6xl': '60px'
    },
    components: {
        Modal: Modal.extend({
            defaultProps: {
                padding: 32,
                radius: 8,
                closeOnClickOutside: false
            }
        }),
        TextInput: TextInput.extend({
            styles: {
                label: {
                    marginBottom: '5px'
                }
            },
            defaultProps: {
                size: 'md'
            }
        }),
        NumberInput: NumberInput.extend({
            styles: {
                label: {
                    marginBottom: '5px'
                }
            },
            defaultProps: {
                size: 'md'
            }
        }),
        PasswordInput: PasswordInput.extend({
            styles: {
                label: {
                    marginBottom: '5px'
                }
            },
            defaultProps: {
                size: 'md'
            }
        }),
        Select: Select.extend({
            styles: {
                label: {
                    marginBottom: '5px'
                }
            },
            defaultProps: {
                size: 'md',
                // variant: 'filled',
                searchable: true
            }
        }),
        MultiSelect: Select.extend({
            styles: {
                label: {
                    marginBottom: '5px'
                }
            },
            defaultProps: {
                size: 'md',
                // variant: 'filled',
                searchable: true
            }
        }),
        Button: Button.extend({
            defaultProps: {
                size: 'md'
            }
        })
    }
});
