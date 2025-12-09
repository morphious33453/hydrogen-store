import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import { vitePlugin as remix } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vercelPreset } from '@vercel/remix/vite';

const env = process.env as unknown as { DEPLOY_TARGET?: string };
const isVercel = env.DEPLOY_TARGET === 'vercel';

console.log('Build Target:', env.DEPLOY_TARGET);
console.log('isVercel:', isVercel);

export default defineConfig({
  plugins: [
    hydrogen(),
    // Only run Oxygen plugin if NOT deploying to Vercel
    !isVercel && oxygen(),
    remix({
      // Use the custom Vercel server adapter (handles Context & Hydrogen)
      serverBuildFile: 'server.vercel.ts',
      // preset handles the server entry point automatically or we configure it
      presets: [
        // On Vercel, use vercelPreset (which handles the server entry text).
        // On Oxygen/other, use hydrogen.preset (which handles Oxygen entry).
        isVercel ? vercelPreset() : hydrogen.preset(),
      ].filter(Boolean),
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      // Vital: Swap the Oxygen entry point for the Node/Vercel one during build
      '~/entry.server': isVercel ? './app/entry.vercel.tsx' : './app/entry.server.tsx',
    },
  },
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
