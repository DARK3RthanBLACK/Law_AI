import React from 'react';
import { 
  Sparkles, 
  MessageSquare,
  Search,
  FileText,
  CheckCircle2 
} from 'lucide-react';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorksPage() {
  const { language } = useLanguage();
  const steps = language === 'en' ? [
    {
      step: "01",
      title: "Interviewer",
      desc: "Asks about any gaps in knowledge and clarifies your requirements.",
      icon: MessageSquare,
      color: "from-accent-blue to-blue-500 shadow-accent-blue/15"
    },
    {
      step: "02",
      title: "Advisor",
      desc: "Searches legal document databases to find relevant precedents and laws.",
      icon: Search,
      color: "from-blue-500 to-indigo-500 shadow-blue-500/15"
    },
    {
      step: "03",
      title: "Drafter",
      desc: "Creates the case cards and drafts relevant PDFs based on the gathered context.",
      icon: FileText,
      color: "from-indigo-500 to-purple-500 shadow-purple-500/15"
    },
    {
      step: "04",
      title: "Self Evaluator",
      desc: "Performs a final quality check to ensure accuracy and completeness.",
      icon: CheckCircle2,
      color: "from-purple-500 to-accent-emerald shadow-accent-emerald/15"
    }
  ] : [
    {
      step: "01",
      title: "साक्षात्कारकर्ता",
      desc: "ज्ञान में किसी भी कमी के बारे में पूछता है और आपकी आवश्यकताओं को स्पष्ट करता है।",
      icon: MessageSquare,
      color: "from-accent-blue to-blue-500 shadow-accent-blue/15"
    },
    {
      step: "02",
      title: "सलाहकार",
      desc: "प्रासंगिक मिसालें और कानून खोजने के लिए कानूनी दस्तावेज़ डेटाबेस खोजता है।",
      icon: Search,
      color: "from-blue-500 to-indigo-500 shadow-blue-500/15"
    },
    {
      step: "03",
      title: "प्रारूपकार",
      desc: "एकत्रित संदर्भ के आधार पर केस कार्ड और प्रासंगिक पीडीएफ तैयार करता है।",
      icon: FileText,
      color: "from-indigo-500 to-purple-500 shadow-purple-500/15"
    },
    {
      step: "04",
      title: "स्वयं मूल्यांकनकर्ता",
      desc: "सटीकता और पूर्णता सुनिश्चित करने के लिए अंतिम गुणवत्ता जांच करता है।",
      icon: CheckCircle2,
      color: "from-purple-500 to-accent-emerald shadow-accent-emerald/15"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-18 animate-fade-in">
      <Header />

      <section className="py-20 md:py-28 relative flex-1 flex flex-col justify-center">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none animate-float" />

        <div className="max-w-5xl mx-auto px-6 relative z-10 w-full text-center">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto mb-20">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold rounded-full mb-4">
                <Sparkles size={12} />
                <span>{language === 'en' ? 'Auditing Pipeline' : 'ऑडिटिंग पाइपलाइन'}</span>
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
                {language === 'en' ? 'How Vakil Sahab Works' : 'वकील साहब (Vakil Sahab) कैसे काम करता है'}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                {language === 'en'
                  ? 'Follow our secure ingestion and neural processing sequence to unlock verified compliance audits.'
                  : 'सत्यापित अनुपालन ऑडिट अनलॉक करने के लिए हमारे सुरक्षित अंतर्ग्रहण और तंत्रिका प्रसंस्करण अनुक्रम का पालन करें।'}
              </p>
            </div>
          </ScrollReveal>

          {/* Flowchart container */}
          <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-12 md:gap-6 mt-10">
            
            {/* Desktop Connecting SVG Dashed Connector Line */}
            <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-1 z-0">
              <svg className="w-full h-2 overflow-visible" fill="none">
                <line 
                  x1="0" 
                  y1="0" 
                  x2="100%" 
                  y2="0" 
                  stroke="rgba(255, 255, 255, 0.05)" 
                  strokeWidth="3" 
                />
                <line 
                  x1="0" 
                  y1="0" 
                  x2="100%" 
                  y2="0" 
                  stroke="url(#flow-gradient)" 
                  strokeWidth="3" 
                  strokeDasharray="8 8" 
                  className="animate-flow-dash"
                />
                <defs>
                  <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Steps loop */}
            {steps.map((st, idx) => {
              const StepIcon = st.icon;
              return (
                <ScrollReveal 
                  key={idx} 
                  direction="up" 
                  delay={idx * 180}
                  className="flex-1 z-10"
                >
                  <div className="flex flex-col items-center group h-full">
                    
                    {/* Node Circle */}
                    <div className={`w-22 h-22 rounded-full bg-gradient-to-tr ${st.color} p-0.5 shadow-lg group-hover:scale-105 transition-all duration-300 relative z-10 flex items-center justify-center`}>
                      <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-white relative">
                        <StepIcon size={24} className="text-slate-200 group-hover:text-white transition-colors duration-250" />
                        <span className="absolute -bottom-2 right-1 bg-slate-900 border border-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-accent-blue">
                          {st.step}
                        </span>
                      </div>
                    </div>

                    {/* Step Card Content */}
                    <div className="mt-6 bg-slate-900/35 border border-slate-900 group-hover:border-slate-800/80 rounded-2xl p-6 text-center flex flex-col flex-grow transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-black/40">
                      <h3 className="font-semibold text-lg text-slate-100 mb-2.5 tracking-tight group-hover:text-white transition-colors">
                        {st.title}
                      </h3>
                      <p className="text-slate-450 text-xs leading-relaxed">
                        {st.desc}
                      </p>
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}

          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900 bg-slate-950/60 py-8 text-center text-xs text-slate-650">
        &copy; {new Date().getFullYear()} Vakil Sahab Inc. All rights reserved.
      </footer>
    </div>
  );
}
