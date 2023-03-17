/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
    externalDir: true,
  },
  output: 'export',
  // reactStrictMode: false,
}

module.exports = nextConfig
