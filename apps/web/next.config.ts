import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // optional
});

const nextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {},
};

export default pwaConfig(nextConfig);
