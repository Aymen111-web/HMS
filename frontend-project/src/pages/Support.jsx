import React from 'react';
import { Card, Button } from '../components/UI';
import { HelpCircle, Book, MessageCircle, Phone, Mail } from 'lucide-react';

const Support = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Center</h1>
                <p className="text-slate-500 font-medium mt-1">How can we help you today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-8 hover:shadow-lg transition-shadow border-slate-100">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                        <Book size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Knowledge Base</h3>
                    <p className="text-slate-500 text-sm mb-6">Browse our comprehensive guides and tutorials for using the HMS platform efficiently.</p>
                    <Button variant="secondary" className="w-full justify-between">
                        Read Articles <HelpCircle size={18} />
                    </Button>
                </Card>

                <Card className="p-8 hover:shadow-lg transition-shadow border-slate-100">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                        <MessageCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Live Chat</h3>
                    <p className="text-slate-500 text-sm mb-6">Connect with our support agents in real-time for immediate assistance with system issues.</p>
                    <Button variant="secondary" className="w-full justify-between">
                        Start Chat <HelpCircle size={18} />
                    </Button>
                </Card>

                <Card className="p-8 hover:shadow-lg transition-shadow border-slate-100">
                    <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                        <Phone size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Technical Support</h3>
                    <p className="text-slate-500 text-sm mb-6">For critical system failures or hardware integration issues, reach out to our tech team.</p>
                    <Button variant="secondary" className="w-full justify-between">
                        Contact Support <HelpCircle size={18} />
                    </Button>
                </Card>
            </div>

            <Card title="Frequently Asked Questions" className="p-8 border-slate-100">
                <div className="space-y-6 mt-4">
                    {[
                        { q: 'How do I reset my professional password?', a: 'Go to Settings > Profile > Security and click on Change Password.' },
                        { q: 'Can I cancel an appointment within 24 hours?', a: 'Yes, but it may be subject to a cancellation fee depending on hospital policy.' },
                        { q: 'Where can I find my lab results?', a: 'All lab results are automatically synced to your "Lab Reports" section once verified by the pathologist.' }
                    ].map((faq, i) => (
                        <div key={i} className="pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                                {faq.q}
                            </h4>
                            <p className="text-sm text-slate-500 leading-relaxed pl-3.5">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="bg-slate-900 rounded-[2rem] p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Still need help?</h2>
                    <p className="text-slate-400 mt-2 font-medium">Our helpdesk is available 24/7 for emergency technical support.</p>
                </div>
                <div className="flex gap-4">
                    <Button className="bg-white text-slate-900 border-none hover:bg-slate-100 h-14 px-8 rounded-2xl font-bold flex items-center gap-2">
                        <Mail size={20} /> Email Us
                    </Button>
                    <Button className="bg-blue-600 text-white border-none hover:bg-blue-700 h-14 px-8 rounded-2xl font-bold flex items-center gap-2">
                        <Phone size={20} /> Call Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Support;
