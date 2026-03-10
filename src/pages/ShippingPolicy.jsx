import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ShippingPolicy() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
            <Navbar />
            <main className="flex-1 max-w-[800px] mx-auto w-full px-8 py-24">
                <h1 className="text-[2.5rem] font-black tracking-tight mb-4 uppercase italic">Shipping Policy</h1>
                <p className="text-slate-500 font-medium mb-12 text-lg">Fast, reliable, and premium delivery services.</p>

                <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 mb-12">
                    <h2 className="text-xs font-black text-[#7c3aed] uppercase tracking-widest mb-6">Delivery Times</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-sm font-black text-slate-900 mb-2">Karachi & Lahore</p>
                            <p className="text-slate-600 font-medium">1-2 Business Days</p>
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 mb-2">Other Cities</p>
                            <p className="text-slate-600 font-medium">3-5 Business Days</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 px-4">
                    <div>
                        <h3 className="text-lg font-black mb-3">Shipping Charges</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">FREE shipping on all orders above Rs. 2,500. For orders below this amount, a flat fee of Rs. 150 is applied nationwide.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-black mb-3">Cash on Delivery (COD)</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">We offer Cash on Delivery across all serviceable areas in Pakistan. Please ensure you have the exact amount ready upon delivery.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ShippingPolicy;
