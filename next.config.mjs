/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Enables static export
  trailingSlash: true, // Export as /foo/index.html so /foo/ works on static hosts
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
