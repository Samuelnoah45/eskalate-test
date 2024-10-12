// next-sitemap.config.js

module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://eskalate.io', // Replace with your domain
    generateRobotsTxt: true, // (Optional) Generate a robots.txt file
    sitemapSize: 7000, // (Optional) Split the sitemap into multiple files if there are more than 7000 URLs
    exclude: [
        '/developer/*',
        '/signup/developer/verify',
        '/developer/',
        '/signin/reset',
        '/signin/forgot'
    ] // Exclude all URLs starting with /developer
};
