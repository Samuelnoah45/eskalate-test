import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode'; // Use jwt-decode to decode JWT

export const userLoggedIn = () => {
    const cookieStore = cookies();
    const auth = cookieStore.get('login'); // Access the 'login' cookie

    if (!auth) {
        return null; // No cookie, so the user is not logged in
    }

    try {
        const token = JSON.parse(auth.value).accessToken; // Extract the access token
        const decodedToken = jwtDecode(token); // Decode the JWT

        if (!decodedToken || !decodedToken.exp) {
            return null; // Invalid token structure
        }

        const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

        if (decodedToken.exp < currentTime) {
            // Token is expired, remove the cookie
            cookieStore.delete('login'); // Delete the expired cookie
            return null; // User is not logged in due to expired token
        }

        // Token is valid
        return auth;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null; // Invalid token or decoding failed
    }
};
