/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  sw: 'service-worker.js',
  customWorkerDir: 'worker'
})

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: false,
})

module.exports = nextConfig
