// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import { createRequestHandler } from '@vercel/remix';
import {
    cartGetIdDefault,
    cartSetIdDefault,
    createCartHandler,
    createStorefrontClient,
    storefrontRedirect,
    createCustomerAccountClient,
} from '@shopify/hydrogen';

import { AppSession } from '~/lib/session.server';
import { getLocaleFromRequest } from '~/lib/utils';

/**
 * Export a fetch handler in module format.
 */
export default createRequestHandler(remixBuild, {
    mode: process.env.NODE_ENV,
    getLoadContext: async (request) => {

        // 1. Adapter: Map process.env to Env
        const env = process.env as any;

        // 2. Session: Create AppSession
        // Iterate on SESSION_SECRET: Provide a default if missing to prevent boot crashes
        const sessionSecret = env.SESSION_SECRET || 'default-secret-for-vercel-deployment';
        if (!env.SESSION_SECRET) {
            console.warn('SESSION_SECRET is not set. Using default secret.');
        }

        // Note: Vercel doesn't use 'caches' API in the same way as Workers in Node mode.
        // If using Edge runtime, 'caches' might work. For Node, we might need a polyfill or ignore cache.
        // For now, passing 'undefined' for cache to defaults or mocked.
        // However, Hydrogen's createStorefrontClient expects a Cache API compatible object.

        const waitUntil = (promise: Promise<any>) => void promise; // Vercel handles this differently or just awaits

        // Cast request to any to bypass VercelRequest vs Request conflict
        const req = request as any;

        const session = await AppSession.init(req, [sessionSecret]);

        // 3. Storefront: Create Client
        const { storefront } = createStorefrontClient({
            cache: undefined,
            waitUntil,
            i18n: getLocaleFromRequest(req),
            publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
            privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
            storeDomain: env.PUBLIC_STORE_DOMAIN,
            storefrontId: env.PUBLIC_STOREFRONT_ID,
            storefrontHeaders: {
                requestGroupId: null,
                buyerIp: null,
                cookie: null,
                purpose: null,
            },
        });

        // 4. Customer Account
        const customerAccount = createCustomerAccountClient({
            waitUntil,
            request: req,
            session,
            customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
            shopId: env.SHOP_ID,
        });

        const cart = createCartHandler({
            storefront,
            customerAccount,
            getCartId: cartGetIdDefault(req.headers),
            setCartId: cartSetIdDefault(),
        });

        return {
            session,
            waitUntil,
            storefront,
            customerAccount,
            cart,
            env,
        };
    },
});
