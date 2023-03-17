/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    externalDir: true,
  },
  output: 'export',
  // reactStrictMode: false,
}

module.exports = nextConfig
