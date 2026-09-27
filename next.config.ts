import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/index",
        destination: "/airfare-index",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
