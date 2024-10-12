import { DeveloperSkill } from '@/types';
import { Button, Flex, Grid, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect } from 'react';
import DeleteModal from '../DeleteModal/DeleteModal';
import {
    useDeleteSkillMutation,
    useGetAllSkillsQuery,
    useUpdateSkillMutation
} from '@/lib/redux/api/developer/skill';
import { handleError } from '@/utils/error_handler';
import { toast } from 'react-toastify';
// Assuming this is your Skill component
export function EditSkill({
    close,
    handleDelete,
    skill
}: {
    close: () => void;
    handleDelete: () => void;
    skill: DeveloperSkill;
}) {
    // state to control the delete modal
    const [
        deleteModalOpened,
        { open: openDeleteModal, close: closeDeleteModal }
    ] = useDisclosure(false);

    const { data: skillList, isLoading: isLoadingSkills } =
        useGetAllSkillsQuery();

    const [updateSkill, { isLoading: isLoadingUpdate }] =
        useUpdateSkillMutation();
    const [deleteSkill, { isLoading: isLoadingDelete }] =
        useDeleteSkillMutation();

    const skills = skillList?.map((skill: any) => {
        return { label: skill.name, value: skill.id };
    });

    useEffect(() => {
        form.setFieldValue('id', skill.skillId);
        form.setFieldValue(
            'yearsOfExperience',
            skill.yearsOfExperience?.toString()
        );
        form.setFieldValue('competency', skill.competencyLevel?.toString());
    }, [skill]);

    const form = useForm({
        initialValues: {
            id: skill.skillId,
            yearsOfExperience: skill.yearsOfExperience?.toString(),
            competency: skill.competencyLevel?.toString()
        },
        validate: {}
    });

    const handleEditSkill = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const error = form.validate() as any;
        if (error.hasErrors) return;

        const values = {
            skillId: form.values.id,
            yearsOfExperience: parseInt(form.values.yearsOfExperience),
            competencyLevel: parseInt(form.values.competency)
        };

        updateSkill(values)
            .unwrap()
            .then((res) => {
                toast.success('Skill updated successfully');
                close();
            })
            .catch((err) => {
                const errorMessage = handleError(err);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    const handleDeleteSkill = () => {
        deleteSkill(form.values.id)
            .unwrap()
            .then((res: any) => {
                closeDeleteModal();
                toast.success('Skill deleted successfully');
                close();
            })
            .catch((err: any) => {
                const errorMessage = handleError(err);
                if (errorMessage !== null) {
                    toast.error(errorMessage);
                }
            });
    };

    return (
        <form onSubmit={handleEditSkill}>
            <Grid columns={12}>
                <Grid.Col span={12}>
                    <TextInput
                        label={'Skill'}
                        placeholder="Skill name"
                        required
                        {...form.getInputProps('name')}
                        value={skill.skill.name}
                        disabled
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Select
                        data={[
                            { label: '1 year', value: '1' },
                            { label: '2 years', value: '2' },
                            { label: '3 years', value: '3' },
                            { label: '4 years', value: '4' }
                        ]}
                        label={'Years of Experience'}
                        {...form.getInputProps('yearsOfExperience')}
                        placeholder="Years of Experience"
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Select
                        data={[
                            { label: 'Beginner', value: '0' },
                            {
                                label: 'Intermediate',
                                value: '1'
                            },
                            { label: 'Advanced', value: '2' }
                        ]}
                        label={'Competency'}
                        {...form.getInputProps('competency')}
                        placeholder="Competency Level"
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Flex justify="space-between" mt={24} gap={24}>
                        <Button
                            variant="default"
                            c={'red.6'}
                            onClick={openDeleteModal}
                        >
                            Delete
                        </Button>
                        <Button
                            w={'fit-content'}
                            type="submit"
                            loading={isLoadingUpdate}
                        >
                            Save
                        </Button>
                    </Flex>
                </Grid.Col>
            </Grid>
            <DeleteModal
                opened={deleteModalOpened}
                close={closeDeleteModal}
                onDelete={handleDeleteSkill}
                isLoading={isLoadingDelete}
                title="Delete Skill"
                message="Are you sure you want to delete this skill?"
            />
        </form>
    );
}
