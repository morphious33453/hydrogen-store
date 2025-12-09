import clsx from 'clsx';
import { flattenConnection, Image, Money, useMoney } from '@shopify/hydrogen';
import type { MoneyV2, Product } from '@shopify/hydrogen/storefront-api-types';

import type { ProductCardFragment } from 'storefrontapi.generated';
import { Text } from '~/components/Text';
import { Link } from '~/components/Link';
import { Button } from '~/components/Button';
import { AddToCartButton } from '~/components/AddToCartButton';
import { isDiscounted, isNewArrival } from '~/lib/utils';
import { getProductPlaceholder } from '~/lib/placeholders';

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}: {
  product: ProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
  quickAdd?: boolean;
}) {
  let cardLabel;

  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const { image, price, compareAtPrice } = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  return (
    <div className="flex flex-col gap-2 group relative">
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="viewport"
        className="block"
      >
        <div className={clsx('grid gap-4 transition-all duration-500 ease-out transform group-hover:-translate-y-1', className)}>
          <div className="relative aspect-square overflow-hidden bg-slate-100 rounded-xl shadow-soft-sm group-hover:shadow-soft-xl transition-all duration-500">
            {image && (
              <Image
                className="object-contain w-full h-full p-4 transition-transform duration-700 ease-in-out group-hover:scale-105"
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                aspectRatio="1/1"
                data={image}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 right-3 z-10">
              <Text
                as="label"
                size="fine"
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md 
                  ${cardLabel === 'Sale' ? 'bg-red-500/90 text-white shadow-lg' :
                    cardLabel === 'New' ? 'bg-cantap-teal/90 text-white shadow-lg' :
                      'bg-white/80 text-slate-800'}`}
              >
                {cardLabel}
              </Text>
            </div>
          </div>

          <div className="grid gap-1 px-1">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-cantap-teal transition-colors">
              {product.title}
            </h3>
            <div className="flex gap-4 items-center">
              <span className="font-medium text-slate-700">
                <Money withoutTrailingZeros data={price!} />
              </span>
              {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                <span className="text-sm text-slate-400 line-through">
                  <Money withoutTrailingZeros data={compareAtPrice as MoneyV2} />
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Quick Add Button - Appears on Hover */}
      <div className="absolute bottom-[4.5rem] left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
        {quickAdd && firstVariant.availableForSale && (
          <AddToCartButton
            lines={[
              {
                quantity: 1,
                merchandiseId: firstVariant.id,
              },
            ]}
            variant="primary"
            className="w-full bg-slate-900 text-white hover:bg-cantap-teal transition-colors py-3 rounded-lg shadow-lg font-bold text-sm"
          >
            Add to Bag
          </AddToCartButton>
        )}
        {quickAdd && !firstVariant.availableForSale && (
          <Button variant="secondary" className="w-full bg-slate-200 text-slate-400 cursor-not-allowed py-3 rounded-lg font-bold text-sm" disabled>
            Sold Out
          </Button>
        )}
      </div>
    </div>
  );
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const { currencyNarrowSymbol, withoutTrailingZerosAndCurrency } =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
