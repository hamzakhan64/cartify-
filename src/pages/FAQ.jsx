import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function FAQ() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
            <Navbar />
            <main className="flex-1 max-w-[800px] mx-auto w-full px-8 py-24">
                <h1 className="text-[2.5rem] font-black tracking-tight mb-4 uppercase italic">FAQs</h1>
                <p className="text-slate-500 font-medium mb-12 text-lg">Everything you need to know about your Cartify experience.</p>

                <div className="space-y-8">
                    <div className="border-b border-slate-100 pb-8">
                        <h3 className="text-lg font-black mb-3">How long does shipping take?</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">Standard shipping usually takes 3-5 business days across Pakistan. Premium shipping options are available at checkout.</p>
                    </div>

                    <div className="border-b border-slate-100 pb-8">
                        <h3 className="text-lg font-black mb-3">Do you offer warranty?</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">Yes! All our tech accessories come with a standard 6-month replacement warranty for any manufacturing defects.</p>
                    </div>

                    <div className="border-b border-slate-100 pb-8">
                        <h3 className="text-lg font-black mb-3">What is your return policy?</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">We offer a 7-day no-questions-asked return policy if the product is in its original packaging and unused.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-black mb-3">How do I track my order?</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">Once your order is confirmed, you will receive a tracking ID via email and SMS to monitor your delivery.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default FAQ;
