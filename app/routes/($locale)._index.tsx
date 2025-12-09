import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData } from '@remix-run/react';
import { getSeoMeta, Money, Image } from '@shopify/hydrogen';
import { seoPayload } from '~/lib/seo.server';
import { routeHeaders } from '~/data/cache';
import nfcStyles from '~/styles/nfc-landing.css?url';
import { ProductCard } from '~/components/ProductCard';

export const headers = routeHeaders;
export const links = () => [{ rel: 'stylesheet', href: nfcStyles }];

export async function loader(args: LoaderFunctionArgs) {
  const { request, context } = args;
  const { storefront } = context;

  const collectionPromise = storefront.query(HOMEPAGE_COLLECTION_QUERY, {
    variables: { handle: 'nfc-review-hardware-canada' },
  });

  const seo = seoPayload.home({
    url: request.url,
    title: 'CAN-TAP Verified: Canada\'s Tap-to-Review System | Google Reviews',
    description: 'Turn walk-ins into verified reviews instantly. NFC-powered, zero friction. Trusted by Canadian businesses coast to coast.'
  });

  return defer({
    seo,
    collection: await collectionPromise
  });
}

export const meta = ({ matches }: any) => {
  return getSeoMeta(...matches.map((match: any) => (match.data as any).seo));
};

export default function Homepage() {
  const { collection } = useLoaderData<typeof loader>();
  const products = collection?.collection?.products?.nodes || [];

  return (
    <div className="cantap-landing">

      {/* ─────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────── */}
      <section className="relative isolate pt-32 pb-20 overflow-hidden bg-slate-50">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.100),white)] opacity-40" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

        <div className="cantap-container relative z-10 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-cantap-teal/10 text-cantap-teal-dark font-bold text-xs tracking-widest uppercase animate-fade-in border border-cantap-teal/20 backdrop-blur-sm">
            ✨ Canada's Official Review System
          </div>

          <h1 className="text-5xl md:text-7xl font-anton mb-6 tracking-tight text-slate-900 animate-fade-up">
            Turn Walk-Ins Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cantap-teal to-cantap-teal-dark">5-Star Reviews</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            The official <strong>CAN-TAP Verified™</strong> system. Boost your Google ranking with zero friction. Trusted by 500+ Canadian businesses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="#hardware"
              className="px-10 py-5 rounded-full bg-cantap-teal text-white font-bold text-lg shadow-glow hover:shadow-xl hover:-translate-y-1 hover:bg-cantap-teal-dark transition-all duration-300"
            >
              Get Verified Now
            </Link>
            <Link
              to="/how-it-works"
              className="px-10 py-5 rounded-full bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:border-cantap-teal hover:text-cantap-teal transition-all duration-300 flex items-center gap-2 group"
            >
              See How It Works <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Social Proof Pills */}
          <div className="flex justify-center gap-4 opacity-80 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full shadow-sm border border-slate-200 backdrop-blur-sm">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-xs font-bold text-slate-700">Google Partner</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full shadow-sm border border-slate-200 backdrop-blur-sm">
              <span className="text-blue-500">✓</span>
              <span className="text-xs font-bold text-slate-700">NFC Certified</span>
            </div>
          </div>
        </div>

        {/* Hero Product Visual - Using Official Stand */}
        <div className="mt-12 max-w-5xl mx-auto px-4 relative animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative z-10 rounded-3xl shadow-soft-xl overflow-hidden glass border-white/40 p-12">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/50 to-white/20"></div>
            <img
              src="/official-stand.png"
              alt="CAN-TAP Official Stand"
              className="relative z-10 w-full h-auto max-h-[600px] object-contain mx-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700 ease-in-out"
            />
          </div>
          {/* Decorative blurred glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cantap-teal/20 blur-[100px] -z-10 rounded-full opacity-60"></div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          TRUST BAND
      ───────────────────────────────────────────────────── */}
      <section className="py-8 border-y border-gray-100 bg-white">
        <div className="cantap-container overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 text-center">
            {/* Local Niagara Businesses */}
            <span className="font-medium text-slate-500 hover:text-slate-900 transition-colors">Home Hardware</span>
            <span className="font-medium text-slate-500 hover:text-slate-900 transition-colors">The Pen Centre</span>
            <span className="font-medium text-slate-500 hover:text-slate-900 transition-colors">Niagara Parks</span>
            <span className="font-medium text-slate-500 hover:text-slate-900 transition-colors">Fallsview Group</span>
            <span className="font-medium text-slate-500 hover:text-slate-900 transition-colors">Brock University</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          SHOP THE SYSTEM (DYNAMIC)
      ───────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────
          SHOP THE SYSTEM (DYNAMIC)
      ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-white relative" id="hardware">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-50 to-white/0 pointer-events-none"></div>

        <div className="cantap-container relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-anton text-slate-900 mb-4 tracking-tight uppercase">
              Choose Your <span className="text-cantap-teal">Hardware</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Professional NFC tools designed for counters, windows, and teams. <br />
              <strong>One-time purchase. No monthly fees.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                quickAdd={true}
                className="group"
              />
            ))}
            {products.length === 0 && (
              <div className="col-span-4 text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-400 font-medium">Loading Enterprise Hardware...</p>
              </div>
            )}
          </div>

          <div className="text-center mt-20">
            <Link
              to="/collections/nfc-review-hardware-canada"
              className="inline-block px-12 py-4 rounded-full bg-slate-900 text-white font-bold tracking-wide hover:bg-cantap-teal hover:-translate-y-1 shadow-lg hover:shadow-cantap-teal/30 transition-all duration-300"
            >
              View Full Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          MARKETING BANNER
      ───────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12">
        <div className="cantap-container text-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 inline-block max-w-4xl mx-auto">
            <img src="/cantap-marketing-banner.png" alt="Loved it? Tap your Real review." className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          WHY CAN-TAP WINS
      ───────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────
          WHY CAN-TAP WINS
      ───────────────────────────────────────────────────── */}
      <section className="cantap-section bg-slate-50" id="how-it-works">
        <div className="cantap-container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-anton text-slate-900 mb-6 tracking-tight uppercase">
              Dominate Local Search
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mt-4">
              Stop begging for reviews. Start collecting them automatically with the system built for authority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-soft-lg text-center hover:-translate-y-1 transition-transform duration-300 border border-slate-100">
              <div className="text-6xl mb-6 transform hover:scale-110 transition-transform">👀</div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">1. They See It</h3>
              <p className="text-slate-600 leading-relaxed">
                The <strong>Official CAN-TAP Badge</strong> creates instant trust. Customers recognize the checkmark.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft-xl text-center relative overflow-hidden border-2 border-cantap-teal/10 hover:border-cantap-teal/30 transition-colors group">
              <div className="absolute top-4 right-4 bg-cantap-teal/10 text-cantap-teal-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Core Tech</div>
              <div className="text-6xl mb-6 transform group-hover:rotate-12 transition-transform duration-300">📲</div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">2. They Tap It</h3>
              <p className="text-slate-600 leading-relaxed">
                Zero friction. One tap on the stand opens your Google Review page instantly. No searching required.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft-lg text-center hover:-translate-y-1 transition-transform duration-300 border border-slate-100">
              <div className="text-6xl mb-6 transform hover:scale-110 transition-transform">🚀</div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">3. You Win</h3>
              <p className="text-slate-600 leading-relaxed">
                Watch your star rating climb and your business shoot to <strong>#1 on Google Maps</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          KIT COMPONENTS
      ───────────────────────────────────────────────────── */}
      <section className="cantap-section" style={{ background: 'var(--cantap-bg-section)' }}>
        <div className="cantap-container">
          <div className="cantap-grid-2">
            <div>
              <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>THE ENTERPRISE KIT</h2>
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                Everything your business needs to own its local reputation.
                Professional hardware, not cheap stickers.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <span style={{ color: 'var(--cantap-primary)', fontSize: '1.2rem' }}>✓</span>
                  <span><strong>Premium Acrylic NFC Stand</strong> <span className="text-sm opacity-60">(The Flagship 6x4")</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <span style={{ color: 'var(--cantap-primary)', fontSize: '1.2rem' }}>✓</span>
                  <span><strong>Verified Window Decal</strong> <span className="text-sm opacity-60">(5x5" Heavy Duty Vinyl)</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <span style={{ color: 'var(--cantap-primary)', fontSize: '1.2rem' }}>✓</span>
                  <span><strong>Countertop Badge</strong> <span className="text-sm opacity-60">(For reception/tables)</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <span style={{ color: 'var(--cantap-primary)', fontSize: '1.2rem' }}>✓</span>
                  <strong>Lifetime Hardware Warranty</strong>
                </li>
              </ul>

              <Link to="/collections/nfc-review-hardware-canada" className="cantap-cta">
                Claim Your Kit Now →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="cantap-card p-4 flex items-center justify-center bg-white aspect-square relative border border-gray-100">
                <img src="/official-stand.png" alt="Official NFC Stand" className="w-full h-full object-contain hover:scale-105 transition-transform" />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Acrylic Stand</div>
              </div>
              <div className="cantap-card p-4 flex items-center justify-center bg-white aspect-square relative border border-gray-100">
                <img src="/staff-badge.png" alt="Window Decal" className="w-full h-full object-contain hover:scale-105 transition-transform" />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Window Decal</div>
              </div>
              <div className="cantap-card p-4 flex items-center justify-center bg-white aspect-square relative border border-gray-100">
                <img src="/window-decal.png" alt="Countertop Badge" className="w-full h-full object-contain hover:scale-105 transition-transform" />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Countertop Badge</div>
              </div>
              <div className="cantap-card p-4 flex items-center justify-center bg-white aspect-square relative border border-gray-100">
                <div className="text-center p-4">
                  <div className="text-4xl mb-2">🛡️</div>
                  <div className="font-bold text-sm text-gray-800">Lifetime Warranty</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          PRICING / OFFER
      ───────────────────────────────────────────────────── */}
      <section className="cantap-section" id="pricing">
        <div className="cantap-container">
          <div className="max-w-4xl mx-auto">
            <div className="cantap-pricing-highlight cantap-card" style={{ background: '#ffffff', textAlign: 'center', padding: '4rem 2rem' }}>
              <div className="cantap-pricing-badge" style={{ backgroundColor: '#D32F2F' }}>EARLY BIRD OFFER: FIRST 100 ONLY</div>

              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>The Complete Enterprise System</h2>

              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                {/* Hardware Pricing */}
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Hardware Kit</div>
                  <div className="text-3xl font-bold text-gray-400 line-through Decoration-red-500 decoration-2">$129</div>
                  <div className="text-5xl font-extrabold text-[#004D40]">$99</div>
                  <div className="text-sm text-gray-500 mt-1">One-time payment</div>
                </div>

                <div className="text-4xl font-light text-gray-300">+</div>

                {/* Software Pricing */}
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Business Tier</div>
                  <div className="text-5xl font-extrabold text-[#004D40]">$79<span className="text-2xl">/mo</span></div>
                  <div className="text-sm text-gray-500 mt-1">Cancel anytime</div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg max-w-2xl mx-auto mb-8 text-left">
                <h4 className="font-bold text-[#004D40] mb-2 uppercase text-xs tracking-widest">Everything Included:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">✅ <strong>Full Hardware Kit</strong> (Stand, Decal, Badges)</div>
                  <div className="flex items-center gap-2">✅ <strong>Review Management Dashboard</strong></div>
                  <div className="flex items-center gap-2">✅ <strong>Google/Yelp/TripAdvisor Sync</strong></div>
                  <div className="flex items-center gap-2">✅ <strong>AI Response Assistant</strong></div>
                  <div className="flex items-center gap-2">✅ <strong>Unlimited NFC Taps</strong></div>
                  <div className="flex items-center gap-2">✅ <strong>Priority Canadian Support</strong></div>
                </div>
              </div>

              <Link to="/collections/nfc-review-hardware-canada" className="cantap-cta" style={{ transform: 'scale(1.1)', backgroundColor: '#D32F2F' }}>
                Claim Early Bird Offer ($99) →
              </Link>

              <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <span>🔒 Secure SSL Checkout</span>
                <span>⚡ Ships from Niagara, ON</span>
                <span>🍁 100% Canadian Owned</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="cantap-container max-w-4xl mx-auto prose prose-teal">
          <h3>Why Buy The Official CAN-TAP Verified System?</h3>
          <p>
            Canadian businesses choose CAN-TAP because it is the only <strong>Google Review NFC Stand</strong> engineered specifically for the Canadian market.
            Whether you need a <strong>Google Review Card for business</strong>, or a complete reputation management system, our enterprise-grade hardware delivers results.
          </p>
          <p>
            Stop searching for "how to get more google reviews" and start automating it.
            Our <strong>Tap to Review</strong> technology works with all modern smartphones (iPhone and Android) without requiring any app download.
            Perfect for Restaurants, Dental Clinics, Real Estate Agents, and Automotive Service Centers in Toronto, Vancouver, Montreal, and Niagara.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mt-8">
            <div>NFC Review Stand</div>
            <div>Google Review Card</div>
            <div>Tap to Review</div>
            <div>Reputation Management</div>
          </div>
        </div>
      </section>

    </div>
  );
}

const HOMEPAGE_COLLECTION_QUERY = `#graphql
  query CollectionHome($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: 8) {
        nodes {
          id
          title
          handle
          publishedAt
          variants(first: 1) {
            nodes {
              id
              availableForSale
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
