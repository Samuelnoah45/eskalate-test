import {
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    Select,
    Text,
    TextInput
} from '@mantine/core';
import React from 'react';
import { useUpdateEducationMutation } from '@/lib/redux/api/developer/education';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import dayjs from 'dayjs';
import Placeholder from '@tiptap/extension-placeholder';
import { toast } from 'react-toastify';
import { isNotEmpty, useForm } from '@mantine/form';
import { handleError } from '@/utils/error_handler';

interface EditEducationFormProps {
    education: any;
    close: () => void;
}

const EditEducationForm: React.FC<EditEducationFormProps> = (props) => {
    const { education, close } = props;

    const [content, setContent] = React.useState<string>(
        education?.description || ''
    );

    const [
        updateEducation,
        { isLoading: isUpdating, isSuccess: isUpdatingSuccess }
    ] = useUpdateEducationMutation();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            Placeholder.configure({
                placeholder: 'Write you education description here'
            })
        ],
        content: content,
        onUpdate: ({ editor }: { editor: any }) => {
            if (editor.getHTML().length <= 1000) {
                setContent(editor.getHTML());
            } else {
                editor.commands.setContent(content);
            }
        }
    });

    const form = useForm({
        initialValues: {
            collageName: education.institutionName
                ? education.institutionName
                : '',
            degree: education.degree ? education.degree : 'No Formal Education',
            present: education.isEndDatePresent ? true : false,
            description: education.description ? education.description : '',
            country: education.country ? education.country : '',
            city: education.city ? education.city : '',
            department: education.field ? education.field : '',
            startDate: dayjs(education.startDate).format('YYYY-MM'),
            endDate: dayjs(education.endDate).format('YYYY-MM')
        },

        validate: {
            collageName: isNotEmpty('This field is required'),
            department: isNotEmpty('This field is required'),
            startDate: (value) => {
                if (value === '') {
                    return 'This field is required';
                }
            },
            endDate: (value) => {
                if (!form.values.present) {
                    if (value === '') {
                        return 'This field is required';
                    }
                }
            }
        }
    });

    const handleSubmit = () => {
        const res = form.validate();
        if (res.hasErrors) {
            return;
        }

        const present = new Date().toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });

        const updatedEducation = {
            id: education.id,
            institutionName: form.values.collageName,
            field: form.values.department,
            degree: form.values.degree,
            startDate:
                form.values.startDate.length === 0
                    ? education.startDate
                    : form.values.startDate,
            endDate: form.values.present
                ? present
                : form.values.endDate.length === 0
                  ? education.endDate
                  : form.values.endDate,
            description: content,
            country: form.values.country,
            city: form.values.city,
            isEndDatePresent: form.values.present
        };

        updateEducation(updatedEducation)
            .unwrap()
            .then((data: any) => {
                close();
                toast.success('Education updated successfully');
            })
            .catch((error: any) => {
                const errorMessage = handleError(error);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    return (
        <Box
            maw={900}
            mx="auto"
            component="form"
            onSubmit={form.onSubmit((values: any) => handleSubmit())}
        >
            <Grid gutter={'lg'}>
                <Grid.Col span={{ base: 12 }}>
                    <TextInput
                        withAsterisk
                        label="School"
                        placeholder="AASTU"
                        {...form.getInputProps('collageName')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        withAsterisk
                        label="Department"
                        placeholder="Computer Science"
                        {...form.getInputProps('department')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                        label="Degree"
                        data={[
                            'Coding Academy',
                            "Associate's Degree",
                            "Bachelor's Degree",
                            "Master's Degree",
                            'Doctoral or Professional Degree',
                            'Others'
                        ]}
                        {...form.getInputProps('degree')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                        label="Country"
                        placeholder="Ethiopia"
                        data={[
                            'Algeria',
                            'Angola',
                            'Benin',
                            'Botswana',
                            'Burkina Faso',
                            'Burundi',
                            'Cabo Verde',
                            'Cameroon',
                            'Central African Republic',
                            'Chad',
                            'Comoros',
                            'Democratic Republic of the Congo',
                            'Republic of the Congo',
                            'Djibouti',
                            'Egypt',
                            'Equatorial Guinea',
                            'Eritrea',
                            'Eswatini',
                            'Ethiopia',
                            'Gabon',
                            'Gambia',
                            'Ghana',
                            'Guinea',
                            'Guinea-Bissau',
                            'Ivory Coast',
                            'Kenya',
                            'Lesotho',
                            'Liberia',
                            'Libya',
                            'Madagascar',
                            'Malawi',
                            'Mali',
                            'Mauritania',
                            'Mauritius',
                            'Morocco',
                            'Mozambique',
                            'Namibia',
                            'Niger',
                            'Nigeria',
                            'Rwanda',
                            'Sao Tome and Principe',
                            'Senegal',
                            'Seychelles',
                            'Sierra Leone',
                            'Somalia',
                            'South Africa',
                            'South Sudan',
                            'Sudan',
                            'Tanzania',
                            'Togo',
                            'Tunisia',
                            'Turkey',
                            'Uganda',
                            'Zambia',
                            'Zimbabwe'
                        ]}
                        {...form.getInputProps('country')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        label="City"
                        placeholder="Addis Ababa"
                        {...form.getInputProps('city')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        type="month"
                        label="Start date"
                        withAsterisk
                        {...form.getInputProps('startDate')}
                        max={new Date().toISOString().slice(0, 7)}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        type="month"
                        label="End date"
                        withAsterisk
                        disabled={form.values.present || !form.values.startDate}
                        {...form.getInputProps('endDate')}
                        min={form.values.startDate}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 0, md: 6 }}></Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Checkbox
                        label="Present"
                        className="font-light"
                        {...form.getInputProps('present')}
                        checked={form.values.present}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                    <RichTextEditor editor={editor}>
                        <RichTextEditor.Toolbar sticky>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold />
                                <RichTextEditor.BulletList />
                                <RichTextEditor.OrderedList />
                            </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>

                        <RichTextEditor.Content />
                    </RichTextEditor>
                    {/* maximum number of characters */}
                    <Text mt={5}>
                        {editor?.getText().length} /{1000} characters
                    </Text>
                    <Text mt={5} c={'red'}>
                        {content.length >= 1000 &&
                            "You've reached the maximum number of characters"}
                    </Text>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Flex gap={24} mt={24} justify={'flex-end'}>
                        <Button
                            disabled={isUpdating}
                            variant="default"
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleSubmit()}
                            loading={isUpdating}
                        >
                            Save
                        </Button>
                    </Flex>
                </Grid.Col>
            </Grid>
        </Box>
    );
};

export default EditEducationForm;
