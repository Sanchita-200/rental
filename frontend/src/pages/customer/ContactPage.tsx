import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-12 bg-[#07140F]">
      
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white">Contact RentFlow Support</h1>
        <p className="text-xs text-slate-400">Have questions about rental bookings, deposits, or store pickup locations? Send us a message.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Information Cards */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-green-500/20 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Phone Support</span>
              <span className="text-xs text-slate-400">+91 1800-RENT-FLOW</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-green-500/20 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Email Inquiries</span>
              <span className="text-xs text-slate-400">support@rentflow.com</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-green-500/20 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Headquarters & Pickup Station</span>
              <span className="text-xs text-slate-400">Tech Park Cyber City, Suite 402</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-green-500/30 shadow-2xl">
          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-300">Our customer team will reply to <strong>{email}</strong> within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john@example.com"
                    className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="Booking inquiry or equipment rental question"
                  className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Tell us how we can help..."
                  className="w-full bg-[#07140F] border border-green-500/20 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg glow-emerald hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
