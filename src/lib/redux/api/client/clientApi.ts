import { AddClinetInf, Developer, Education, Experience } from '@/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const clientApi = createApi({
    reducerPath: 'clientApi',
    baseQuery: fetchBaseQuery({
        // baseUrl: 'https://eskalate-backend.onrender.com',
        baseUrl: process.env.NEXT_PUBLIC_ESKALATE_BACKEND_URL,
        prepareHeaders: (headers, { getState }) => {
            return headers;
        }
        // mode: 'no-cors'
    }),
    tagTypes: ['Developer', 'Education', 'Project', 'Experience', 'Skill'],
    endpoints: (builder) => ({
        registerClient: builder.mutation<any, any>({
            query: (body: AddClinetInf) => ({
                url: `v1/guestClient/addGuestClient`,
                method: 'POST',
                body
            })
        }),
        updateClient: builder.mutation<any, any>({
            query: (body) => ({
                url: `v1/guestClient/updateGuestClientInfo/${body.id}`,
                method: 'PUT',
                body: body.api
            })
        }),
        getSkills: builder.query({
            query: (body) => ({
                url: `/v1/skills/getAll`,
                method: 'GET'
            })
        })
    })
});

export const {
    useRegisterClientMutation,
    useUpdateClientMutation,
    useGetSkillsQuery
} = clientApi;
