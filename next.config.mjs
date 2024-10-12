/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'res.cloudinary.com'
            }
        ]
    }
    // ... other configurations
};

export default nextConfig;
