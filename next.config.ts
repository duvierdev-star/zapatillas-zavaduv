import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite previsualizar desde otros dispositivos en la misma red
  allowedDevOrigins: ["26.112.97.152"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
