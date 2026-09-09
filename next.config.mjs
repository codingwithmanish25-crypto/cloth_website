/** @type {import('next').NextMode} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows images from any remote host
      },
    ],
  },
};

export default nextConfig;