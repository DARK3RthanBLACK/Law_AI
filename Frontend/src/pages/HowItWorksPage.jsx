import React from 'react';
import { 
  Sparkles, 
  Upload, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Ask or Ingest",
      desc: "Type a legal question or drop documents (PDF, DOCX, TXT) directly into our workspace portal.",
      icon: Upload,
      color: "from-accent-blue to-blue-500 shadow-accent-blue/15"
    },
    {
      step: "02",
      title: "Deep AI Audit",
      desc: "LawAI parses clauses, flags structural liabilities, cross-references jurisdictions, and details risks.",
      icon: Cpu,
      color: "from-blue-500 to-indigo-500 shadow-blue-500/15"
    },
    {
      step: "03",
      title: "Actionable Verdicts",
      desc: "Download formatted audit reviews, read summaries in plain text, and see cited statute sections.",
      icon: CheckCircle2,
      color: "from-indigo-500 to-accent-emerald shadow-accent-emerald/15"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-18">
      <Header />

      <section className="py-20 md:py-28 relative flex-1 flex flex-col justify-center">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10 w-full text-center">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto mb-20">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold rounded-full mb-4">
                <Sparkles size={12} />
                <span>Auditing Pipeline</span>
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
                How LawAI Works
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Follow our secure ingestion and neural processing sequence to unlock verified compliance audits.
              </p>
            </div>
          </ScrollReveal>

          {/* Flowchart container */}
          <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-12 md:gap-6 mt-10">
            
            {/* Desktop Connecting SVG Dashed Connector Line */}
            <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-1 z-0">
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
        &copy; {new Date().getFullYear()} LawAI Inc. All rights reserved.
      </footer>
    </div>
  );
}
