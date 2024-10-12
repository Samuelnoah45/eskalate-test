// PasswordStrengthIndicator.tsx
'use client';

import React, { useState } from 'react';
import { Box, Text, Tooltip } from '@mantine/core';
import style from './style.module.css';

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const evaluateStrength = (password: string) => {
        return {
            length: password.length >= 8,
            upperCase: /[A-Z]/.test(password),
            lowerCase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*]/.test(password)
        };
    };

    const strength = evaluateStrength(password);

    const getStrengthPercentage = () => {
        const { length, upperCase, lowerCase, number, specialChar } = strength;
        const strengthCount = [
            length,
            upperCase,
            lowerCase,
            number,
            specialChar
        ].filter(Boolean).length;
        return (strengthCount / 5) * 100;
    };

    const getStrengthColor = () => {
        const percentage = getStrengthPercentage();
        if (percentage === 100) return 'green';
        if (percentage >= 60) return 'orange';
        return 'red';
    };

    const tooltipLabel = (
        <ul style={{ margin: 0, padding: '8px 16px' }}>
            <Text
                component="li"
                style={{ color: strength.length ? 'green' : 'red' }}
            >
                At least 8 characters
            </Text>
            <Text
                component="li"
                style={{ color: strength.upperCase ? 'green' : 'red' }}
            >
                At least one uppercase letter
            </Text>
            <Text
                component="li"
                style={{ color: strength.lowerCase ? 'green' : 'red' }}
            >
                At least one lowercase letter
            </Text>
            <Text
                component="li"
                style={{ color: strength.number ? 'green' : 'red' }}
            >
                At least one number
            </Text>
            <Text
                component="li"
                style={{ color: strength.specialChar ? 'green' : 'red' }}
            >
                At least one special character
            </Text>
        </ul>
    );

    return (
        <Tooltip
            multiline
            w={320}
            withArrow
            label={tooltipLabel}
            opened={showTooltip}
            color="white"
            style={{
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                padding: '10px'
            }}
            transitionProps={{ transition: 'fade', duration: 300 }}
        >
            <Box
                className={style.progressBarContainer}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <Box
                    className={style.progressBar}
                    style={{
                        width: `${getStrengthPercentage()}%`,
                        backgroundColor: getStrengthColor()
                    }}
                ></Box>
            </Box>
        </Tooltip>
    );
};

export default PasswordStrengthIndicator;
