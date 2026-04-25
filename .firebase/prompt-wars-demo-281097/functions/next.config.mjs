// next.config.mjs
var nextConfig = {
  output: "standalone",
  typescript: {
    // Types checked in CI pipeline instead
  },
  images: {
    unoptimized: true
  }
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
