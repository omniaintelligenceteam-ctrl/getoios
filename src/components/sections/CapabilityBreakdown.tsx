'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Calendar,
  TrendingUp,
  Megaphone,
  Settings,
  DollarSign,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';

interface SubTopic {
  name: string;
  details: string[];
}

interface Capability {
  icon: LucideIcon;
  name: string;
  tagline: string;
  color: string;
  borderColor: string;
  bgColor: string;
  subtopics: SubTopic[];
}

const capabilities: Capability[] = [
  {
    icon: Phone,
    name: 'Phones',
    tagline: 'Every call answered. Every caller remembered.',
    color: 'text-teal-400',
    borderColor: 'border-teal-400/20',
    bgColor: 'bg-teal-400/10',
    subtopics: [
      {
        name: 'Answering Modes',
        details: [
          'Always-on — every call answered, period',
          'Overflow — picks up when you don\'t answer',
          'After-hours — covers nights, weekends, holidays',
          'Handles multiple calls simultaneously',
          'Custom voice and personality trained on your business',
        ],
      },
      {
        name: 'Alerting',
        details: [
          'Instant SMS alert with caller details after every call',
          'Email summary with full call breakdown',
          'Emergency routing — urgent calls go straight to you',
          'VIP caller routing — flag numbers for instant transfer',
        ],
      },
      {
        name: 'Call Intelligence',
        details: [
          'Caller memory — recognizes returning callers by name',
          'FAQ handling trained on your hours, pricing, and services',
          'Full transcripts and recordings for every call',
          'Sentiment tracking — flags upset callers for follow-up',
          'Auto-tagging — new lead, existing customer, spam, vendor',
        ],
      },
      {
        name: 'Language',
        details: [
          'Full English and Spanish support',
          'Natural conversation — not robotic scripts',
        ],
      },
      {
        name: 'Analytics',
        details: [
          'Call volume tracking — daily, weekly, monthly',
          'Peak hour identification',
          'Average call duration',
          'Lead vs. non-lead breakdown',
        ],
      },
    ],
  },
  {
    icon: Calendar,
    name: 'Scheduling',
    tagline: 'Booked on the call. Confirmed by text. No no-shows.',
    color: 'text-amber-400',
    borderColor: 'border-amber-400/20',
    bgColor: 'bg-amber-400/10',
    subtopics: [
      {
        name: 'Live Booking',
        details: [
          'Book appointments right on the call — no website needed',
          'Real-time calendar availability checks',
          'Handles rescheduling and cancellations',
          'Double-booking prevention',
        ],
      },
      {
        name: 'Calendar Sync',
        details: [
          'Google Calendar integration',
          'ServiceTitan, Housecall Pro, Jobber sync',
          'Works with any field service software',
        ],
      },
      {
        name: 'Reminders',
        details: [
          'Confirmation text sent immediately after booking',
          'Day-before reminder texts — cuts no-shows significantly',
          'Rescheduling and cancellation confirmations',
        ],
      },
      {
        name: 'Smart Dispatch',
        details: [
          'Route to the right person by skill, location, and availability',
          'Travel time accounted for between appointments',
          'Buffer time management',
          'Emergency slot holds for urgent requests',
        ],
      },
      {
        name: 'Waitlist',
        details: [
          'Capture info when fully booked, notify when slot opens',
          'Recurring appointment scheduling',
          'No-show tracking — flags repeat offenders',
        ],
      },
    ],
  },
  {
    icon: TrendingUp,
    name: 'Sales',
    tagline: 'No lead falls through the cracks. Ever.',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400/20',
    bgColor: 'bg-emerald-400/10',
    subtopics: [
      {
        name: 'Lead Capture',
        details: [
          'Every call auto-logged — name, number, needs, urgency',
          'Lead tagging — new vs. returning, service type, source',
          'Nothing falls through the cracks',
        ],
      },
      {
        name: 'Follow-Up',
        details: [
          'Automated follow-up calls and texts to leads who didn\'t book',
          'Drip email sequences — personalized, timed follow-ups',
          'Speed-to-lead tracking',
          'Re-engagement for leads that went cold',
        ],
      },
      {
        name: 'Upselling',
        details: [
          'Natural add-on suggestions during calls',
          'Custom upsell rules for your business',
          'Conversion tracking — see what\'s working',
        ],
      },
      {
        name: 'Lead Scoring',
        details: [
          'Rate every lead by value, intent, and urgency',
          'Priority flagging for high-value leads',
          'Source tracking — know which channels work best',
        ],
      },
      {
        name: 'Pipeline',
        details: [
          'See where every lead stands — new to completed',
          'Stale lead alerts',
          'Win/loss tracking and conversion analytics',
        ],
      },
      {
        name: 'Outbound',
        details: [
          'AI-powered lead sourcing from public databases',
          'Personalized outreach sequences — human-approved',
          'Open and click tracking on all emails',
          'Auto-generated proposals from call transcripts',
        ],
      },
    ],
  },
  {
    icon: Megaphone,
    name: 'Marketing',
    tagline: 'The stuff you know you should do but never have time for.',
    color: 'text-violet-400',
    borderColor: 'border-violet-400/20',
    bgColor: 'bg-violet-400/10',
    subtopics: [
      {
        name: 'Reviews',
        details: [
          'Automated review requests after every completed job',
          'Review monitoring across Google and Yelp',
          'AI-drafted professional review responses',
          'Negative review alerts — know immediately',
          'Reputation dashboard — rating trend over time',
        ],
      },
      {
        name: 'Re-Engagement',
        details: [
          'Past customer outreach — seasonal reminders',
          'Win-back campaigns for quiet customers',
          'Birthday and anniversary outreach',
          'Warranty expiration reminders',
        ],
      },
      {
        name: 'Campaigns',
        details: [
          'Email and text marketing sequences',
          'Referral program management',
          'Neighborhood targeting near completed jobs',
        ],
      },
      {
        name: 'Content',
        details: [
          'Social media posts — LinkedIn, Facebook, Instagram',
          'Blog posts and email newsletters',
          'Before/after showcases and success stories',
        ],
      },
      {
        name: 'Analytics',
        details: [
          'Open rates, click rates, and conversions',
          'Marketing ROI — which campaigns drive real revenue',
          'Customer lifetime value tracking',
        ],
      },
    ],
  },
  {
    icon: Settings,
    name: 'Operations',
    tagline: 'Wake up to a briefing. Not a mess.',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-400/20',
    bgColor: 'bg-cyan-400/10',
    subtopics: [
      {
        name: 'Daily Briefings',
        details: [
          'Morning — overnight calls, today\'s schedule, priorities',
          'Midday — jobs on track, delays, new leads',
          'Afternoon — tomorrow\'s schedule, open slots, weather',
          'Delivered by text, email, or both',
        ],
      },
      {
        name: 'CRM Sync',
        details: [
          'Auto-log every call, lead, and booking',
          'Works with ServiceTitan, Jobber, Housecall Pro, Google Sheets',
          'Full customer history in one place',
          'No more manual data entry',
        ],
      },
      {
        name: 'Reporting',
        details: [
          'Weekly summaries — calls, bookings, revenue, missed opportunities',
          'Monthly performance reports with growth trends',
          'Custom reports — ask for anything',
          'KPI dashboards',
        ],
      },
      {
        name: 'Crew Management',
        details: [
          'Performance tracking — who closes most, who upsells best',
          'Job assignment and dispatch tracking',
          'Call scoring and coaching from real interactions',
        ],
      },
      {
        name: 'Job Tracking',
        details: [
          'Status from booked to dispatched to complete to invoiced',
          'Photo documentation — techs text photos, auto-logged',
          'Quality assurance flagging',
        ],
      },
      {
        name: 'Workflow Automation',
        details: [
          'Custom triggers — job done? Send review, update CRM, invoice',
          'Automated task delegation',
          'Escalation paths — right person notified when things go wrong',
        ],
      },
    ],
  },
  {
    icon: DollarSign,
    name: 'Finance',
    tagline: 'No more awkward past-due calls. We handle it.',
    color: 'text-orange-400',
    borderColor: 'border-orange-400/20',
    bgColor: 'bg-orange-400/10',
    subtopics: [
      {
        name: 'Invoicing',
        details: [
          'Automated invoice generation after jobs',
          'Text and email reminders for overdue payments',
          'Payment links sent via text',
          'Payment plan management for larger jobs',
        ],
      },
      {
        name: 'Cash Flow',
        details: [
          'Real-time money in vs. money out monitoring',
          'Alerts when things look off or slow period approaching',
          'Accounts receivable aging — who owes what',
          'Revenue forecasting from pipeline and seasonals',
        ],
      },
      {
        name: 'Profitability',
        details: [
          'Profit margin per job — materials + labor vs. revenue',
          'Per-person profitability tracking',
          'Which services make the most money',
          'Cost per lead and marketing ROI',
        ],
      },
      {
        name: 'Reporting',
        details: [
          'Daily, weekly, and monthly revenue reports',
          'Profit and loss summaries',
          'Year-over-year comparisons',
          'Tax-ready records for your accountant',
        ],
      },
      {
        name: 'Planning',
        details: [
          'Budget forecasting from historical data',
          'Seasonal revenue predictions',
          'Break-even analysis',
          'Growth modeling — what if you add a second team?',
        ],
      },
    ],
  },
];

function SubTopicAccordion({ subtopic }: { subtopic: SubTopic }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-700/30 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-1 text-left group"
      >
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
          {subtopic.name}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ul className="pb-3 px-1 space-y-1.5">
              {subtopic.details.map((detail) => (
                <li key={detail} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-teal-400 opacity-60 flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CapabilityBreakdown() {
  const [activeTab, setActiveTab] = useState(0);
  const active = capabilities[activeTab];

  return (
    <section className="py-24 lg:py-32 bg-bg-primary relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">
              What We Cover
            </span>
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            Six Areas.{' '}
            <span className="gradient-text">Zero Hires.</span>
          </h2>
        </motion.div>

        {/* Tab Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {capabilities.map((cap, i) => (
            <button
              key={cap.name}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === i
                  ? `bg-slate-800 border border-slate-600 text-white shadow-lg`
                  : 'bg-slate-900/40 border border-slate-700/30 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              <cap.icon className={`w-4 h-4 ${activeTab === i ? cap.color : ''}`} />
              {cap.name}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className={`rounded-2xl bg-slate-900/60 border ${active.borderColor} p-6 sm:p-8`}
          >
            {/* Tab Header */}
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-12 h-12 rounded-xl ${active.bgColor} border ${active.borderColor} flex items-center justify-center`}>
                <active.icon className={`w-6 h-6 ${active.color}`} />
              </div>
              <div>
                <h3
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  {active.name}
                </h3>
                <p className="text-sm text-slate-400">{active.tagline}</p>
              </div>
            </div>

            {/* Sub-topic Accordions */}
            <div className="mt-6 border-t border-slate-700/30">
              {active.subtopics.map((sub) => (
                <SubTopicAccordion key={sub.name} subtopic={sub} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
