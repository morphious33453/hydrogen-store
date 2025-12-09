import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';

const SITEMAP_QUERY = `#graphql
  query Sitemap($urlLimits: Int, $language: LanguageCode)
  @inContext(language: $language) {
    products(
      first: $urlLimits
      query: "published_status:online_store:visible"
    ) {
      nodes {
        updatedAt
        handle
        onlineStoreUrl
        title
      }
    }
    collections(
      first: $urlLimits
      query: "published_status:online_store:visible"
    ) {
      nodes {
        updatedAt
        handle
        onlineStoreUrl
      }
    }
    pages(first: $urlLimits, query: "published_status:online_store:visible") {
      nodes {
        updatedAt
        handle
        onlineStoreUrl
      }
    }
  }
`;

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const url = new URL(request.url);

  const { products, collections, pages } = await storefront.query(SITEMAP_QUERY, {
    variables: {
      urlLimits: 250,
      language: context.storefront.i18n.language,
    },
  });

  const baseUrl = url.origin;

  const productUrls = products.nodes.map((product) => {
    return `
    <url>
      <loc>${baseUrl}/products/${product.handle}</loc>
      <lastmod>${product.updatedAt}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
    `;
  });

  const collectionUrls = collections.nodes.map((collection) => {
    return `
    <url>
      <loc>${baseUrl}/collections/${collection.handle}</loc>
      <lastmod>${collection.updatedAt}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
    `;
  });

  const pageUrls = pages.nodes.map((page) => {
    return `
    <url>
      <loc>${baseUrl}/pages/${page.handle}</loc>
      <lastmod>${page.updatedAt}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.5</priority>
    </url>
    `;
  });

  const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>
      ${productUrls.join('')}
      ${collectionUrls.join('')}
      ${pageUrls.join('')}
    </urlset>
  `;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      'encoding': 'UTF-8',
    },
  });
}
