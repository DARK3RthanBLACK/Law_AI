import React from 'react';
import { 
  MessageSquare, 
  FileText, 
  History, 
  Languages, 
  ShieldCheck, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import ScrollReveal from '../components/ScrollReveal';

export default function FeaturesPage() {
  const features = [
    {
      title: "Interactive AI Consultation",
      icon: MessageSquare,
      desc: "Chat with an AI trained on core legal principles, providing citations and clarifying complex legal jargon in real-time."
    },
    {
      title: "Smart Document Analysis",
      icon: FileText,
      desc: "Upload PDFs, contracts, or terms of service to extract liabilities, key dates, indemnifications, and potential risks instantly."
    },
    {
      title: "Historical Case Retrieval",
      icon: History,
      desc: "Revisit and manage all your past queries and document reviews in a consolidated, secure space."
    },
    {
      title: "Multi-language Adaptability",
      icon: Languages,
      desc: "Translate, summarize, and draft documents across multiple languages with legal accuracy maintained."
    },
    {
      title: "Precision & Confidence Check",
      icon: ShieldCheck,
      desc: "Double-checks references to prevent legal hallucinations, highlighting exactly what section of the law matches your query."
    },
    {
      title: "Statute Reference Library",
      icon: BookOpen,
      desc: "Quick access to constitutional amendments, corporate laws, and tenant codes to crosscheck recommendations."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-18">
      <Header />

      <section className="py-20 md:py-28 relative flex-1 flex flex-col justify-center">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 w-full">
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold rounded-full mb-4">
                <Sparkles size={12} />
                <span>Capabilities</span>
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
                Platform Features
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering lawyers, business owners, and individuals with state-of-the-art legal understanding tools.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <ScrollReveal 
                key={idx} 
                direction="up" 
                delay={(idx % 3) * 120} 
                duration={600}
              >
                <Card title={feat.title} icon={feat.icon} className="h-full">
                  {feat.desc}
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900 bg-slate-950/60 py-8 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} LawAI Inc. All rights reserved.
      </footer>
    </div>
  );
}
