/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // GitHub Pages serves this repo at https://sebvibevalley.github.io/<repo>/,
  // so every route and asset needs the repo name prefixed.
  output: 'export',
  basePath: '/land-cognition-credits-website',
  assetPrefix: '/land-cognition-credits-website/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
