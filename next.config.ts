import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.xn--hy1b10z9tb76a.kr",
      },
    ],
  },
};

export default nextConfig;
