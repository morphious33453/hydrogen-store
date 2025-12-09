import { useParams, Form, Await, useRouteLoaderData } from '@remix-run/react';
import useWindowScroll from 'react-use/esm/useWindowScroll';
import { Disclosure } from '@headlessui/react';
import { Suspense, useEffect, useMemo } from 'react';
import { CartForm } from '@shopify/hydrogen';

import { type LayoutQuery } from 'storefrontapi.generated';
import { Text, Heading, Section } from '~/components/Text';
import { Link } from '~/components/Link';
import { Cart } from '~/components/Cart';
import { CartLoading } from '~/components/CartLoading';
import { Input } from '~/components/Input';
import { Drawer, useDrawer } from '~/components/Drawer';
import { CountrySelector } from '~/components/CountrySelector';
import {
  IconMenu,
  IconCaret,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
} from '~/components/Icon';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { useCartFetchers } from '~/hooks/useCartFetchers';
import type { RootLoader } from '~/root';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function PageLayout({ children, layout }: LayoutProps) {
  const { headerMenu, footerMenu } = layout || {};
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && layout?.shop.name && (
          <Header title={layout.shop.name} menu={headerMenu} />
        )}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </>
  );
}

function Header({ title, menu }: { title: string; menu?: EnhancedMenu }) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  return (
    <header
      role="banner"
      className="flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8"
      style={{ backgroundColor: '#0A1628', color: '#ffffff' }}
    >
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo-new.png" alt="CAN-TAP" style={{ height: '40px' }} />
      </Link>
      <Link
        to="/collections/nfc-review-hardware-canada"
        className="text-sm font-bold px-4 py-2 rounded"
        style={{ backgroundColor: '#FFD700', color: '#0A1628' }}
      >
        Get Badge
      </Link>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
}) {
  return (
    <header
      role="banner"
      className="hidden h-24 lg:flex items-center justify-between sticky transition-all duration-300 z-40 top-0 w-full px-8 glass border-b-0 shadow-sm"
    >
      {/* Left: Trust & Intent */}
      <div className="flex items-center gap-6 w-1/3">
        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <img src="/canada-logo.png" alt="Official Canada Partner" className="h-8 object-contain grayscale hover:grayscale-0 transition-all" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden xl:block">Official Partner</span>
        </div>
        <nav className="flex gap-4">
          <Link to="/how-it-works" className="font-bold text-slate-700 hover:text-cantap-teal transition-colors text-xs uppercase tracking-widest">How It Works</Link>
        </nav>
      </div>

      {/* Center: Brand Logo */}
      <div className="flex justify-center w-1/3 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[35%] bg-white/40 p-5 rounded-full backdrop-blur-3xl shadow-glow border border-white/50">
          <Link to="/" className="block group">
            <img src="/logo-new.png" alt="CAN-TAP" className="h-40 transition-transform duration-300 group-hover:scale-105 object-contain drop-shadow-2xl" />
          </Link>
        </div>
      </div>

      {/* Right: CTA & Actions */}
      <div className="flex items-center justify-end gap-6 w-1/3">
        <Link to="/resellers" className="font-medium text-slate-500 hover:text-cantap-teal transition-colors text-xs uppercase tracking-wide">Resellers</Link>
        <Link
          to="/collections/nfc-review-hardware-canada"
          className="font-black px-8 py-3 rounded-full shadow-lg bg-slate-900 text-white hover:bg-cantap-teal hover:shadow-cantap-teal/30 hover:-translate-y-0.5 transition-all duration-300 text-sm uppercase tracking-wide"
        >
          Get Verified
        </Link>
      </div>
    </header>
  );
}

function AccountLink({ className }: { className?: string }) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Link to="/account" className={className}>
      <Suspense fallback={<IconLogin />}>
        <Await resolve={isLoggedIn} errorElement={<IconLogin />}>
          {(isLoggedIn) => (isLoggedIn ? <IconAccount /> : <IconLogin />)}
        </Await>
      </Suspense>
    </Link>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${dark
            ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
            : 'text-contrast bg-primary'
            } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({ menu }: { menu?: EnhancedMenu }) {
  return (
    <footer
      role="contentinfo"
      className="w-full bg-slate-950 text-white"
    >
      {/* FINAL CTA SECTION */}
      <div className="py-16 px-8 text-center border-b border-white/5 bg-slate-900/50">
        <h2 className="text-white mb-4 text-4xl font-anton tracking-wide">Ready to Own Your Reputation?</h2>
        <p className="mb-8 opacity-70 text-lg max-w-2xl mx-auto">
          Join 500+ Canadian businesses using the official standard for verifiable reviews.
        </p>
        <Link
          to="/collections/nfc-review-hardware-canada"
          className="bg-white text-slate-900 font-bold py-4 px-10 rounded-full hover:bg-cantap-teal hover:text-white transition-all duration-300 shadow-glow inline-block hover:shadow-xl hover:-translate-y-1"
        >
          Order Your Kit Now
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 py-12 text-sm font-medium tracking-wide uppercase text-slate-400">
        <Link to="/policies/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link to="/policies/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link to="/pages/contact" className="hover:text-white transition-colors">Contact Us</Link>
        <a href="tel:+12896874158" className="hover:text-white transition-colors flex items-center gap-2">
          <span>📞 (289) 687-4158</span>
        </a>
      </div>

      <div className="py-8 px-6 md:px-12 text-center text-xs text-slate-600 bg-slate-950">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <img src="/logo-new.png" alt="CAN-TAP" className="h-6 brightness-0 invert" />
            <span>© {new Date().getFullYear()} CAN-TAP Verified.</span>
          </div>
          <div>
            Made with pride in Niagara, Canada 🍁
          </div>
        </div>
      </div>
    </footer>
  );
}
