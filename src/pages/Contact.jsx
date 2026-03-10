import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Contact() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
            <Navbar />
            <main className="flex-1 max-w-[800px] mx-auto w-full px-8 py-24">
                <h1 className="text-[2.5rem] font-black tracking-tight mb-4 uppercase italic">Contact Us</h1>
                <p className="text-slate-500 font-medium mb-12 text-lg">We're here to help you upgrade your tech lifestyle.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Get in Touch</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-black text-slate-900 uppercase mb-1">Email</p>
                                <p className="text-slate-600 font-bold">support@cartify.com</p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 uppercase mb-1">Phone</p>
                                <p className="text-slate-600 font-bold">+92 300 1234567</p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 uppercase mb-1">Address</p>
                                <p className="text-slate-600 font-bold">Zero Tower, Tech Hub, Karachi, Pakistan</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Customer Care Hours</h3>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                            Monday — Friday: 9AM to 6PM<br />
                            Saturday: 10AM to 4PM<br />
                            Sunday: Closed
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Contact;
