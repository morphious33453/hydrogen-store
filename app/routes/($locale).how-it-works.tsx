import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link } from '@remix-run/react';
import { getSeoMeta } from '@shopify/hydrogen';
import { seoPayload } from '~/lib/seo.server';
import { routeHeaders } from '~/data/cache';
import nfcStyles from '~/styles/nfc-landing.css?url';

export const headers = routeHeaders;
export const links = () => [{ rel: 'stylesheet', href: nfcStyles }];

export async function loader({ request }: LoaderFunctionArgs) {
    const seo = seoPayload.home({
        url: request.url,
        title: 'How It Works | The Science of Tapping for Reviews',
        description: 'Discover the psychology and technology behind CAN-TAP. Learn how NFC friction reduction turns 30% more customers into 5-star Google Reviews.'
    });

    return json({
        seo
    });
}

export const meta = ({ matches }: any) => {
    return getSeoMeta(...matches.map((match: any) => (match.data as any).seo));
};

export default function HowItWorks() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "Why does tapping get more reviews than QR codes?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Friction. QR codes require 4 steps (Unlock -> Camera -> Focus -> Click). NFC is 1 step (Tap). This 3-second difference increases conversion rates by up to 300%."
            }
        }, {
            "@type": "Question",
            "name": "Do I need an app or subscription?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "No app is needed for you or the customer. The Stand works out of the box. Our Business Tier software is optional but recommended for tracking and AI responses."
            }
        }, {
            "@type": "Question",
            "name": "What happens if a customer doesn't have NFC?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "98% of modern phones have NFC. For the rare older phone, every CAN-TAP stand includes a backup QR code subtly integrated into the design."
            }
        }]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "The CAN-TAP Review System",
        "step": [{
            "@type": "HowToStep",
            "name": "Visual Priming",
            "text": "Place the Official Stand at the point of transaction. The 'Verified' badge builds subconscious trust."
        }, {
            "@type": "HowToStep",
            "name": "Haptic Engagement",
            "text": "Customer Taps their phone. The physical action creates a 'sunk cost' psychological commitment to finish the review."
        }, {
            "@type": "HowToStep",
            "name": "Instant Routing",
            "text": "The phone opens your Google Review form immediately. No navigation, no searching."
        }]
    };

    return (
        <div className="cantap-page">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

            {/* ─────────────────────────────────────────────────────
          HERO: THE SCIENCE OF MORE REVIEWS
      ───────────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-24 bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('/official-stand.png')] bg-cover bg-center blur-xl scale-110"></div>
                <div className="absolute inset-0 z-1 bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-900"></div>

                <div className="cantap-container text-center relative z-10 max-w-4xl">
                    <div className="inline-block mb-6 px-4 py-1 rounded-full bg-teal-900/50 border border-teal-500/30 text-teal-400 font-bold text-xs tracking-[0.2em] uppercase backdrop-blur-sm">
                        SYSTEM ARCHITECTURE V2.0
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight" style={{ fontFamily: 'Anton' }}>
                        WE ENGINEERED OUT<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">THE FRICTION</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed font-light">
                        Why do willing customers fail to leave reviews?<br />
                        <strong className="text-white">Because "asking" is too much work.</strong><br />
                        We replaced 4 steps of cognitive load with 1 second of instinct.
                    </p>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────
          MARKETING BANNER
      ───────────────────────────────────────────────────── */}
            <section className="bg-white relative z-20 -mt-12 mb-12">
                <div className="cantap-container text-center">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 inline-block max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
                        <img src="/cantap-marketing-banner.png" alt="Tap your Real review" className="w-full h-auto" />
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────
          SECTION 1: THE BIOLOGY OF TAPPING (Psychology)
      ───────────────────────────────────────────────────── */}
            <section className="cantap-section bg-white">
                <div className="cantap-container">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-4xl font-black mb-6 text-[#263238]" style={{ fontFamily: 'Anton' }}>
                                THE BIOLOGY OF TAPPING
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                There is a psychological reason <strong>Apple Pay</strong> and <strong>Subway cards</strong> took over the world.
                                Humans are "cognitive misers"—our brains instinctively avoid mental effort.
                            </p>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                <strong>QR Codes are high-friction.</strong> They demand focus, steady hands, and multiple clicks.
                                This creates "Drop-Off" points where 70% of customers abandon the process.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-teal-500 pl-6 italic bg-gray-50 py-4 pr-4 rounded-r-lg">
                                <strong>The Tap Effect:</strong> When a customer physically taps their phone, they engage haptic feedback.
                                Psychologically, this is a "micro-commitment." Once they Tap, their brain feels committed to finishing the task (the review).
                            </p>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-teal-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                                <img src="/official-stand.png" alt="Haptic Engagement" className="relative z-10 w-3/4 mx-auto drop-shadow-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────
          SECTION 2: ROI ENGINE (The Math)
      ───────────────────────────────────────────────────── */}
            <section className="cantap-section bg-gray-50">
                <div className="cantap-container max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-black mb-12 text-[#263238]" style={{ fontFamily: 'Anton' }}>
                        THE MATH OF "PAGE ONE"
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-teal-600 font-black text-5xl mb-2">3.8x</div>
                            <div className="font-bold text-gray-800 uppercase tracking-wide text-sm">More Conversion</div>
                            <p className="text-gray-500 text-sm mt-2">Businesses with 4.5+ stars get nearly 4x the leads of those with 3.5 stars.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transform scale-105 border-teal-500/30 ring-4 ring-teal-500/5">
                            <div className="text-teal-600 font-black text-5xl mb-2">#1</div>
                            <div className="font-bold text-gray-800 uppercase tracking-wide text-sm">Ranking Factor</div>
                            <p className="text-gray-500 text-sm mt-2">"Review Velocity" (how often you get new reviews) is a top ranking signal for Google Maps.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-teal-600 font-black text-5xl mb-2">9%</div>
                            <div className="font-bold text-gray-800 uppercase tracking-wide text-sm">Revenue Jump</div>
                            <p className="text-gray-500 text-sm mt-2">For every 1-star increase in rating, studies show a 5-9% increase in revenue.</p>
                        </div>
                    </div>

                    <p className="text-xl text-gray-600">
                        The CAN-TAP system isn't an expense. It's a <span className="underline decoration-teal-500 decoration-4">revenue multiplier</span>.
                    </p>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────
          SECTION 3: TECHNICAL SUPERIORITY (Hardware Specs)
      ───────────────────────────────────────────────────── */}
            <section className="cantap-section bg-[#263238] text-white">
                <div className="cantap-container">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                        <div className="flex-1">
                            <div className="inline-block mb-4 px-3 py-1 bg-teal-900 rounded text-teal-300 font-mono text-xs">HARDWARE SPECS</div>
                            <h2 className="text-4xl font-black mb-6 text-white" style={{ fontFamily: 'Anton' }}>
                                NOT ALL CHIPS ARE EQUAL
                            </h2>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Cheap generic stickers use <strong>NTAG213</strong> chips with weak signal strength (20-30mm range).
                                They require customers to "hunt" for the sweet spot, causing frustration.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <span className="text-teal-400 text-xl">✓</span>
                                    <div>
                                        <strong className="block text-white">Industrial NTAG216 (High Capacity)</strong>
                                        <span className="text-gray-400 text-sm">We use industrial-grade chips with double the memory and signal boost.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-teal-400 text-xl">✓</span>
                                    <div>
                                        <strong className="block text-white">70mm "Active Zone"</strong>
                                        <span className="text-gray-400 text-sm">Our wide-range antenna means the phone just needs to be *near* the stand.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-teal-400 text-xl">✓</span>
                                    <div>
                                        <strong className="block text-white">UV-Cured Acrylic Protection</strong>
                                        <span className="text-gray-400 text-sm">Protected against sunlight fading and countertop spills. Built for coffee shops and bars.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1">
                            <div className="bg-gradient-to-tr from-gray-800 to-gray-700 p-8 rounded-3xl border border-gray-600 relative overflow-hidden">
                                {/* Abstract Chip Visualization */}
                                <div className="absolute top-10 right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl"></div>
                                <div className="relative z-10 grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-600/50 backdrop-blur">
                                        <div className="text-3xl mb-2 text-teal-400 font-mono">100k</div>
                                        <div className="text-xs text-gray-400 uppercase">Read/Write Cycles</div>
                                    </div>
                                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-600/50 backdrop-blur">
                                        <div className="text-3xl mb-2 text-teal-400 font-mono">10yr</div>
                                        <div className="text-xs text-gray-400 uppercase">Data Retention</div>
                                    </div>
                                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-600/50 backdrop-blur col-span-2">
                                        <div className="text-3xl mb-2 text-teal-400 font-mono">IP68</div>
                                        <div className="text-xs text-gray-400 uppercase">Water/Dust Resistant</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────
          COMPARATIVE ANALYSIS (Table)
      ───────────────────────────────────────────────────── */}
            {/* ─────────────────────────────────────────────────────
          COMPETITIVE ADVANTAGE (Customer Facing)
      ───────────────────────────────────────────────────── */}
            <section className="py-20 bg-gray-50">
                <div className="cantap-container max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4 text-[#263238]" style={{ fontFamily: 'Anton' }}>THE CAN-TAP DIFFERENCE</h2>
                        <p className="text-xl text-gray-500">
                            Why 500+ Canadian businesses choose us over cheap knockoffs.
                        </p>
                    </div>

                    <div className="overflow-x-auto shadow-xl rounded-2xl border border-gray-200 bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#004D40] text-white">
                                    <th className="p-6 text-lg font-bold uppercase tracking-wider w-1/3">Feature</th>
                                    <th className="p-6 text-lg font-bold uppercase tracking-wider w-1/3 text-[#4DB6AC]">CAN-TAP Verified™</th>
                                    <th className="p-6 text-lg font-bold uppercase tracking-wider w-1/3 text-white/60">Generic Stickers</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-bold text-gray-800">Chip Technology</td>
                                    <td className="p-6 text-[#004D40] font-bold">Industrial NTAG216 (High Range)</td>
                                    <td className="p-6 text-gray-500">Cheap NTAG213 (Must touch phone)</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-bold text-gray-800">Durability</td>
                                    <td className="p-6 text-[#004D40] font-bold">UV-Cured Acrylic (Lifetime)</td>
                                    <td className="p-6 text-gray-500">Paper/Vinyl (Fades in sun)</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-bold text-gray-800">No-App Guarantee</td>
                                    <td className="p-6 text-[#004D40] font-bold">100% Native (iPhone & Android)</td>
                                    <td className="p-6 text-gray-500">Often requires specific apps</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-bold text-gray-800">Warranty</td>
                                    <td className="p-6 text-[#004D40] font-bold">Lifetime Hardware Warranty</td>
                                    <td className="p-6 text-gray-500">None / Final Sale</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-bold text-gray-800">Support</td>
                                    <td className="p-6 text-[#004D40] font-bold">Local Niagara Support Team</td>
                                    <td className="p-6 text-gray-500">Overseas Bot Support</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────
          FAQ ACCORDION
      ───────────────────────────────────────────────────── */}
            <section className="cantap-section bg-white text-center">
                <div className="cantap-container max-w-3xl">
                    <h2 className="text-4xl font-black mb-12 text-[#263238]" style={{ fontFamily: 'Anton' }}>
                        FREQUENTLY ASKED QUESTIONS
                    </h2>
                    <div className="space-y-4 text-left">
                        {/* FAQ Item 1 */}
                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-2 text-[#004D40]">Do customers need to download an app?</h3>
                            <p className="text-gray-600">No. The CAN-TAP system uses native NFC technology built into all modern smartphones (iPhone and Android). Customers simply tap their phone and the review page opens instantly.</p>
                        </div>
                        {/* FAQ Item 2 */}
                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-2 text-[#004D40]">Is there a monthly fee?</h3>
                            <p className="text-gray-600">For the Standard Kit, it's a one-time purchase. If you upgrade to our Enterprise Dashboard (for AI response and multi-location syncing), plans start at $79/mo.</p>
                        </div>
                        {/* FAQ Item 3 */}
                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-2 text-[#004D40]">How long does shipping take within Canada?</h3>
                            <p className="text-gray-600">We ship everything from Niagara, Ontario. Most orders arrive in Ontario/Quebec within 2 days, and Western/Eastern Canada within 4-5 days.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────
          FINAL CTA
      ───────────────────────────────────────────────────── */}
            <section className="py-24 bg-[#004D40] text-center text-white">
                <div className="cantap-container">
                    <h2 className="text-5xl font-black mb-8" style={{ fontFamily: 'Anton' }}>START DOMINATING TODAY</h2>
                    <p className="text-2xl opacity-90 mb-12 max-w-2xl mx-auto">
                        Join 500+ Canadian businesses who turned their walk-in traffic into a digital goldmine.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/collections/nfc-review-hardware-canada" className="bg-white text-[#004D40] font-bold text-xl px-12 py-5 rounded shadow-2xl hover:bg-gray-100 hover:-translate-y-1 transition-all">
                            Get Your Kit Now →
                        </Link>
                        <Link to="/resellers" className="text-white border-2 border-white/30 px-12 py-5 rounded font-bold hover:bg-white/10 transition-all">
                            Become a Reseller
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
