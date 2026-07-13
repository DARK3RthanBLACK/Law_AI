import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';

export default function FaqPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "Can LawAI replace an attorney or represent me in court?",
      a: "No, LawAI provides AI-generated analysis, summaries, and educational guidance based on public statutes. It does not provide official legal representation or replace qualified legal counsel. Always consult a licensed attorney for official legal advice."
    },
    {
      q: "Is my uploaded document data secure and confidential?",
      a: "Yes, security is a priority. All uploaded files and chats are encrypted in transit and at rest. We do not use your proprietary documents to train public AI models."
    },
    {
      q: "Does LawAI support legal jurisdictions outside the United States?",
      a: "Currently, our primary dataset covers US Federal law, state codes (including California, New York, Delaware), and common law principles. Support for EU and Commonwealth jurisdictions is currently in beta."
    },
    {
      q: "How accurate is the document clause parsing?",
      a: "Our models achieve over 92% accuracy in identifying key clauses (like indemnity, termination, force majeure). However, we always recommend reviewing critical recommendations manually."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-18">
      <Header />

      <section className="py-20 md:py-28 relative flex-1 flex flex-col justify-center">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10 w-full">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold rounded-full mb-4">
                <Sparkles size={12} />
                <span>Information</span>
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Answers to common queries regarding LawAI capabilities, data security, and limits.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <ScrollReveal 
                  key={idx} 
                  direction="up" 
                  delay={idx * 80}
                  duration={500}
                >
                  <div 
                    className="glass border border-slate-900 rounded-xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-4.5 flex items-center justify-between text-left font-medium text-slate-200 hover:text-white cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown 
                        size={18} 
                        className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} 
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-slate-400 text-sm border-t border-slate-900/60 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900 bg-slate-950/60 py-8 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} LawAI Inc. All rights reserved.
      </footer>
    </div>
  );
}
