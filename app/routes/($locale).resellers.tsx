import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData } from '@remix-run/react';
import { getSeoMeta } from '@shopify/hydrogen';
import { seoPayload } from '~/lib/seo.server';
import { routeHeaders } from '~/data/cache';
import nfcStyles from '~/styles/nfc-landing.css?url';

export const headers = routeHeaders;
export const links = () => [{ rel: 'stylesheet', href: nfcStyles }];

export async function loader({ request }: LoaderFunctionArgs) {
    const seo = seoPayload.home({
        url: request.url,
        title: 'Become a Reseller | NiagaraStandsOut.ca Official Distributor',
        description: 'Partner with the official CAN-TAP Regional Distributor for Niagara. Access wholesale pricing, marketing assets, and the Page-One Domination system.'
    });

    return json({
        seo
    });
}

export const meta = ({ matches }: any) => {
    return getSeoMeta(...matches.map((match: any) => (match.data as any).seo));
};

export default function Resellers() {
    return (
        <div className="cantap-page">
            {/* ─────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-[#004D40] text-white">
                <div className="cantap-container text-center relative z-10">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[#00695C] text-teal-100 font-bold text-sm tracking-wider uppercase border border-teal-500">
                        OFFICIAL REGIONAL DISTRIBUTOR
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight" style={{ fontFamily: 'Anton' }}>
                        PARTNER WITH<br />
                        <span className="text-[#4DB6AC]">NIAGARA STANDS OUT</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-teal-100 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                        Bring the <strong>Page-One Domination System</strong> to your local clients.<br />
                        Wholesale hardware, enterprise software, and proven results.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#apply" className="bg-white text-[#004D40] font-bold text-xl px-12 py-5 rounded shadow-xl hover:bg-gray-100 hover:-translate-y-1 transition-all">
                            Apply to Resell →
                        </a>
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────
          THE OPPORTUNITY (Differentiation Table)
      ───────────────────────────────────────────────────── */}
            {/* ─────────────────────────────────────────────────────
          THE OPPORTUNITY (Customer Facing)
      ───────────────────────────────────────────────────── */}
            <section className="py-20 bg-white">
                <div className="cantap-container max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-[#263238] mb-4" style={{ fontFamily: 'Anton' }}>WHY RESELL CAN-TAP?</h2>
                        <p className="text-xl text-gray-500">
                            Why our partners win "Page-One Domination" contracts easily.
                        </p>
                    </div>

                    <div className="overflow-x-auto shadow-2xl rounded-2xl border border-gray-100">
                        <table className="w-full text-left border-collapse bg-white">
                            <thead>
                                <tr className="bg-[#263238] text-white">
                                    <th className="p-6 text-lg font-bold uppercase tracking-wider w-1/3">Benefits</th>
                                    <th className="p-6 text-lg font-bold uppercase tracking-wider w-1/3 text-[#4DB6AC]">CAN-TAP Partners</th>
                                    <th className="p-6 text-lg font-bold uppercase tracking-wider w-1/3 text-white/50">Generic Sellers</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-bold text-gray-800">Hardware Margin</td>
                                    <td className="p-6 text-[#004D40] font-bold">50-60% Wholesale Discount</td>
                                    <td className="p-6 text-gray-600">Buy retail / Low margin dropshipping</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-bold text-gray-800">Recurring Software</td>
                                    <td className="p-6 text-[#004D40] font-bold">Yes - Monthly Commissions</td>
                                    <td className="p-6 text-gray-600">No - One-time sale only</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-bold text-gray-800">Sales Enablement</td>
                                    <td className="p-6 text-[#004D40] font-bold">Full "White Label" Sales Deck</td>
                                    <td className="p-6 text-gray-600">You're on your own</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6 font-bold text-gray-800">Territory</td>
                                    <td className="p-6 text-[#004D40] font-bold">Exclusive Regional Leads</td>
                                    <td className="p-6 text-gray-600">Saturated market</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────
          PARTNER BENEFITS
      ───────────────────────────────────────────────────── */}
            <section className="cantap-section" style={{ background: '#F5F7F8' }}>
                <div className="cantap-container">
                    <h2 className="text-4xl font-black text-center mb-16 text-[#263238]" style={{ fontFamily: 'Anton' }}>
                        THE RESELLER ADVANTAGE
                    </h2>

                    <div className="cantap-grid-3">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-4xl mb-4">📦</div>
                            <h3 className="text-xl font-bold mb-2">Wholesale Hardware</h3>
                            <p className="text-gray-600 text-sm">
                                Get verified NFC stands, window decals, and badges at distributor pricing. 50%+ margins on hardware.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold mb-2">Software Revenue</h3>
                            <p className="text-gray-600 text-sm">
                                Earn recurring commissions on the Enterprise Dashboard software. Build a book of passive income.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-4xl mb-4">🎨</div>
                            <h3 className="text-xl font-bold mb-2">Marketing Assets</h3>
                            <p className="text-gray-600 text-sm">
                                Access our library of high-converting photos, copy scripts, and sales decks. Don't reinvent the wheel.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────
          APPLICATION FORM
      ───────────────────────────────────────────────────── */}
            <section className="py-20 bg-white" id="apply">
                <div className="cantap-container max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-[#263238] mb-4">Apply for Partnership</h2>
                        <p className="text-gray-600">
                            We are selectively partnering with Niagara-based agencies and consultants.
                        </p>
                    </div>

                    <form className="bg-gray-50 p-8 rounded-2xl border border-gray-200 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" placeholder="Jane" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" placeholder="Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" placeholder="Acme Marketing Inc." />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
                            <input type="url" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" placeholder="https://" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Monthly Volume</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
                                <option>1-5 Kits / Month</option>
                                <option>5-20 Kits / Month</option>
                                <option>20+ Kits / Month</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full bg-[#004D40] text-white font-bold text-xl py-4 rounded-lg hover:bg-teal-900 transition-colors shadow-lg">
                                Submit Application
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-4">
                                By applying, you agree to our Reseller Terms & Conditions.
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
