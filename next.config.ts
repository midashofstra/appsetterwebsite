import type { NextConfig } from "next";

const rawBase = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
const basePath = rawBase
  ? (rawBase.startsWith("/") ? rawBase : `/${rawBase}`).replace(/\/$/, "")
  : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
