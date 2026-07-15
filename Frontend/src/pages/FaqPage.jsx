import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export default function FaqPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const { language } = useLanguage();

  const faqs = language === 'en' ? [
    {
      q: "Can Vakil Sahab replace an attorney or represent me in court?",
      a: "No, Vakil Sahab provides AI-generated analysis, summaries, and educational guidance based on public statutes. It does not provide official legal representation or replace qualified legal counsel. Always consult a licensed attorney for official legal advice."
    },
    {
      q: "Is my uploaded document data secure and confidential?",
      a: "Yes, security is a priority. All uploaded files and chats are encrypted in transit and at rest. We do not use your proprietary documents to train public AI models."
    },
    {
      q: "Does Vakil Sahab support legal jurisdictions outside the United States?",
      a: "Currently, our primary dataset covers US Federal law, state codes (including California, New York, Delaware), and common law principles. Support for EU and Commonwealth jurisdictions is currently in beta."
    },
    {
      q: "How accurate is the document clause parsing?",
      a: "Our models achieve over 92% accuracy in identifying key clauses (like indemnity, termination, force majeure). However, we always recommend reviewing critical recommendations manually."
    }
  ] : [
    {
      q: "क्या लॉएआई किसी वकील की जगह ले सकता है या अदालत में मेरा प्रतिनिधित्व कर सकता है?",
      a: "नहीं, लॉएआई सार्वजनिक कानूनों के आधार पर एआई-जनरेटेड विश्लेषण, सारांश और शैक्षिक मार्गदर्शन प्रदान करता है। यह आधिकारिक कानूनी प्रतिनिधित्व प्रदान नहीं करता है या योग्य कानूनी वकील की जगह नहीं लेता है। आधिकारिक कानूनी सलाह के लिए हमेशा एक लाइसेंस प्राप्त वकील से परामर्श लें।"
    },
    {
      q: "क्या मेरा अपलोड किया गया दस्तावेज़ डेटा सुरक्षित और गोपनीय है?",
      a: "हाँ, सुरक्षा एक प्राथमिकता है। सभी अपलोड की गई फाइलें और चैट ट्रांजिट और रेस्ट में एन्क्रिप्टेड हैं। हम आपके मालिकाना दस्तावेजों का उपयोग सार्वजनिक एआई मॉडल को प्रशिक्षित करने के लिए नहीं करते हैं।"
    },
    {
      q: "क्या लॉएआई संयुक्त राज्य अमेरिका के बाहर कानूनी क्षेत्राधिकारों का समर्थन करता है?",
      a: "वर्तमान में, हमारा प्राथमिक डेटासेट यूएस फेडरल कानून, राज्य कोड (कैलिफ़ोर्निया, न्यूयॉर्क, डेलावेयर सहित), और सामान्य कानून सिद्धांतों को कवर करता है। यूरोपीय संघ और राष्ट्रमंडल क्षेत्राधिकारों के लिए समर्थन वर्तमान में बीटा में है।"
    },
    {
      q: "दस्तावेज़ क्लॉज पार्सिंग कितना सटीक है?",
      a: "हमारे मॉडल प्रमुख खंडों (जैसे क्षतिपूर्ति, समाप्ति, बल की घटना) की पहचान करने में 92% से अधिक सटीकता प्राप्त करते हैं। हालांकि, हम हमेशा महत्वपूर्ण सिफारिशों की मैन्युअल रूप से समीक्षा करने की सलाह देते हैं।"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-18 animate-fade-in">
      <Header />

      <section className="py-20 md:py-28 relative flex-1 flex flex-col justify-center">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10 w-full">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold rounded-full mb-4">
                <Sparkles size={12} />
                <span>{language === 'en' ? 'Information' : 'जानकारी'}</span>
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
                {language === 'en' ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले प्रश्न'}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                {language === 'en'
                  ? 'Answers to common queries regarding Vakil Sahab capabilities, data security, and limits.'
                  : 'वकील साहब (Vakil Sahab) क्षमताओं, डेटा सुरक्षा और सीमाओं के संबंध में सामान्य प्रश्नों के उत्तर।'}
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
        &copy; {new Date().getFullYear()} Vakil Sahab Inc. All rights reserved.
      </footer>
    </div>
  );
}
