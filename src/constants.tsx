import { Text, Tooltip } from '@mantine/core';
import {
    IconBrandGithubFilled,
    IconBrandLeetcode,
    IconBrandLinkedin,
    IconLink
} from '@tabler/icons-react';
import { SiCodeforces } from 'react-icons/si';
import countryList from 'react-select-country-list';

export const socialLinks = {
    linkedin: (
        <Tooltip label="Linkedin">
            <IconBrandLinkedin />
        </Tooltip>
    ),
    github: (
        <Tooltip label="Github">
            <IconBrandGithubFilled />
        </Tooltip>
    ),
    leetcode: (
        <Tooltip label="Leetcode">
            <IconBrandLeetcode />
        </Tooltip>
    ),
    codeforces: (
        <Tooltip label="Codeforces">
            <Text>
                <SiCodeforces />
            </Text>
        </Tooltip>
    ),
    portfolio: (
        <Tooltip label="Portfolio">
            <IconLink />
        </Tooltip>
    )
};

export const COUNTRIES = countryList()
    .getData()
    .map((country) => {
        return {
            label: country.label,
            value: country.label
        };
    });

// dictionary of links
