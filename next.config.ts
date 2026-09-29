import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep tracing scoped to this portfolio when a parent folder has another lockfile.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
