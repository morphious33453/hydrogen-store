import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import { vitePlugin as remix } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

const isVercel = process.env.DEPLOY_TARGET === 'vercel';

export default defineConfig({
  plugins: [
    hydrogen(),
    // Only run Oxygen plugin if NOT deploying to Vercel
    !isVercel && oxygen(),
    remix({
      // Use distinct entry file for Vercel
      serverBuildFile: isVercel ? 'index.js' : 'index.js',
      // 'server' option overrides the default server entry (server.ts)
      server: isVercel ? './server.vercel.ts' : undefined,
      presets: [
        hydrogen.preset(),
      ],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    optimizeDeps: {
      include: ['typographic-base'],
    },
  },
  optimizeDeps: {
    include: [
      'clsx',
      '@headlessui/react',
      'typographic-base',
      'react-intersection-observer',
      'react-use/esm/useScroll',
      'react-use/esm/useDebounce',
      'react-use/esm/useWindowScroll',
    ],
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
});
