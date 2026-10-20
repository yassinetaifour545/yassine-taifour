import React from 'react';
import { Tag, Headphones, ShieldCheck, Check, Sparkles } from 'lucide-react';

export const WhyUs: React.FC = () => {
  const pillars = [
    {
      icon: Tag,
      title: 'Morocco Best Price Guarantee',
      description:
        'All 9 models in our catalog are directly benchmarked 25% to 35% below international airport desks. If you find a comparable verified offer in Casablanca or Marrakech, we match it and deduct 10%.',
      proofPoints: [
        'Strictly zero hidden terminal charges',
        'Transparent fuel policy (Like-for-Like)',
        'Up to 20% discount on rentals over 14 days',
      ],
    },
    {
      icon: Headphones,
      title: '24/7 VIP Concierge & Assistance',
      description:
        'Our dedicated bilingual dispatch team monitors your flight in real-time. Whether landing at 2 AM in Mohammed V (CMN) or Menara (RAK), your vehicle is waiting curbside with immediate keys handover.',
      proofPoints: [
        'Real-time flight arrival tracking',
        'Guaranteed replacement vehicle within 90 mins',
        'Direct VIP WhatsApp line for instant roadside help',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Sanitized & Fully Insured Fleet',
      description:
        'Every car undergoes an 84-point mechanical and safety inspection plus clinical detailing before every handover. Comprehensive collision coverage, theft protection, and zero-deductible options are standard.',
      proofPoints: [
        'Certified medical-grade cabin sanitization',
        'Optional zero-excess (0 DH liability) protection',
        'Full Moroccan legal road authorization',
      ],
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-white dark:bg-[#0E0E0E] border-y border-black/5 dark:border-white/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F5A623] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Yassine Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0A0A] dark:text-[#FAFAFA] font-display">
            Built for peace of mind across Morocco.
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-light">
            We stripped away long rental counter queues, confusing insurance fine print, and inflated prices to deliver pure driving pleasure.
          </p>
        </div>

        {/* 3 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-neutral-50 dark:bg-[#141414] border border-black/5 dark:border-white/5 flex flex-col justify-between hover:border-black/20 dark:hover:border-white/20 transition-all duration-200"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-[#0A0A0A] dark:text-[#FAFAFA] mb-3 font-display">
                    {pillar.title}
                  </h3>

                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6 font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-black/5 dark:border-white/5">
                  {pillar.proofPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <Check className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtle Metric Adjacency Proof Row */}
        <div className="mt-16 p-6 rounded-2xl bg-[#0A0A0A] text-white flex flex-wrap items-center justify-around gap-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F5A623] font-display tabular-nums">
              4,800+
            </div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5">
              Verified Trips in Morocco
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FAFAFA] font-display tabular-nums">
              4.9 / 5.0
            </div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5">
              Google Customer Rating
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F5A623] font-display tabular-nums">
              90 Mins
            </div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5">
              Rapid Vehicle Replacement
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FAFAFA] font-display tabular-nums">
              0 DH
            </div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5">
              Cancellation Fee Prior to 24h
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
