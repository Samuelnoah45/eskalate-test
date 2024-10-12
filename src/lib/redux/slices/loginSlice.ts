import { createSlice } from '@reduxjs/toolkit';
import { UserInfo } from '@/types';

let initialState: UserInfo | null = null;

if (typeof window !== 'undefined') {
    // Perform localStorage action

    const data = localStorage.getItem('login');
    if (data) {
        initialState = JSON.parse(data);
    }
}

export const loginSlice = createSlice({
    name: 'loginSlice',
    initialState,
    reducers: {
        setUser: (state: any, action) => {
            localStorage.setItem('login', JSON.stringify(action.payload));
            // set it to cookie
            document.cookie = `login=${encodeURIComponent(
                JSON.stringify(action.payload)
            )}; path=/; secure; samesite=lax`;
            return action.payload;
        },
        unsetUser: (state: any) => {
            localStorage.removeItem('login');
            document.cookie =
                'login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            return null;
        },
        refreshUserToken: (state: any, action) => {
            const { token } = action.payload;
            const user = state;
            user.accessToken = token;
            localStorage.setItem('login', JSON.stringify(user));
            document.cookie = `login=${encodeURIComponent(
                JSON.stringify(user)
            )}; path=/; secure; samesite=lax`;
            return user;
        }
    }
});

export const { setUser, unsetUser, refreshUserToken } = loginSlice.actions;
