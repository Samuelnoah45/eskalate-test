import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { UserInfo } from '@/types';

let initialState: UserInfo | null = null;

if (typeof window !== 'undefined') {
    const data = Cookies.get('login');
    if (data) {
        initialState = JSON.parse(data);
    }
}

export const loginSlice = createSlice({
    name: 'loginSlice',
    initialState,
    reducers: {
        setUser: (state: any, action) => {
            Cookies.set('login', JSON.stringify(action.payload), {
                path: '/',
                secure: true,
                sameSite: 'lax'
            });
            return action.payload;
        },
        unsetUser: (state: any) => {
            Cookies.remove('login', { path: '/' });
            return null;
        },
        refreshUserToken: (state: any, action) => {
            const { token } = action.payload;
            const user = state;
            user.accessToken = token;
            Cookies.set('login', JSON.stringify(user), {
                path: '/',
                secure: true,
                sameSite: 'lax'
            });
            return user;
        }
    }
});

export const { setUser, unsetUser, refreshUserToken } = loginSlice.actions;
