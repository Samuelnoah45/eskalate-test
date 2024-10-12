import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useContactUsMutation } from '@/lib/redux/api/contact/contactApi';

export const useContactUs = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [ContactUs] = useContactUsMutation();

    return {
        addContactUshanlder: async (data: any) => {
            try {
                const response = await ContactUs(data);
            } catch (error) {
                return null;
            }
        }
    };
};
