import { COUNTRIES } from '@/constants';
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    MultiSelect,
    Select,
    Text,
    TextInput
} from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import React from 'react';

interface EditExperienceFormProps {
    form: any;
    handleSubmit: (values: any) => void;
    close: () => void;
    companyEditor: Editor | null;
    companyDescriptionEditor: string;
    skills: any;
    projectEditor: Editor | null;
    projectResponsibilitiesEditor: string;
    isUpdating: boolean;
}

const EditExperienceForm: React.FC<EditExperienceFormProps> = (props) => {
    const {
        form,
        handleSubmit,
        companyEditor,
        companyDescriptionEditor,
        projectEditor,
        projectResponsibilitiesEditor,
        skills,
        isUpdating,
        close
    } = props;
    return (
        <Box
            // maw={900}
            mx="auto"
            component="form"
            onSubmit={form.onSubmit((e: any) => handleSubmit(e))}
        >
            <Grid maw={900} mx="auto" gutter={'lg'}>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        withAsterisk
                        label="Company name"
                        placeholder="A2SV"
                        {...form.getInputProps('collageName')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        label="Company website"
                        placeholder="http://example.com"
                        {...form.getInputProps('companyWebsite')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                    <h3
                        style={{
                            marginBottom: '2px',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}
                    >
                        Company description
                    </h3>

                    <RichTextEditor
                        editor={companyEditor}
                        style={{
                            backgroundColor: 'rgba(0, 0, 255, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '2px'
                        }}
                    >
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
                        {companyEditor?.getText().length} /{1000} characters
                    </Text>
                    <Text mt={5} c={'red'}>
                        {companyDescriptionEditor?.length >= 1000 &&
                            "You've reached the maximum number of characters"}
                    </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                        withAsterisk
                        label="Designation"
                        placeholder="Full Stack Developer"
                        {...form.getInputProps('designation')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <MultiSelect
                        label="Skills"
                        placeholder="Select skills"
                        searchable
                        data={
                            skills
                                ? skills.map((skill: any) => skill.label)
                                : []
                        }
                        {...form.getInputProps('favoriteLibraries')}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                        label="Country"
                        placeholder="Ethiopia"
                        data={COUNTRIES}
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
                <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Checkbox
                        label="Present"
                        className="font-light"
                        {...form.getInputProps('present')}
                        checked={form.values.present}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                    <h3
                        style={{
                            marginBottom: '2px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Project description
                    </h3>

                    <RichTextEditor editor={projectEditor}>
                        <RichTextEditor.Toolbar sticky>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold />
                                <RichTextEditor.BulletList />
                                <RichTextEditor.OrderedList />
                            </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>

                        <RichTextEditor.Content />
                    </RichTextEditor>
                    <Text mt={5}>
                        {projectEditor?.getText().length} /{1000} charactersss
                    </Text>
                    <Text mt={5} c={'red'}>
                        {projectResponsibilitiesEditor?.length >= 1000 &&
                            "You've reached the maximum number of characters"}
                    </Text>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Flex gap={24} mt={24} justify={'flex-end'}>
                        <Button variant="default" onClick={() => close()}>
                            {' '}
                            Cancel
                        </Button>
                        <Button type="submit" loading={isUpdating}>
                            Save
                        </Button>
                    </Flex>
                </Grid.Col>
            </Grid>
        </Box>
    );
};

export default EditExperienceForm;
