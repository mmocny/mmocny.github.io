/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
    externalDir: true,
  },
  output: 'export',
  // reactStrictMode: false,
  assetPrefix: './',
}

module.exports = nextConfig
