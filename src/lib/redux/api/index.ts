import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/lib/redux/index';
import { Mutex } from 'async-mutex';
import { refreshUserToken, unsetUser } from '../slices/loginSlice';
import { toast } from 'react-toastify';

// Create a Mutex instance
const mutex = new Mutex();

const fetchWithTimeout = async (
    input: any,
    init?: any,
    timeout: number = 35000
): Promise<Response> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(input, {
            ...init,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            toast.error('Request timed out!');
            throw new Error('timeout');
        } else if (error instanceof TypeError) {
            toast.error('Please, Connect to the internet and try again.');
            throw new Error('timeout');
        }
        throw error;
    }
};

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_ESKALATE_BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).login?.accessToken;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
    fetchFn: fetchWithTimeout
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // checking whether the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            const refreshToken = (api as any).getState().login?.refreshToken;
            try {
                const refreshResult: any = await baseQuery(
                    {
                        url: '/v1/refresh-token',
                        method: 'POST',
                        body: {
                            refreshToken: refreshToken // replace this with your actual refresh token
                        }
                    },
                    api,
                    extraOptions
                );
                if (refreshResult.data) {
                    api.dispatch(
                        refreshUserToken({
                            token: refreshResult.data.accessToken
                        })
                    );

                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(unsetUser());
                }
            } finally {
                // release must be called once the mutex should be released again.
                release();
            }
        } else {
            // wait until the mutex is available without locking it
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Developer', 'Education', 'Project', 'Experience', 'Skill'],
    endpoints: () => ({})
});
