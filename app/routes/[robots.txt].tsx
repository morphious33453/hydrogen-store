import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  return new Response(
    `
User-agent: *
Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
Disallow: /account
Allow: /

Sitemap: ${url.origin}/sitemap.xml
    `.trim(),
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    },
  );
}
