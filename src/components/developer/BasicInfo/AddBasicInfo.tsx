import {
    ActionIcon,
    Box,
    Button,
    Flex,
    Grid,
    Group,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput
} from '@mantine/core';
import { isNotEmpty, matches, useForm } from '@mantine/form';
import React from 'react';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { socialLinks } from '@/constants';
import classes from './BasicInfo.module.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
    useGetDeveloperQuery,
    useUpdateDeveloperMutation
} from '@/lib/redux/api/developer/developer';
import { toast } from 'react-toastify';
import { handleError } from '@/utils/error_handler';
import dayjs from 'dayjs';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { validateURL } from '@/utils/validators';

export function AddBasicInfo({
    close,
    basicInfo: developer
}: {
    close: () => void;
    basicInfo: any;
}) {
    const generationData = [
        {
            label: 'G-12',
            value: '12'
        },
        {
            label: 'G-31',
            value: '31'
        },
        {
            label: 'G-32',
            value: '32'
        },
        {
            label: 'G-33',
            value: '33'
        },
        {
            label: 'G-3 Remote (P1)',
            value: '3 Remote'
        },
        {
            label: 'G-41',
            value: '41'
        },
        {
            label: 'G-42',
            value: '42'
        },
        {
            label: 'G-43',
            value: '43'
        },
        {
            label: 'G-44',
            value: '44'
        },
        {
            label: 'G-45',
            value: '45'
        },
        {
            label: 'G-46',
            value: '46'
        },
        {
            label: 'G-47 Remote',
            value: '47 Remote'
        },
        {
            label: 'G-48 Remote',
            value: '48 Remote'
        },
        {
            label: 'G-49 Remote',
            value: '49 Remote'
        },
        {
            label: 'G-4A Remote',
            value: '4A Remote'
        },
        {
            label: 'G-51',
            value: '51'
        },
        {
            label: 'G-52',
            value: '52'
        },
        {
            label: 'G-53',
            value: '53'
        },
        {
            label: 'G-54',
            value: '54'
        },
        {
            label: 'G-55',
            value: '55'
        },
        {
            label: 'G-56',
            value: '56'
        },
        {
            label: 'G-57',
            value: '57'
        },
        {
            label: 'G-58',
            value: '58'
        },
        {
            label: 'G-59',
            value: '59'
        },
        {
            label: 'G-5A Remote',
            value: '5A Remote'
        },
        {
            label: 'G-5B Remote',
            value: '5B Remote'
        },
        {
            label: 'G-5C Remote',
            value: '5C Remote'
        },
        {
            label: 'G-5D Remote',
            value: '5D Remote'
        },
        {
            label: 'G-5E Remote',
            value: '5E Remote'
        },
        {
            label: 'G-5F Remote',
            value: '5F Remote'
        },
        {
            label: 'G-5G Remote',
            value: '5G Remote'
        }
    ];
    const [updateDeveloper, { isLoading, status, isSuccess, error }] =
        useUpdateDeveloperMutation();

    const { data: devProfile } = useGetDeveloperQuery({});
    // remove the id from the links
    const initialSocialLinks = developer?.socialLinks.map((social: any) => {
        return {
            name: social.name,
            url: social.url
        };
    });

    const phoneUtil = PhoneNumberUtil.getInstance();

    const form = useForm<{
        firstName: string;
        lastName: string;
        country: string;
        engineering: string;
        phoneNumber: string;
        yearsOfExperience: number;
        calendlyLink: string;
        socialMedia: [{ name: string; url: string }];
        city: string;
        a2svGroup: string;
        graduationDate: Date | string;
    }>({
        initialValues: {
            lastName: developer?.user.fullName.split(' ')[1] || '',
            firstName: developer?.user.fullName.split(' ')[0] || '',
            country: developer?.user.country || '',
            engineering: developer?.title || '',
            yearsOfExperience: developer?.yearsOfExperience || 0.0,
            phoneNumber: devProfile?.user.phoneNumber || '',
            calendlyLink: '',
            socialMedia: initialSocialLinks || [],
            city: developer?.user?.city || '',
            a2svGroup: developer?.a2svGroup || '',
            graduationDate:
                dayjs(developer?.graduationDate).format('YYYY-MM') || ''
        },
        validate: {
            firstName: (value: string) =>
                value.length > 0 ? null : 'First ame is required',
            lastName: (value: string) =>
                value.length > 0 ? null : 'Last name is required',
            country: (value: string) => (!value ? 'Country is required' : null),
            city: (value: string) =>
                value.length > 0 ? null : 'City is required',
            engineering: (value: string) =>
                !value ? 'Engineering category is required' : null,
            yearsOfExperience: (value: number) => {
                const [years, months] = value.toString().split('.');
                if (parseInt(years) < 0) {
                    return 'Years of experience cannot be negative';
                }
                if (months && parseInt(months) > 11) {
                    return 'Months part of experience should be between 0 and 11';
                }
                return null;
            },
            phoneNumber: (value: string) => {
                try {
                    const parsedNumber = value
                        ? phoneUtil.parse('+' + value)
                        : '';
                    return parsedNumber && phoneUtil.isValidNumber(parsedNumber)
                        ? null
                        : 'Invalid phone number';
                } catch (e) {
                    return 'Invalid phone number format';
                }
            },
            socialMedia: {
                url: (value: string) => validateURL(value)
            },
            a2svGroup: (value: string) => (!value ? 'Group is required' : null),
            graduationDate: isNotEmpty('Graduation date is required')
        }
    });

    const handleAddBasicInfo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const error = form.validate() as any;
        if (error.hasErrors) return;

        const newValue = {
            fullName: form.values.firstName + ' ' + form.values.lastName,
            country: form.values.country,
            phoneNumber: '+' + form.values.phoneNumber,
            title: form.values.engineering,
            yearsOfExperience: form.values.yearsOfExperience,
            socialLinks: form.values.socialMedia,
            city: form.values.city,
            a2svGroup: form.values.a2svGroup,
            graduationDate: form.values.graduationDate
        };

        newValue.phoneNumber = newValue.phoneNumber.replace('++', '+');

        updateDeveloper(newValue)
            .unwrap()
            .then((data: any) => {
                toast.success('Profile updated successfully');
                close();
            })
            .catch((error: any) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };
    return (
        <form onSubmit={handleAddBasicInfo}>
            <Grid columns={12}>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                        withAsterisk
                        label={'First Name'}
                        {...form.getInputProps('firstName')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                        withAsterisk
                        label={'Last Name'}
                        {...form.getInputProps('lastName')}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Select
                        withAsterisk
                        data={[
                            { label: 'Ethiopia', value: 'Ethiopia' },
                            { label: 'Kenya', value: 'Kenya' },
                            { label: 'Ghana', value: 'Ghana' },
                            { label: 'Egypt', value: 'Egypt' }
                        ]}
                        label={'Country'}
                        {...form.getInputProps('country')}
                        placeholder="Country"
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        withAsterisk
                        label="City"
                        {...form.getInputProps('city')}
                        placeholder="City"
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                        withAsterisk
                        data={[
                            {
                                label: 'Frontend Developer',
                                value: 'Frontend Developer'
                            },
                            {
                                label: 'Backend Developer',
                                value: 'Backend Developer'
                            },
                            {
                                label: 'UI/UX Designer',
                                value: 'UI/UX Designer'
                            },
                            {
                                label: 'Mobile Developer',
                                value: 'Mobile Developer'
                            },
                            {
                                label: 'Full Stack Developer',
                                value: 'Full Stack Developer'
                            }
                        ]}
                        label={'Engineering Category'}
                        {...form.getInputProps('engineering')}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <NumberInput
                        label="Total yrs of Exp"
                        placeholder="0.0"
                        decimalScale={2}
                        fixedDecimalScale
                        defaultValue={0.2}
                        min={0.0}
                        {...form.getInputProps('yearsOfExperience')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Flex style={{ marginBottom: '5px' }} gap={5}>
                        <Text fw={500}>Phone Number</Text>
                        <span style={{ color: 'red' }}> *</span>
                    </Flex>
                    <PhoneInput
                        country={'et'}
                        isValid={(value, country) => {
                            if (
                                form.isTouched('phoneNumber') &&
                                value.length < 5
                            ) {
                                return false;
                            }
                            return true;
                        }}
                        containerStyle={{ width: '100%', border: 'none' }}
                        inputStyle={{
                            width: '100%'
                        }}
                        value={form.values.phoneNumber}
                        onChange={(new_number) => {
                            form.setFieldValue('phoneNumber', new_number);
                        }}
                        placeholder="Phone Number"
                    />
                    {form.errors?.phoneNumber && (
                        <Text style={{ fontSize: '13px' }} mt="1px" color="red">
                            invalid phone number
                        </Text>
                    )}
                </Grid.Col>
                {/*<Grid.Col span={6}>
                    <TextInput
                        label={'Calendly Link'}
                        {...form.getInputProps('calendlyLink')}
                    />
                </Grid.Col>*/}
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Select
                        withAsterisk
                        data={generationData}
                        label={'Generation'}
                        {...form.getInputProps('a2svGroup')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <TextInput
                        type="month"
                        label="Graduation Date"
                        {...form.getInputProps('graduationDate')}
                        withAsterisk
                    />
                </Grid.Col>
                <Grid.Col span={12}>
                    <Text size="sm" fw={500} mb={10}>
                        Links
                    </Text>
                    <Stack gap={5} pl={10}>
                        {form.values.socialMedia.map((social, index) => {
                            return (
                                <TextInput
                                    key={index}
                                    label={social.name}
                                    {...form.getInputProps(
                                        `socialMedia.${index}.url`
                                    )}
                                    classNames={{
                                        label: classes.input_label
                                    }}
                                    rightSection={
                                        <ActionIcon
                                            variant="transparent"
                                            color="red"
                                            onClick={() =>
                                                form.removeListItem(
                                                    'socialMedia',
                                                    index
                                                )
                                            }
                                        >
                                            <IconTrash
                                                size="1rem"
                                                style={{
                                                    color: 'var(--mantine-color-red-5)'
                                                }}
                                            />
                                        </ActionIcon>
                                    }
                                />
                            );
                        })}
                    </Stack>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Flex gap={10} wrap={'wrap'}>
                        {Object.keys(socialLinks)
                            .filter((value) => {
                                return !form.values.socialMedia.some(
                                    (social) => social.name === value
                                );
                            })

                            .map((value, index) => {
                                return (
                                    <Group
                                        key={index}
                                        style={{
                                            border: '1px solid',
                                            borderColor:
                                                'var(--mantine-color-default-border)',
                                            borderRadius: '30px',
                                            padding: '5px 10px',
                                            cursor: 'pointer'
                                        }}
                                        gap={2}
                                        onClick={() =>
                                            form.insertListItem('socialMedia', {
                                                name: value,
                                                url: ''
                                            })
                                        }
                                        align="center"
                                    >
                                        <IconPlus
                                            size="1rem"
                                            style={{
                                                color: 'var(--mantine-color-gray-5)'
                                            }}
                                        />
                                        <Text size="xs" c={'gray.7'}>
                                            {value}
                                        </Text>
                                    </Group>
                                );
                            })}
                    </Flex>
                </Grid.Col>
                {error && (
                    <Grid.Col span={{ base: 12, lg: 12 }}>
                        <Text
                            style={{
                                color: 'red'
                            }}
                        >
                            {(error as any).data?.message}
                        </Text>
                    </Grid.Col>
                )}
                <Grid.Col span={12}>
                    <Flex gap={24} mt={20} justify={'flex-end'}>
                        <Button
                            disabled={isLoading}
                            variant="default"
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={isLoading}>
                            Save
                        </Button>
                    </Flex>
                </Grid.Col>
            </Grid>
        </form>
    );
}
