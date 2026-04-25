/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Types checked in CI pipeline instead
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
