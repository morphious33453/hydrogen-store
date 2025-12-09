import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@shopify/remix-oxygen';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'stream';
import { createContentSecurityPolicy } from '@shopify/hydrogen';

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
) {
    const { nonce, header, NonceProvider } = createContentSecurityPolicy({
        // Vercel apps might not have context.env explicitly here if not passed by the adapter
        // We can rely on process.env in Node environment
        shop: {
            checkoutDomain: process.env.PUBLIC_CHECKOUT_DOMAIN || '',
            storeDomain: process.env.PUBLIC_STORE_DOMAIN || '',
        },
        scriptSrc: [
            'self',
            'https://cdn.shopify.com',
            'https://shopify.com',
            'https://www.google-analytics.com',
            'https://www.googletagmanager.com',
            ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:*'] : []),
        ],
    });

    return new Promise((resolve, reject) => {
        let didError = false;
        const { pipe, abort } = renderToPipeableStream(
            <NonceProvider>
                <RemixServer context={remixContext} url={request.url} />
            </NonceProvider>,
            {
                nonce,
                onShellReady() {
                    const body = new PassThrough();
                    responseHeaders.set('Content-Type', 'text/html');
                    responseHeaders.set('Content-Security-Policy', header);

                    resolve(
                        new Response(body as any, {
                            headers: responseHeaders,
                            status: didError ? 500 : responseStatusCode,
                        }),
                    );
                    pipe(body);
                },
                onShellError(err) {
                    reject(err);
                },
                onError(error) {
                    didError = true;
                    console.error(error);
                },
            },
        );

        if (isbot(request.headers.get('user-agent'))) {
            const NO_DELAY = 0;
            setTimeout(abort, NO_DELAY);
        }
    });
}
