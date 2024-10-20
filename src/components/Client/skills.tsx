'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import {
    Button,
    Grid,
    Text,
    Flex,
    CloseButton,
    MultiSelect,
    Group
} from '@mantine/core';
import SignupStyle from './Signup.module.css';
import { useDisclosure } from '@mantine/hooks';
import { useGetSkillsQuery } from '@/lib/redux/api/client/clientApi';
import { BiCheck } from 'react-icons/bi';
import { skillStacks } from '@/utils/constants/hire';
const Skills = ({ form, skipStep, nextStep }: any) => {
    const { isLoading, isError, isSuccess, data, error } = useGetSkillsQuery(
        {}
    );
    const techs = form.getInputProps('technologies').value;
    const skillsValue: string[] = form.getInputProps('skills').value;
    const [dropdownOpened, { toggle, open }] = useDisclosure();
    const validate = () => {
        const temporary = data.filter((d: any) => techs.indexOf(d.name) != -1);
        const t = temporary.map((d: any) => d.id);
        form.setFieldValue('apiTechnologies', t);
        nextStep();
    };

    const c = () => {
        let temp = data.map((d: any) => d.name);
        temp = new Set(temp);
        return [...temp];
    };

    const skillsData = isSuccess ? c() : [];

    return (
        <Group className={SignupStyle.main_info}>
            <Text fw={700} className={SignupStyle.signupText}>
                Connecting You With Skilled Talent!!
            </Text>

            <Grid gutter={20} style={{ width: 'fit-content' }}>
                <Grid.Col style={{ background: '' }}>
                    <Text size="md" mb="md">
                        Help us match you with the right talent by providing the
                        following information.
                    </Text>
                </Grid.Col>
                <Grid.Col style={{ background: '' }}>
                    <Text size="md" fw={600}>
                        what skill would you like to see in your new hire ?
                    </Text>
                    <Flex
                        gap="md"
                        mt={'md'}
                        justify="flex-start"
                        align="flex-start"
                        direction="row"
                        style={{
                            flexWrap: 'wrap'
                        }}
                    >
                        {skillStacks.map((data) => (
                            <Button
                                key={data}
                                bg={
                                    skillsValue.indexOf(data) == -1
                                        ? '#e4f4fd'
                                        : ''
                                }
                                onClick={() => {
                                    skillsValue.indexOf(data) == -1
                                        ? form.setFieldValue('skills', [
                                              ...skillsValue,
                                              data
                                          ])
                                        : form.setFieldValue('skills', [
                                              ...skillsValue.filter(
                                                  (val) => val != data
                                              )
                                          ]);
                                }}
                                variant={`${skillsValue.indexOf(data) == -1 && 'outline'}`}
                                radius="xl"
                                rightSection={
                                    skillsValue.indexOf(data) != -1 && (
                                        <BiCheck style={{ fontSize: '20px' }} />
                                    )
                                }
                            >
                                {data}
                            </Button>
                        ))}
                    </Flex>
                    <Text mt={'xl'} fw={600}>
                        Technology Stacks
                    </Text>
                    <MultiSelect
                        data={skillsData}
                        value={[]}
                        searchable
                        checkIconPosition="right"
                        placeholder="search skill"
                        onClick={() => {
                            toggle();
                        }}
                        onChange={(data) => {
                            toggle();
                            techs.indexOf(data[0]) == -1 &&
                                form.setFieldValue('technologies', [
                                    ...form.getInputProps('technologies').value,
                                    data[0]
                                ]);
                        }}
                        mt={'sm'}
                        dropdownOpened={dropdownOpened}
                        nothingFoundMessage="Nothing found..."
                        // style={{ width: '70%' }}
                        className={SignupStyle.multiSelect}
                    />
                    <Flex
                        gap="md"
                        mt={'lg'}
                        justify="flex-start"
                        align="flex-start"
                        direction="row"
                        wrap="wrap"
                    >
                        {techs.map((data: string) => (
                            <Button
                                variant={`outline`}
                                bg={'#e4f4fd'}
                                radius="xl"
                                key={data}
                                rightSection={
                                    <CloseButton
                                        style={{
                                            color: 'var(--mantine-color-primary-6)'
                                        }}
                                        onClick={() => {
                                            form.setFieldValue(
                                                'technologies',
                                                techs.filter(
                                                    (temp: string) =>
                                                        temp != data
                                                )
                                            );
                                        }}
                                    />
                                }
                            >
                                {data}
                            </Button>
                        ))}
                    </Flex>
                </Grid.Col>
                <Grid.Col
                    mt={'xl'}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <div></div>

                    <Button onClick={validate} className={SignupStyle.applyBtn}>
                        Next
                    </Button>
                </Grid.Col>
            </Grid>
        </Group>
    );
};

export default Skills;
