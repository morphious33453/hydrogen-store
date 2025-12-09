import { useEffect } from 'react';
import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useInView } from 'react-intersection-observer';
import type {
  Filter,
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import {
  Pagination,
  flattenConnection,
  getPaginationVariables,
  Analytics,
  getSeoMeta,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import { PageHeader, Section, Text } from '~/components/Text';
import { Grid } from '~/components/Grid';
import { Button } from '~/components/Button';
import { ProductCard } from '~/components/ProductCard';
import { SortFilter, type SortParam } from '~/components/SortFilter';
import { PRODUCT_CARD_FRAGMENT } from '~/data/fragments';
import { routeHeaders } from '~/data/cache';
import { seoPayload } from '~/lib/seo.server';
import { FILTER_URL_PREFIX } from '~/components/SortFilter';
import { getImageLoadingPriority } from '~/lib/const';
import { parseAsCurrency } from '~/lib/utils';

export const headers = routeHeaders;

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const { collectionHandle } = params;
  const locale = context.storefront.i18n;

  invariant(collectionHandle, 'Missing collectionHandle param');

  const searchParams = new URL(request.url).searchParams;

  const { sortKey, reverse } = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  const { collection, collections } = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        ...paginationVariables,
        handle: collectionHandle,
        filters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );

  if (!collection) {
    throw new Response('collection', { status: 404 });
  }

  const seo = seoPayload.collection({ collection, url: request.url });

  const allFilterValues = collection.products.filters.flatMap(
    (filter) => filter.values,
  );

  const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          // This comparison should be okay as long as we're not manipulating the input we
          // get from the API before using it as a URL param.
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        // eslint-disable-next-line no-console
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return json({
    collection,
    appliedFilters,
    collections: flattenConnection(collections),
    seo,
  });
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Collection() {
  const { collection, collections, appliedFilters } =
    useLoaderData<typeof loader>();

  const { ref, inView } = useInView();

  return (
    <>
      {/* Premium Hero Section - Sales Focused */}
      <section className="relative pt-48 pb-24 bg-slate-50 overflow-hidden min-h-[80vh] flex items-center">
        {/* Abstract Backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white -z-10" />
        <div className="absolute right-0 top-0 w-1/3 h-full bg-cantap-teal/5 skew-x-12 blur-3xl -z-10" />

        <div className="cantap-container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy & CTA */}
          <div className="text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Official Hardware Request
            </div>
            <h1 className="text-6xl md:text-8xl font-anton text-slate-900 mb-6 uppercase tracking-tight leading-[0.9]">
              Get Verified <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cantap-teal to-cantap-teal-dark">In Seconds</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-lg mb-10">
              The only Google Review system endorsed for Canadian service businesses. Tap to verify.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const element = document.querySelector('#collection-products');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-4 rounded-full bg-slate-900 text-white font-black text-xl shadow-glow hover:bg-cantap-teal hover:scale-105 transition-all duration-300"
              >
                Choose Your Kit
              </button>
              <div className="flex items-center gap-4 px-6 opacity-70">
                <img src="/canada-logo.png" className="h-6 opacity-50 contrast-0 grayscale" />
                <span className="text-sm font-bold text-slate-400">Official Partner</span>
              </div>
            </div>
          </div>

          {/* Right: Hero Image / Visual */}
          <div className="relative animate-fade-in hidden lg:block" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10 bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-glass-lg rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src="/official-stand.png" alt="Official Stand" className="w-full h-auto object-contain drop-shadow-2xl" />
            </div>
            <div className="absolute inset-0 bg-cantap-teal/20 blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* How It Works Section (Walkthrough) */}
      <section className="py-20 bg-white relative z-10 border-b border-slate-100">
        <div className="cantap-container">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">The Workflow</span>
            <h2 className="text-4xl md:text-5xl font-anton text-slate-900 uppercase">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10" />

            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto bg-white rounded-full border border-slate-100 shadow-soft-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative">
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <svg className="w-10 h-10 text-cantap-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-anton text-slate-900 uppercase mb-3">Customer Taps</h3>
              <p className="text-slate-500 leading-relaxed px-4">
                Customers simply tap their phone to the stand. No app download needed. Works with iPhone & Android.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto bg-white rounded-full border border-slate-100 shadow-soft-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative">
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <svg className="w-10 h-10 text-cantap-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-2xl font-anton text-slate-900 uppercase mb-3">Instant Review</h3>
              <p className="text-slate-500 leading-relaxed px-4">
                Your Google Review form pops up instantly. We remove the friction of searching for your business.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto bg-white rounded-full border border-slate-100 shadow-soft-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative">
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <svg className="w-10 h-10 text-cantap-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-anton text-slate-900 uppercase mb-3">Rank Higher</h3>
              <p className="text-slate-500 leading-relaxed px-4">
                More 5-star reviews boost your local SEO, helping you rank #1 on Google Maps in your city.
              </p>
            </div>
          </div>
        </div>
      </section >

      {/* Main Product Grid */}
      < section id="collection-products" className="py-24 bg-white relative z-10" >
        <div className="cantap-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-anton uppercase text-slate-900 mb-4">Select Your Package</h2> {/* Updated Title */}
            <p className="text-slate-500">Free shipping on all Canadian orders over $150.</p>
          </div>

          <div className="min-h-[50vh]">
            <SortFilter
              filters={collection.products.filters as Filter[]}
              appliedFilters={appliedFilters}
              collections={collections}
            >
              <Pagination connection={collection.products}>
                {({
                  nodes,
                  isLoading,
                  PreviousLink,
                  NextLink,
                  nextPageUrl,
                  hasNextPage,
                  state,
                }) => (
                  <>
                    <div className="flex items-center justify-center mb-10">
                      <Button as={PreviousLink} variant="secondary" width="full" className="glass bg-white/50 hover:bg-white text-slate-700">
                        {isLoading ? 'Loading...' : 'Load Previous'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                      <ProductsLoadedOnScroll
                        nodes={nodes}
                        inView={inView}
                        nextPageUrl={nextPageUrl}
                        hasNextPage={hasNextPage}
                        state={state}
                      />
                    </div>

                    <div className="flex items-center justify-center mt-10">
                      <Button
                        ref={ref}
                        as={NextLink}
                        variant="secondary"
                        width="full"
                        className="glass bg-white/50 hover:bg-white text-slate-700 px-8 py-3"
                      >
                        {isLoading ? 'Loading...' : 'Load More Products'}
                      </Button>
                    </div>
                  </>
                )}
              </Pagination>
            </SortFilter>
          </div>
        </div>
      </section >

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </>
  );
}

function ProductsLoadedOnScroll({
  nodes,
  inView,
  nextPageUrl,
  hasNextPage,
  state,
}: {
  nodes: any;
  inView: boolean;
  nextPageUrl: string;
  hasNextPage: boolean;
  state: any;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        replace: true,
        preventScrollReset: true,
        state,
      });
    }
  }, [inView, navigate, state, nextPageUrl, hasNextPage]);

  // Use Fragment to avoid wrapping plain list in extra div if not needed by Grid
  return (
    <>
      {nodes.map((product: any, i: number) => (
        <ProductCard
          key={product.id}
          product={product}
          loading={getImageLoadingPriority(i)}
          className="h-full"
        />
      ))}
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
    collections(first: 100) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED',
        reverse: true,
      };
    case 'featured':
      return {
        sortKey: 'MANUAL',
        reverse: false,
      };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}
