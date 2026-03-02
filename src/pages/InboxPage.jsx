import { useState, useRef, useEffect, useMemo } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import {
  Search, Filter, ChevronDown, ChevronRight, Star, Clock, Inbox,
  MessageSquare, Mail, Phone, Send, Paperclip, Smile, Mic,
  MoreHorizontal, Sparkles, CheckCircle, X, Plus, Video,
  Bookmark, Users, Activity, AlertCircle, Camera, Settings,
  FileText, Square, Check, Zap, UserPlus, AlignJustify, Twitter, Heart, Shield,
  Bot, ArrowRight, Copy, Edit3, ThumbsUp, ThumbsDown, RotateCcw,
  BookOpen, ArrowUpRight, CircleDot, Brain, Cpu, TrendingUp,
  Calendar, MapPin, ExternalLink, Tag, Building, Globe, PlayCircle, Reply,
} from 'lucide-react';

/* ═══ DATA ═══ */
const inboxConversations = [
  {
    id: 1, name: 'Brad Pitt', initials: 'BP', time: '2m',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    tags: [
      { label: 'VIP', color: theme.colors.warning, bg: theme.colors.warningMuted },
      { label: 'At risk', color: theme.colors.error, bg: theme.colors.errorMuted },
    ],
    preview: 'We were charged twice for our February invoice. Can you look into it?', channel: 'chat', status: 'online',
  },
  {
    id: 2, name: 'Michael Torres', initials: 'MT', time: '1h',
    gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)',
    tags: [], preview: 'Can you walk me through the differences and pricing?', channel: 'email', status: 'away',
  },
  {
    id: 3, name: 'Emily Davis', initials: 'ED', time: '3h',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    tags: [],
    preview: "I've been trying to reset my password but keep getting an error.", channel: 'phone', status: 'online',
  },
  {
    id: 4, name: 'David Kim', initials: 'DK', time: '4h',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    tags: [{ label: 'Technical', color: theme.colors.blue, bg: theme.colors.blueMuted }],
    preview: "We're getting intermittent 429 rate limit errors during peak hours...", channel: 'chat', status: 'offline',
  },
  {
    id: 5, name: 'Rachel Martinez', initials: 'RM', time: '1d',
    gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
    tags: [{ label: 'New Lead', color: theme.colors.success, bg: theme.colors.successMuted }],
    preview: 'Can you tell me about the onboarding process?', channel: 'sms', status: 'online',
  },
  {
    id: 6, name: 'Tom Bradley', initials: 'TB', time: '2d',
    gradient: 'linear-gradient(135deg, #0062B8, #004580)',
    tags: [
      { label: 'VIP', color: theme.colors.warning, bg: theme.colors.warningMuted },
      { label: 'At risk', color: theme.colors.error, bg: theme.colors.errorMuted },
      { label: 'Critical', color: theme.colors.error, bg: theme.colors.errorMuted },
    ],
    preview: 'I need this resolved NOW and I want to know what went wrong.', channel: 'email', status: 'offline',
  },
  {
    id: 7, name: 'Amanda Foster', initials: 'AF', time: '3d',
    gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)',
    tags: [{ label: 'Expanding', color: theme.colors.success, bg: theme.colors.successMuted }],
    preview: 'We need separate call routing per site but unified reporting.', channel: 'chat', status: 'online',
  },
];

const interactionTimelineMap = {
  default: [
    {
      id: 1, channel: 'sms', date: 'Nov 10',
      title: 'Quick question about billing portal access',
      time: '2:15 PM', agent: 'AI Assistant', sentiment: 'Neutral',
      outcome: 'Resolved - sent portal link',
      messages: [
        { from: 'customer', name: 'Brad Pitt', text: "Hi, I can't find the billing portal. Can you send me the direct link?", time: '2:15 PM' },
        { from: 'agent', name: 'You', text: "Of course! Here's your billing portal: billing.nextiva.com. Log in with your admin credentials.", time: '2:16 PM' },
        { from: 'customer', name: 'Brad Pitt', text: 'Got it, thanks!', time: '2:18 PM' },
      ],
    },
    {
      id: 2, channel: 'email', date: 'Nov 20', highlight: 'Onboarding Complete',
      title: 'Sent onboarding follow-up and training resources',
      time: '9:00 AM', agent: 'James Wilson', sentiment: 'Positive',
      outcome: 'Customer completed training',
      messages: [
        { from: 'agent', name: 'You', text: "Hi Brad, I wanted to follow up on your onboarding. I've attached the training resources and setup guide for your team.", time: '9:00 AM' },
        { from: 'customer', name: 'Brad Pitt', text: "Thank you James! We've gone through the training materials and everything is set up. The team is loving the new system.", time: '11:45 AM' },
      ],
    },
    {
      id: 3, channel: 'phone', date: 'Dec 15', highlight: 'Contract Renewal Discussion',
      title: 'Quarterly business review call',
      time: '3:00 PM', agent: 'Yaniv Masjedi', duration: '45:12', sentiment: 'Positive',
      outcome: 'Renewed contract discussion',
      messages: [
        { from: 'agent', name: 'You', text: 'Discussed Q3 performance metrics, usage trends, and upcoming feature roadmap. Brad expressed interest in expanding to Enterprise tier.', time: '3:00 PM' },
        { from: 'customer', name: 'Brad Pitt', text: "We're looking to scale 3x for the holiday season. Need to understand the Enterprise migration path and pricing.", time: '3:25 PM' },
      ],
    },
    {
      id: 4, channel: 'chat', date: 'Jan 5',
      title: 'Asked about API integration capabilities',
      time: '11:20 AM', agent: 'AI Assistant', sentiment: 'Neutral',
      outcome: 'Provided documentation',
      messages: [
        { from: 'customer', name: 'Brad Pitt', text: 'We need to integrate the Nextiva API with our internal CRM. Is there documentation for the REST API?', time: '11:20 AM' },
        { from: 'agent', name: 'You', text: "Absolutely! Here's our API documentation: docs.nextiva.com/api. It covers authentication, endpoints, and webhook setup. Let me know if you need help with the integration.", time: '11:22 AM' },
        { from: 'customer', name: 'Brad Pitt', text: "Perfect, I'll pass this to our dev team. Thanks!", time: '11:25 AM' },
      ],
    },
    {
      id: 5, channel: 'twitter', date: 'Jan 8', highlight: 'Public Praise',
      title: 'Mentioned us in a positive tweet about customer support',
      time: '4:30 PM', agent: 'Social Team', sentiment: 'Positive',
      outcome: 'Engagement acknowledged',
      messages: [
        { from: 'customer', name: 'Brad Pitt', text: "Shoutout to @Nextiva for the amazing customer support! Their team went above and beyond to help us scale. Couldn't be happier. 🎉", time: '4:30 PM' },
        { from: 'agent', name: 'You', text: "Thank you so much for the kind words, Brad! We're thrilled to be part of your growth journey. 💙", time: '4:45 PM' },
      ],
    },
    {
      id: 6, channel: 'chat', date: 'Jan 15',
      title: 'Requested scaling options for holiday rush',
      time: '10:30 AM', agent: 'AI Assistant', sentiment: 'Positive',
      outcome: 'Scheduled follow-up demo',
      messages: [
        { from: 'customer', name: 'Brad Pitt', text: "We need to scale our call center capacity 3x for the upcoming holiday rush. What are our options?", time: '10:30 AM' },
        { from: 'agent', name: 'You', text: "Based on your current usage, I'd recommend our Enterprise tier with auto-scaling and dedicated support. Would you like me to schedule a demo to walk through the migration?", time: '10:32 AM' },
        { from: 'customer', name: 'Brad Pitt', text: "Yes, please schedule a demo for next week. This is a priority for us.", time: '10:35 AM' },
      ],
    },
  ],
  3: [
    {
      id: 1, channel: 'email', date: 'Dec 2',
      title: 'Welcome email — Brightwave Corp onboarded to Business Pro',
      time: '10:00 AM', agent: 'Onboarding Team', sentiment: 'Positive',
      outcome: 'Account setup confirmed',
      messages: [
        { from: 'agent', name: 'You', text: "Hi Emily, welcome to Nextiva! Your Business Pro account for Brightwave Corp is all set up. Here are your login credentials and setup guide.", time: '10:00 AM' },
        { from: 'customer', name: 'Emily Davis', text: "Thanks! Everything looks good. I'll get the team started this week.", time: '10:45 AM' },
      ],
    },
    {
      id: 2, channel: 'chat', date: 'Jan 18',
      title: 'Asked about adding team members to the account',
      time: '3:30 PM', agent: 'AI Assistant', sentiment: 'Neutral',
      outcome: 'Resolved — guided through admin panel',
      messages: [
        { from: 'customer', name: 'Emily Davis', text: "How do I add new team members to our Nextiva account? I need to onboard 3 more people.", time: '3:30 PM' },
        { from: 'agent', name: 'You', text: "You can add team members under Settings > Users > Invite. I've sent you a step-by-step guide as well.", time: '3:32 PM' },
        { from: 'customer', name: 'Emily Davis', text: "Got it, thanks!", time: '3:35 PM' },
      ],
    },
  ],
};

const allConversations = {
  1: [ // Brad Pitt — Duplicate billing charge
    { id: 1, from: 'customer', name: 'Brad Pitt', text: 'Hi! I was given your direct contact by our account manager. We have an urgent billing question.', time: '10:30 AM', sentiment: 'Neutral' },
  ],
  2: [ // Michael Torres — Contract renewal
    { id: 1, from: 'customer', name: 'Michael Torres', text: "Hi, our Business Pro contract is up for renewal next month. I wanted to discuss the terms before it auto-renews.", time: '9:15 AM', sentiment: 'Neutral' },
    { id: 2, from: 'agent', name: 'You', text: "Hi Michael! Thanks for reaching out ahead of time. Let me pull up your contract details.", time: '9:17 AM', _responseId: 'nba-greet-1' },
    { id: 3, from: 'customer', name: 'Michael Torres', text: "We're considering either upgrading to Enterprise or scaling down to a smaller plan. Can you walk me through the differences and pricing?", time: '9:20 AM', sentiment: 'Neutral' },
  ],
  3: [ // Emily Davis — Password reset (Voice call)
    { id: 1, from: 'customer', name: 'Emily Davis', text: "Hi, I've been trying to reset my password for the last 20 minutes but nothing is working. I keep getting an error every time I try.", time: '2:00 PM', sentiment: 'Negative' },
  ],
  4: [ // David Kim — API integration issue
    { id: 1, from: 'customer', name: 'David Kim', text: "We just completed the API integration, but we're getting intermittent 429 rate limit errors during peak hours. Our sync jobs keep failing.", time: '11:00 AM', sentiment: 'Negative' },
  ],
  5: [ // Rachel Martinez — New prospect onboarding
    { id: 1, from: 'customer', name: 'Rachel Martinez', text: "Hi! I attended your booth at the MarTech conference last week. We're interested in Nextiva for our 50-person team. Can you tell me about the onboarding process?", time: '3:30 PM', sentiment: 'Positive' },
  ],
  6: [ // Tom Bradley — Critical outage
    { id: 1, from: 'customer', name: 'Tom Bradley', text: "This is urgent. Our entire phone system has been down for 45 minutes. None of our 300 agents can make or receive calls. We're losing revenue every minute.", time: '8:00 AM', sentiment: 'Negative' },
    { id: 2, from: 'agent', name: 'You', text: "Tom, I understand the severity. Let me immediately check your service status and escalate this.", time: '8:01 AM', _responseId: 'nba-greet-1' },
    { id: 3, from: 'customer', name: 'Tom Bradley', text: "We've already lost an estimated $15,000 in sales. Our SLA guarantees 99.99% uptime. I need this resolved NOW and I want to know what went wrong.", time: '8:03 AM', sentiment: 'Negative' },
  ],
  7: [ // Amanda Foster — Multi-site expansion
    { id: 1, from: 'customer', name: 'Amanda Foster', text: "Hi, we're planning to expand from 3 locations to 8 by Q3. I need to understand how to scale our Nextiva setup across all sites with centralized management.", time: '1:00 PM', sentiment: 'Neutral' },
    { id: 2, from: 'agent', name: 'You', text: "That's exciting growth, Amanda! Let me help you plan the multi-site expansion.", time: '1:02 PM', _responseId: 'nba-greet-1' },
    { id: 3, from: 'customer', name: 'Amanda Foster', text: "Each new site will have 20-30 people. We need separate call routing per site but unified reporting. Also, can we do a phased rollout?", time: '1:05 PM', sentiment: 'Neutral' },
  ],
};

const initialConversation = allConversations[1];

/* ═══ NextIQ INTELLIGENCE DATA ═══ */

const nextIQClassificationRules = {
  kbResponse: [
    'Direct question (Who/What/When/Where/Why/How)',
    'Specific policy/procedure/feature in KB',
    'KB confidence > 80%',
  ],
  nextBestAction: [
    'Greeting with intent signal (no question yet)',
    'Vague/open-ended statement',
    'Symptom without specifics (diagnostic needed)',
    'Multi-step process (troubleshooting/setup)',
    'Frustrated/angry customer (escalation needed)',
    'KB confidence < 50%',
  ],
  both: [
    'Direct question + actionable tools available',
    'Complex utterance (multiple questions/topics)',
    'Medium KB confidence (50-80%)',
    'VIP/high-value customer with direct question',
  ],
};

function classifyIntent(conversation, customerContext) {
  if (!conversation || conversation.length === 0) return { mode: 'nba', intent: 'conversation_start', reason: 'Conversation start' };
  const lastCustomerMsg = [...conversation].reverse().find(m => m.from === 'customer');
  if (!lastCustomerMsg) return { mode: 'nba', intent: 'no_customer_message', reason: 'No customer message yet' };
  const text = lastCustomerMsg.text.toLowerCase();
  const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening)[\s!.,]/.test(text);
  const isQuestion = /^(who|what|when|where|why|how|can|could|is|are|do|does|did|will|would)\b/.test(text) || text.includes('?');
  const isBilling = /(bill|invoice|charge|payment|refund|price|cost|plan|subscription)/.test(text);
  const isVague = /(not working|having issues|something is wrong|need help|problem|issue|broken|error|trouble)/.test(text);
  const isFrustrated = /(ridiculous|frustrated|angry|terrible|worst|unacceptable|speak to.*manager|escalat)/.test(text);
  const isMultiPart = text.includes(' and ') && (isQuestion || isBilling);
  const isVIP = customerContext?.tags?.some(t => t.label === 'VIP');

  const isContinuation = /(go ahead|i'm listening|listening|okay.*go|please.*continue|continue.*ready|tell me|share|let me know|what did you find)/.test(text);
  const isRateLimit = /(rate.?limit|429|throttl|too many requests|api.*(error|fail|limit)|sync.*(fail|error)|check.*(usage|limit)|usage.*(look|check|pattern)|temporary.*(increase|raise)|increase.*(limit|rate))/.test(text);

  const isRateLimitAction = /(apply|increase|raise|bump).*(rate|limit|temp)|temporary.*(increase|raise|fix)/.test(text);
  const wantsEnterprise = /(enterprise|upgrade|permanent|plan)/.test(text);
  const wantsSchedule = /(thursday|schedule.*call|let'?s.*schedule|works.*for us|cto)/.test(text) && /(scale|integration|enterprise|cto|api)/.test(text);

  const isPasswordIssue = /(password|reset|login|log.?in|sign.?in|can'?t.*access|locked.*out|credential|forgot.*password|unable.*reset)/.test(text);
  const isEmailVerification = /(my email|email.*is|it'?s\s+\S+@)/.test(text);
  const isReactivationRequest = /(reactivat|can you.*activ|old domain|rebrand|wrong.*email|wrong.*domain)/.test(text);

  const isClosing = /(thank|thanks|helpful|appreciate|great job|awesome|see you|talk soon|that'?s (all|everything)|no.*else|we'?re.*good|all.*set|have a good|will do|good one)/.test(text)
    && !/(but|however|also.*can|one more|another|question|issue|problem with|take.*time|let me know|what.*find|can you|send me|look.*into|waiting|schedule|refund|apply|increase|go ahead)/.test(text);

  if (isClosing) return { mode: 'nba', intent: 'closing_gratitude', reason: 'Customer expressing gratitude / closing conversation — no KB needed', confidence: 80 };
  if (isReactivationRequest) return { mode: 'nba', intent: 'account_reactivation', reason: 'Customer requesting account reactivation — action-focused', confidence: 90 };
  if (isEmailVerification) return { mode: 'nba', intent: 'identity_verification', reason: 'Customer providing email for identity verification — diagnostic action needed', confidence: 88 };
  if (isGreeting && !isQuestion) return { mode: 'nba', intent: 'greeting_with_intent', reason: 'Greeting with intent signal — no question to answer yet', confidence: 70 };
  if (isContinuation) return { mode: 'both', intent: 'action_continuation', reason: 'Customer acknowledging — waiting for agent findings', confidence: 82 };
  if (isRateLimitAction && wantsEnterprise) return { mode: 'nba', intent: 'rate_limit_fix_and_upgrade', reason: 'Customer requesting rate limit fix + Enterprise upgrade — action-focused', confidence: 92 };
  if (isRateLimitAction) return { mode: 'nba', intent: 'rate_limit_action_request', reason: 'Customer requesting specific rate limit action — NBA-focused', confidence: 88 };
  if (wantsSchedule) return { mode: 'nba', intent: 'schedule_enterprise_call', reason: 'Customer confirming schedule for Enterprise consultation — action-focused', confidence: 88 };
  if (isRateLimit) return { mode: 'both', intent: 'api_rate_limit_issue', reason: 'API rate limit / integration error detected — KB + diagnostic actions available', confidence: 90 };

  if (isPasswordIssue) return { mode: 'both', intent: 'password_reset_issue', reason: 'Password/login issue detected — KB troubleshooting + diagnostic actions available', confidence: 88 };
  if (isFrustrated) return { mode: 'nba', intent: 'escalation_needed', reason: 'Escalation language detected', confidence: 35 };
  if (isVague && !isQuestion) return { mode: 'nba', intent: 'vague_issue', reason: 'Vague statement — diagnostic needed', confidence: 40 };
  if (isMultiPart || (isVIP && isQuestion)) return { mode: 'both', intent: isVIP ? 'vip_complex_inquiry' : 'multi_part_question', reason: isVIP ? 'VIP customer + complex inquiry' : 'Multi-part question', confidence: 65 };
  if (isQuestion && isBilling) return { mode: 'both', intent: 'billing_inquiry', reason: 'Direct billing inquiry — KB match + action tools available', confidence: 88 };
  if (isQuestion) return { mode: 'kb_response', intent: 'direct_question', reason: 'Direct question with KB match', confidence: 85 };
  if (isBilling) return { mode: 'both', intent: 'billing_context', reason: 'Billing context — medium confidence', confidence: 72 };
  return { mode: 'both', intent: 'general_inquiry', reason: 'General inquiry', confidence: 60 };
}

function getKBResponse(conversation) {
  const lastCustomerMsg = [...conversation].reverse().find(m => m.from === 'customer');
  if (!lastCustomerMsg) return null;
  const text = lastCustomerMsg.text.toLowerCase();

  if (/(charge.*twice|duplicate.*charge|charged.*twice|double.*charge)/.test(text)) {
    return {
      id: 'kb-billing-duplicate',
      response: `Per our Duplicate Charge Resolution Policy (BIL-2024-015):\n\nDuplicate charges caused by backend system failures during transaction processing are eligible for a full refund. Once the billing team confirms the duplicate entry in the account ledger, the standard resolution is:\n\n• Full refund of the duplicate amount\n• Processing time: 3-5 business days\n• Confirmation email with reference number sent automatically\n• Preventive billing audit triggered on the account\n\nThe agent should verify the duplicate via the billing records tool before initiating the refund workflow.`,
      confidence: 92,
      source: 'Billing Knowledge Base',
      reasoning: 'Customer reported duplicate charge — KB article BIL-2024-015 matched with 96% relevance for duplicate charge resolution procedure.',
      sourceArticles: [
        { id: 'KB-BIL-2041', title: 'Duplicate Charge Resolution & Refund Procedure', relevance: 96 },
        { id: 'KB-BIL-1987', title: 'Invoice Discrepancy Handling Policy', relevance: 89 },
        { id: 'KB-ACC-3102', title: 'Account Billing History Lookup Guide', relevance: 82 },
      ],
    };
  }
  if (/(refund.*confirmation|reference number|email.*confirm|when.*refund)/.test(text)) {
    return {
      id: 'kb-refund-tracking',
      response: `Per our Refund Tracking Policy (BIL-2055):\n\nOnce a refund is initiated, customers receive an automated confirmation email containing the refund reference number. Standard refund timelines:\n\n• Credit card refunds: 3-5 business days\n• Bank transfer refunds: 5-7 business days\n• Account credit: Immediate\n\nCustomers can track refund status via the billing portal or by contacting support with their reference number.`,
      confidence: 95,
      source: 'Billing Knowledge Base',
      reasoning: 'Customer requesting refund confirmation details — KB article BIL-2055 covers refund tracking and reference number procedures.',
      sourceArticles: [
        { id: 'KB-BIL-2055', title: 'Refund Tracking & Reference Number Lookup', relevance: 97 },
        { id: 'KB-BIL-2041', title: 'Duplicate Charge Resolution & Refund Procedure', relevance: 91 },
        { id: 'KB-COM-1450', title: 'Automated Refund Confirmation Emails', relevance: 84 },
      ],
    };
  }
  if (/(billing alert|notification|alert.*charge|yes.*alert|that would be|set.*up|please do)/.test(text)) {
    return {
      id: 'kb-billing-alerts',
      response: `Per our Billing Alert Configuration Guide (SET-3201):\n\nReal-time billing alerts can be configured to notify customers via email and SMS for:\n\n• All charges exceeding a configurable threshold\n• Duplicate transaction attempts\n• Invoice generation events\n• Payment method expiration warnings\n\nFor VIP and Enterprise accounts, a preventive billing audit can also be triggered to review recent invoices for discrepancies.`,
      confidence: 90,
      source: 'Account Settings Knowledge Base',
      reasoning: 'Customer interested in billing notifications — KB article SET-3201 covers alert configuration options.',
      sourceArticles: [
        { id: 'KB-SET-3201', title: 'Billing Alert Configuration & Notification Rules', relevance: 95 },
        { id: 'KB-BIL-2090', title: 'Proactive Billing Audit for VIP Accounts', relevance: 88 },
        { id: 'KB-COM-1462', title: 'SMS & Email Notification Delivery Settings', relevance: 79 },
      ],
    };
  }
  if (/(enterprise|upgrade|scale|scaling|capacity|holiday|rush|expand)/.test(text)) {
    return {
      id: 'kb-enterprise-tier',
      response: `Per our Enterprise Tier Guide (PRD-4010):\n\nThe Enterprise tier is designed for high-growth accounts requiring scalability. Key features include:\n\n• Auto-scaling up to 10x current capacity\n• Dedicated support with named account manager\n• 99.99% uptime SLA with financial guarantees\n• Zero-downtime migration from lower tiers\n• Priority API rate limits and custom integrations\n\nEligibility is based on current usage patterns and growth trajectory. A solutions engineer walkthrough is recommended before migration.`,
      confidence: 88,
      source: 'Product Knowledge Base',
      reasoning: 'Customer expressed scaling/upgrade interest — KB article PRD-4010 covers Enterprise tier features, pricing, and migration.',
      sourceArticles: [
        { id: 'KB-PRD-4010', title: 'Enterprise Tier Features & Pricing', relevance: 94 },
        { id: 'KB-PRD-4025', title: 'Plan Migration Guide — Zero Downtime Upgrade', relevance: 90 },
        { id: 'KB-PRD-4032', title: 'Auto-Scaling Architecture & SLA Guarantees', relevance: 85 },
      ],
    };
  }
  if (/(thursday|friday|schedule|demo|walkthrough|book|slot|yes.*work)/.test(text)) {
    return {
      id: 'kb-scheduling',
      response: `Per our Solutions Engineer Scheduling Workflow (SCH-1100):\n\nEnterprise demos should be scheduled with a solutions engineer who has prior context on the customer's account. Standard procedure:\n\n• Check engineer availability for the requested time slot\n• Send calendar invite with video conference link\n• Include pre-demo questionnaire to tailor the session\n• Notify the account manager of the scheduled demo`,
      confidence: 93,
      source: 'Scheduling Knowledge Base',
      reasoning: 'Customer confirmed scheduling preference — KB article SCH-1100 covers the enterprise demo scheduling workflow.',
      sourceArticles: [
        { id: 'KB-SCH-1100', title: 'Solutions Engineer Scheduling Workflow', relevance: 93 },
        { id: 'KB-ACC-3115', title: 'Account Owner & Contact Preferences', relevance: 86 },
      ],
    };
  }
  if (/(rate.?limit|429|throttl|too many requests|sync.*(fail|error)|check.*(usage|limit)|usage.*(look|check|pattern)|temporary.*(increase|raise)|increase.*(limit|rate))/.test(text)) {
    return {
      id: 'kb-rate-limit',
      response: `Per our API Rate Limit Policy (API-3050):\n\nDefault rate limits are set per plan tier to ensure platform stability:\n\n• Starter: 60 req/min\n• Business Pro: 300 req/min\n• Enterprise: 1,000 req/min (configurable up to 5,000)\n\nHTTP 429 errors indicate the rate limit has been exceeded. Best practices for high-volume integrations:\n\n• Implement exponential backoff with jitter\n• Use batch endpoints where available (up to 100 items/request)\n• Spread sync jobs outside peak windows (2-6 AM recommended)\n• Request a temporary rate limit increase for migration periods\n\nEnterprise customers can request custom limits via their account manager or through a support ticket.`,
      confidence: 94,
      source: 'API & Integration Knowledge Base',
      reasoning: 'Customer reporting 429 rate limit errors during API integration — KB article API-3050 covers rate limit policies, thresholds, and best practices.',
      sourceArticles: [
        { id: 'KB-API-3050', title: 'API Rate Limit Policy & Tier Thresholds', relevance: 97 },
        { id: 'KB-API-3062', title: 'Batch API Endpoints & High-Volume Integration Guide', relevance: 92 },
        { id: 'KB-API-3071', title: '429 Error Handling & Exponential Backoff Best Practices', relevance: 89 },
      ],
    };
  }
  if (/(password|reset|login|log.?in|sign.?in|can'?t.*access|locked.*out|credential|forgot.*password|unable.*reset)/.test(text)) {
    return {
      id: 'kb-password-reset',
      response: `Per our Password Reset Troubleshooting Guide (ACC-2010):\n\nCommon causes of password reset failures:\n\n• Email address mismatch — user may be entering an old or incorrect email\n• Account status INACTIVE — accounts with 90+ days of inactivity are auto-deactivated\n• Expired reset link — reset links are valid for 24 hours only\n• Browser cache/cookie issues — recommend clearing cache or using incognito\n\nResolution steps:\n1. Verify the user's identity via phone number or security questions\n2. Check if the email address on file matches what the user is entering\n3. Check account status — if INACTIVE, reactivation is required before reset\n4. If all checks pass, trigger a manual password reset email from admin panel`,
      confidence: 91,
      source: 'Account Management Knowledge Base',
      reasoning: 'Customer reporting password reset failure — KB article ACC-2010 covers troubleshooting steps for common reset issues including email mismatch and inactive accounts.',
      sourceArticles: [
        { id: 'KB-ACC-2010', title: 'Password Reset Troubleshooting Guide', relevance: 96 },
        { id: 'KB-ACC-2015', title: 'Account Status & Reactivation Policy', relevance: 91 },
        { id: 'KB-SEC-1050', title: 'Identity Verification Procedures', relevance: 85 },
      ],
    };
  }
  if (/(latency|api|service health|status page|downtime|slow|performance|speed)/.test(text)) {
    return {
      id: 'kb-service-health',
      response: `Per our Service Health Monitoring Guide (INF-5010):\n\nReal-time service status is available at status.nextiva.com. When customers report latency or performance issues:\n\n• Check the service dashboard for any ongoing incidents\n• Review the infrastructure monitoring logs for the customer's region\n• Cross-reference with recent incident post-mortems\n• Offer proactive health alerts for the customer's account\n\nCommon root causes include load balancer misconfigurations, regional capacity limits, and scheduled maintenance windows.`,
      confidence: 87,
      source: 'Infrastructure Knowledge Base',
      reasoning: 'Customer reporting performance/latency concerns — KB article INF-5010 covers service health monitoring procedures.',
      sourceArticles: [
        { id: 'KB-INF-5010', title: 'Service Health Dashboard & Uptime Monitoring', relevance: 95 },
        { id: 'KB-INF-5028', title: 'API Latency Troubleshooting Runbook', relevance: 91 },
        { id: 'KB-INF-5035', title: 'Infrastructure Incident Post-Mortem: US-East LB', relevance: 83 },
      ],
    };
  }
  if (/(health alert|proactive|monitor|yes.*alert|sounds good|that would be great)/.test(text)) {
    return {
      id: 'kb-health-alerts',
      response: `Per our Proactive Health Alert Configuration (INF-5042):\n\nService health alerts can be configured to notify customers via email, Slack, or webhook for:\n\n• API latency exceeding configurable thresholds (default: 200ms)\n• Service degradation or outage events\n• Scheduled maintenance windows (24-hour advance notice)\n• Regional infrastructure changes\n\nEnterprise and VIP accounts are eligible for priority notification and dedicated monitoring channels.`,
      confidence: 91,
      source: 'Infrastructure Knowledge Base',
      reasoning: 'Customer interested in health monitoring — KB article INF-5042 covers proactive alert configuration.',
      sourceArticles: [
        { id: 'KB-INF-5042', title: 'Proactive Health Alert Configuration', relevance: 96 },
        { id: 'KB-SET-3210', title: 'Slack Integration for Service Notifications', relevance: 88 },
        { id: 'KB-INF-5010', title: 'Service Health Dashboard & Uptime Monitoring', relevance: 80 },
      ],
    };
  }
  if (/(go ahead|i'm listening|listening|okay.*go|please.*continue|continue|ready|tell me|share|let me know|what did you find)/.test(text)) {
    return {
      id: 'kb-continuation',
      response: `Per our Active Case Continuation Protocol (GEN-1025):\n\nWhen a customer acknowledges and is waiting for findings, the agent should:\n\n• Summarize the completed action and its results clearly\n• Provide specific details (amounts, IDs, timelines)\n• Outline the immediate next step (refund, escalation, etc.)\n• Confirm the customer understands the resolution path`,
      confidence: 85,
      source: 'General Knowledge Base',
      reasoning: 'Customer is waiting for findings from a completed action — KB article GEN-1025 covers active case continuation protocol.',
      sourceArticles: [
        { id: 'KB-GEN-1025', title: 'Active Case Continuation Protocol', relevance: 93 },
        { id: 'KB-GEN-1001', title: 'General Customer Inquiry Response Templates', relevance: 78 },
      ],
    };
  }
  return {
    id: 'kb-general',
    response: `No specific knowledge base article matched with high confidence for this inquiry. The agent should gather more context from the customer to identify the relevant KB resources.\n\nGeneral inquiry handling guidelines (GEN-1001):\n• Acknowledge the customer's request\n• Ask clarifying questions if the intent is unclear\n• Search the knowledge base with more specific terms once context is available`,
    confidence: 55,
    source: 'General Knowledge Base',
    reasoning: 'General inquiry — no high-confidence KB match. Additional context needed from customer.',
    sourceArticles: [
      { id: 'KB-GEN-1001', title: 'General Customer Inquiry Response Templates', relevance: 72 },
    ],
  };
}

function getNextBestActions(conversation, customerContext) {
  const lastCustomerMsg = [...conversation].reverse().find(m => m.from === 'customer');
  const actions = [];
  const isVIP = customerContext?.tags?.some(t => t.label === 'VIP');
  const firstName = customerContext?.name?.split(' ')[0] || 'there';

  const greetingMatch = lastCustomerMsg && /^(hi|hello|hey|good morning|good afternoon|good evening)[\s!.,]/i.test(lastCustomerMsg.text);
  const isGreeting = greetingMatch && lastCustomerMsg.text.trim().split(/\s+/).length <= 12;

  if (!lastCustomerMsg || isGreeting) {
    actions.push(
      { id: 'nba-greet-1', type: 'greeting', icon: 'MessageSquare', label: `Greet & ask how to help`, priority: 'high', immediateReply: `Of course, ${firstName}. Happy to help directly. What can I look into for you?`, toolCall: null, postToolResponse: null },
      { id: 'nba-greet-2', type: 'greeting', icon: 'MessageSquare', label: `Greet & offer assistance`, priority: 'high', immediateReply: `Hello ${firstName}! Thanks for reaching out. What can I assist you with?`, toolCall: null, postToolResponse: null },
      { id: 'nba-get-account', type: 'action', icon: 'Zap', label: `Get ${firstName}'s Account & Billing Details`, priority: 'medium',
        immediateReply: null,
        toolCall: { toolId: 'tool_get_account_details', toolName: 'Get Account Details', parameters: { customerId: customerContext?.name || 'unknown' } },
        mockResult: { accountType: 'Enterprise', plan: 'Business Pro Plus', monthlySpend: '$2,450/mo', lastPayment: 'Feb 1, 2026', paymentMethod: 'Corporate Card ending 4821', openIssues: 1 },
        resultSummary: [
          { label: 'Account', value: 'Enterprise' },
          { label: 'Plan', value: 'Business Pro Plus ($2,450/mo)' },
          { label: 'Last Payment', value: 'Feb 1, 2026' },
          { label: 'Payment Method', value: 'Card ending 4821' },
          { label: 'Open Issues', value: '1', status: 'warning' },
        ],
        postToolResponse: `Account details retrieved for ${firstName}:\n• Account Type: Enterprise\n• Plan: Business Pro Plus ($2,450/mo)\n• Last Payment: Feb 1, 2026\n• Payment Method: Corporate Card ending 4821\n• Open Issues: 1`,
      },
    );
    return actions;
  }

  const text = lastCustomerMsg.text.toLowerCase();

  const isClosing = /(thank|thanks|helpful|appreciate|great job|awesome|see you|talk soon|that'?s (all|everything)|no.*else|we'?re.*good|all.*set|have a good|will do|good one)/.test(text)
    && !/(but|however|also.*can|one more|another|question|issue|problem with|take.*time|let me know|what.*find|can you|send me|look.*into|waiting|schedule|refund|apply|increase|go ahead)/.test(text);
  if (isClosing) {
    actions.push(
      { id: 'nba-close-1', type: 'reply', icon: 'MessageSquare', label: `Wrap up & wish ${firstName} well`, priority: 'high',
        immediateReply: `You're very welcome, ${firstName}! Glad I could help. If anything else comes up, don't hesitate to reach out. Have a great rest of your day!`,
        toolCall: null, postToolResponse: null },
      { id: 'nba-close-2', type: 'reply', icon: 'MessageSquare', label: `Confirm & close`, priority: 'high',
        immediateReply: `Happy to help, ${firstName}! If you need anything else in the future, we're always here. Have a wonderful day!`,
        toolCall: null, postToolResponse: null },
      { id: 'nba-close-3', type: 'reply', icon: 'MessageSquare', label: `Brief thank you & close`, priority: 'medium',
        immediateReply: `Anytime, ${firstName}! Happy to help. 👋`,
        toolCall: null, postToolResponse: null },
    );
    return actions;
  }

  if (/(charge|bill|invoice|refund|payment)/.test(text)) {
    actions.push(
      { id: 'nba-respond-check-billing', type: 'action', icon: 'Zap', label: 'Respond & Check Feb Bill for Double Charges', priority: 'high',
        immediateReply: `Sure ${firstName}, give me a second while I review your February billing.`,
        toolCall: { toolId: 'tool_check_double_charges', toolName: 'Check Double Charges', parameters: { customerId: customerContext?.name || 'unknown', month: 'february', year: '2026' } },
        mockResult: { found: true, details: 'Two identical charges of $2,400 found on Feb 15', transactionIds: ['TXN-90281', 'TXN-90282'] },
        resultSummary: [
          { label: 'Status', value: 'Duplicate found', status: 'warning' },
          { label: 'Amount', value: '$2,400.00' },
          { label: 'Date', value: 'February 15, 2026' },
          { label: 'Transactions', value: 'TXN-90281, TXN-90282' },
        ],
        postToolResponse: `I've reviewed your February billing and found two identical charges of $2,400 on Feb 15 (TXN-90281 and TXN-90282). This appears to be a duplicate charge from a backend processing error. I can initiate a refund for the duplicate right away — would you like me to proceed?`,
      },
      { id: 'nba-revert-refund', type: 'action', icon: 'Zap', label: 'Revert Last Billing Transaction & Refund to Source', priority: 'high',
        immediateReply: null,
        toolCall: { toolId: 'tool_revert_transaction', toolName: 'Revert Transaction', parameters: { customerId: customerContext?.name || 'unknown', transactionId: 'TXN-90282' } },
        mockResult: { refundId: 'REF-ABC123', status: 'processed', estimatedDays: 3 },
        resultSummary: [
          { label: 'Status', value: 'Refund processed', status: 'success' },
          { label: 'Reference ID', value: 'REF-ABC123' },
          { label: 'Amount', value: '$2,400.00' },
          { label: 'Estimated Credit', value: '3-4 business days' },
        ],
        postToolResponse: `Refund initiated successfully.\n\n• Reference ID: REF-ABC123\n• Amount: $2,400.00\n• Status: Processing\n• Estimated credit: 3-4 business days\n\nYou'll receive a confirmation email at your address on file. Is there anything else I can help with?`,
      },
    );
  }

  if (/(password|reset|login|log.?in|sign.?in|can'?t.*access|locked.*out|credential|forgot.*password|unable.*reset)/.test(text)) {
    actions.push(
      { id: 'nba-greet-verify', type: 'action', icon: 'Zap', label: `Greet & ask ${firstName} for email to verify identity`, priority: 'high',
        immediateReply: `Hi ${firstName}, I'm sorry to hear you're having trouble with your password reset. I can definitely help with that. Can you confirm the email address associated with your account so I can look into this for you?`,
        toolCall: null, postToolResponse: null },
      { id: 'nba-diagnose-user', type: 'action', icon: 'Zap', label: `Diagnose username & check user status`, priority: 'high',
        immediateReply: `Thanks ${firstName}, let me look that up now. One moment.`,
        toolCall: { toolId: 'tool_diagnose_user', toolName: 'Diagnose User Account', parameters: { email: 'emily.davis@brightwave.io', phoneFromMetadata: '+1 (512) 555-0198' } },
        mockResult: { emailMatch: false, registeredEmail: 'emily@brightwavecorp.io', accountStatus: 'INACTIVE', lastLogin: '92 days ago', inactiveSince: 'Nov 26, 2025', phoneMatch: true, username: 'emily.davis' },
        resultSummary: [
          { label: 'Email Match', value: 'No — mismatch', status: 'warning' },
          { label: 'Registered Email', value: 'emily@brightwavecorp.io' },
          { label: 'Account Status', value: 'INACTIVE', status: 'warning' },
          { label: 'Last Login', value: '92 days ago' },
          { label: 'Phone Match', value: 'Verified via call metadata', status: 'success' },
        ],
        postToolResponse: null,
      },
      { id: 'nba-password-generic', type: 'reply', icon: 'MessageSquare', label: `Suggest using Forgot Password flow`, priority: 'medium',
        immediateReply: `${firstName}, you can try the "Forgot Password" link on the login page. It will send a reset link to the email on your account. If that doesn't work, I can manually trigger a reset from our end.`,
        toolCall: null, postToolResponse: null },
    );
    return actions;
  }

  if (/(my email|email.*is|it'?s\s+\S+@)/.test(text)) {
    actions.push(
      { id: 'nba-diagnose-user', type: 'action', icon: 'Zap', label: `Diagnose the email entered & check user status`, priority: 'high',
        immediateReply: `Thanks ${firstName}, let me look that up now. One moment.`,
        toolCall: { toolId: 'tool_diagnose_user', toolName: 'Diagnose User Account', parameters: { email: 'emily.davis@brightwave.io', phoneFromMetadata: '+1 (512) 555-0198' } },
        mockResult: { emailMatch: false, registeredEmail: 'emily@brightwavecorp.io', accountStatus: 'INACTIVE', lastLogin: '92 days ago', inactiveSince: 'Nov 26, 2025', phoneMatch: true, username: 'emily.davis' },
        resultSummary: [
          { label: 'Email Match', value: 'No — mismatch', status: 'warning' },
          { label: 'Registered Email', value: 'emily@brightwavecorp.io' },
          { label: 'Account Status', value: 'INACTIVE', status: 'warning' },
          { label: 'Last Login', value: '92 days ago' },
          { label: 'Phone Match', value: 'Verified via call metadata', status: 'success' },
        ],
        postToolResponse: null,
      },
    );
    return actions;
  }

  if (/(reactivat|can you.*activ|old domain|rebrand|wrong.*email|wrong.*domain)/.test(text)) {
    actions.push(
      { id: 'nba-reactivate-account', type: 'action', icon: 'Zap', label: `Reactivate account & trigger password reset email`, priority: 'high',
        immediateReply: `Absolutely, ${firstName}. Let me reactivate your account and send you a password reset email right now.`,
        toolCall: { toolId: 'tool_reactivate_account', toolName: 'Reactivate Account & Reset Password', parameters: { userId: 'emily.davis', email: 'emily@brightwavecorp.io' } },
        mockResult: { status: 'reactivated', resetEmailSent: true, sentTo: 'emily@brightwavecorp.io', accountStatus: 'ACTIVE', promoEligible: true, promoOffer: '20% off Business Pro Plus until Mar 31' },
        resultSummary: [
          { label: 'Account Status', value: 'ACTIVE', status: 'success' },
          { label: 'Reset Email', value: 'Sent to emily@brightwavecorp.io', status: 'success' },
          { label: 'Promo Eligible', value: 'Spring upgrade — 20% off', status: 'success' },
        ],
        postToolResponse: null,
      },
      { id: 'nba-reactivate-only', type: 'action', icon: 'Zap', label: `Reactivate account only`, priority: 'medium',
        immediateReply: `Sure, ${firstName}. Let me reactivate your account now.`,
        toolCall: { toolId: 'tool_reactivate_account', toolName: 'Reactivate Account & Reset Password', parameters: { userId: 'emily.davis', email: 'emily@brightwavecorp.io' } },
        mockResult: { status: 'reactivated', resetEmailSent: false, accountStatus: 'ACTIVE' },
        resultSummary: [
          { label: 'Account Status', value: 'ACTIVE', status: 'success' },
        ],
        postToolResponse: null,
      },
    );
    return actions;
  }

  if (/(apply|increase|raise|bump).*(rate|limit|temp)|temporary.*(increase|raise|fix)/.test(text) && /(enterprise|upgrade|permanent|plan)/.test(text)) {
    actions.push(
      { id: 'nba-apply-temp-and-pitch', type: 'action', icon: 'Zap', label: `Apply Temp Rate Limit Increase & Discuss Enterprise`, priority: 'high',
        immediateReply: `Absolutely, ${firstName}. Let me apply the temporary rate limit increase right now so your sync jobs run cleanly tonight. And yes — let's talk about Enterprise for a permanent solution.`,
        toolCall: { toolId: 'tool_temp_rate_increase', toolName: 'Temporary Rate Limit Increase', parameters: { customerId: customerContext?.name || 'unknown', newLimit: 1000, durationHours: 48 } },
        mockResult: { status: 'applied', newLimit: '1,000 req/min', duration: '48 hours', expiresAt: 'Feb 28, 2026 11:00 AM EST', previousLimit: '300 req/min' },
        resultSummary: [
          { label: 'Status', value: 'Applied', status: 'success' },
          { label: 'New Limit', value: '1,000 req/min' },
          { label: 'Duration', value: '48 hours' },
          { label: 'Expires', value: 'Feb 28, 2026 11:00 AM' },
          { label: 'Previous', value: '300 req/min' },
        ],
        postToolResponse: `Done — temporary rate limit increase is now active:\n\n• New limit: 1,000 req/min (was 300)\n• Duration: 48 hours\n• Expires: Feb 28, 2026 at 11:00 AM EST\n\nYour sync jobs should complete without 429 errors tonight. Now regarding the Enterprise upgrade — it includes configurable rate limits up to 5,000 req/min, batch API endpoints, dedicated support, and 99.99% uptime SLA. Would you like me to schedule a call with our solutions engineer to walk through the upgrade? He's familiar with API-heavy integrations like yours.`,
      },
      { id: 'nba-apply-temp-and-schedule', type: 'action', icon: 'Zap', label: `Apply Temp Increase & Schedule Enterprise Consultation`, priority: 'high',
        immediateReply: `On it, ${firstName}. I'm applying the temporary increase now and scheduling an Enterprise consultation so we can get you a permanent fix.`,
        toolCall: { toolId: 'tool_temp_rate_increase', toolName: 'Temporary Rate Limit Increase', parameters: { customerId: customerContext?.name || 'unknown', newLimit: 1000, durationHours: 48 } },
        mockResult: { status: 'applied', newLimit: '1,000 req/min', duration: '48 hours', expiresAt: 'Feb 28, 2026 11:00 AM EST', previousLimit: '300 req/min' },
        resultSummary: [
          { label: 'Status', value: 'Applied', status: 'success' },
          { label: 'New Limit', value: '1,000 req/min' },
          { label: 'Duration', value: '48 hours' },
          { label: 'Expires', value: 'Feb 28, 2026 11:00 AM' },
          { label: 'Previous', value: '300 req/min' },
        ],
        postToolResponse: `Temporary rate limit increase applied — 1,000 req/min for 48 hours. Your sync jobs are good to go tonight.\n\nFor the Enterprise upgrade discussion, I'd like to set up a call with James Wilson, our solutions engineer who specializes in high-volume API integrations. He can walk through the Enterprise tier features and tailor a plan to your needs. What time works best this week?`,
      },
      { id: 'nba-apply-temp-only', type: 'action', icon: 'Zap', label: `Apply Temporary Rate Limit Increase (1,000 req/min)`, priority: 'medium',
        immediateReply: `Let me apply the temporary rate limit increase right away, ${firstName}.`,
        toolCall: { toolId: 'tool_temp_rate_increase', toolName: 'Temporary Rate Limit Increase', parameters: { customerId: customerContext?.name || 'unknown', newLimit: 1000, durationHours: 48 } },
        mockResult: { status: 'applied', newLimit: '1,000 req/min', duration: '48 hours', expiresAt: 'Feb 28, 2026 11:00 AM EST', previousLimit: '300 req/min' },
        resultSummary: [
          { label: 'Status', value: 'Applied', status: 'success' },
          { label: 'New Limit', value: '1,000 req/min' },
          { label: 'Duration', value: '48 hours' },
          { label: 'Expires', value: 'Feb 28, 2026 11:00 AM' },
          { label: 'Previous', value: '300 req/min' },
        ],
        postToolResponse: `Temporary rate limit increase applied:\n\n• New limit: 1,000 req/min (was 300)\n• Duration: 48 hours\n• Expires: Feb 28, 2026 at 11:00 AM EST\n\nYour sync jobs should run without issues tonight.`,
      },
    );
    return actions;
  }

  if (/(thursday|schedule.*call|let'?s.*schedule|works.*for us|2.*pm|cto)/.test(text) && /(scale|integration|enterprise|cto|api)/.test(text)) {
    actions.push(
      { id: 'nba-schedule-enterprise-consult', type: 'action', icon: 'Zap', label: `Schedule Enterprise Consultation for ${firstName}`, priority: 'high',
        immediateReply: `Perfect, ${firstName}! Let me get that Enterprise consultation set up right now.`,
        toolCall: { toolId: 'tool_schedule_demo', toolName: 'Schedule Demo', parameters: { customerId: customerContext?.name || 'unknown', demoType: 'enterprise-api', includeAttendees: 'CTO' } },
        mockResult: { available: true, slot: 'Thursday 2:00 PM', engineer: 'James Wilson', zoomLink: 'https://zoom.us/j/demo-789' },
        resultSummary: [
          { label: 'Status', value: 'Scheduled', status: 'success' },
          { label: 'Date & Time', value: 'Thursday at 2:00 PM' },
          { label: 'Engineer', value: 'James Wilson (API specialist)' },
          { label: 'Meeting', value: 'Zoom invite sent' },
        ],
        postToolResponse: `Enterprise consultation is confirmed:\n\n• Date: Thursday at 2:00 PM\n• Engineer: James Wilson — he specializes in high-volume API integrations\n• Zoom invite sent to your email\n• I've noted your CTO will be joining\n\nJames will review your integration architecture and walk through the Enterprise tier features (configurable rate limits up to 5,000 req/min, batch endpoints, dedicated support). In the meantime, your temporary rate limit increase is active for the next 48 hours. Is there anything else I can help with?`,
      },
      { id: 'nba-reply-confirm-schedule', type: 'reply', icon: 'MessageSquare', label: `Confirm Thursday & share what to expect`, priority: 'high',
        immediateReply: `Thursday at 2:00 PM works perfectly, ${firstName}! I'll set up the call with James Wilson, our API integration specialist. He'll walk your team through:\n\n• Enterprise rate limits (up to 5,000 req/min, configurable)\n• Batch API endpoints for high-volume sync\n• Dedicated support & 99.99% uptime SLA\n• Migration path — zero downtime\n\nI'll include your CTO on the invite. Let me get that scheduled now.`,
        toolCall: null, postToolResponse: null },
    );
    return actions;
  }

  if (/(rate.?limit|429|throttl|too many requests|sync.*(fail|error)|check.*(usage|limit)|usage.*(look|check|pattern)|temporary.*(increase|raise)|increase.*(limit|rate))/.test(text)) {
    actions.push(
      { id: 'nba-check-api-usage', type: 'action', icon: 'Zap', label: `Respond & Check ${firstName}'s API Usage & Rate Limits`, priority: 'high',
        immediateReply: `Sure, ${firstName} — let me pull up your API usage patterns and current rate limits right now.`,
        toolCall: { toolId: 'tool_check_api_usage', toolName: 'Check API Usage', parameters: { customerId: customerContext?.name || 'unknown' } },
        mockResult: { currentPlan: 'Business Pro', rateLimit: '300 req/min', peakUsage: '487 req/min', peakWindow: '2:00–4:00 AM EST', failedRequests24h: 1247, avgLatency: '142ms', recommendedLimit: '1000 req/min (Enterprise)' },
        resultSummary: [
          { label: 'Current Plan', value: 'Business Pro' },
          { label: 'Rate Limit', value: '300 req/min' },
          { label: 'Peak Usage', value: '487 req/min', status: 'warning' },
          { label: 'Peak Window', value: '2:00–4:00 AM EST' },
          { label: 'Failed (24h)', value: '1,247 requests', status: 'warning' },
          { label: 'Recommended', value: '1,000 req/min (Enterprise)', status: 'success' },
        ],
        postToolResponse: `I've analyzed your API usage, ${firstName}. Here's what I found:\n\n• Your current limit is 300 req/min (Business Pro tier)\n• Your peak usage hits 487 req/min during the 2-4 AM sync window\n• 1,247 requests failed in the last 24 hours due to rate limiting\n\nYou're exceeding your limit by ~60% during peak hours. I can either apply a temporary rate limit increase while we discuss an upgrade, or we can look at optimizing your sync jobs. What would you prefer?`,
      },
      { id: 'nba-check-account-ratelimit', type: 'action', icon: 'Zap', label: `Reply & Check ${firstName}'s Account Rate Limit`, priority: 'high',
        immediateReply: `Hi ${firstName}, thanks for flagging this. Let me check your account's current rate limit configuration right away.`,
        toolCall: { toolId: 'tool_get_account_rate_limit', toolName: 'Get Account Rate Limit', parameters: { customerId: customerContext?.name || 'unknown' } },
        mockResult: { currentPlan: 'Business Pro', rateLimit: '300 req/min', burstLimit: '350 req/min', batchEndpointEnabled: false, customLimitEligible: true },
        resultSummary: [
          { label: 'Plan', value: 'Business Pro' },
          { label: 'Rate Limit', value: '300 req/min' },
          { label: 'Burst Limit', value: '350 req/min' },
          { label: 'Batch API', value: 'Not enabled', status: 'warning' },
          { label: 'Custom Limit', value: 'Eligible', status: 'success' },
        ],
        postToolResponse: `${firstName}, I've checked your account. Here are your current rate limits:\n\n• Plan: Business Pro\n• Rate limit: 300 requests/min (burst: 350)\n• Batch API: Not yet enabled on your account\n\nIf your sync jobs are exceeding 300 req/min, that explains the 429 errors. I can enable batch endpoints for you (which handle 100 records per call) or apply a temporary rate limit increase. What would work best?`,
      },
      { id: 'nba-run-api-error-log', type: 'action', icon: 'Zap', label: `Reply & Pull ${firstName}'s Recent API Error Logs`, priority: 'medium',
        immediateReply: `Hi ${firstName}, sorry about the sync failures. Let me pull your recent API error logs to pinpoint exactly when and where the 429s are occurring.`,
        toolCall: { toolId: 'tool_get_api_error_logs', toolName: 'Get API Error Logs', parameters: { customerId: customerContext?.name || 'unknown', errorCode: '429', hours: 24 } },
        mockResult: { totalErrors: 1247, timeRange: 'Last 24 hours', peakErrorWindow: '2:15–3:45 AM EST', affectedEndpoints: ['/api/v2/contacts', '/api/v2/contacts/bulk-update'], avgRequestsAtPeak: '487 req/min', successRate: '74.3%' },
        resultSummary: [
          { label: '429 Errors (24h)', value: '1,247', status: 'warning' },
          { label: 'Peak Error Window', value: '2:15–3:45 AM EST' },
          { label: 'Affected Endpoints', value: '/contacts, /bulk-update' },
          { label: 'Peak Request Rate', value: '487 req/min', status: 'warning' },
          { label: 'Success Rate', value: '74.3%', status: 'warning' },
        ],
        postToolResponse: `${firstName}, here's what I found in your API logs over the last 24 hours:\n\n• 1,247 rate limit errors (429s)\n• Peak errors between 2:15–3:45 AM EST\n• Affected endpoints: /contacts and /bulk-update\n• Request rate at peak: 487 req/min (your limit is 300)\n• Overall success rate dropped to 74.3%\n\nYour sync jobs are hitting roughly 60% over the limit during peak hours. I'd recommend either a rate limit increase or switching to batch endpoints to reduce call volume. Want me to proceed with either?`,
      },
    );
    return actions;
  }

  if (/(not working|broken|error|issue|problem|slow|down)/.test(text)) {
    actions.push(
      { id: 'nba-ask-d1', type: 'reply', icon: 'MessageSquare', label: 'Ask for specific error details', priority: 'high',
        immediateReply: 'What specific error message are you seeing?', toolCall: null, postToolResponse: null },
      { id: 'nba-ask-d2', type: 'reply', icon: 'MessageSquare', label: 'Ask when issue started', priority: 'high',
        immediateReply: 'When did you first notice this issue?', toolCall: null, postToolResponse: null },
      { id: 'nba-run-diagnostic', type: 'action', icon: 'Zap', label: 'Run Automated System Health Check', priority: 'medium',
        immediateReply: 'Let me run a quick diagnostic on your account...',
        toolCall: { toolId: 'tool_system_health_check', toolName: 'System Health Check', parameters: { customerId: customerContext?.name || 'unknown' } },
        mockResult: { status: 'degraded', region: 'US-East', latency: '340ms', uptime: '99.2%', recentIncident: 'Load balancer misconfiguration resolved 2h ago' },
        resultSummary: [
          { label: 'Status', value: 'Degraded', status: 'warning' },
          { label: 'Region', value: 'US-East' },
          { label: 'Latency', value: '340ms (elevated)', status: 'warning' },
          { label: 'Uptime (30d)', value: '99.2%' },
          { label: 'Recent Incident', value: 'LB misconfiguration — resolved 2h ago' },
        ],
        postToolResponse: `Diagnostic complete. I found a recent issue in your region:\n\n• Region: US-East\n• Current latency: 340ms (elevated)\n• Uptime (30d): 99.2%\n• Recent incident: Load balancer misconfiguration — resolved 2 hours ago\n\nThe elevated latency should normalize within the next hour. Would you like me to set up monitoring alerts?`,
      },
    );
  }

  if (/(scale|expand|upgrade|enterprise|capacity)/.test(text)) {
    actions.push(
      { id: 'nba-ask-s1', type: 'reply', icon: 'MessageSquare', label: 'Ask about scaling timeline', priority: 'high',
        immediateReply: 'What timeline are you looking at for the scaling needs?', toolCall: null, postToolResponse: null },
      { id: 'nba-schedule-demo', type: 'action', icon: 'Zap', label: 'Schedule Enterprise Tier Demo', priority: 'high',
        immediateReply: `Great choice, ${firstName}! Let me check availability for an Enterprise demo.`,
        toolCall: { toolId: 'tool_schedule_demo', toolName: 'Schedule Demo', parameters: { customerId: customerContext?.name || 'unknown', demoType: 'enterprise' } },
        mockResult: { available: true, slot: 'Thursday 2:00 PM', engineer: 'James Wilson', zoomLink: 'https://zoom.us/j/demo-123' },
        resultSummary: [
          { label: 'Status', value: 'Scheduled', status: 'success' },
          { label: 'Date & Time', value: 'Thursday at 2:00 PM' },
          { label: 'Engineer', value: 'James Wilson' },
          { label: 'Meeting', value: 'Zoom invite sent to email' },
        ],
        postToolResponse: `Enterprise demo scheduled!\n\n• Date: Thursday at 2:00 PM\n• Engineer: James Wilson (familiar with your account)\n• Link: Zoom invite sent to your email\n• Pre-demo questionnaire included\n\nLooking forward to helping you scale!`,
      },
      { id: 'nba-compare-plans', type: 'action', icon: 'Zap', label: 'Review Current Usage & Compare Plans', priority: 'medium',
        immediateReply: null,
        toolCall: { toolId: 'tool_compare_plans', toolName: 'Compare Plans', parameters: { customerId: customerContext?.name || 'unknown' } },
        mockResult: { currentPlan: 'Business Pro', usage: '78% of capacity', recommendedPlan: 'Enterprise', savingsPercent: '15% with annual commitment' },
        resultSummary: [
          { label: 'Current Plan', value: 'Business Pro' },
          { label: 'Usage', value: '78% of capacity', status: 'warning' },
          { label: 'Recommended', value: 'Enterprise', status: 'success' },
          { label: 'Savings', value: '15% with annual commitment' },
        ],
        postToolResponse: `Plan comparison for your account:\n\n• Current: Business Pro (78% capacity used)\n• Recommended: Enterprise tier\n• Migration: Zero-downtime, seamless\n• Savings: 15% with annual commitment\n\nThe Enterprise tier gives you 10x scaling headroom and dedicated support.`,
      },
    );
  }

  if (isVIP) {
    actions.push(
      { id: 'nba-vip-1', type: 'action', icon: 'Star', label: 'Offer complimentary expedited resolution (VIP benefit)', priority: 'high',
        immediateReply: `As a VIP customer, ${firstName}, I'm prioritizing your case for expedited resolution.`,
        toolCall: { toolId: 'tool_vip_escalate', toolName: 'VIP Priority Escalation', parameters: { customerId: customerContext?.name || 'unknown' } },
        mockResult: { priorityLevel: 'P1', sla: '2 hours', assignedTeam: 'Senior Support' },
        resultSummary: [
          { label: 'Priority', value: 'P1', status: 'success' },
          { label: 'SLA', value: '2-hour resolution target' },
          { label: 'Assigned Team', value: 'Senior Support' },
        ],
        postToolResponse: `Your case has been escalated to VIP priority:\n\n• Priority: P1\n• SLA: 2-hour resolution target\n• Assigned: Senior Support Team\n\nYou'll have a dedicated agent for the remainder of this interaction.`,
      },
    );
  }

  if (/(manager|escalat|supervisor|complain)/.test(text)) {
    actions.push(
      { id: 'nba-esc-1', type: 'escalation', icon: 'ArrowUpRight', label: 'Transfer to supervisor queue', priority: 'critical',
        immediateReply: null,
        toolCall: { toolId: 'tool_transfer_supervisor', toolName: 'Transfer to Supervisor', parameters: { customerId: customerContext?.name || 'unknown', reason: 'Customer requested escalation' } },
        mockResult: { transferId: 'ESC-7821', supervisor: 'Maria Santos', estimatedWait: '< 2 min' },
        resultSummary: [
          { label: 'Status', value: 'Transfer initiated', status: 'success' },
          { label: 'Transfer ID', value: 'ESC-7821' },
          { label: 'Supervisor', value: 'Maria Santos' },
          { label: 'Est. Wait', value: 'Less than 2 minutes' },
        ],
        postToolResponse: `Transfer initiated to supervisor queue.\n\n• Transfer ID: ESC-7821\n• Supervisor: Maria Santos\n• Estimated wait: Less than 2 minutes\n\nI'm passing along the full conversation context so you won't need to repeat anything.`,
      },
      { id: 'nba-esc-2', type: 'reply', icon: 'MessageSquare', label: 'Empathize & offer to resolve before transfer', priority: 'high',
        immediateReply: "I completely understand your frustration, and I'm sorry for the experience. Before I transfer you to a supervisor, may I try one more thing to resolve this directly?",
        toolCall: null, postToolResponse: null },
    );
  }

  if (customerContext?.tags?.some(t => t.label === 'At risk')) {
    actions.push(
      { id: 'nba-risk-1', type: 'action', icon: 'AlertCircle', label: 'Flag for retention team review', priority: 'medium',
        immediateReply: null,
        toolCall: { toolId: 'tool_flag_retention', toolName: 'Flag for Retention', parameters: { customerId: customerContext?.name || 'unknown' } },
        mockResult: { flagId: 'RET-3321', team: 'Customer Success', nextReview: 'Within 24 hours' },
        resultSummary: [
          { label: 'Status', value: 'Flagged', status: 'success' },
          { label: 'Flag ID', value: 'RET-3321' },
          { label: 'Assigned Team', value: 'Customer Success' },
          { label: 'Next Review', value: 'Within 24 hours' },
        ],
        postToolResponse: `Account flagged for retention review.\n\n• Flag ID: RET-3321\n• Team: Customer Success\n• Next review: Within 24 hours\n\nThe retention team will proactively reach out with a tailored offer.`,
      },
      { id: 'nba-risk-2', type: 'action', icon: 'Zap', label: 'Offer loyalty discount or contract review', priority: 'medium',
        immediateReply: null,
        toolCall: { toolId: 'tool_loyalty_offer', toolName: 'Generate Loyalty Offer', parameters: { customerId: customerContext?.name || 'unknown' } },
        mockResult: { discount: '20% for 3 months', contractReview: 'Available', specialOffer: 'Free Enterprise trial for 30 days' },
        resultSummary: [
          { label: 'Discount', value: '20% for 3 months', status: 'success' },
          { label: 'Special Offer', value: 'Free Enterprise trial (30 days)' },
          { label: 'Contract Review', value: 'Available' },
        ],
        postToolResponse: `Loyalty offer generated for ${firstName}:\n\n• 20% discount for the next 3 months\n• Free Enterprise tier trial for 30 days\n• Complimentary contract review\n\nWould you like me to present this offer to the customer?`,
      },
    );
  }

  if (/(go ahead|i'm listening|listening|okay.*go|please.*continue|continue|ready|tell me|share|let me know|what did you find)/.test(text)) {
    actions.push(
      { id: 'nba-share-findings', type: 'reply', icon: 'MessageSquare', label: `Share billing review findings with ${firstName}`, priority: 'high',
        immediateReply: `${firstName}, I've reviewed your February billing and found two identical charges of $2,400 on Feb 15 (TXN-90281, TXN-90282). This was caused by a backend processing error. Let me process the refund for the duplicate charge right now.`,
        toolCall: null, postToolResponse: null },
      { id: 'nba-confirm-and-refund', type: 'action', icon: 'Zap', label: 'Confirm Duplicate & Process Refund', priority: 'high',
        immediateReply: `${firstName}, I see the duplicate charge. I've already initiated the refund - it should appear in 3-5 business days.`,
        toolCall: { toolId: 'tool_revert_transaction', toolName: 'Process Refund', parameters: { customerId: customerContext?.name || 'unknown', transactionId: 'TXN-90282' } },
        mockResult: { refundId: 'REF-ABC123', status: 'processed', estimatedDays: 3 },
        resultSummary: [
          { label: 'Status', value: 'Refund processed', status: 'success' },
          { label: 'Reference ID', value: 'REF-ABC123' },
          { label: 'Amount', value: '$2,400.00' },
          { label: 'Estimated Credit', value: '3-5 business days' },
        ],
        postToolResponse: `Refund processed successfully.\n\n• Reference ID: REF-ABC123\n• Amount: $2,400.00\n• Estimated credit: 3-5 business days\n• Confirmation email sent to your address on file\n\nIs there anything else I can help with, ${firstName}?`,
      },
      { id: 'nba-billing-summary', type: 'reply', icon: 'MessageSquare', label: `Provide detailed billing summary`, priority: 'medium',
        immediateReply: `${firstName}, here's a summary of what I found:\n\n• Two identical charges of $2,400 on Feb 15\n• Transaction IDs: TXN-90281 (original) and TXN-90282 (duplicate)\n• Root cause: Backend processing error during payment\n\nI can initiate the refund for the duplicate charge right now. Would you like me to proceed?`,
        toolCall: null, postToolResponse: null },
    );
  }

  if (actions.length === 0) {
    actions.push(
      { id: 'nba-gen-1', type: 'reply', icon: 'MessageSquare', label: 'Ask for more details', priority: 'medium',
        immediateReply: 'Could you provide more details so I can assist you better?', toolCall: null, postToolResponse: null },
      { id: 'nba-review-account', type: 'action', icon: 'Zap', label: 'Review Account History & Identify Context', priority: 'low',
        immediateReply: null,
        toolCall: { toolId: 'tool_review_account', toolName: 'Review Account', parameters: { customerId: customerContext?.name || 'unknown' } },
        mockResult: { recentActivity: '6 tickets in 90 days', lastContact: '2 days ago', openIssues: 1, sentiment: 'Neutral' },
        resultSummary: [
          { label: 'Recent Activity', value: '6 tickets in 90 days' },
          { label: 'Last Contact', value: '2 days ago' },
          { label: 'Open Issues', value: '1', status: 'warning' },
          { label: 'Sentiment', value: 'Neutral' },
        ],
        postToolResponse: `Account review for ${firstName}:\n\n• Recent activity: 6 tickets in last 90 days\n• Last contact: 2 days ago\n• Open issues: 1\n• Overall sentiment: Neutral`,
      },
    );
  }

  return actions;
}

function getPostActionNBAs(completedActions, customerContext) {
  const firstName = customerContext?.name?.split(' ')[0] || 'there';
  const actions = [];

  for (const completed of completedActions) {
    const { toolName, result, resultSummary } = completed;

    if (toolName === 'Check Double Charges' && result?.found) {
      actions.push(
        { id: 'nba-confirm-and-refund', type: 'action', icon: 'Zap',
          label: `Respond confirming duplicate charges found & execute refund`,
          priority: 'high',
          immediateReply: `${firstName}, I've reviewed your February billing and found two identical charges of $2,400 on Feb 15 (${result.transactionIds?.join(', ')}). This was caused by a backend processing error. Let me process the refund for the duplicate charge right now.`,
          toolCall: { toolId: 'tool_revert_transaction', toolName: 'Revert Transaction', parameters: { customerId: customerContext?.name || 'unknown', transactionId: result.transactionIds?.[1] || 'TXN-90282' } },
          mockResult: { refundId: 'REF-ABC123', status: 'processed', estimatedDays: 3 },
          resultSummary: [
            { label: 'Status', value: 'Refund processed', status: 'success' },
            { label: 'Reference ID', value: 'REF-ABC123' },
            { label: 'Amount', value: '$2,400.00' },
            { label: 'Estimated Credit', value: '3-4 business days' },
          ],
          postToolResponse: `Great news — the refund has been processed.\n\n• Reference ID: REF-ABC123\n• Amount: $2,400.00\n• Estimated credit: 3-4 business days\n\nYou'll receive a confirmation email shortly. Is there anything else I can help with?`,
        },
        { id: 'nba-reply-duplicate-found', type: 'reply', icon: 'MessageSquare',
          label: `Inform ${firstName} about the duplicate charges found`,
          priority: 'high',
          immediateReply: `${firstName}, I've completed the review of your February billing. I can confirm there are two identical charges of $2,400 on Feb 15 (${result.transactionIds?.join(' and ')}). This appears to be a duplicate from a backend processing error. Would you like me to initiate the refund right away?`,
          toolCall: null, postToolResponse: null,
        },
      );
    }

    if (toolName === 'Get Account Details') {
      actions.push(
        { id: 'nba-post-account-reply', type: 'reply', icon: 'MessageSquare',
          label: `Acknowledge and ask how to help (account context loaded)`,
          priority: 'high',
          immediateReply: `Thanks for waiting, ${firstName}. I've pulled up your account — I can see you're on the ${result?.plan || 'Business'} plan. How can I help you today?`,
          toolCall: null, postToolResponse: null,
        },
      );
    }

    if (toolName === 'Revert Transaction' && result?.refundId) {
      actions.push(
        { id: 'nba-confirm-refund-done', type: 'reply', icon: 'MessageSquare',
          label: `Confirm refund completion to ${firstName}`,
          priority: 'high',
          immediateReply: `${firstName}, the refund has been processed successfully. Your reference ID is ${result.refundId}. The amount of $2,400 will be credited back to your original payment method within ${result.estimatedDays || 3}-${(result.estimatedDays || 3) + 1} business days. You'll receive a confirmation email shortly. Is there anything else I can help with?`,
          toolCall: null, postToolResponse: null,
        },
      );
    }

    if (toolName === 'Get Account Rate Limit') {
      actions.push(
        { id: 'nba-post-ratelimit-share', type: 'reply', icon: 'MessageSquare',
          label: `Share rate limit details & offer solutions`,
          priority: 'high',
          immediateReply: `${firstName}, your account is on the ${result?.currentPlan || 'Business Pro'} plan with a rate limit of ${result?.rateLimit || '300 req/min'}. Since your sync jobs are exceeding this, here are two options:\n\n1. I can apply a temporary rate limit increase (48h) so tonight's sync runs cleanly\n2. I can enable batch API endpoints on your account — this would let you push 100 records per request instead of one at a time\n\nWhich would you prefer, or should I do both?`,
          toolCall: null, postToolResponse: null,
        },
        { id: 'nba-post-ratelimit-temp-increase', type: 'action', icon: 'Zap',
          label: `Apply temporary rate limit increase for ${firstName}`,
          priority: 'high',
          immediateReply: `Based on your current limit of ${result?.rateLimit || '300 req/min'}, I'm applying a temporary increase to 1,000 req/min for 48 hours so your sync jobs run without issues tonight.`,
          toolCall: { toolId: 'tool_temp_rate_increase', toolName: 'Temporary Rate Limit Increase', parameters: { customerId: customerContext?.name || 'unknown', newLimit: 1000, durationHours: 48 } },
          mockResult: { status: 'applied', newLimit: '1,000 req/min', duration: '48 hours', expiresAt: 'Feb 28, 2026 11:00 AM EST', previousLimit: '300 req/min' },
          resultSummary: [
            { label: 'Status', value: 'Applied', status: 'success' },
            { label: 'New Limit', value: '1,000 req/min' },
            { label: 'Duration', value: '48 hours' },
            { label: 'Expires', value: 'Feb 28, 2026 11:00 AM' },
          ],
          postToolResponse: `Done! Temporary rate limit increase applied:\n\n• New limit: 1,000 req/min (was ${result?.rateLimit || '300 req/min'})\n• Duration: 48 hours\n• Expires: Feb 28, 2026 at 11:00 AM EST\n\nYour sync jobs should run without 429 errors tonight. For a permanent solution, I'd recommend upgrading to Enterprise which supports configurable limits up to 5,000 req/min. Want me to schedule a call with our solutions team?`,
        },
      );
    }

    if (toolName === 'Get API Error Logs') {
      actions.push(
        { id: 'nba-post-errorlog-share', type: 'reply', icon: 'MessageSquare',
          label: `Share error log findings & recommend next steps`,
          priority: 'high',
          immediateReply: `${firstName}, I found ${result?.totalErrors?.toLocaleString() || '1,247'} rate limit errors in the last 24 hours, mostly between ${result?.peakErrorWindow || '2:15–3:45 AM EST'}. Your peak request rate hit ${result?.avgRequestsAtPeak || '487 req/min'} — well over your plan's limit. I'd recommend a temporary rate limit increase for tonight and then we can discuss a permanent upgrade. Shall I apply the increase now?`,
          toolCall: null, postToolResponse: null,
        },
        { id: 'nba-post-errorlog-temp-increase', type: 'action', icon: 'Zap',
          label: `Apply temporary rate limit increase for ${firstName}`,
          priority: 'high',
          immediateReply: `Given the ${result?.totalErrors?.toLocaleString() || '1,247'} failed requests, I'm applying a temporary increase to 1,000 req/min for 48 hours to stabilize your sync jobs immediately.`,
          toolCall: { toolId: 'tool_temp_rate_increase', toolName: 'Temporary Rate Limit Increase', parameters: { customerId: customerContext?.name || 'unknown', newLimit: 1000, durationHours: 48 } },
          mockResult: { status: 'applied', newLimit: '1,000 req/min', duration: '48 hours', expiresAt: 'Feb 28, 2026 11:00 AM EST', previousLimit: '300 req/min' },
          resultSummary: [
            { label: 'Status', value: 'Applied', status: 'success' },
            { label: 'New Limit', value: '1,000 req/min' },
            { label: 'Duration', value: '48 hours' },
            { label: 'Expires', value: 'Feb 28, 2026 11:00 AM' },
          ],
          postToolResponse: `Temporary rate limit increase applied:\n\n• New limit: 1,000 req/min (was 300)\n• Duration: 48 hours\n• Expires: Feb 28, 2026 at 11:00 AM EST\n\nThis should eliminate the 429 errors for your sync window tonight. For a permanent fix, the Enterprise tier supports up to 5,000 req/min with configurable limits. Want me to schedule a walkthrough?`,
        },
      );
    }

    if (toolName === 'Check API Usage') {
      actions.push(
        { id: 'nba-post-api-share-and-fix', type: 'reply', icon: 'MessageSquare',
          label: `Share API usage findings with ${firstName} & apply temporary rate limit increase`,
          priority: 'high',
          immediateReply: `${firstName}, I've analyzed your API usage. Here's what I found:\n\n• Current limit: ${result?.rateLimit || '300 req/min'}\n• Peak usage: ${result?.peakUsage || '487 req/min'} during your ${result?.peakWindow || '2-4 AM'} sync window\n• Failed requests (24h): ${result?.failedRequests24h?.toLocaleString() || '1,247'}\n\nYou're exceeding your limit by ~60% during peak hours — that's why your sync jobs are failing with 429 errors. I can apply a temporary rate limit increase to 1,000 req/min right now so tonight's sync runs cleanly. Shall I go ahead?`,
          toolCall: null, postToolResponse: null,
        },
        { id: 'nba-post-api-share', type: 'reply', icon: 'MessageSquare',
          label: `Share API usage findings with ${firstName}`,
          priority: 'medium',
          immediateReply: `${firstName}, I've pulled your API usage data. Your current limit is ${result?.rateLimit || '300 req/min'} but you're hitting ${result?.peakUsage || '487 req/min'} during your ${result?.peakWindow || '2-4 AM'} sync window. ${result?.failedRequests24h ? `About ${result.failedRequests24h.toLocaleString()} requests failed in the last 24 hours.` : ''} Would you like me to look into options to resolve this?`,
          toolCall: null, postToolResponse: null,
        },
      );
    }

    if (toolName === 'Temporary Rate Limit Increase' && result?.status === 'applied') {
      actions.push(
        { id: 'nba-post-temp-increase-confirm', type: 'reply', icon: 'MessageSquare',
          label: `Confirm rate limit increase & suggest Enterprise upgrade`,
          priority: 'high',
          immediateReply: `Great news, ${firstName}! The temporary increase is now active — your new limit is ${result.newLimit} for the next ${result.duration}. Your sync jobs should run cleanly tonight.\n\nFor the Enterprise walkthrough, our API integration specialist James Wilson is available Thursday at 2:00 PM or 3:30 PM. The Enterprise tier includes configurable limits up to 5,000 req/min, batch endpoints, and dedicated support — perfect for your scaling needs. Which time works best for your team?`,
          toolCall: null, postToolResponse: null,
        },
        { id: 'nba-post-temp-schedule-demo', type: 'action', icon: 'Zap',
          label: `Schedule Enterprise upgrade consultation`,
          priority: 'medium',
          immediateReply: `Let me set up a call with our solutions team to discuss the Enterprise upgrade — they can tailor the plan to your integration needs.`,
          toolCall: { toolId: 'tool_schedule_demo', toolName: 'Schedule Demo', parameters: { customerId: customerContext?.name || 'unknown', demoType: 'enterprise-api' } },
          mockResult: { available: true, slot: 'Thursday 2:00 PM', engineer: 'James Wilson', zoomLink: 'https://zoom.us/j/demo-456' },
          resultSummary: [
            { label: 'Status', value: 'Scheduled', status: 'success' },
            { label: 'Date & Time', value: 'Thursday at 2:00 PM' },
            { label: 'Engineer', value: 'James Wilson' },
            { label: 'Meeting', value: 'Zoom invite sent' },
          ],
          postToolResponse: `Enterprise consultation scheduled:\n\n• Date: Thursday at 2:00 PM\n• Engineer: James Wilson (API integration specialist)\n• Zoom link sent to your email\n\nJames will review your specific integration architecture and recommend the optimal plan configuration. In the meantime, your temporary rate limit increase is active.`,
        },
      );
    }

    if (toolName === 'Schedule Demo' && result?.available) {
      actions.push(
        { id: 'nba-post-demo-confirm', type: 'reply', icon: 'MessageSquare',
          label: `All set, ${firstName}! Enterprise consultation confirmed`,
          priority: 'high',
          immediateReply: `All set, ${firstName}! The Enterprise consultation is confirmed:\n\n• Date: ${result.slot || 'Thursday at 2:00 PM'}\n• Engineer: ${result.engineer || 'James Wilson'} — he specializes in high-volume API integrations\n• Zoom invite has been sent to your email\n\nIn the meantime, your temporary rate limit increase is active so tonight's sync should run smoothly. Is there anything else I can help with?`,
          toolCall: null, postToolResponse: null,
        },
      );
    }

    if (toolName === 'Diagnose User Account') {
      actions.push(
        { id: 'nba-post-diagnose-share', type: 'reply', icon: 'MessageSquare',
          label: `Share findings — wrong email & inactive account`,
          priority: 'high',
          immediateReply: `${firstName}, I found two issues with your account:\n\n1. The email you entered doesn't match our records — your registered email is ${result?.registeredEmail || 'emily@brightwavecorp.io'}\n2. Your account is currently INACTIVE because there hasn't been a login in over 90 days\n\nThe good news is I've verified your identity through the phone number you're calling from. Would you like me to reactivate your account and send a password reset email to ${result?.registeredEmail || 'emily@brightwavecorp.io'}?`,
          toolCall: null, postToolResponse: null,
        },
        { id: 'nba-reactivate-account', type: 'action', icon: 'Zap',
          label: `Reactivate account & send password reset email`,
          priority: 'high',
          immediateReply: `Absolutely, ${firstName}. Let me reactivate your account and send a password reset email right now.`,
          toolCall: { toolId: 'tool_reactivate_account', toolName: 'Reactivate Account & Reset Password', parameters: { userId: 'emily.davis', email: result?.registeredEmail || 'emily@brightwavecorp.io' } },
          mockResult: { status: 'reactivated', resetEmailSent: true, sentTo: result?.registeredEmail || 'emily@brightwavecorp.io', accountStatus: 'ACTIVE', promoEligible: true, promoOffer: '20% off Business Pro Plus until Mar 31' },
          resultSummary: [
            { label: 'Account Status', value: 'ACTIVE', status: 'success' },
            { label: 'Reset Email', value: `Sent to ${result?.registeredEmail || 'emily@brightwavecorp.io'}`, status: 'success' },
            { label: 'Promo Eligible', value: 'Spring upgrade — 20% off', status: 'success' },
          ],
          postToolResponse: null,
        },
      );
    }

    if (toolName === 'Reactivate Account & Reset Password' && result?.status === 'reactivated') {
      actions.push(
        { id: 'nba-post-reactivate-confirm', type: 'reply', icon: 'MessageSquare',
          label: `Confirm reactivation & share promo offer`,
          priority: 'high',
          immediateReply: `Great news, ${firstName}! Your account has been reactivated and the password reset email has been sent to ${result?.sentTo || 'emily@brightwavecorp.io'}. You should see it in your inbox within a minute.\n\nAlso, I wanted to mention — your account qualifies for our Spring promotion: 20% off Business Pro Plus until March 31. It includes priority support and advanced security features. Would you like me to email you the details?`,
          toolCall: null, postToolResponse: null,
        },
        { id: 'nba-post-reactivate-close', type: 'reply', icon: 'MessageSquare',
          label: `Confirm and offer Forgot Password as backup`,
          priority: 'medium',
          immediateReply: `All set, ${firstName}! Account is active and the reset email is on its way to ${result?.sentTo || 'emily@brightwavecorp.io'}. If you don't see it in a couple of minutes, check your spam folder or use the "Forgot Password" link on the login page — it will work now. Anything else I can help with?`,
          toolCall: null, postToolResponse: null,
        },
      );
    }

    if (toolName === 'System Health Check') {
      actions.push(
        { id: 'nba-post-diagnostic-reply', type: 'reply', icon: 'MessageSquare',
          label: `Share diagnostic findings with ${firstName}`,
          priority: 'high',
          immediateReply: `${firstName}, I've run a diagnostic on your account. ${result?.status === 'degraded' ? `I found elevated latency (${result.latency}) in the ${result.region} region due to a recent incident that has since been resolved. Things should normalize within the next hour.` : 'Everything looks healthy — all systems are operating normally.'} Would you like me to set up proactive monitoring alerts?`,
          toolCall: null, postToolResponse: null,
        },
      );
    }
  }

  if (actions.length === 0) {
    actions.push(
      { id: 'nba-post-action-gen', type: 'reply', icon: 'MessageSquare',
        label: `Follow up with ${firstName} on the completed action`,
        priority: 'medium',
        immediateReply: `Thanks for your patience, ${firstName}. I've completed the review. Let me share what I found.`,
        toolCall: null, postToolResponse: null,
      },
    );
  }

  return actions;
}

function pickAutopilotAction(classification, kbResponse, nbaActions) {
  const topNba = nbaActions?.[0] || null;
  if (!kbResponse && !topNba) return null;

  if (classification.mode === 'kb_response' && kbResponse) {
    return { type: 'kb', action: kbResponse, reason: 'KB match with high confidence' };
  }
  if (classification.mode === 'nba' && topNba) {
    const isAction = topNba.type === 'action' || topNba.type === 'escalation';
    return { type: isAction ? 'nba_action' : 'nba_reply', action: topNba, reason: `Top NBA: ${topNba.label}` };
  }
  if (classification.mode === 'both') {
    if (kbResponse && (classification.confidence || 0) >= 80) {
      return { type: 'kb', action: kbResponse, reason: `KB match — confidence ${classification.confidence}%` };
    }
    if (topNba) {
      const isAction = topNba.type === 'action' || topNba.type === 'escalation';
      return { type: isAction ? 'nba_action' : 'nba_reply', action: topNba, reason: `Top NBA preferred over KB (confidence ${classification.confidence || '?'}%)` };
    }
    if (kbResponse) return { type: 'kb', action: kbResponse, reason: 'KB fallback' };
  }
  if (topNba) {
    const isAction = topNba.type === 'action' || topNba.type === 'escalation';
    return { type: isAction ? 'nba_action' : 'nba_reply', action: topNba, reason: 'NBA fallback' };
  }
  if (kbResponse) return { type: 'kb', action: kbResponse, reason: 'KB fallback' };
  return null;
}

function generateNextIQAnswer(queryText, customerCtx, liveMessages) {
  const q = queryText.toLowerCase();
  const name = customerCtx.name;
  if (/(billing|payment|invoice|charge).*(history|past|previous)/.test(q) || /(history|past|previous).*(billing|payment|invoice|charge)/.test(q)) {
    return `${name}'s Billing History:\n• 3 billing tickets in last 12 months\n• Last resolved: Dec 2024 (refund of $1,200)\n• Current invoice: $2,450/mo (Enterprise plan)\n• Payment method: Corporate Card ending 4821\n• No outstanding balance prior to this incident`;
  }
  if (/(account|customer).*(detail|info|summary|profile)/.test(q) || /(detail|info|summary|profile).*(account|customer)/.test(q) || /who is|tell me about/.test(q)) {
    return `${name} — Account Summary:\n• Company: TechCorp Inc.\n• Plan: ${customerCtx.accountType}\n• Customer since: ${customerCtx.customerSince}\n• CLV Score: ${customerCtx.clvScore}\n• Sentiment: ${customerCtx.sentiment.toFixed(1)}/5\n• Churn Risk: ${customerCtx.churnRisk} (${customerCtx.churnPercent})\n• Recent Tickets: ${customerCtx.recentTickets} (${customerCtx.resolvedPositively} resolved positively)`;
  }
  if (/(churn|risk|retain|retention|lose|losing)/.test(q)) {
    return `${name}'s churn risk is ${customerCtx.churnRisk} (${customerCtx.churnPercent}). Key factors:\n• Duplicate billing issue (current) — negative impact\n• Sentiment trending: ${customerCtx.sentiment.toFixed(1)}/5\n• CLV Score: ${customerCtx.clvScore}\n\nRecommendation: Resolve current issue swiftly, offer proactive billing alerts, and consider scheduling an account health check to reinforce value.`;
  }
  if (/(escalat|manager|supervisor|transfer)/.test(q)) {
    return `Based on current conversation analysis:\n• Sentiment: Not yet escalation-critical\n• Customer tone: Direct but professional\n• Recommendation: Continue resolving directly — ${name} was given this direct contact by their account manager, indicating trust in the current channel.\n• If escalation needed: Priority queue available (avg wait: 45s)`;
  }
  if (/(refund|duplicate|charge.*twice|double.*charge)/.test(q)) {
    return `Refund Status for ${name}:\n• Duplicate charge detected: $2,450.00 on Feb 1\n• Transaction IDs: TXN-44281 (original) and TXN-44283 (duplicate)\n• Refund policy: Auto-eligible for system-detected duplicates\n• Processing time: 3-5 business days\n• Refund reference once initiated: REF-2024-88432`;
  }
  if (/(empathy|tone|how.*respond|what.*say|rephrase|draft)/.test(q)) {
    const lastCustomerMsg = [...liveMessages].reverse().find(m => m.from === 'customer');
    return `Based on ${name}'s tone and context, here's a recommended approach:\n• Lead with acknowledgment: "I completely understand your concern..."\n• Be specific: Reference exact amounts and dates\n• Provide clear next steps with timelines\n• Close with proactive offer\n\nThe customer's current sentiment is ${customerCtx.sentiment.toFixed(1)}/5 — a swift, empathetic resolution will likely improve it.`;
  }
  if (/(enterprise|upgrade|plan|pricing|feature)/.test(q)) {
    return `Enterprise Plan Details for ${name}'s evaluation:\n• Price: Custom pricing (typically 20-30% above current plan)\n• Key features: Auto-scaling to 10x, dedicated support, 99.99% SLA\n• Migration: Zero-downtime, typically 2-3 hours\n• ${name} qualifies for preferred rate as existing customer\n• Next step: Schedule demo with solutions engineer`;
  }
  if (/(summar|recap|what happened|context|catch me up)/.test(q)) {
    const customerMsgs = liveMessages.filter(m => m.from === 'customer');
    const agentMsgs = liveMessages.filter(m => m.from === 'agent');
    return `Conversation Summary:\n• ${customerMsgs.length} customer message${customerMsgs.length !== 1 ? 's' : ''}, ${agentMsgs.length} agent response${agentMsgs.length !== 1 ? 's' : ''}\n• Topic: Billing — duplicate charge on February invoice\n• Customer: ${name} (${customerCtx.accountType}, VIP)\n• Status: In progress\n• Key issue: Charged twice ($2,450 each) for February\n• Sentiment: ${customerCtx.sentiment.toFixed(1)}/5`;
  }
  return `Here's what I found based on "${queryText}":\n\n${name} is a ${customerCtx.accountType} customer since ${customerCtx.customerSince} with CLV score of ${customerCtx.clvScore}. Current conversation is about a billing issue. Churn risk: ${customerCtx.churnRisk}.\n\nCan you be more specific? Try asking about billing history, account details, churn risk, escalation, or refund status.`;
}

function getCustomerContext(conversation) {
  const conv = conversation || inboxConversations[0];
  const contexts = {
    'Brad Pitt': {
      name: 'Brad Pitt', accountType: 'Enterprise', customerSince: '3 years',
      clvScore: 'High ($48,200)', churnRisk: 'At Risk', churnPercent: '28%',
      recentTickets: 6, resolvedPositively: 5, sentiment: 2.8,
      tags: conv?.tags || [],
    },
    'Michael Torres': {
      name: 'Michael Torres', accountType: 'Business Pro', customerSince: '1 year',
      clvScore: 'Medium ($12,400)', churnRisk: 'Low', churnPercent: '8%',
      recentTickets: 2, resolvedPositively: 2, sentiment: 4.2,
      tags: [],
    },
    'Emily Davis': {
      name: 'Emily Davis', accountType: 'Business Pro', customerSince: '1 year',
      clvScore: 'Medium ($14,400)', churnRisk: 'Low', churnPercent: '8%',
      recentTickets: 1, resolvedPositively: 1, sentiment: 4.0,
      tags: [],
      phone: '+1 (512) 555-0198',
      email: 'emily@brightwavecorp.io',
      company: 'Brightwave Corp',
    },
    'David Kim': {
      name: 'David Kim', accountType: 'Business Pro', customerSince: '8 months',
      clvScore: 'Medium ($18,600)', churnRisk: 'Medium', churnPercent: '15%',
      recentTickets: 4, resolvedPositively: 3, sentiment: 3.1,
      tags: [{ label: 'Technical', color: theme.colors.blue, bg: theme.colors.blueMuted }],
    },
    'Rachel Martinez': {
      name: 'Rachel Martinez', accountType: 'Prospect', customerSince: 'New',
      clvScore: 'Projected ($24,000)', churnRisk: 'N/A', churnPercent: 'N/A',
      recentTickets: 0, resolvedPositively: 0, sentiment: 4.5,
      tags: [{ label: 'New Lead', color: theme.colors.success, bg: theme.colors.successMuted }],
    },
    'Tom Bradley': {
      name: 'Tom Bradley', accountType: 'Enterprise', customerSince: '5 years',
      clvScore: 'Very High ($156,000)', churnRisk: 'At Risk', churnPercent: '35%',
      recentTickets: 8, resolvedPositively: 5, sentiment: 1.8,
      tags: conv?.tags || [],
    },
    'Amanda Foster': {
      name: 'Amanda Foster', accountType: 'Business Pro', customerSince: '2 years',
      clvScore: 'High ($36,000)', churnRisk: 'Low', churnPercent: '6%',
      recentTickets: 1, resolvedPositively: 1, sentiment: 4.0,
      tags: [{ label: 'Expanding', color: theme.colors.success, bg: theme.colors.successMuted }],
    },
  };
  return contexts[conv?.name] || {
    name: conv?.name || 'Unknown', accountType: 'Standard', customerSince: 'N/A',
    clvScore: 'N/A', churnRisk: 'N/A', churnPercent: 'N/A',
    recentTickets: 0, resolvedPositively: 0, sentiment: 3.0,
    tags: conv?.tags || [],
  };
}

const teams = [
  { id: 'sales', name: 'Sales Team', letter: 'S', color: theme.colors.success, badge: 4, members: '3 members' },
  { id: 'support', name: 'Customer ...', letter: 'C', color: theme.colors.blue, badge: 6, members: '5 members' },
  { id: 'vip', name: 'VIP Accounts', letter: 'V', color: theme.colors.purple, badge: 3, members: '2 members' },
];

/* ═══ SUB-COMPONENTS ═══ */

function InboxSidebar({ activeInbox, setActiveInbox }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [hovered, setHovered] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const collapsedWidth = 48;
  const expandedWidth = 180;

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: expanded ? `${expandedWidth}px` : `${collapsedWidth}px`,
        minWidth: expanded ? `${expandedWidth}px` : `${collapsedWidth}px`,
        flexShrink: 0,
        borderRight: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
        display: 'flex', flexDirection: 'column',
        padding: '12px 0',
        overflow: 'hidden',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative', zIndex: 5,
      }}
    >
      {/* Expand indicator */}
      {!expanded && (
        <div style={{
          position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)',
          width: '3px', height: '24px', borderRadius: '3px 0 0 3px',
          backgroundColor: theme.colors.blue + '30',
        }} />
      )}

      {[
        { id: 'my-inbox', label: 'My Inbox', icon: Inbox, badge: 3 },
        { id: 'all-activity', label: 'All Activity', icon: Activity },
      ].map((item) => {
        const isActive = activeInbox === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveInbox(item.id)}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            title={!expanded ? item.label : undefined}
            style={{
              width: '100%',
              padding: expanded ? '8px 12px' : '8px 0',
              border: 'none',
              backgroundColor: isActive ? colors.sidebarActive
                : hovered === item.id ? colors.sidebarHover : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              gap: '8px',
              justifyContent: expanded ? 'flex-start' : 'center',
              fontFamily: theme.fonts.body, fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? theme.colors.blue : colors.text,
              transition: 'background-color 0.15s ease, padding 0.2s ease',
              textAlign: 'left',
              borderLeft: isActive ? `3px solid ${theme.colors.blue}` : '3px solid transparent',
              position: 'relative',
            }}
          >
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <item.icon size={18} color={isActive ? theme.colors.blue : colors.textSecondary} />
              {item.badge && !expanded && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-8px',
                  minWidth: '16px', height: '16px', padding: '0 4px',
                  backgroundColor: theme.colors.blue, borderRadius: theme.radii.full,
                  fontSize: '9px', fontWeight: 700, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${colors.surface}`,
                }}>{item.badge}</span>
              )}
            </div>
            {expanded && (
              <>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    minWidth: '20px', height: '20px', padding: '0 6px',
                    backgroundColor: theme.colors.blue, borderRadius: theme.radii.full,
                    fontSize: '11px', fontWeight: 700, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{item.badge}</span>
                )}
              </>
            )}
          </button>
        );
      })}

      <div style={{ height: '1px', backgroundColor: colors.border, margin: '10px 0' }} />

      {expanded && (
        <div style={{ padding: '0 12px', marginBottom: '6px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, color: colors.textTertiary,
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>Teams</span>
        </div>
      )}

      {teams.map((team) => (
        <button
          key={team.id}
          onMouseEnter={() => setHovered(team.id)}
          onMouseLeave={() => setHovered(null)}
          title={!expanded ? team.name : undefined}
          style={{
            width: '100%',
            padding: expanded ? '6px 12px' : '6px 0',
            border: 'none',
            backgroundColor: hovered === team.id ? colors.sidebarHover : 'transparent',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            gap: '8px',
            justifyContent: expanded ? 'flex-start' : 'center',
            fontFamily: theme.fonts.body,
            transition: 'background-color 0.15s ease, padding 0.2s ease',
            textAlign: 'left',
          }}
        >
          <div style={{
            width: '26px', height: '26px', borderRadius: theme.radii.md,
            backgroundColor: team.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>{team.letter}</div>
          {expanded && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{team.name}</div>
              </div>
              <span style={{
                minWidth: '18px', height: '18px', padding: '0 5px',
                backgroundColor: colors.surfaceHover, borderRadius: theme.radii.full,
                fontSize: '10px', fontWeight: 600, color: colors.textSecondary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{team.badge}</span>
            </>
          )}
        </button>
      ))}

      {expanded && (
        <button
          onMouseEnter={() => setHovered('create')}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: '100%', padding: '6px 12px', border: 'none',
            backgroundColor: hovered === 'create' ? colors.sidebarHover : 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: theme.fonts.body, fontSize: '12px', fontWeight: 500,
            color: theme.colors.blue, transition: theme.transitions.fast, textAlign: 'left',
            marginTop: '4px',
          }}
        >
          <Plus size={14} /> Create team
        </button>
      )}
    </div>
  );
}

function ConversationList({ selected, setSelected, activeLayout, setActiveLayout }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [hovered, setHovered] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showViewMenu, setShowViewMenu] = useState(false);
  const viewMenuRef = useRef(null);

  const layouts = ['Classic', 'Simple', 'Focus', 'Journal'];

  useEffect(() => {
    const handler = (e) => {
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target)) setShowViewMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filters = [
    { id: 'all', label: 'All', count: 7, color: theme.colors.blue, filled: true },
    { id: 'high-risk', label: 'High Risk', count: 2, dotColor: theme.colors.error },
    { id: 'vip', label: 'VIP', count: 3, dotColor: theme.colors.warning },
    { id: 'new', label: 'New', count: 2, dotColor: theme.colors.success },
    { id: 'urgent', label: 'Urgent' },
    { id: 'more', label: 'More', hasChevron: true },
  ];

  const currentLabel = layouts.find((l) => l.toLowerCase() === activeLayout) || 'Classic';

  return (
    <div style={{
      width: '260px', minWidth: '260px', flexShrink: 0,
      borderRight: `1px solid ${colors.border}`,
      backgroundColor: colors.background, display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <h2 style={{
            fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700,
            color: colors.text, margin: 0,
          }}>My Inbox</h2>

          {/* View switcher */}
          <div style={{ position: 'relative' }} ref={viewMenuRef}>
            <button
              onClick={() => setShowViewMenu(!showViewMenu)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: theme.radii.full,
                border: `1px solid ${showViewMenu ? theme.colors.blue + '40' : colors.border}`,
                backgroundColor: showViewMenu ? theme.colors.blueMuted : 'transparent',
                fontSize: '11px', fontWeight: 600, fontFamily: theme.fonts.body,
                color: showViewMenu ? theme.colors.blue : colors.textSecondary,
                cursor: 'pointer', transition: theme.transitions.fast,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!showViewMenu) {
                  e.currentTarget.style.borderColor = theme.colors.gray300;
                  e.currentTarget.style.backgroundColor = colors.surfaceHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!showViewMenu) {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {currentLabel}
              <ChevronDown size={10} style={{
                transform: showViewMenu ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s ease',
              }} />
            </button>
            {showViewMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                width: '140px', backgroundColor: theme.colors.white,
                borderRadius: theme.radii.lg,
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                zIndex: 1000, overflow: 'hidden', padding: '4px',
                animation: 'fadeIn 0.12s ease',
              }}>
                {layouts.map((l) => {
                  const isActive = activeLayout === l.toLowerCase();
                  return (
                    <button
                      key={l}
                      onClick={() => { setActiveLayout(l.toLowerCase()); setShowViewMenu(false); }}
                      style={{
                        width: '100%', padding: '8px 12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        border: 'none', borderRadius: theme.radii.md,
                        backgroundColor: isActive ? theme.colors.blueMuted : 'transparent',
                        cursor: 'pointer', transition: theme.transitions.fast,
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = theme.colors.gray50;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={{
                        fontSize: '13px', fontWeight: isActive ? 600 : 500,
                        color: isActive ? theme.colors.blue : theme.colors.navy,
                        fontFamily: theme.fonts.body,
                      }}>{l}</span>
                      {isActive && <Check size={14} color={theme.colors.blue} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Select checkbox */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '4px 8px', borderRadius: theme.radii.full,
            border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
            fontSize: '11px', fontWeight: 500, color: colors.textSecondary,
            fontFamily: theme.fonts.body, cursor: 'pointer',
          }}>
            <Square size={12} /> Select
          </button>

          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '4px 8px', borderRadius: theme.radii.full,
                  border: f.filled && isActive
                    ? `1px solid ${theme.colors.blue}`
                    : `1px solid ${isActive ? theme.colors.blue + '40' : colors.border}`,
                  backgroundColor: f.filled && isActive ? theme.colors.blue
                    : isActive ? theme.colors.blueMuted : 'transparent',
                  fontSize: '11px', fontWeight: 600, fontFamily: theme.fonts.body,
                  color: f.filled && isActive ? '#fff'
                    : isActive ? theme.colors.blue : colors.textSecondary,
                  cursor: 'pointer', transition: theme.transitions.fast,
                  whiteSpace: 'nowrap',
                }}
              >
                {f.dotColor && (
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: f.dotColor,
                  }} />
                )}
                {f.label}
                {f.count != null && (
                  <span style={{
                    fontSize: '10px', fontWeight: 700,
                    backgroundColor: f.filled && isActive ? 'rgba(255,255,255,0.3)' : 'transparent',
                    borderRadius: theme.radii.full, padding: '0 2px',
                  }}>{f.count}</span>
                )}
                {f.hasChevron && <ChevronDown size={10} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Week divider */}
      <div style={{
        padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, color: colors.textTertiary,
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>This week · 7</span>
        <ChevronDown size={12} color={colors.textTertiary} />
      </div>

      {/* Conversations */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {inboxConversations.map((conv) => {
          const isSelected = selected?.id === conv.id;
          const channelMap = {
            chat: { icon: MessageSquare, label: 'Chat', color: theme.colors.purple, bg: theme.colors.purpleMuted },
            email: { icon: Mail, label: 'Email', color: theme.colors.blue, bg: theme.colors.blueMuted },
            call: { icon: Phone, label: 'Call', color: theme.colors.success, bg: theme.colors.successMuted },
            phone: { icon: Phone, label: 'Call', color: theme.colors.success, bg: theme.colors.successMuted },
            sms: { icon: MessageSquare, label: 'SMS', color: theme.colors.warning, bg: theme.colors.warningMuted },
            twitter: { icon: Twitter, label: 'Twitter', color: '#000000', bg: 'rgba(0,0,0,0.06)' },
          };
          const ch = channelMap[conv.channel] || channelMap.chat;
          const ChannelIcon = ch.icon;
          return (
            <div
              key={conv.id}
              onClick={() => setSelected(conv)}
              onMouseEnter={() => setHovered(conv.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${colors.divider}`,
                cursor: 'pointer',
                backgroundColor: isSelected ? colors.sidebarActive
                  : hovered === conv.id ? colors.surfaceHover : 'transparent',
                borderLeft: isSelected ? `3px solid ${theme.colors.blue}` : '3px solid transparent',
                transition: theme.transitions.fast,
              }}
            >
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Channel icon */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <div title={ch.label} style={{
                    width: '22px', height: '22px', borderRadius: theme.radii.md,
                    backgroundColor: ch.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ChannelIcon size={11} color={ch.color} />
                  </div>
                </div>
                <Avatar name={conv.name} size={36} gradient={conv.gradient} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{conv.name}</span>
                    <span style={{ fontSize: '12px', color: colors.textTertiary }}>{conv.time}</span>
                  </div>
                  {conv.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '3px' }}>
                      {conv.tags.map((tag, i) => (
                        <span key={i} style={{
                          fontSize: '11px', fontWeight: 600, padding: '1px 6px',
                          borderRadius: theme.radii.full, backgroundColor: tag.bg, color: tag.color,
                        }}>{tag.label}</span>
                      ))}
                    </div>
                  )}
                  {conv.preview && (
                    <p style={{
                      fontSize: '13px', color: colors.textSecondary, margin: 0,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{conv.preview}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConversationDetail({ conversation, autopilot, liveMessages, setLiveMessages, composeText, setComposeText, pendingDraftId, setPendingDraftId, onAskNextIQ }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const isVoice = conversation?.channel === 'phone';
  const messageText = composeText;
  const setMessageText = setComposeText;
  const inputRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);
  const [callNotes, setCallNotes] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef(null);

  useEffect(() => {
    if (isVoice) {
      callTimerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
      return () => clearInterval(callTimerRef.current);
    }
    return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); };
  }, [isVoice]);

  const formatCallDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  const [msgReactions, setMsgReactions] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    setLiveMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        from: 'agent',
        name: 'You',
        text: messageText.trim(),
        time: timeStr,
        ...(pendingDraftId ? { _responseId: pendingDraftId, autopilot: false } : {}),
        ...(replyTo ? { replyTo: { id: replyTo.id, name: replyTo.name, text: replyTo.text } } : {}),
      },
    ]);
    setMessageText('');
    setPendingDraftId(null);
    setReplyTo(null);
  };
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [msgLayout, setMsgLayout] = useState('default');
  const [expandedIds, setExpandedIds] = useState(new Set([1]));
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const moreMenuRef = useRef(null);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [liveMessages.length]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const handler = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setShowMoreMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!conversation) return (
    <div style={{ flex: 45, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <div style={{ textAlign: 'center', color: colors.textSecondary }}>
        <MessageSquare size={48} color={colors.textTertiary} style={{ marginBottom: '16px' }} />
        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Select a conversation</div>
        <div style={{ fontSize: '14px' }}>Choose from the list to view details</div>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 45, minWidth: 0, display: 'flex', flexDirection: 'column', backgroundColor: colors.background, overflow: 'hidden' }}>
      {/* ─── Conversation Header ─── */}
      <div style={{
        padding: '12px 20px', borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.surface, display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <Avatar name={conversation.name} size={40} gradient={conversation.gradient} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text }}>{conversation.name}</span>
            {isVoice ? (
              <span style={{
                fontSize: '12px', fontWeight: 600, padding: '2px 8px',
                borderRadius: theme.radii.full, backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <Phone size={11} />
                Voice Call
                <span style={{ fontSize: '10px', fontWeight: 700, color: theme.colors.success, marginLeft: '2px' }}>
                  {formatCallDuration(callDuration)}
                </span>
              </span>
            ) : (
              <span style={{
                fontSize: '12px', fontWeight: 600, padding: '2px 8px',
                borderRadius: theme.radii.full, backgroundColor: theme.colors.successMuted,
                color: theme.colors.success, display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: theme.colors.success }} />
                Live Chat
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '13px', fontWeight: 600, color: colors.textSecondary,
            backgroundColor: colors.surfaceHover, padding: '4px 10px',
            borderRadius: theme.radii.full, display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <Clock size={13} /> 1h 23m
          </span>
          {[Phone, Video, Bookmark].map((Icon, i) => (
            <button key={i} style={{
              width: '32px', height: '32px', borderRadius: theme.radii.md, border: 'none',
              backgroundColor: 'transparent', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: theme.transitions.fast,
            }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icon size={16} color={colors.textSecondary} />
            </button>
          ))}
          {/* More menu with dropdown */}
          <div style={{ position: 'relative' }} ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              style={{
                width: '32px', height: '32px', borderRadius: theme.radii.md,
                border: showMoreMenu ? `2px solid ${theme.colors.blue}` : 'none',
                backgroundColor: showMoreMenu ? colors.surfaceHover : 'transparent',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: theme.transitions.fast,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceHover}
              onMouseLeave={(e) => {
                if (!showMoreMenu) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <MoreHorizontal size={16} color={showMoreMenu ? theme.colors.blue : colors.textSecondary} />
            </button>
            {showMoreMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                width: '240px', backgroundColor: theme.colors.white,
                borderRadius: theme.radii.xl,
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                zIndex: 1000, overflow: 'hidden',
                animation: 'fadeIn 0.15s ease',
              }}>
                {[
                  { icon: UserPlus, label: 'Add Teammate' },
                  { icon: FileText, label: 'Internal Notes' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setShowMoreMenu(false)}
                    style={{
                      width: '100%', padding: '14px 18px',
                      display: 'flex', alignItems: 'center', gap: '14px',
                      border: 'none', backgroundColor: 'transparent',
                      cursor: 'pointer', transition: theme.transitions.fast,
                      textAlign: 'left',
                      borderBottom: `1px solid ${theme.colors.gray100}`,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.gray50}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <item.icon size={20} color={theme.colors.gray600} />
                    <span style={{
                      fontSize: '15px', fontWeight: 500, color: theme.colors.navy,
                      fontFamily: theme.fonts.body,
                    }}>{item.label}</span>
                  </button>
                ))}
                {/* Message Layout row with toggle */}
                <div style={{
                  padding: '14px 18px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontSize: '15px', fontWeight: 500, color: theme.colors.navy,
                    fontFamily: theme.fonts.body,
                  }}>Message Layout</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMsgLayout(msgLayout === 'default' ? 'compact' : 'default');
                    }}
                    style={{
                      width: '36px', height: '28px', borderRadius: theme.radii.md,
                      border: `1.5px solid ${theme.colors.blue}`,
                      backgroundColor: theme.colors.white,
                      cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      transition: theme.transitions.fast,
                    }}
                  >
                    <AlignJustify size={16} color={theme.colors.blue} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Interaction timeline ─── */}
      <div ref={scrollAreaRef} style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '36px 24px 0' }}>
          {/* Jump to button */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            padding: '12px 0',
          }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 14px', borderRadius: theme.radii.full,
              border: `1px solid ${theme.colors.gray200}`, backgroundColor: theme.colors.white,
              fontSize: '13px', fontWeight: 500, color: theme.colors.gray500,
              fontFamily: theme.fonts.body, cursor: 'pointer',
            }}>
              <Search size={12} /> Jump to...
            </button>
          </div>

          {[...(interactionTimelineMap[conversation?.id] || interactionTimelineMap.default)].reverse().map((interaction, idx) => {
            const channelDef = {
              sms: { icon: MessageSquare, label: 'sms', color: theme.colors.warning },
              email: { icon: Mail, label: 'email', color: theme.colors.blue },
              call: { icon: Phone, label: 'call', color: theme.colors.success },
              phone: { icon: Phone, label: 'call', color: theme.colors.success },
              chat: { icon: MessageSquare, label: 'chat', color: theme.colors.purple },
              twitter: { icon: Twitter, label: 'twitter', color: '#000000' },
            };
            const ch = channelDef[interaction.channel] || channelDef.chat;
            const ChannelIcon = ch.icon;
            const sentimentColor = interaction.sentiment === 'Positive' ? theme.colors.success
              : interaction.sentiment === 'Neutral' ? theme.colors.gray500 : theme.colors.error;
            const isExpanded = expandedIds.has(interaction.id);

            return (
              <div key={interaction.id} style={{ marginBottom: '0' }}>
                {/* Channel divider with lines */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '20px 0 12px', position: 'relative',
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.gray200 }} />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '4px 12px', backgroundColor: theme.colors.white,
                    borderRadius: theme.radii.full, border: `1px solid ${theme.colors.gray200}`,
                    flexShrink: 0,
                  }}>
                    <ChannelIcon size={12} color={ch.color} />
                    <span style={{
                      fontSize: '12px', fontWeight: 600, color: theme.colors.gray500,
                      textTransform: 'capitalize',
                    }}>{ch.label}</span>
                    <span style={{ fontSize: '12px', color: theme.colors.gray400 }}>•</span>
                    <span style={{ fontSize: '12px', color: theme.colors.gray400 }}>{interaction.date}</span>
                    {interaction.highlight && (
                      <>
                        <span style={{ fontSize: '12px', color: theme.colors.gray400 }}>•</span>
                        <span style={{
                          fontSize: '12px', color: '#D97706', fontWeight: 600,
                        }}>★ {interaction.highlight}</span>
                      </>
                    )}
                  </div>
                  <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.gray200 }} />
                </div>

                {/* Expandable card */}
                <div style={{
                  backgroundColor: theme.colors.white,
                  borderRadius: theme.radii.lg,
                  border: `1px solid ${isExpanded ? ch.color + '40' : theme.colors.gray200}`,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isExpanded ? `0 2px 12px ${ch.color}15` : theme.shadows.xs,
                }}>
                  {/* Card header button */}
                  <button
                    onClick={() => toggleExpand(interaction.id)}
                    style={{
                      width: '100%', padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      border: 'none',
                      backgroundColor: isExpanded ? `${ch.color}08` : 'transparent',
                      cursor: 'pointer', transition: 'background-color 0.15s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = theme.colors.gray50;
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Channel icon circle */}
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: `${ch.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <ChannelIcon size={14} color={ch.color} />
                    </div>

                    {/* Title + metadata */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px', fontWeight: 600, color: theme.colors.navy,
                        marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {interaction.title}
                      </div>
                      <div style={{
                        fontSize: '12px', color: theme.colors.gray400,
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}>
                        <span>{interaction.time}</span>
                        {interaction.agent && (
                          <><span>•</span><span>{interaction.agent}</span></>
                        )}
                        {interaction.duration && (
                          <><span>•</span><span>{interaction.duration}</span></>
                        )}
                        <span>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <div style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: sentimentColor,
                          }} />
                          <span style={{ textTransform: 'capitalize' }}>{interaction.sentiment}</span>
                        </div>
                      </div>
                    </div>

                    {/* Collapsed outcome preview */}
                    {interaction.outcome && !isExpanded && (
                      <span style={{
                        fontSize: '12px', color: theme.colors.gray400,
                        flexShrink: 0, maxWidth: '160px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{interaction.outcome}</span>
                    )}

                    {/* Chevron */}
                    <ChevronDown
                      size={16} color={theme.colors.gray400}
                      style={{
                        flexShrink: 0, transition: 'transform 0.2s ease',
                        transform: isExpanded ? 'rotate(0)' : 'rotate(-90deg)',
                      }}
                    />
                  </button>

                  {/* Expanded content */}
                  {isExpanded && interaction.messages && (
                    <div style={{ borderTop: `1px solid ${theme.colors.gray150}` }}>
                      {/* Outcome bar */}
                      {interaction.outcome && (
                        <div style={{
                          padding: '8px 16px',
                          backgroundColor: theme.colors.successMuted,
                          display: 'flex', alignItems: 'center', gap: '6px',
                          borderBottom: `1px solid ${theme.colors.gray150}`,
                        }}>
                          <CheckCircle size={12} color={theme.colors.success} />
                          <span style={{
                            fontSize: '13px', color: theme.colors.success, fontWeight: 500,
                          }}>Outcome: {interaction.outcome}</span>
                        </div>
                      )}

                      {/* Messages */}
                      <div style={{
                        padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
                      }}>
                        {interaction.messages.map((msg, mi) => (
                          <div key={mi}>
                            {/* Sender name */}
                            <div style={{
                              fontSize: '12px', fontWeight: 600,
                              color: msg.from === 'agent' ? theme.colors.blue : theme.colors.gray500,
                              marginBottom: '3px', paddingLeft: '2px',
                            }}>
                              {msg.from === 'agent' ? 'You' : conversation.name}
                            </div>
                            {/* Message bubble */}
                            <div style={{
                              display: 'inline-block', maxWidth: '85%',
                              padding: '10px 14px', fontSize: '14px', lineHeight: 1.5,
                              whiteSpace: 'pre-line',
                              backgroundColor: msg.from === 'agent' ? theme.colors.blue : theme.colors.gray100,
                              color: msg.from === 'agent' ? theme.colors.white : theme.colors.navy,
                              borderRadius: '16px',
                              boxShadow: theme.shadows.xs,
                            }}>
                              {msg.text}
                            </div>
                            <div style={{
                              fontSize: '12px', color: theme.colors.gray400,
                              marginTop: '3px', paddingLeft: '2px',
                            }}>
                              {msg.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {/* ── CURRENT CONVERSATION divider ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '24px 0 16px',
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.success + '40' }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', backgroundColor: theme.colors.white,
              borderRadius: theme.radii.full, border: `1px solid ${theme.colors.success}40`,
            }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                backgroundColor: theme.colors.success,
              }} />
              <span style={{
                fontSize: '12px', fontWeight: 700, color: theme.colors.success,
                letterSpacing: '0.5px',
              }}>CURRENT CONVERSATION</span>
            </div>
            <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.success + '40' }} />
          </div>

          {/* ── Live chat messages ── */}
          {liveMessages.map((msg) => {
            const isHovered = hoveredMsgId === msg.id;
            return (
              <div
                key={msg.id}
                style={{ marginBottom: '12px', position: 'relative' }}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => { setHoveredMsgId(null); setShowEmojiPicker(null); }}
              >
                {/* Sender name */}
                <div style={{
                  fontSize: '12px', fontWeight: 600,
                  color: msg.from === 'agent' ? theme.colors.blue : theme.colors.gray500,
                  marginBottom: '3px', paddingLeft: '2px',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  {msg.from === 'agent' ? 'You' : conversation.name}
                  {isVoice && (
                    <span style={{
                      fontSize: '10px', fontWeight: 500, color: msg.from === 'agent' ? theme.colors.blue : '#D97706',
                      display: 'flex', alignItems: 'center', gap: '3px', opacity: 0.7,
                    }}>
                      {msg.from === 'agent' ? (
                        <>{msg.autopilot ? <Zap size={9} /> : <Mic size={9} />} {msg.communicated ? 'verbal' : 'verbal'}</>
                      ) : (
                        <><Activity size={9} /> transcribed</>
                      )}
                    </span>
                  )}
                </div>

                {/* Message bubble + hover toolbar */}
                <div style={{ position: 'relative', display: 'inline-block', maxWidth: '85%' }}>
                  {/* Reply-to reference */}
                  {msg.replyTo && (
                    <div style={{
                      padding: '6px 12px', marginBottom: '-6px',
                      borderRadius: '12px 12px 0 0',
                      backgroundColor: msg.from === 'agent' ? `${theme.colors.blue}20` : theme.colors.gray150,
                      borderLeft: `3px solid ${theme.colors.blue}50`,
                    }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: theme.colors.blue, marginBottom: '2px' }}>{msg.replyTo.name}</div>
                      <div style={{ fontSize: '11px', color: theme.colors.gray500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{msg.replyTo.text}</div>
                    </div>
                  )}
                  <div style={{
                    padding: '10px 14px', fontSize: '14px', lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                    backgroundColor: isVoice
                      ? (msg.from === 'agent' ? `${theme.colors.blue}08` : theme.colors.gray50)
                      : (msg.from === 'agent' ? theme.colors.blue : theme.colors.gray100),
                    color: isVoice ? theme.colors.navy : (msg.from === 'agent' ? theme.colors.white : theme.colors.navy),
                    borderRadius: isVoice ? '4px' : (msg.replyTo ? '0 0 16px 16px' : '16px'),
                    borderLeft: isVoice ? `3px solid ${msg.from === 'agent' ? theme.colors.blue : '#D97706'}` : 'none',
                    boxShadow: isVoice ? 'none' : theme.shadows.xs,
                  }}>
                    {msg.text}
                  </div>

                  {/* Emoji reactions */}
                  {msgReactions[msg.id] && msgReactions[msg.id].length > 0 && (
                    <div style={{
                      display: 'flex', gap: '4px', marginTop: '4px',
                      flexWrap: 'wrap',
                    }}>
                      {[...new Set(msgReactions[msg.id])].map((emoji, i) => {
                        const count = msgReactions[msg.id].filter(e => e === emoji).length;
                        return (
                          <span key={i} style={{
                            fontSize: '13px', padding: '2px 6px', borderRadius: theme.radii.full,
                            backgroundColor: colors.surfaceHover, border: `1px solid ${colors.border}`,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px',
                          }}
                            onClick={() => setMsgReactions(prev => ({ ...prev, [msg.id]: prev[msg.id].filter(e => e !== emoji) }))}
                          >
                            {emoji}{count > 1 && <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textSecondary }}>{count}</span>}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Hover action toolbar — top-right above bubble */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute', top: '-32px', right: '0',
                      display: 'flex', alignItems: 'center', gap: '1px',
                      backgroundColor: theme.colors.white,
                      borderRadius: theme.radii.md,
                      boxShadow: '0 1px 8px rgba(0,0,0,0.12)',
                      border: `1px solid ${theme.colors.gray200}`,
                      padding: '2px', zIndex: 10,
                    }}>
                      {[
                        { icon: Sparkles, label: 'Ask NextIQ', color: theme.colors.blue, onClick: () => { if (onAskNextIQ) onAskNextIQ(msg.text); } },
                        { icon: MessageSquare, label: 'Reply', color: theme.colors.gray500, onClick: () => { setReplyTo(msg); inputRef.current?.focus(); } },
                        { icon: Smile, label: 'React', color: theme.colors.gray500, onClick: () => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id) },
                      ].map(({ icon: Icon, label, color, onClick }, i) => (
                        <button key={i} title={label} onClick={onClick} style={{
                          width: '28px', height: '28px', borderRadius: theme.radii.sm,
                          border: 'none', backgroundColor: 'transparent',
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', transition: 'background-color 0.1s ease',
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.gray100}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Icon size={14} color={color} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick emoji picker — absolute, below toolbar */}
                  {showEmojiPicker === msg.id && (
                    <div style={{
                      position: 'absolute', top: '-32px', right: '0',
                      transform: 'translateY(-100%)',
                      display: 'flex', gap: '2px', padding: '4px 6px',
                      backgroundColor: theme.colors.white, borderRadius: theme.radii.md,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.15)', border: `1px solid ${theme.colors.gray200}`,
                      zIndex: 20,
                    }}>
                      {quickEmojis.map(emoji => (
                        <button key={emoji} onClick={() => {
                          setMsgReactions(prev => ({ ...prev, [msg.id]: [...(prev[msg.id] || []), emoji] }));
                          setShowEmojiPicker(null);
                        }} style={{
                          width: '30px', height: '30px', borderRadius: theme.radii.sm,
                          border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                          fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background-color 0.1s ease',
                        }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.colors.gray100}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >{emoji}</button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timestamp + autopilot */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginTop: '3px', paddingLeft: '2px',
                }}>
                  <span style={{ fontSize: '12px', color: theme.colors.gray400 }}>{msg.time}</span>
                  {msg.autopilot && (
                    <span style={{
                      fontSize: '12px', fontWeight: 600, color: theme.colors.blue,
                      display: 'flex', alignItems: 'center', gap: '3px',
                    }}>
                      <Zap size={11} /> Autopilot
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div style={{ height: '16px' }} />
        </div>
      </div>


      {/* ─── Message input / Call Notes ─── */}
      {isVoice ? (
        <div style={{
          padding: '12px 20px 16px', borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
        }}>
          {/* Call status bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 12px', marginBottom: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.06)',
            borderRadius: theme.radii.lg, border: '1px solid rgba(245, 158, 11, 0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.colors.success, animation: 'autopilotGlow 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#D97706' }}>Active Call</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: colors.text }}>{formatCallDuration(callDuration)}</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[{ icon: Mic, label: 'Mute' }, { icon: Phone, label: 'Hold' }].map(({ icon: Ico, label }, i) => (
                <button key={i} title={label} style={{
                  width: '28px', height: '28px', borderRadius: theme.radii.sm,
                  border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ico size={12} color={colors.textSecondary} />
                </button>
              ))}
            </div>
          </div>
          {/* Call notes input */}
          <div style={{
            border: `1px solid ${colors.inputBorder}`, borderRadius: theme.radii.lg,
            backgroundColor: colors.inputBackground, overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px' }}>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Add call notes..."
                rows={2}
                style={{
                  width: '100%', border: 'none', outline: 'none', fontSize: '13px',
                  fontFamily: theme.fonts.body, color: colors.text,
                  backgroundColor: 'transparent', resize: 'none', lineHeight: '1.5',
                }}
              />
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 12px', borderTop: `1px solid ${colors.divider}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={13} color={colors.textTertiary} />
                <span style={{ fontSize: '11px', color: colors.textTertiary }}>Call Notes</span>
              </div>
              <span style={{ fontSize: '10px', color: colors.textTertiary }}>
                {callNotes.trim() ? 'Auto-saved' : ''}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '12px 20px 16px', borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
        }}>
          <div style={{
            border: `1px solid ${pendingDraftId ? theme.colors.blue : colors.inputBorder}`,
            borderRadius: theme.radii.xl,
            backgroundColor: colors.inputBackground, overflow: 'hidden',
            transition: theme.transitions.fast,
            boxShadow: pendingDraftId ? `0 0 0 2px ${theme.colors.blue}20` : 'none',
          }}>
            {pendingDraftId && (
              <div style={{
                padding: '6px 16px', backgroundColor: `${theme.colors.blue}08`,
                borderBottom: `1px solid ${theme.colors.blue}15`,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <Edit3 size={11} color={theme.colors.blue} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.blue }}>
                  Editing AI draft — review and send
                </span>
                <button
                  onClick={() => { setMessageText(''); setPendingDraftId(null); }}
                  style={{
                    marginLeft: 'auto', border: 'none', background: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px',
                  }}
                >
                  <X size={12} color={colors.textTertiary} />
                </button>
              </div>
            )}
            {replyTo && (
              <div style={{
                padding: '8px 16px', backgroundColor: `${theme.colors.blue}06`,
                borderBottom: `1px solid ${colors.border}`,
                borderLeft: `3px solid ${theme.colors.blue}`,
                display: 'flex', alignItems: 'flex-start', gap: '8px',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.blue, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Reply size={11} /> Replying to {replyTo.name}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{replyTo.text}</div>
                </div>
                <button onClick={() => setReplyTo(null)} style={{
                  border: 'none', background: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', padding: '2px', flexShrink: 0,
                }}>
                  <X size={12} color={colors.textTertiary} />
                </button>
              </div>
            )}
            <div style={{ padding: '12px 16px' }}>
              <textarea
                ref={inputRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write a message..."
                rows={pendingDraftId ? 4 : 1}
                style={{
                  width: '100%', border: 'none', outline: 'none', fontSize: '14px',
                  fontFamily: theme.fonts.body, color: colors.text,
                  backgroundColor: 'transparent', resize: 'none',
                  lineHeight: '1.5',
                }}
              />
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderTop: `1px solid ${colors.divider}`,
            }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[Plus, Paperclip, Camera, Smile, Mic].map((Icon, i) => {
                  return (
                    <button key={i} style={{
                      width: '30px', height: '30px', borderRadius: theme.radii.md,
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: theme.transitions.fast,
                    }}>
                      <Icon size={15} color={colors.textSecondary} />
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleSendMessage}
                  style={{
                    width: '32px', height: '32px', borderRadius: theme.radii.md,
                    border: 'none',
                    backgroundColor: messageText.trim() ? theme.colors.blue : colors.surfaceHover,
                    cursor: messageText.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: theme.transitions.fast,
                  }}
                >
                  <Send size={15} color={messageText.trim() ? '#fff' : colors.textTertiary} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AutopilotBorderOverlay({ progress, borderRadius = '8px' }) {
  if (progress <= 0) return null;
  const pct = Math.min(progress, 100);
  const deg = (pct / 100) * 360;
  return (
    <div style={{
      position: 'absolute', inset: '-3px', borderRadius, zIndex: 2, pointerEvents: 'none',
      background: `conic-gradient(from 0deg, rgba(0,98,184,0.9) 0deg, rgba(59,130,246,0.65) ${deg * 0.7}deg, rgba(0,98,184,0.9) ${deg}deg, transparent ${deg}deg)`,
      WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      padding: '3px',
      transition: 'none',
    }} />
  );
}

function NextIQPanel({ conversation, autopilot, setAutopilot, liveMessages, setLiveMessages, setComposeText, setPendingDraftId, nextIQQuery, clearNextIQQuery }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const isVoice = conversation?.channel === 'phone';
  const [query, setQuery] = useState('');

  const [hoveredAction, setHoveredAction] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const [usedActions, setUsedActions] = useState(new Set());
  const [iqConversation, setIqConversation] = useState([]);
  const [expandedSources, setExpandedSources] = useState({});
  const [expandedHistoricSuggestions, setExpandedHistoricSuggestions] = useState({});
  const threadScrollRef = useRef(null);
  const autopilotTargetRef = useRef(null);
  const [actionResults, setActionResults] = useState({});

  const COUNTDOWN_TOTAL = 15;
  const [countdown, setCountdown] = useState(COUNTDOWN_TOTAL);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownSent, setCountdownSent] = useState(false);
  const countdownRef = useRef(null);
  const [autopilotDecision, setAutopilotDecision] = useState(null);
  const lastAutopilotTrigger = useRef(null);

  const prevConvId = useRef(conversation?.id);
  useEffect(() => {
    if (conversation?.id !== prevConvId.current) {
      prevConvId.current = conversation?.id;
      setActionResults({});
      setUsedActions(new Set());
      setHoveredAction(null);
      setExpandedSources({});
      setExpandedHistoricSuggestions({});
      setAutopilotDecision(null);
      setCountdownActive(false);
      setCountdownSent(false);
      setCountdown(COUNTDOWN_TOTAL);
      lastAutopilotTrigger.current = null;
      if (countdownRef.current) clearInterval(countdownRef.current);
    }
  }, [conversation?.id]);

  const handleNbaMouseEnter = (actionId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredAction(actionId);
  };
  const handleNbaMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredAction(null), 80);
  };

  const customerCtx = getCustomerContext(conversation);
  const completedActions = useMemo(() =>
    Object.entries(actionResults)
      .filter(([, r]) => r.status === 'complete')
      .map(([id, r]) => ({ id, ...r })),
    [actionResults]
  );
  const hasActionContext = completedActions.length > 0;

  const classification = hasActionContext
    ? { mode: 'nba', intent: 'action_follow_up', reason: 'Pending action results — generating follow-up actions', confidence: 95 }
    : classifyIntent(liveMessages, customerCtx);
  const kbResponse = (!hasActionContext && (classification.mode === 'kb_response' || classification.mode === 'both'))
    ? getKBResponse(liveMessages)
    : null;
  const nbaActions = hasActionContext
    ? getPostActionNBAs(completedActions, customerCtx)
    : (classification.mode === 'nba' || classification.mode === 'both')
      ? getNextBestActions(liveMessages, customerCtx)
      : [];

  // Autopilot toggle — reset state when toggled
  useEffect(() => {
    if (autopilot) {
      setCountdownSent(false);
      setCountdownActive(false);
      setCountdown(COUNTDOWN_TOTAL);
      setAutopilotDecision(null);
      lastAutopilotTrigger.current = null;
      setUsedActions(new Set());
      usedMockTriggers.current = new Set();
    } else {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (customerReplyTimer.current) clearTimeout(customerReplyTimer.current);
      setCountdownActive(false);
      setCountdown(COUNTDOWN_TOTAL);
      setCountdownSent(false);
      setAutopilotDecision(null);
      lastAutopilotTrigger.current = null;
    }
  }, [autopilot]);

  // Autopilot trigger — decide action when new customer message arrives
  useEffect(() => {
    if (!autopilot || countdownActive || countdownSent) return;
    if (hasActionContext) return;
    const lastMsg = liveMessages[liveMessages.length - 1];
    if (!lastMsg || lastMsg.from !== 'customer') return;
    const triggerKey = `msg-${lastMsg.id}`;
    if (lastAutopilotTrigger.current === triggerKey) return;

    const availableNbas = nbaActions.filter(a => !usedActions.has(a.id));
    const decision = pickAutopilotAction(classification, kbResponse, availableNbas);
    if (!decision) return;

    lastAutopilotTrigger.current = triggerKey;
    setAutopilotDecision(decision);
    setCountdownSent(false);
    setCountdown(COUNTDOWN_TOTAL);
    setCountdownActive(true);
  }, [autopilot, liveMessages.length, classification?.mode, kbResponse?.id, nbaActions?.length, countdownActive, countdownSent]);

  // Countdown tick
  useEffect(() => {
    if (countdownActive && !countdownSent) {
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            setCountdownActive(false);
            setCountdownSent(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [countdownActive, countdownSent]);

  const mockCustomerReplies = [
    { trigger: 'kb-billing-duplicate', text: "That's great to hear! Can you send me the refund confirmation and reference number via email?", sentiment: 'Positive' },
    { trigger: 'nba-respond-check-billing', text: "Okay, thank you! Take your time.", sentiment: 'Neutral' },
    { trigger: 'nba-confirm-and-refund', text: "That's great to hear! Thank you for looking into this so quickly. Can you send me the refund confirmation via email?", sentiment: 'Positive' },
    { trigger: 'nba-reply-duplicate-found', text: "Yes, please go ahead and initiate the refund!", sentiment: 'Positive' },
    { trigger: 'nba-confirm-refund-done', text: "That's wonderful, thank you so much! I'll keep an eye out for the confirmation email. You've been incredibly helpful!", sentiment: 'Positive' },
    { trigger: 'nba-post-account-reply', text: "Yes, specifically about the duplicate charges on our February invoice. We were billed twice for the same amount.", sentiment: 'Negative' },
    { trigger: 'nba-post-diagnostic-reply', text: "Yes, please set up monitoring alerts. That would be really helpful so we know right away if there's another issue.", sentiment: 'Positive' },
    { trigger: 'nba-post-action-gen', text: "Okay, go ahead — I'm listening.", sentiment: 'Neutral' },
    { trigger: 'nba-share-findings', text: "Yes, please go ahead and process the refund!", sentiment: 'Positive' },
    { trigger: 'nba-billing-summary', text: "Yes, please process the refund. Thank you for the detailed breakdown.", sentiment: 'Positive' },
    { trigger: 'kb-continuation', text: "Thanks for the update! Is there anything else I need to do on my end?", sentiment: 'Positive' },
    { trigger: 'kb-refund-tracking', text: "Yes, that would be really helpful! Please set up billing alerts for my account.", sentiment: 'Positive' },
    { trigger: 'kb-billing-alerts', text: "Wonderful, thank you! Actually, while I have you — we've been thinking about upgrading to the Enterprise plan. Can you tell me more about what's included?", sentiment: 'Positive' },
    { trigger: 'kb-enterprise-tier', text: "Thursday works perfectly! Let's do the 2:00 PM slot.", sentiment: 'Positive' },
    { trigger: 'kb-scheduling', text: "That's everything. Thank you so much — this has been incredibly helpful!", sentiment: 'Positive' },
    { trigger: 'nba-greet-1', textFn: (name) => name === 'Emily Davis'
      ? "Sure, it's emily.davis@brightwave.io"
      : "Yes, specifically about the duplicate charges on our February invoice. We were billed twice for the same amount.",
      sentimentFn: (name) => name === 'Emily Davis' ? 'Neutral' : 'Negative' },
    { trigger: 'nba-greet-2', textFn: (name) => name === 'Emily Davis'
      ? "It's emily.davis@brightwave.io — that's the email I've been using."
      : "Yes, specifically about the duplicate charges on our February invoice. We were billed twice for the same amount.",
      sentimentFn: (name) => name === 'Emily Davis' ? 'Neutral' : 'Negative' },
    { trigger: 'kb-general', text: "Can you look into this for me? I've been having this issue for a while.", sentiment: 'Neutral' },
    { trigger: 'kb-password-reset', text: "That makes sense. My email is emily.davis@brightwave.io — can you check if that's the right one?", sentiment: 'Neutral' },
    { trigger: 'nba-check-api-usage', text: "Okay, thank you! Let me know what you find.", sentiment: 'Neutral' },
    { trigger: 'nba-check-account-ratelimit', text: "Thanks for checking! Our sync runs about 50,000 records nightly — so yes, 300/min is definitely not enough. What are our options?", sentiment: 'Neutral' },
    { trigger: 'nba-run-api-error-log', text: "That's a lot of failures. Yes, please go ahead with the temporary increase — we can't have another night of failed syncs.", sentiment: 'Negative' },
    { trigger: 'nba-post-ratelimit-share', text: "Let's do both — apply the temp increase for tonight and enable batch endpoints. We need the immediate fix plus the long-term improvement.", sentiment: 'Positive' },
    { trigger: 'nba-post-ratelimit-temp-increase', text: "That's a relief! Yes, let's definitely schedule a call about Enterprise — our data volume is only going to grow.", sentiment: 'Positive' },
    { trigger: 'nba-post-errorlog-share', text: "Yes, please apply the increase right away. We can't afford another night of failed syncs.", sentiment: 'Positive' },
    { trigger: 'nba-post-errorlog-temp-increase', text: "Perfect, that's exactly what we needed. Yes, let's schedule the Enterprise walkthrough — our CTO wants to be on that call too.", sentiment: 'Positive' },
    { trigger: 'kb-rate-limit', text: "Makes sense. Can you check what our current usage looks like and whether we qualify for a temporary increase?", sentiment: 'Neutral' },
    { trigger: 'nba-post-api-share-and-fix', text: "Yes, please apply the temporary increase. And let's discuss the Enterprise upgrade — we need a permanent fix.", sentiment: 'Positive' },
    { trigger: 'nba-post-api-share', text: "Yes, please apply the temporary increase. And let's discuss the Enterprise upgrade — we need a permanent fix.", sentiment: 'Positive' },
    { trigger: 'nba-apply-temp-and-pitch', text: "That's a huge relief — thank you! Yes, let's schedule the call. Thursday works for us. Our CTO wants to join as well since we're planning to scale the integration significantly.", sentiment: 'Positive' },
    { trigger: 'nba-apply-temp-and-schedule', text: "That sounds perfect. Thursday at 2 PM works great — our CTO will be on the call too. Thanks for getting the temp increase done so quickly!", sentiment: 'Positive' },
    { trigger: 'nba-apply-temp-only', text: "Thanks! That helps for now. Can we also talk about Enterprise? We need a permanent fix since our data volume is only going to grow.", sentiment: 'Positive' },
    { trigger: 'nba-post-temp-increase-confirm', text: "Thursday at 2 PM works great for us! We'll have our CTO on the call as well.", sentiment: 'Positive' },
    { trigger: 'nba-post-temp-schedule-demo', text: "Fantastic! Thanks for the quick help — the temp increase and the scheduled call is exactly what we needed. We'll see James on Thursday!", sentiment: 'Positive' },
    { trigger: 'nba-post-demo-confirm', text: "This has been incredibly helpful — you solved our immediate problem and set us up with a path forward. Thanks so much! We'll see James on Thursday.", sentiment: 'Positive' },
    { trigger: 'nba-schedule-enterprise-consult', text: "Excellent! Everything looks great. Thanks so much for the quick resolution — the temp increase and the scheduled call is exactly what we needed. See you Thursday!", sentiment: 'Positive' },
    { trigger: 'nba-reply-confirm-schedule', text: "That sounds great! Looking forward to it. Thanks for all the help today — the temp fix is a lifesaver and the Enterprise call will set us up for the long term.", sentiment: 'Positive' },
    // Emily Davis — Password reset flow
    { trigger: 'nba-greet-verify', text: "Sure, it's emily.davis@brightwave.io", sentiment: 'Neutral' },
    { trigger: 'nba-post-diagnose-share', text: "Oh, that's our old domain! We rebranded last year to Brightwave Corp. Yes, please go ahead and reactivate it!", sentiment: 'Neutral' },
    { trigger: 'nba-post-reactivate-confirm', text: "Got the email already! That was fast. And yes, I'd love to hear about the upgrade offer — send me the details! You've been incredibly helpful.", sentiment: 'Positive' },
    { trigger: 'nba-post-reactivate-close', text: "Perfect, I see the reset email in my inbox! Thanks so much for your help — this was way easier than I expected!", sentiment: 'Positive' },
    { trigger: 'nba-password-generic', text: "I tried that already and it didn't work — that's why I called. Can you check what's wrong?", sentiment: 'Negative' },
  ];
  const customerReplyTimer = useRef(null);
  const usedMockTriggers = useRef(new Set());

  const executeAutopilotAction = () => {
    if (!autopilotDecision) return;
    const { type, action } = autopilotDecision;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (type === 'kb') {
      setLiveMessages(prev => [
        ...prev,
        { id: prev.length + 1, from: 'agent', name: 'You', text: action.response, time: timeStr, autopilot: true, _responseId: action.id },
      ]);
    } else if (type === 'nba_reply') {
      setUsedActions(prev => new Set([...prev, action.id]));
      if (action.immediateReply) {
        setLiveMessages(prev => [
          ...prev,
          { id: prev.length + 1, from: 'agent', name: 'You', text: action.immediateReply, time: timeStr, autopilot: true, _responseId: action.id },
        ]);
      }
      if (hasActionContext) {
        setActionResults({});
      }
    } else if (type === 'nba_action') {
      setUsedActions(prev => new Set([...prev, action.id]));
      if (action.immediateReply) {
        setLiveMessages(prev => [
          ...prev,
          { id: prev.length + 1, from: 'agent', name: 'You', text: action.immediateReply, time: timeStr, autopilot: true, _responseId: action.id },
        ]);
      }
      if (action.toolCall) {
        setActionResults({ [action.id]: { status: 'loading', toolName: action.toolCall.toolName } });
        setTimeout(() => {
          setActionResults({ [action.id]: {
            status: 'complete',
            toolName: action.toolCall.toolName,
            result: action.mockResult,
            resultSummary: action.resultSummary,
            postToolResponse: action.postToolResponse,
          } });
        }, 1800);
      }
    }
  };

  useEffect(() => {
    if (countdownSent && autopilotDecision) {
      executeAutopilotAction();
      setCountdownSent(false);
    }
  }, [countdownSent]);

  useEffect(() => {
    if (countdownActive && autopilotDecision && autopilotTargetRef.current && threadScrollRef.current) {
      setTimeout(() => {
        if (autopilotTargetRef.current && threadScrollRef.current) {
          autopilotTargetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [countdownActive, autopilotDecision]);

  // Post-action autopilot loop: when a tool completes AND customer replies, pick the top post-action NBA
  useEffect(() => {
    if (!autopilot || !hasActionContext) return;
    if (countdownActive || countdownSent) return;
    const lastMsg = liveMessages[liveMessages.length - 1];
    if (!lastMsg || lastMsg.from !== 'customer') return;
    const postActionNbas = getPostActionNBAs(completedActions, customerCtx);
    const availableNbas = postActionNbas.filter(a => !usedActions.has(a.id));
    if (availableNbas.length === 0) return;

    const topNba = availableNbas[0];
    const isAction = topNba.type === 'action' || topNba.type === 'escalation';
    const decision = { type: isAction ? 'nba_action' : 'nba_reply', action: topNba, reason: `Post-action follow-up: ${topNba.label}` };
    const triggerKey = `post-action-${completedActions.map(a => a.id).join(',')}-${lastMsg.id}`;
    if (lastAutopilotTrigger.current === triggerKey) return;

    lastAutopilotTrigger.current = triggerKey;
    setAutopilotDecision(decision);
    setCountdownSent(false);
    setCountdown(COUNTDOWN_TOTAL);
    setCountdownActive(true);
  }, [autopilot, hasActionContext, completedActions.length, liveMessages.length, countdownActive, countdownSent]);

  const lastProcessedAgentMsgId = useRef(null);

  useEffect(() => {
    const lastMsg = liveMessages[liveMessages.length - 1];
    if (!lastMsg || lastMsg.from !== 'agent' || !lastMsg._responseId) return;
    if (lastMsg.id === lastProcessedAgentMsgId.current) return;

    const triggerId = lastMsg._responseId;
    if (usedMockTriggers.current.has(triggerId)) return;
    const mockReply = mockCustomerReplies.find(r => r.trigger === triggerId);
    if (!mockReply) return;

    const customerName = conversation?.name || 'Customer';
    const replyText = mockReply.textFn ? mockReply.textFn(customerName) : mockReply.text;
    const replySentiment = mockReply.sentimentFn ? mockReply.sentimentFn(customerName) : mockReply.sentiment;

    lastProcessedAgentMsgId.current = lastMsg.id;
    usedMockTriggers.current.add(triggerId);

    customerReplyTimer.current = setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      setLiveMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          from: 'customer',
          name: customerName,
          text: replyText,
          time: timeStr,
          sentiment: replySentiment,
        },
      ]);
      if (countdownRef.current) clearInterval(countdownRef.current);
      setCountdownActive(false);
      setCountdownSent(false);
      setCountdown(COUNTDOWN_TOTAL);
      setAutopilotDecision(null);
    }, 5000);

    return () => {
      if (customerReplyTimer.current) clearTimeout(customerReplyTimer.current);
      usedMockTriggers.current.delete(triggerId);
      lastProcessedAgentMsgId.current = null;
    };
  }, [liveMessages]);

  const handleCancelCountdown = () => {
    clearInterval(countdownRef.current);
    setCountdownActive(false);
    setCountdown(COUNTDOWN_TOTAL);
    setAutopilotDecision(null);
  };

  const handleApproveNow = () => {
    clearInterval(countdownRef.current);
    setCountdownActive(false);
    setCountdownSent(true);
    setCountdown(0);
  };

  const handleSendAsReply = () => {
    if (!kbResponse) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const responseId = kbResponse.id;
    setLiveMessages(prev => [
      ...prev,
      { id: prev.length + 1, from: 'agent', name: 'You', text: kbResponse.response, time: timeStr, _responseId: responseId },
    ]);
  };

  const handleEditDraft = () => {
    if (!kbResponse) return;
    clearInterval(countdownRef.current);
    setCountdownActive(false);
    setCountdown(COUNTDOWN_TOTAL);
    setAutopilotDecision(null);
    setComposeText(kbResponse.response);
    setPendingDraftId(kbResponse.id);
  };

  const handleEditAutopilotDraft = () => {
    if (!autopilotDecision) return;
    clearInterval(countdownRef.current);
    setCountdownActive(false);
    setCountdown(COUNTDOWN_TOTAL);
    const { type, action } = autopilotDecision;
    const text = type === 'kb' ? action.response : action.immediateReply;
    const id = action.id;
    setAutopilotDecision(null);
    if (text) {
      setComposeText(text);
      setPendingDraftId(id);
    }
  };

  const perMessageSuggestions = useMemo(() => {
    const map = {};
    const lastCustomerIdx = (() => {
      for (let i = liveMessages.length - 1; i >= 0; i--) {
        if (liveMessages[i].from === 'customer') return i;
      }
      return -1;
    })();

    liveMessages.forEach((msg, idx) => {
      if (msg.from === 'customer') {
        const msgsUpTo = liveMessages.slice(0, idx + 1);
        const isLatestCustomerMsg = idx === lastCustomerIdx;

        let chosenId = null;
        for (let j = idx + 1; j < liveMessages.length; j++) {
          if (liveMessages[j].from === 'customer') break;
          if (liveMessages[j].from === 'agent' && liveMessages[j]._responseId) {
            chosenId = liveMessages[j]._responseId;
            break;
          }
        }

        const cls = classifyIntent(msgsUpTo, customerCtx);
        const kb = (cls.mode === 'kb_response' || cls.mode === 'both')
          ? getKBResponse(msgsUpTo) : null;
        const nba = (cls.mode === 'nba' || cls.mode === 'both')
          ? getNextBestActions(msgsUpTo, customerCtx) : [];
        map[msg.id] = { classification: cls, kbResponse: kb, nba, chosenId };
      }
    });
    return map;
  }, [liveMessages, conversation?.name, hasActionContext, completedActions]);

  const latestTriggerRef = useRef(null);
  const activeActionRef = useRef(null);

  useEffect(() => {
    const doScroll = () => {
      if (activeActionRef.current && threadScrollRef.current) {
        activeActionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (latestTriggerRef.current && threadScrollRef.current) {
        const container = threadScrollRef.current;
        const el = latestTriggerRef.current;
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const targetScrollTop = container.scrollTop + (elRect.top - containerRect.top);
        container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
      }
    };
    const t = setTimeout(doScroll, 150);
    return () => clearTimeout(t);
  }, [liveMessages.length, iqConversation.length, hasActionContext]);

  const handleNextIQQuery = () => {
    if (!query.trim()) return;
    const queryText = query.trim();
    setQuery('');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const queryId = Date.now();
    setIqConversation(prev => [...prev, {
      id: queryId, type: 'agent-query', text: queryText, time: timeStr,
    }]);
    setTimeout(() => {
      const response = generateNextIQAnswer(queryText, customerCtx, liveMessages);
      const respTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      setIqConversation(prev => [...prev, {
        id: queryId + 1, type: 'iq-response', text: response, time: respTime, queryId,
      }]);
    }, 800);
  };

  useEffect(() => {
    if (nextIQQuery?.text) {
      const queryText = nextIQQuery.text;
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const queryId = Date.now();
      setIqConversation(prev => [...prev, {
        id: queryId, type: 'agent-query', text: queryText, time: timeStr,
      }]);
      setTimeout(() => {
        const response = generateNextIQAnswer(queryText, customerCtx, liveMessages);
        const respTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        setIqConversation(prev => [...prev, {
          id: queryId + 1, type: 'iq-response', text: response, time: respTime, queryId,
        }]);
      }, 800);
      if (clearNextIQQuery) clearNextIQQuery();
    }
  }, [nextIQQuery]);

  const threadEntries = useMemo(() => {
    const entries = [];
    liveMessages.forEach((msg) => {
      if (msg.from === 'customer') {
        entries.push({ entryType: 'customer-msg', ...msg });
      } else {
        entries.push({ entryType: 'agent-msg', ...msg });
      }
    });
    iqConversation.forEach(entry => entries.push({ ...entry, entryType: entry.type === 'iq-response' ? 'iq-response' : 'customer-msg' }));
    return entries;
  }, [liveMessages, iqConversation]);

  const lastTriggerIdx = useMemo(() => {
    for (let i = threadEntries.length - 1; i >= 0; i--) {
      if (threadEntries[i].entryType === 'customer-msg') return i;
    }
    return -1;
  }, [threadEntries]);

  const nbaTypeConfig = {
    greeting: { label: 'Greeting', color: '#8B5CF6', bg: '#8B5CF610', icon: MessageSquare },
    reply: { label: 'Reply', color: theme.colors.blue, bg: theme.colors.blueMuted, icon: MessageSquare },
    action: { label: 'Action', color: theme.colors.success, bg: theme.colors.successMuted, icon: Zap },
    workflow: { label: 'Workflow', color: theme.colors.purple, bg: theme.colors.purpleMuted, icon: ArrowRight },
    escalation: { label: 'Escalate', color: theme.colors.error, bg: theme.colors.errorMuted, icon: ArrowUpRight },
  };

  const priorityConfig = {
    critical: { color: theme.colors.error, label: 'Critical' },
    high: { color: theme.colors.warning, label: 'High' },
    medium: { color: theme.colors.blue, label: 'Med' },
    low: { color: theme.colors.gray400, label: 'Low' },
  };

  const handleUseAction = (action) => {
    if (!action) return;
    setUsedActions(prev => new Set([...prev, action.id]));

    if (action.type === 'reply' || action.type === 'greeting') {
      if (action.immediateReply) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        setLiveMessages(prev => [
          ...prev,
          { id: prev.length + 1, from: 'agent', name: 'You', text: action.immediateReply, time: timeStr, _responseId: action.id },
        ]);
      }
      if (hasActionContext) {
        setActionResults({});
      }
      return;
    }

    if (hasActionContext) {
      setActionResults({});
      setUsedActions(new Set([action.id]));
    }

    if (action.immediateReply) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      setLiveMessages(prev => [
        ...prev,
        { id: prev.length + 1, from: 'agent', name: 'You', text: action.immediateReply, time: timeStr, _responseId: action.id },
      ]);
    }

    if (action.toolCall) {
      setActionResults(prev => ({ ...prev, [action.id]: { status: 'loading', toolName: action.toolCall.toolName } }));
      setTimeout(() => {
        setActionResults(prev => ({
          ...prev,
          [action.id]: {
            status: 'complete',
            toolName: action.toolCall.toolName,
            result: action.mockResult,
            resultSummary: action.resultSummary,
            postToolResponse: action.postToolResponse,
          },
        }));
      }, 1800);
    }
  };

  const clearActionContext = () => {
    setActionResults({});
    setUsedActions(new Set());
  };

  const handleSendActionResponse = (actionId) => {
    const result = actionResults[actionId];
    if (!result?.postToolResponse) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    setLiveMessages(prev => [
      ...prev,
      { id: prev.length + 1, from: 'agent', name: 'You', text: result.postToolResponse, time: timeStr, _responseId: actionId },
    ]);
    clearActionContext();
  };

  const handleEditActionResponse = (actionId) => {
    const result = actionResults[actionId];
    if (!result?.postToolResponse) return;
    setComposeText(result.postToolResponse);
    setPendingDraftId(actionId);
  };

  return (
    <div style={{
      flex: 1,
      backgroundColor: colors.background, display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* ─── Header ─── */}
      <div style={{
        padding: '10px 14px', borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', gap: '8px',
        backgroundColor: colors.surface,
      }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: theme.radii.md,
          background: `linear-gradient(135deg, ${theme.colors.purple}, ${theme.colors.blue})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Sparkles size={14} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>
            NextIQ Intelligence
          </div>
          <div style={{ fontSize: '11px', color: colors.textTertiary, marginTop: '2px' }}>
            Context-aware agent assistant
          </div>
        </div>
      </div>

      {/* ─── Voice Mode Banner ─── */}
      {isVoice && (
        <div style={{
          padding: '6px 14px',
          backgroundColor: 'rgba(245, 158, 11, 0.06)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.12)',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Phone size={12} color="#D97706" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#D97706' }}>
            Voice mode
          </span>
          <span style={{ fontSize: '11px', color: colors.textTertiary }}>
            — suggestions are for verbal reference
          </span>
        </div>
      )}

      {/* ─── Autopilot Mode Strip ─── */}
      <div style={{
        padding: '8px 14px',
        backgroundColor: autopilot ? `${theme.colors.blue}06` : colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        transition: theme.transitions.base,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: theme.radii.sm,
            backgroundColor: autopilot ? theme.colors.blueMuted : colors.surfaceHover,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: theme.transitions.base,
          }}>
            <Zap size={14} color={autopilot ? theme.colors.blue : colors.textTertiary} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: autopilot ? theme.colors.blue : colors.text }}>
              Autopilot
            </div>
            <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '2px' }}>
              {autopilot
                ? (countdownSent && autopilotDecision
                    ? (autopilotDecision.type === 'kb' ? 'KB Response sent'
                      : autopilotDecision.type === 'nba_action' ? `Executed: ${autopilotDecision.action.label}`
                      : 'Reply sent')
                    : countdownActive && autopilotDecision
                      ? (autopilotDecision.type === 'kb'
                          ? `Sending KB Response in ${countdown}s`
                          : autopilotDecision.type === 'nba_action'
                            ? `Executing "${autopilotDecision.action.label}" in ${countdown}s`
                            : `Sending reply in ${countdown}s`)
                      : 'Monitoring conversation...')
                : 'Off — manual assist mode'}
            </div>
          </div>
          <div
            onClick={() => setAutopilot(!autopilot)}
            style={{
              display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none',
              gap: '6px', flexShrink: 0,
            }}
          >
            <span style={{
              fontSize: '11px', fontWeight: 600,
              color: autopilot ? theme.colors.blue : colors.textTertiary,
            }}>
              {autopilot ? 'ON' : 'OFF'}
            </span>
            <div style={{
              width: '36px', height: '20px', borderRadius: '10px',
              backgroundColor: autopilot ? theme.colors.blue : colors.surfaceHover,
              border: `1.5px solid ${autopilot ? theme.colors.blue : colors.border}`,
              position: 'relative', transition: theme.transitions.base,
            }}>
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%',
                backgroundColor: '#fff', position: 'absolute', top: '0.5px',
                left: autopilot ? '17px' : '0.5px',
                transition: theme.transitions.base,
                boxShadow: theme.shadows.sm,
              }} />
            </div>
          </div>
        </div>
        {/* Autopilot countdown + action buttons */}
        {autopilot && autopilotDecision && countdownActive && !countdownSent && (
          <>
            <div style={{ padding: '6px 0 2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                color: autopilotDecision.type === 'nba_action' ? theme.colors.success : theme.colors.blue,
                padding: '1px 6px', borderRadius: theme.radii.full,
                backgroundColor: autopilotDecision.type === 'nba_action' ? theme.colors.successMuted : theme.colors.blueMuted,
              }}>
                {autopilotDecision.type === 'kb' ? 'KB Response' : autopilotDecision.type === 'nba_action' ? 'Action' : 'Reply'}
              </span>
              <span style={{ fontSize: '11px', color: colors.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {autopilotDecision.type === 'kb' ? autopilotDecision.action.source : autopilotDecision.action.label}
              </span>
            </div>
            <div style={{ padding: '4px 0' }}>
              <div style={{ width: '100%', height: '3px', borderRadius: '2px', backgroundColor: colors.surfaceHover, overflow: 'hidden' }}>
                <div style={{
                  width: `${((COUNTDOWN_TOTAL - countdown) / COUNTDOWN_TOTAL) * 100}%`,
                  height: '100%', borderRadius: '2px',
                  backgroundColor: autopilotDecision.type === 'nba_action' ? theme.colors.success : theme.colors.blue,
                  transition: 'width 1s linear',
                }} />
              </div>
            </div>
            {isVoice && autopilotDecision.type !== 'nba_action' && (
              <div style={{
                padding: '4px 0 2px',
                fontSize: '10px', fontWeight: 600, color: '#D97706',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <Mic size={10} /> Say this to the customer:
              </div>
            )}
            <div style={{ display: 'flex', gap: '6px', paddingTop: '4px' }}>
              <button onClick={handleApproveNow} style={{
                flex: 2, padding: '6px 10px', borderRadius: theme.radii.md,
                border: 'none',
                backgroundColor: autopilotDecision.type === 'nba_action' ? theme.colors.success
                  : (isVoice ? theme.colors.success : theme.colors.blue),
                color: '#fff', fontSize: '11px', fontWeight: 600, fontFamily: theme.fonts.body,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              }}>
                {autopilotDecision.type === 'nba_action'
                  ? <><Zap size={11} /> Execute Now</>
                  : isVoice
                    ? <><Check size={11} /> Done — Communicated</>
                    : <><Send size={11} /> Send Now</>
                }
              </button>
              {!isVoice && (
                <button onClick={handleEditAutopilotDraft} style={{
                  flex: 1, padding: '6px 10px', borderRadius: theme.radii.md,
                  border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                  color: colors.text, fontSize: '11px', fontWeight: 600, fontFamily: theme.fonts.body,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                }}>
                  <Edit3 size={11} /> Edit
                </button>
              )}
              <button onClick={handleCancelCountdown} style={{
                padding: '6px 10px', borderRadius: theme.radii.md,
                border: `1px solid ${theme.colors.error}30`, backgroundColor: theme.colors.errorMuted,
                color: theme.colors.error, fontSize: '11px', fontWeight: 600, fontFamily: theme.fonts.body,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              }}>
                <X size={11} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ─── Copilot Chat Thread ─── */}
      <div ref={threadScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
        {threadEntries.map((entry, idx) => {
          const isLastTrigger = idx === lastTriggerIdx;

          // ── Customer message or Agent-to-NextIQ query ──
          if (entry.entryType === 'customer-msg') {
            const sug = perMessageSuggestions[entry.id];
            const msgKb = sug?.kbResponse;
            const msgNba = sug?.nba || [];
            const msgClassification = sug?.classification;
            const msgChosenId = sug?.chosenId;
            const hasSuggestions = msgKb || msgNba.length > 0;
            const isIqQuery = !!entry.type;

            return (
              <div key={entry.id} ref={isLastTrigger ? latestTriggerRef : null}>
                {/* The message bubble */}
                <div style={{ padding: '5px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{
                      width: '26px', height: '26px',
                      borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                      background: isIqQuery
                        ? `linear-gradient(135deg, ${theme.colors.blue}, ${theme.colors.purple})`
                        : (conversation?.gradient || `linear-gradient(135deg, ${theme.colors.blue}, ${theme.colors.purple})`),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>
                        {isIqQuery ? 'You' : (entry.name || 'C').split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>
                          {isIqQuery ? 'You → NextIQ' : entry.name}
                        </span>
                        <span style={{ fontSize: '11px', color: colors.textTertiary }}>{entry.time}</span>
                        {entry.sentiment && (
                          <span style={{
                            fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: theme.radii.full,
                            backgroundColor: entry.sentiment === 'Negative' ? theme.colors.errorMuted
                              : entry.sentiment === 'Positive' ? theme.colors.successMuted : colors.surfaceHover,
                            color: entry.sentiment === 'Negative' ? theme.colors.error
                              : entry.sentiment === 'Positive' ? theme.colors.success : colors.textSecondary,
                          }}>{entry.sentiment}</span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.55, color: colors.text }}>
                        {entry.text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* NextIQ Suggestion — unified card */}
                {hasSuggestions && (() => {
                  const isHistoricExpanded = isLastTrigger || expandedHistoricSuggestions[entry.id];
                  return (
                  <div style={{ padding: '3px 14px 5px', paddingLeft: '46px' }}>
                    <div style={{
                      borderRadius: theme.radii.lg, overflow: 'hidden',
                      border: `1px solid ${isLastTrigger ? `${theme.colors.purple}25` : colors.border}`,
                      backgroundColor: isLastTrigger ? `${theme.colors.purple}03` : colors.surface,
                    }}>
                      {/* Suggestion header */}
                      <div
                        onClick={!isLastTrigger ? () => setExpandedHistoricSuggestions(prev => ({ ...prev, [entry.id]: !prev[entry.id] })) : undefined}
                        style={{
                          padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px',
                          background: `linear-gradient(135deg, ${theme.colors.purple}08, ${theme.colors.blue}08)`,
                          borderBottom: isHistoricExpanded ? `1px solid ${colors.border}` : 'none',
                          cursor: !isLastTrigger ? 'pointer' : 'default',
                          userSelect: !isLastTrigger ? 'none' : 'auto',
                        }}
                      >
                        {!isLastTrigger && (
                          isHistoricExpanded
                            ? <ChevronDown size={12} color={theme.colors.purple} />
                            : <ChevronRight size={12} color={theme.colors.purple} />
                        )}
                        <Sparkles size={13} color={theme.colors.purple} />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: theme.colors.purple }}>
                          NextIQ
                        </span>
                        {msgClassification?.intent && (
                          <span style={{
                            fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: theme.radii.full,
                            backgroundColor: `${theme.colors.purple}10`, color: theme.colors.purple,
                            fontFamily: 'monospace', letterSpacing: '-0.3px',
                          }}>
                            {msgClassification.intent}
                          </span>
                        )}
                        <span style={{ flex: 1 }} />
                        <span style={{
                          fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: theme.radii.full,
                          backgroundColor: msgClassification?.mode === 'nba' ? theme.colors.purpleMuted
                            : msgClassification?.mode === 'kb_response' ? theme.colors.blueMuted
                            : `${theme.colors.purple}10`,
                          color: msgClassification?.mode === 'nba' ? theme.colors.purple
                            : msgClassification?.mode === 'kb_response' ? theme.colors.blue
                            : theme.colors.purple,
                        }}>
                          {msgClassification?.mode === 'nba' ? 'NBA Only'
                            : msgClassification?.mode === 'kb_response' ? 'KB Only'
                            : 'KB + NBA'}
                        </span>
                      </div>

                      {isHistoricExpanded && (<>
                      {/* Knowledge Base Response */}
                      {msgKb && (() => {
                        const kbChosen = msgChosenId && msgChosenId === msgKb.id;
                        const kbDimmed = msgChosenId && !kbChosen;
                        const autopilotCountingDownForAny = isLastTrigger && autopilot && countdownActive && !countdownSent && autopilotDecision;
                        const kbAutopilotTarget = autopilotCountingDownForAny && autopilotDecision?.type === 'kb';
                        const kbAutopilotDimmed = autopilotCountingDownForAny && !kbAutopilotTarget;
                        const autopilotProgress = kbAutopilotTarget ? ((COUNTDOWN_TOTAL - countdown) / COUNTDOWN_TOTAL) * 100 : 0;
                        return (
                        <div ref={kbAutopilotTarget ? autopilotTargetRef : undefined} style={{
                          borderBottom: msgNba.length > 0 ? `1px solid ${colors.border}` : 'none',
                          backgroundColor: kbAutopilotTarget ? `${theme.colors.blue}08` : kbChosen ? `${theme.colors.success}04` : 'transparent',
                          position: 'relative',
                          opacity: kbAutopilotDimmed ? 0.4 : kbDimmed ? 0.5 : 1,
                          transition: 'background-color 0.2s ease, opacity 0.25s ease',
                          animation: kbAutopilotTarget ? 'autopilotPulse 1.8s ease-in-out infinite' : 'none',
                          overflow: 'visible',
                        }}>
                          {kbAutopilotTarget && <AutopilotBorderOverlay progress={autopilotProgress} borderRadius="0px" />}
                          {kbChosen && (
                            <div style={{
                              position: 'absolute', top: 0, right: 0,
                              backgroundColor: theme.colors.success, color: '#fff',
                              fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px',
                              padding: '2px 8px', borderBottomLeftRadius: theme.radii.sm,
                              display: 'flex', alignItems: 'center', gap: '3px', zIndex: 1,
                            }}>
                              <CheckCircle size={8} /> CHOSEN
                            </div>
                          )}
                          <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {isVoice ? <Mic size={12} color="#D97706" /> : <BookOpen size={12} color={theme.colors.blue} />}
                            <span style={{ fontSize: '11px', fontWeight: 700, color: isVoice ? '#D97706' : theme.colors.blue }}>
                              {isVoice ? 'SUGGESTED TALK TRACK' : 'KNOWLEDGE BASE RESPONSE'}
                            </span>
                            <span style={{
                              fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: theme.radii.full,
                              backgroundColor: msgKb.confidence >= 80 ? theme.colors.successMuted : msgKb.confidence >= 50 ? theme.colors.warningMuted : theme.colors.errorMuted,
                              color: msgKb.confidence >= 80 ? theme.colors.success : msgKb.confidence >= 50 ? theme.colors.warning : theme.colors.error,
                            }}>{msgKb.confidence}%</span>
                            {kbAutopilotDimmed && (
                              <span style={{ fontSize: '10px', color: colors.textTertiary, marginLeft: 'auto', fontStyle: 'italic' }}>Minimized — NBA chosen</span>
                            )}
                          </div>
                          {!kbAutopilotDimmed && (
                          <div style={{ padding: '0 12px 10px' }}>
                            <p style={{
                              margin: 0, fontSize: '13px', lineHeight: 1.6, color: colors.text,
                              whiteSpace: 'pre-wrap',
                            }}>
                              {msgKb.response}
                            </p>

                            {msgKb.reasoning && (
                              <div style={{
                                marginTop: '10px', padding: '10px 12px',
                                backgroundColor: `${theme.colors.purple}06`,
                                borderRadius: theme.radii.md,
                                border: `1px solid ${theme.colors.purple}15`,
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                                  <Brain size={11} color={theme.colors.purple} />
                                  <span style={{
                                    fontSize: '10px', fontWeight: 700, color: theme.colors.purple,
                                    letterSpacing: '0.5px', textTransform: 'uppercase',
                                  }}>Why this KB match</span>
                                </div>
                                <p style={{
                                  margin: 0, fontSize: '12px', lineHeight: 1.55,
                                  color: colors.textSecondary,
                                }}>
                                  {msgKb.reasoning}
                                </p>
                              </div>
                            )}

                            {msgKb.sourceArticles && msgKb.sourceArticles.length > 0 ? (
                              <div style={{ marginTop: '10px' }}>
                                <div
                                  onClick={() => setExpandedSources(prev => ({ ...prev, [entry.id]: !prev[entry.id] }))}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: '5px',
                                    cursor: 'pointer', userSelect: 'none',
                                  }}
                                >
                                  {expandedSources[entry.id]
                                    ? <ChevronDown size={12} color={colors.textSecondary} />
                                    : <ChevronRight size={12} color={colors.textSecondary} />
                                  }
                                  <FileText size={11} color={colors.textSecondary} />
                                  <span style={{
                                    fontSize: '10px', fontWeight: 700, color: colors.textSecondary,
                                    letterSpacing: '0.5px', textTransform: 'uppercase',
                                  }}>Source Articles</span>
                                  <span style={{
                                    fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: theme.radii.full,
                                    backgroundColor: colors.surfaceHover, color: colors.textTertiary,
                                  }}>{msgKb.sourceArticles.length}</span>
                                </div>
                                {expandedSources[entry.id] && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                                  {msgKb.sourceArticles.map((article, ai) => (
                                    <div key={ai} style={{
                                      display: 'flex', alignItems: 'center', gap: '8px',
                                      padding: '6px 10px', borderRadius: theme.radii.sm,
                                      backgroundColor: colors.surfaceHover,
                                      cursor: 'pointer', transition: `background ${theme.transitions.fast}`,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.surfaceActive}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = colors.surfaceHover}
                                    >
                                      <BookOpen size={11} color={theme.colors.blue} style={{ flexShrink: 0 }} />
                                      <span style={{
                                        fontSize: '11px', color: theme.colors.blue, fontWeight: 500,
                                        flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                      }}>{article.id}</span>
                                      <span style={{
                                        fontSize: '11px', color: colors.textSecondary,
                                        flex: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                      }}>{article.title}</span>
                                      <span style={{
                                        fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: theme.radii.full,
                                        backgroundColor: article.relevance >= 90 ? theme.colors.successMuted : theme.colors.blueMuted,
                                        color: article.relevance >= 90 ? theme.colors.success : theme.colors.blue,
                                        flexShrink: 0,
                                      }}>{article.relevance}%</span>
                                    </div>
                                  ))}
                                </div>
                                )}
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
                                <BookOpen size={10} color={colors.textTertiary} />
                                <span style={{ fontSize: '11px', color: colors.textTertiary }}>{msgKb.source}</span>
                              </div>
                            )}
                          </div>
                          )}

                          {/* Action buttons (latest only) */}
                          {!kbAutopilotDimmed && isLastTrigger && !kbChosen && (
                            <>
                              {autopilot && autopilotDecision?.type === 'kb' && (countdownActive || countdownSent) ? (
                                <div style={{
                                  padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px',
                                  backgroundColor: countdownSent ? `${theme.colors.success}06` : `${theme.colors.blue}06`,
                                  borderTop: `1px solid ${colors.border}`,
                                }}>
                                  <Zap size={12} color={countdownSent ? theme.colors.success : theme.colors.blue} />
                                  <span style={{ fontSize: '11px', fontWeight: 600, color: countdownSent ? theme.colors.success : theme.colors.blue }}>
                                    {countdownSent
                                      ? (isVoice ? 'Communicated by agent' : 'Sent by Autopilot')
                                      : (isVoice ? `Say this to customer — ${countdown}s` : `Autopilot sending in ${countdown}s`)}
                                  </span>
                                </div>
                              ) : !autopilot && (
                                <div style={{ padding: '8px 12px 10px', display: 'flex', gap: '6px' }}>
                                  {isVoice ? (
                                    <>
                                      <button onClick={() => { navigator.clipboard?.writeText(kbResponse?.response || ''); }} style={{
                                        flex: 1, padding: '8px 12px', borderRadius: theme.radii.md,
                                        border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                                        color: colors.text, fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                      }}>
                                        <Copy size={12} /> Copy
                                      </button>
                                      <button onClick={handleSendAsReply} style={{
                                        flex: 1, padding: '8px 12px', borderRadius: theme.radii.md,
                                        border: 'none', backgroundColor: theme.colors.success, color: '#fff',
                                        fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                      }}>
                                        <Check size={12} /> Mark as Communicated
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={handleSendAsReply} style={{
                                        flex: 1, padding: '8px 12px', borderRadius: theme.radii.md,
                                        border: 'none', backgroundColor: theme.colors.blue, color: '#fff',
                                        fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                      }}>
                                        <Send size={12} /> Send
                                      </button>
                                      <button onClick={handleEditDraft} style={{
                                        flex: 1, padding: '8px 12px', borderRadius: theme.radii.md,
                                        border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                                        color: colors.text, fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                      }}>
                                        <Edit3 size={12} /> Edit
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                          {/* (horizontal bar removed — conic border overlay is used instead) */}
                        </div>
                        );
                      })()}

                      {/* Next Best Actions */}
                      {msgNba.length > 0 && (
                        <div style={{ padding: '8px 12px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <Brain size={12} color={theme.colors.purple} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.purple }}>NEXT BEST ACTIONS</span>
                            <span style={{
                              fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: theme.radii.full,
                              backgroundColor: theme.colors.purpleMuted, color: theme.colors.purple, marginLeft: 'auto',
                            }}>{Math.min(msgNba.length, 3)}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {msgNba.slice(0, 3).map((action) => {
                              const typeConf = nbaTypeConfig[action.type] || nbaTypeConfig.action;
                              const prioConf = priorityConfig[action.priority] || priorityConfig.medium;
                              const TypeIcon = typeConf.icon;
                              const nbaChosen = msgChosenId && msgChosenId === action.id;
                              const isUsed = usedActions.has(action.id);
                              const aResult = actionResults[action.id];
                              const isExecuting = aResult?.status === 'loading';
                              const isComplete = aResult?.status === 'complete';
                              const isHovered = hoveredAction === action.id;
                              const isToolAction = action.type === 'action' || action.type === 'escalation';
                              const isReplyAction = action.type === 'reply' || action.type === 'greeting';
                              const isExpandable = true;
                              const autopilotCountingDown = isLastTrigger && autopilot && countdownActive && !countdownSent && autopilotDecision;
                              const nbaAutopilotTarget = autopilotCountingDown && autopilotDecision.type !== 'kb' && autopilotDecision.action?.id === action.id;
                              const showExpanded = isHovered || isUsed || isExecuting || isComplete || nbaAutopilotTarget;
                              const isDone = isComplete || (isUsed && isReplyAction);
                              const nbaAutopilotDimmed = autopilotCountingDown && !nbaAutopilotTarget;
                              const nbaAutopilotProgress = nbaAutopilotTarget ? ((COUNTDOWN_TOTAL - countdown) / COUNTDOWN_TOTAL) * 100 : 0;
                              return (
                                <div key={action.id}
                                  ref={nbaAutopilotTarget ? autopilotTargetRef : undefined}
                                  onMouseEnter={() => !isDone && !isExecuting && !isComplete && handleNbaMouseEnter(action.id)}
                                  onMouseLeave={handleNbaMouseLeave}
                                  style={{
                                    borderRadius: theme.radii.md, overflow: 'visible', position: 'relative',
                                    border: `1px solid ${nbaAutopilotTarget ? 'transparent' : nbaChosen ? `${theme.colors.success}30` : isDone ? `${theme.colors.success}30` : isExecuting ? `${theme.colors.blue}30` : isHovered ? `${typeConf.color}40` : isUsed ? `${theme.colors.success}25` : colors.border}`,
                                    backgroundColor: nbaAutopilotTarget ? `${theme.colors.blue}08` : nbaChosen ? `${theme.colors.success}06` : isDone ? `${theme.colors.success}04` : isHovered ? `${typeConf.color}04` : isUsed ? `${theme.colors.success}05` : colors.surface,
                                    opacity: nbaAutopilotDimmed ? 0.4 : (msgChosenId && !nbaChosen && !nbaAutopilotTarget) ? 0.5 : 1,
                                    transition: 'border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
                                    animation: nbaAutopilotTarget ? 'autopilotPulse 1.8s ease-in-out infinite' : 'none',
                                  }}>
                                  {nbaAutopilotTarget && <AutopilotBorderOverlay progress={nbaAutopilotProgress} borderRadius={theme.radii.md} />}
                                  {nbaChosen && (
                                    <div style={{
                                      position: 'absolute', top: 0, right: 0,
                                      backgroundColor: theme.colors.success, color: '#fff',
                                      fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px',
                                      padding: '2px 8px', borderBottomLeftRadius: theme.radii.sm,
                                      display: 'flex', alignItems: 'center', gap: '3px', zIndex: 1,
                                    }}>
                                      <CheckCircle size={8} /> CHOSEN
                                    </div>
                                  )}
                                  {/* Compact header row -- always visible */}
                                  <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '7px 10px',
                                    opacity: isUsed && !isDone && !nbaChosen ? 0.7 : 1,
                                  }}>
                                    <div style={{
                                      width: '22px', height: '22px', borderRadius: theme.radii.xs,
                                      backgroundColor: isDone ? theme.colors.successMuted : isExecuting ? `${theme.colors.blue}15` : typeConf.bg,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                      {isDone ? <Check size={11} color={theme.colors.success} />
                                        : isExecuting ? <Cpu size={11} color={theme.colors.blue} style={{ animation: 'spin 1s linear infinite' }} />
                                        : <TypeIcon size={11} color={typeConf.color} />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                                        <span style={{
                                          fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                                          color: typeConf.color, padding: '1px 5px', borderRadius: theme.radii.full, backgroundColor: typeConf.bg,
                                        }}>{typeConf.label}</span>
                                        <span style={{ fontSize: '10px', fontWeight: 600, color: prioConf.color }}>● {prioConf.label}</span>
                                      </div>
                                      <div style={{ fontSize: '12px', lineHeight: 1.45, color: colors.text, marginTop: '2px' }}>
                                        {action.label}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Expanded on hover: reply/greeting shows full message + Send/Edit */}
                                  {isReplyAction && !isDone && (
                                    <div style={{
                                      maxHeight: showExpanded ? '300px' : '0px',
                                      opacity: showExpanded ? 1 : 0,
                                      overflow: 'hidden',
                                      transition: 'max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
                                    }}>
                                      <div style={{ padding: '0 10px 10px' }}>
                                        <p style={{
                                          margin: 0, fontSize: '12.5px', lineHeight: 1.6, color: colors.text,
                                          whiteSpace: 'pre-wrap',
                                        }}>
                                          {action.immediateReply}
                                        </p>
                                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                          {isVoice ? (
                                            <>
                                              <button
                                                onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(action.immediateReply || ''); }}
                                                style={{
                                                  padding: '7px 12px', borderRadius: theme.radii.md,
                                                  border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                                                  color: colors.text, fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                                }}
                                              >
                                                <Copy size={12} /> Copy
                                              </button>
                                              <button
                                                onClick={(e) => { e.stopPropagation(); handleUseAction(action); }}
                                                style={{
                                                  flex: 1, padding: '7px 12px', borderRadius: theme.radii.md,
                                                  border: 'none', backgroundColor: theme.colors.success, color: '#fff',
                                                  fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                                }}
                                              >
                                                <Check size={12} /> Mark as Communicated
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                onClick={(e) => { e.stopPropagation(); handleUseAction(action); }}
                                                style={{
                                                  flex: 1, padding: '7px 12px', borderRadius: theme.radii.md,
                                                  border: 'none', backgroundColor: theme.colors.blue, color: '#fff',
                                                  fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                                }}
                                              >
                                                <Send size={12} /> Send
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setComposeText(action.immediateReply);
                                                  setPendingDraftId(action.id);
                                                  setUsedActions(prev => new Set([...prev, action.id]));
                                                }}
                                                style={{
                                                  flex: 1, padding: '7px 12px', borderRadius: theme.radii.md,
                                                  border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                                                  color: colors.text, fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                                }}
                                              >
                                                <Edit3 size={12} /> Edit
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Reply/greeting: sent/communicated confirmation */}
                                  {isReplyAction && isDone && (
                                    <div style={{ padding: '0 10px 8px' }}>
                                      <span style={{ fontSize: '11px', color: theme.colors.success, fontWeight: 600 }}>
                                        {isVoice ? 'Communicated verbally' : 'Sent to customer'}
                                      </span>
                                    </div>
                                  )}

                                  {/* Expanded on hover: action shows message + tool + Execute */}
                                  {isToolAction && !isExecuting && !isComplete && !isUsed && (
                                    <div style={{
                                      maxHeight: showExpanded ? '400px' : '0px',
                                      opacity: showExpanded ? 1 : 0,
                                      overflow: 'hidden',
                                      transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
                                    }}>
                                      <div style={{ padding: '0 10px 10px' }}>
                                        {action.immediateReply && (
                                          <p style={{
                                            margin: '0 0 8px', fontSize: '12.5px', lineHeight: 1.6, color: colors.text,
                                            whiteSpace: 'pre-wrap',
                                          }}>
                                            {action.immediateReply}
                                          </p>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          {action.toolCall && (
                                            <span style={{
                                              fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: theme.radii.full,
                                              backgroundColor: `${theme.colors.success}10`, color: theme.colors.success,
                                              display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0,
                                            }}>
                                              <Cpu size={9} /> {action.toolCall.toolName}
                                            </span>
                                          )}
                                          <button
                                            onClick={(e) => { e.stopPropagation(); handleUseAction(action); }}
                                            style={{
                                              padding: '5px 14px', borderRadius: theme.radii.sm,
                                              border: 'none', backgroundColor: theme.colors.success, color: '#fff',
                                              fontSize: '11px', fontWeight: 700, fontFamily: theme.fonts.body,
                                              cursor: 'pointer', flexShrink: 0, marginLeft: 'auto',
                                              display: 'flex', alignItems: 'center', gap: '4px',
                                            }}
                                          >
                                            <Zap size={10} /> Execute
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Loading state */}
                                  {isExecuting && (
                                    <div style={{
                                      padding: '8px 12px', borderTop: `1px solid ${colors.border}`,
                                      display: 'flex', alignItems: 'center', gap: '8px',
                                      backgroundColor: `${theme.colors.blue}04`,
                                    }}>
                                      <div style={{
                                        width: '14px', height: '14px', borderRadius: '50%',
                                        border: `2px solid ${theme.colors.blue}30`,
                                        borderTopColor: theme.colors.blue,
                                        animation: 'spin 0.8s linear infinite',
                                      }} />
                                      <span style={{ fontSize: '11px', color: theme.colors.blue, fontWeight: 600 }}>
                                        Running {aResult.toolName}...
                                      </span>
                                    </div>
                                  )}

                                  {/* Action result + AI suggested response */}
                                  {isComplete && (
                                    <>
                                      <div style={{
                                        padding: '8px 12px', borderTop: `1px solid ${theme.colors.success}20`,
                                        backgroundColor: `${theme.colors.success}04`,
                                      }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                                          <CheckCircle size={10} color={theme.colors.success} />
                                          <span style={{ fontSize: '10px', fontWeight: 700, color: theme.colors.success, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                                            Action Result
                                          </span>
                                        </div>
                                        {aResult.resultSummary ? (
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                            {aResult.resultSummary.map((item, si) => (
                                              <div key={si} style={{
                                                padding: '5px 8px', borderRadius: theme.radii.sm,
                                                backgroundColor: colors.surfaceHover,
                                              }}>
                                                <div style={{
                                                  fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                                                  color: colors.textTertiary, letterSpacing: '0.3px', marginBottom: '2px',
                                                }}>{item.label}</div>
                                                <div style={{
                                                  fontSize: '12px', fontWeight: 600,
                                                  color: item.status === 'success' ? theme.colors.success
                                                    : item.status === 'warning' ? theme.colors.warning
                                                    : item.status === 'error' ? theme.colors.error
                                                    : colors.text,
                                                }}>{item.value}</div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <p style={{
                                            margin: 0, fontSize: '12px', lineHeight: 1.5, color: colors.textSecondary,
                                          }}>
                                            {typeof aResult.result === 'object'
                                              ? Object.entries(aResult.result).map(([k, v]) => `${k}: ${v}`).join(' · ')
                                              : aResult.result}
                                          </p>
                                        )}
                                      </div>
                                      {aResult.postToolResponse && (
                                        <div style={{
                                          padding: '8px 12px', borderTop: `1px solid ${theme.colors.purple}15`,
                                          backgroundColor: `${theme.colors.purple}04`,
                                        }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                                            <Sparkles size={10} color={theme.colors.purple} />
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: theme.colors.purple, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                                              AI Suggested Response
                                            </span>
                                          </div>
                                          <p style={{
                                            margin: 0, fontSize: '12px', lineHeight: 1.55, color: colors.text,
                                            whiteSpace: 'pre-wrap',
                                          }}>
                                            {aResult.postToolResponse}
                                          </p>
                                          {isLastTrigger && (
                                            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                              {isVoice ? (
                                                <>
                                                  <button onClick={() => { navigator.clipboard?.writeText(aResult.postToolResponse || ''); }} style={{
                                                    padding: '6px 10px', borderRadius: theme.radii.md,
                                                    border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                                                    color: colors.text, fontSize: '11px', fontWeight: 600, fontFamily: theme.fonts.body,
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                                  }}>
                                                    <Copy size={10} /> Copy
                                                  </button>
                                                  <button onClick={() => handleSendActionResponse(action.id)} style={{
                                                    flex: 1, padding: '6px 10px', borderRadius: theme.radii.md,
                                                    border: 'none', backgroundColor: theme.colors.success, color: '#fff',
                                                    fontSize: '11px', fontWeight: 600, fontFamily: theme.fonts.body,
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                                  }}>
                                                    <Check size={10} /> Mark as Communicated
                                                  </button>
                                                </>
                                              ) : (
                                                <>
                                                  <button onClick={() => handleSendActionResponse(action.id)} style={{
                                                    flex: 1, padding: '6px 10px', borderRadius: theme.radii.md,
                                                    border: 'none', backgroundColor: theme.colors.blue, color: '#fff',
                                                    fontSize: '11px', fontWeight: 600, fontFamily: theme.fonts.body,
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                                  }}>
                                                    <Send size={10} /> Send
                                                  </button>
                                                  <button onClick={() => handleEditActionResponse(action.id)} style={{
                                                    flex: 1, padding: '6px 10px', borderRadius: theme.radii.md,
                                                    border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                                                    color: colors.text, fontSize: '11px', fontWeight: 600, fontFamily: theme.fonts.body,
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                                  }}>
                                                    <Edit3 size={10} /> Edit
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {/* (horizontal bar removed — conic border overlay is used instead) */}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      </>)}
                    </div>
                  </div>
                  );
                })()}
              </div>
            );
          }

          // ── Agent / Autopilot response (full conversational bubble) ──
          if (entry.entryType === 'agent-msg') {
            return (
              <div key={entry.id} style={{ padding: '5px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                    backgroundColor: entry.autopilot ? theme.colors.blueMuted : theme.colors.successMuted,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {entry.autopilot
                      ? <Zap size={13} color={theme.colors.blue} />
                      : <span style={{ fontSize: '10px', fontWeight: 700, color: theme.colors.success }}>AR</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>
                        {entry.autopilot ? 'Autopilot' : 'You'}
                      </span>
                      <span style={{ fontSize: '11px', color: colors.textTertiary }}>{entry.time}</span>
                      {entry.autopilot && (
                        <span style={{
                          fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: theme.radii.full,
                          backgroundColor: theme.colors.blueMuted, color: theme.colors.blue,
                        }}>Auto</span>
                      )}
                    </div>
                    <div style={{
                      padding: '10px 12px', borderRadius: '2px 10px 10px 10px',
                      backgroundColor: entry.autopilot ? `${theme.colors.blue}06` : colors.surface,
                      border: `1px solid ${entry.autopilot ? `${theme.colors.blue}15` : colors.border}`,
                    }}>
                      <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.55, color: colors.text }}>
                        {entry.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // ── NextIQ AI Response (to agent query) ──
          if (entry.entryType === 'iq-response') {
            return (
              <div key={entry.id} style={{ padding: '3px 14px', paddingLeft: '46px' }}>
                <div style={{
                  padding: '10px 12px', borderRadius: theme.radii.lg,
                  backgroundColor: `${theme.colors.purple}04`,
                  border: `1px solid ${theme.colors.purple}15`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                    <Sparkles size={12} color={theme.colors.purple} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.purple }}>NextIQ</span>
                    <span style={{ fontSize: '11px', color: colors.textTertiary }}>{entry.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: colors.text, whiteSpace: 'pre-wrap' }}>{entry.text}</p>
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* ─── Active Action Block: tool results + post-action NBAs ─── */}
        {hasActionContext && (() => {
          const completedEntries = Object.entries(actionResults).filter(([, r]) => r.status === 'complete');
          const loadingEntries = Object.entries(actionResults).filter(([, r]) => r.status === 'loading');
          const postActionNbas = getPostActionNBAs(completedActions, customerCtx);
          if (completedEntries.length === 0 && loadingEntries.length === 0) return null;
          return (
            <div ref={activeActionRef} style={{ padding: '8px 14px 4px' }}>
              <div style={{
                borderRadius: theme.radii.lg, overflow: 'hidden',
                border: `1.5px solid ${theme.colors.success}30`,
                backgroundColor: `${theme.colors.success}03`,
                boxShadow: `0 0 12px ${theme.colors.success}08`,
              }}>
                {/* Header */}
                <div style={{
                  padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px',
                  background: `linear-gradient(135deg, ${theme.colors.success}10, ${theme.colors.purple}08)`,
                  borderBottom: `1px solid ${theme.colors.success}15`,
                }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.colors.success,
                    animation: 'autopilotGlow 1.5s ease-in-out infinite',
                  }} />
                  <Zap size={12} color={theme.colors.success} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.success, letterSpacing: '0.3px' }}>
                    ACTION COMPLETE
                  </span>
                </div>

                {/* Loading state */}
                {loadingEntries.map(([actionId, res]) => (
                  <div key={actionId} style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={14} color={theme.colors.blue} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                      Running {res.toolName}...
                    </span>
                  </div>
                ))}

                {/* Completed tool results */}
                {completedEntries.map(([actionId, res]) => (
                  <div key={actionId} style={{ padding: '10px 12px', borderBottom: postActionNbas.length > 0 ? `1px solid ${colors.border}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <CheckCircle size={12} color={theme.colors.success} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.success }}>{res.toolName}</span>
                    </div>
                    {res.resultSummary && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {res.resultSummary.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: theme.radii.sm, backgroundColor: colors.inputBackground }}>
                            <span style={{ fontSize: '11px', color: colors.textSecondary, minWidth: '100px' }}>{item.label}</span>
                            <span style={{
                              fontSize: '11px', fontWeight: 600,
                              color: item.status === 'success' ? theme.colors.success : item.status === 'warning' ? theme.colors.warning : colors.text,
                            }}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Post-action NBAs — always expanded, fully interactive */}
                {postActionNbas.length > 0 && (
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Brain size={12} color={theme.colors.purple} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: theme.colors.purple }}>SUGGESTED NEXT STEPS</span>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: theme.radii.full,
                        backgroundColor: theme.colors.purpleMuted, color: theme.colors.purple, marginLeft: 'auto',
                      }}>{postActionNbas.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {postActionNbas.map((action, actionIdx) => {
                        const typeConf = nbaTypeConfig[action.type] || nbaTypeConfig.action;
                        const prioConf = priorityConfig[action.priority] || priorityConfig.medium;
                        const TypeIcon = typeConf.icon;
                        const isActionUsed = usedActions.has(action.id);
                        const aResult = actionResults[action.id];
                        const isExec = aResult?.status === 'loading';
                        const isComp = aResult?.status === 'complete';
                        const isDone = isComp || (isActionUsed && (action.type === 'reply' || action.type === 'greeting'));
                        const isTopPick = actionIdx === 0 && !isDone;
                        const isHoveredHere = hoveredAction === `active-${action.id}`;
                        const showBody = isTopPick || isHoveredHere || isDone || isExec;
                        return (
                          <div key={action.id}
                            onMouseEnter={() => !isDone && !isExec && setHoveredAction(`active-${action.id}`)}
                            onMouseLeave={() => setHoveredAction(null)}
                            style={{
                            borderRadius: theme.radii.md, overflow: 'hidden',
                            border: `1px solid ${isDone ? `${theme.colors.success}30` : isExec ? `${theme.colors.blue}30` : isTopPick ? `${typeConf.color}35` : isHoveredHere ? `${typeConf.color}30` : colors.border}`,
                            backgroundColor: isDone ? `${theme.colors.success}04` : isExec ? `${theme.colors.blue}04` : isTopPick ? `${typeConf.color}04` : isHoveredHere ? `${typeConf.color}03` : colors.surface,
                            transition: 'border-color 0.2s ease, background-color 0.2s ease',
                          }}>
                            {/* NBA header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px' }}>
                              <div style={{
                                width: '22px', height: '22px', borderRadius: theme.radii.xs,
                                backgroundColor: isDone ? theme.colors.successMuted : isExec ? `${theme.colors.blue}15` : typeConf.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                              }}>
                                {isDone ? <Check size={11} color={theme.colors.success} />
                                  : isExec ? <Cpu size={11} color={theme.colors.blue} style={{ animation: 'spin 1s linear infinite' }} />
                                  : <TypeIcon size={11} color={typeConf.color} />}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                                  <span style={{
                                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                                    color: typeConf.color, padding: '1px 5px', borderRadius: theme.radii.full, backgroundColor: typeConf.bg,
                                  }}>{typeConf.label}</span>
                                  <span style={{ fontSize: '10px', fontWeight: 600, color: prioConf.color }}>● {prioConf.label}</span>
                                </div>
                                <div style={{ fontSize: '12px', lineHeight: 1.45, color: colors.text, marginTop: '2px' }}>
                                  {action.label}
                                </div>
                              </div>
                            </div>
                            {/* Expandable body: auto-expanded for top pick, hover for rest */}
                            <div style={{
                              maxHeight: showBody ? '400px' : '0px',
                              opacity: showBody ? 1 : 0,
                              overflow: 'hidden',
                              transition: 'max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
                            }}>
                            {/* Pure reply (no tool call) */}
                            {!isDone && !isExec && action.immediateReply && !action.toolCall && (
                              <div style={{ padding: '0 10px 10px' }}>
                                <p style={{
                                  margin: 0, fontSize: '12.5px', lineHeight: 1.6, color: colors.text,
                                  whiteSpace: 'pre-wrap',
                                }}>{action.immediateReply}</p>
                                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                  {isVoice ? (
                                    <>
                                      <button
                                        onClick={() => navigator.clipboard?.writeText(action.immediateReply || '')}
                                        style={{
                                          padding: '7px 12px', borderRadius: theme.radii.md,
                                          border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                                          color: colors.text, fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                        }}
                                      >
                                        <Copy size={12} /> Copy
                                      </button>
                                      <button
                                        onClick={() => handleUseAction(action)}
                                        style={{
                                          flex: 1, padding: '7px 12px', borderRadius: theme.radii.md,
                                          border: 'none', backgroundColor: theme.colors.success, color: '#fff',
                                          fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                        }}
                                      >
                                        <Check size={12} /> Mark as Communicated
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleUseAction(action)}
                                        style={{
                                          flex: 1, padding: '7px 12px', borderRadius: theme.radii.md,
                                          border: 'none', backgroundColor: theme.colors.blue, color: '#fff',
                                          fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                        }}
                                      >
                                        <Send size={12} /> Send
                                      </button>
                                      <button
                                        onClick={() => {
                                          setComposeText(action.immediateReply);
                                          setPendingDraftId(action.id);
                                        }}
                                        style={{
                                          flex: 1, padding: '7px 12px', borderRadius: theme.radii.md,
                                          border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
                                          color: colors.text, fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                        }}
                                      >
                                        <Edit3 size={12} /> Edit
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Action with reply text + tool call */}
                            {!isDone && !isExec && action.toolCall && action.immediateReply && (
                              <div style={{ padding: '0 10px 10px' }}>
                                <p style={{
                                  margin: '0 0 8px', fontSize: '12.5px', lineHeight: 1.6, color: colors.text,
                                  whiteSpace: 'pre-wrap',
                                }}>{action.immediateReply}</p>
                                <button
                                  onClick={() => handleUseAction(action)}
                                  style={{
                                    width: '100%', padding: '7px 12px', borderRadius: theme.radii.md,
                                    border: 'none', backgroundColor: theme.colors.success, color: '#fff',
                                    fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                  }}
                                >
                                  <Zap size={12} /> {isVoice ? 'Execute & Communicate' : 'Send & Execute'}
                                </button>
                              </div>
                            )}
                            {/* Tool-only action (no reply text) */}
                            {!isDone && !isExec && action.toolCall && !action.immediateReply && (
                              <div style={{ padding: '0 10px 10px' }}>
                                <button
                                  onClick={() => handleUseAction(action)}
                                  style={{
                                    width: '100%', padding: '7px 12px', borderRadius: theme.radii.md,
                                    border: 'none', backgroundColor: theme.colors.success, color: '#fff',
                                    fontSize: '12px', fontWeight: 600, fontFamily: theme.fonts.body,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                  }}
                                >
                                  <Zap size={12} /> Execute
                                </button>
                              </div>
                            )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Spacer to allow scrolling latest message to the top */}
        <div style={{ minHeight: '70vh' }} />
      </div>

      {/* ─── Compose bar ─── */}
      <div style={{
        padding: '10px 14px', borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '9px 12px', borderRadius: theme.radii.lg,
          border: `1px solid ${colors.border}`, backgroundColor: colors.inputBackground,
        }}>
          <Sparkles size={14} color={theme.colors.purple} style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleNextIQQuery(); }}
            placeholder="Ask NextIQ anything..."
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: '13px',
              fontFamily: theme.fonts.body, color: colors.text,
              backgroundColor: 'transparent',
            }}
          />
          <button
            onClick={handleNextIQQuery}
            style={{
              width: '26px', height: '26px', borderRadius: theme.radii.md,
              border: 'none',
              backgroundColor: query.trim() ? theme.colors.blue : 'transparent',
              cursor: query.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: theme.transitions.fast,
            }}
          >
            <Send size={12} color={query.trim() ? '#fff' : colors.textTertiary} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ CUSTOMER 360 PANEL ═══ */
function Customer360Panel({ conversation }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [activeSection, setActiveSection] = useState('overview');

  const customer = {
    name: 'Brad Pitt',
    title: 'VP of Operations',
    company: 'Meridian Technologies',
    avatar: conversation?.gradient || 'linear-gradient(135deg, #F59E0B, #D97706)',
    initials: 'BP',
    email: 'brad.pitt@meridiantech.com',
    phone: '+1 (415) 555-0142',
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    lifetimeValue: '$156,000',
    accountAge: '2.4 years',
    plan: 'Enterprise',
    seats: 120,
    renewalDate: 'Aug 15, 2026',
    healthScore: 72,
    npsScore: 8,
    tags: [
      { label: 'Enterprise', color: theme.colors.blue, bg: theme.colors.blueMuted },
      { label: 'VIP', color: theme.colors.warning, bg: theme.colors.warningMuted },
      { label: 'Scaling', color: theme.colors.success, bg: theme.colors.successMuted },
    ],
    history: [
      { date: 'Jan 2024', event: 'Signed initial contract — 50 seats', icon: FileText },
      { date: 'Jul 2024', event: 'Expanded to 120 seats', icon: Users },
      { date: 'Nov 2024', event: 'Upgraded to Enterprise tier', icon: TrendingUp },
      { date: 'Feb 2025', event: 'Reported billing discrepancy', icon: AlertCircle },
    ],
    activities: [
      { type: 'call', direction: 'Outgoing call', detail: 'Discussed Q1 expansion', time: '2 days ago', duration: '12 min', icon: Phone },
      { type: 'chat', direction: 'Live chat', detail: 'Billing inquiry — duplicate charge', time: '2 hours ago', duration: '8 min', icon: MessageSquare },
      { type: 'email', direction: 'Inbound email', detail: 'Invoice PDF request', time: '5 days ago', duration: null, icon: Mail },
    ],
    notes: [
      { text: 'Key decision maker for entire Meridian account. Prefers direct, concise communication. Very responsive on chat.', author: 'Alex Rivera', time: '3 days ago' },
    ],
  };

  const healthColor = customer.healthScore >= 80 ? theme.colors.success : customer.healthScore >= 60 ? theme.colors.warning : theme.colors.error;

  return (
    <div style={{ flex: 1, overflow: 'auto', backgroundColor: colors.background }}>
      {/* Profile Header */}
      <div style={{ padding: '20px 16px 16px', textAlign: 'center', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: customer.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 10px', fontSize: '18px', fontWeight: 700, color: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}>
          {customer.initials}
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: colors.text }}>{customer.name}</div>
        <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>{customer.title}</div>
        <div style={{ fontSize: '11px', color: colors.textTertiary, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Building size={10} /> {customer.company}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
          {[
            { icon: Phone, label: 'Call', color: theme.colors.success },
            { icon: Mail, label: 'Email', color: theme.colors.blue },
            { icon: MessageSquare, label: 'Message', color: theme.colors.purple },
          ].map(({ icon: Icon, label, color }) => (
            <button key={label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              padding: '8px 14px', borderRadius: theme.radii.md,
              border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
              cursor: 'pointer', fontFamily: theme.fonts.body, transition: theme.transitions.fast,
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; e.currentTarget.style.borderColor = color; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = colors.surface; e.currentTarget.style.borderColor = colors.border; }}
            >
              <Icon size={14} color={color} />
              <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textSecondary }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.textTertiary, marginBottom: '8px' }}>Contact Info</div>
        {[
          { icon: Mail, value: customer.email },
          { icon: Phone, value: customer.phone },
          { icon: MapPin, value: customer.location },
          { icon: Globe, value: customer.timezone },
        ].map(({ icon: Icon, value }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
            <Icon size={12} color={colors.textTertiary} />
            <span style={{ fontSize: '12px', color: colors.text }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Account Overview */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.textTertiary, marginBottom: '8px' }}>Account Overview</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '10px', borderRadius: theme.radii.md, backgroundColor: colors.surfaceHover }}>
            <div style={{ fontSize: '10px', color: colors.textTertiary, fontWeight: 600 }}>Lifetime Value</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: theme.colors.success, marginTop: '2px' }}>{customer.lifetimeValue}</div>
          </div>
          <div style={{ padding: '10px', borderRadius: theme.radii.md, backgroundColor: colors.surfaceHover }}>
            <div style={{ fontSize: '10px', color: colors.textTertiary, fontWeight: 600 }}>Account Age</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: colors.text, marginTop: '2px' }}>{customer.accountAge}</div>
          </div>
          <div style={{ padding: '10px', borderRadius: theme.radii.md, backgroundColor: colors.surfaceHover }}>
            <div style={{ fontSize: '10px', color: colors.textTertiary, fontWeight: 600 }}>Health Score</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: colors.border }}>
                <div style={{ width: `${customer.healthScore}%`, height: '100%', borderRadius: '2px', backgroundColor: healthColor }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: healthColor }}>{customer.healthScore}</span>
            </div>
          </div>
          <div style={{ padding: '10px', borderRadius: theme.radii.md, backgroundColor: colors.surfaceHover }}>
            <div style={{ fontSize: '10px', color: colors.textTertiary, fontWeight: 600 }}>Renewal</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: colors.text, marginTop: '2px' }}>{customer.renewalDate}</div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.textTertiary, marginBottom: '8px' }}>Tags</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {customer.tags.map((tag, i) => (
            <span key={i} style={{
              fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: theme.radii.full,
              backgroundColor: tag.bg, color: tag.color,
            }}>{tag.label}</span>
          ))}
        </div>
      </div>

      {/* Contact History Timeline */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.textTertiary, marginBottom: '10px' }}>Contact History</div>
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          <div style={{ position: 'absolute', left: '5px', top: '4px', bottom: '4px', width: '2px', backgroundColor: colors.border }} />
          {customer.history.map(({ date, event, icon: Icon }, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: i < customer.history.length - 1 ? '14px' : '0' }}>
              <div style={{
                position: 'absolute', left: '-20px', top: '2px',
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: colors.surface, border: `2px solid ${theme.colors.blue}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: theme.colors.blue }} />
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: colors.textTertiary }}>{date}</div>
              <div style={{ fontSize: '12px', color: colors.text, marginTop: '2px' }}>{event}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.textTertiary, marginBottom: '8px' }}>Recent Activities</div>
        {customer.activities.map(({ direction, detail, time, duration, icon: Icon }, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0',
            borderBottom: i < customer.activities.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: theme.radii.sm,
              backgroundColor: colors.surfaceHover, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={13} color={colors.textSecondary} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{direction}</div>
              <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '1px' }}>{detail}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '10px', color: colors.textTertiary }}>{time}</div>
              {duration && <div style={{ fontSize: '10px', color: colors.textTertiary, marginTop: '2px' }}>{duration}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.textTertiary, marginBottom: '8px' }}>Notes</div>
        {customer.notes.map((note, i) => (
          <div key={i} style={{
            padding: '10px', borderRadius: theme.radii.md,
            backgroundColor: colors.surfaceHover, border: `1px solid ${colors.borderLight}`,
          }}>
            <div style={{ fontSize: '12px', color: colors.text, lineHeight: 1.5 }}>{note.text}</div>
            <div style={{ fontSize: '10px', color: colors.textTertiary, marginTop: '6px' }}>— {note.author} · {note.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ INTERNAL NOTES PANEL ═══ */
function InternalNotesPanel() {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [notes, setNotes] = useState([
    {
      id: 1,
      text: 'Brad escalated through account manager (Alex). She sounded frustrated on the call but remained professional. The duplicate charge seems to be a real backend issue — not a misunderstanding. Prioritize resolution.',
      author: 'Alex Rivera',
      role: 'Account Manager',
      time: '2 hours ago',
      pinned: true,
    },
    {
      id: 2,
      text: 'Confirmed with billing team: TXN-90282 is the duplicate. Refund has been queued. Brad should see it in 3–5 business days. Follow up if she hasn\'t confirmed by Friday.',
      author: 'David Kim',
      role: 'Billing Specialist',
      time: '45 min ago',
      pinned: false,
    },
    {
      id: 3,
      text: 'Brad is a key decision-maker for the Meridian account (120 seats). Handle with care — renewal is in Aug 2026. Any negative experience could impact expansion plans.',
      author: 'Priya Sharma',
      role: 'Customer Success',
      time: '1 day ago',
      pinned: false,
    },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [{
      id: Date.now(), text: newNote.trim(), author: 'You', role: 'Agent', time: 'Just now', pinned: false,
    }, ...prev]);
    setNewNote('');
    setShowAdd(false);
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', backgroundColor: colors.background }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: colors.text }}>Internal Notes</div>
          <div style={{ fontSize: '11px', color: colors.textTertiary, marginTop: '2px' }}>{notes.length} notes</div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 12px', borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.blue}30`, backgroundColor: theme.colors.blueMuted,
            color: theme.colors.blue, fontSize: '11px', fontWeight: 600,
            cursor: 'pointer', fontFamily: theme.fonts.body,
          }}
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Add Note Form */}
      {showAdd && (
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.surfaceHover }}>
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Write a note..."
            style={{
              width: '100%', minHeight: '80px', padding: '10px', borderRadius: theme.radii.md,
              border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
              color: colors.text, fontSize: '12px', fontFamily: theme.fonts.body,
              resize: 'vertical', outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = theme.colors.blue}
            onBlur={e => e.target.style.borderColor = colors.border}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button onClick={() => { setShowAdd(false); setNewNote(''); }} style={{
              padding: '6px 12px', borderRadius: theme.radii.md,
              border: `1px solid ${colors.border}`, backgroundColor: colors.surface,
              color: colors.textSecondary, fontSize: '11px', fontWeight: 600,
              cursor: 'pointer', fontFamily: theme.fonts.body,
            }}>Cancel</button>
            <button onClick={handleAddNote} style={{
              padding: '6px 12px', borderRadius: theme.radii.md,
              border: 'none', backgroundColor: theme.colors.blue,
              color: '#fff', fontSize: '11px', fontWeight: 600,
              cursor: 'pointer', fontFamily: theme.fonts.body,
              opacity: newNote.trim() ? 1 : 0.5,
            }}>Save Note</button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div style={{ padding: '8px 16px' }}>
        {notes.map(note => (
          <div key={note.id} style={{
            padding: '12px', borderRadius: theme.radii.md, marginBottom: '8px',
            backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
            transition: theme.transitions.fast, cursor: 'default',
            ...(note.pinned ? { borderLeft: `3px solid ${theme.colors.warning}` } : {}),
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = theme.shadows.sm}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            {note.pinned && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                <Bookmark size={10} color={theme.colors.warning} fill={theme.colors.warning} />
                <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', color: theme.colors.warning }}>Pinned</span>
              </div>
            )}
            <div style={{ fontSize: '12px', color: colors.text, lineHeight: 1.55 }}>{note.text}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                backgroundColor: theme.colors.blueMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 700, color: theme.colors.blue,
              }}>
                {note.author.split(' ').map(w => w[0]).join('')}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: colors.text }}>{note.author}</span>
              <span style={{ fontSize: '10px', color: colors.textTertiary }}>· {note.role}</span>
              <span style={{ fontSize: '10px', color: colors.textTertiary, marginLeft: 'auto' }}>{note.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ MEETINGS PANEL ═══ */
function MeetingsPanel() {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const upcoming = [
    {
      id: 1,
      title: 'Quarterly Business Review',
      type: 'Customer',
      date: 'Mar 5, 2026',
      time: '10:00 AM – 11:00 AM PST',
      duration: '1 hour',
      description: 'Review Q1 usage metrics, discuss expansion opportunities, and address the billing incident.',
      attendees: [
        { name: 'Brad Pitt', initials: 'BP', color: '#F59E0B' },
        { name: 'Alex Rivera', initials: 'AR', color: theme.colors.blue },
        { name: 'Priya Sharma', initials: 'PS', color: theme.colors.purple },
      ],
      location: 'Zoom',
    },
    {
      id: 2,
      title: 'Account Renewal Planning',
      type: 'Internal',
      date: 'Mar 12, 2026',
      time: '2:00 PM – 2:30 PM PST',
      duration: '30 min',
      description: 'Internal sync to prepare renewal offer. Discuss pricing adjustments and expansion proposal.',
      attendees: [
        { name: 'Alex Rivera', initials: 'AR', color: theme.colors.blue },
        { name: 'David Kim', initials: 'DK', color: theme.colors.success },
      ],
      location: 'Google Meet',
    },
  ];

  const past = [
    {
      id: 3,
      title: 'Onboarding Check-in',
      date: 'Feb 10, 2026',
      duration: '45 min',
      attendees: [
        { name: 'Brad Pitt', initials: 'BP', color: '#F59E0B' },
        { name: 'Alex Rivera', initials: 'AR', color: theme.colors.blue },
      ],
      hasRecording: true,
      hasTranscript: true,
      summary: 'Discussed seat expansion from 80 to 120. Brad confirmed budget approval.',
    },
    {
      id: 4,
      title: 'Technical Integration Call',
      date: 'Jan 20, 2026',
      duration: '30 min',
      attendees: [
        { name: 'Brad Pitt', initials: 'BP', color: '#F59E0B' },
        { name: 'David Kim', initials: 'DK', color: theme.colors.success },
      ],
      hasRecording: true,
      hasTranscript: false,
      summary: 'Covered SSO setup and API integration. Action items sent via email.',
    },
  ];

  const MeetingCard = ({ meeting, isPast }) => (
    <div style={{
      padding: '12px', borderRadius: theme.radii.md, marginBottom: '8px',
      backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
      transition: theme.transitions.fast,
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = theme.shadows.sm}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: colors.text, flex: 1 }}>{meeting.title}</div>
        {meeting.type && (
          <span style={{
            fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: theme.radii.full,
            backgroundColor: meeting.type === 'Customer' ? theme.colors.blueMuted : theme.colors.purpleMuted,
            color: meeting.type === 'Customer' ? theme.colors.blue : theme.colors.purple,
            flexShrink: 0,
          }}>{meeting.type}</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
        <Calendar size={11} color={colors.textTertiary} />
        <span style={{ fontSize: '11px', color: colors.textSecondary }}>{meeting.date}</span>
        <span style={{ fontSize: '10px', color: colors.textTertiary }}>· {meeting.duration}</span>
      </div>

      {meeting.time && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          <Clock size={11} color={colors.textTertiary} />
          <span style={{ fontSize: '11px', color: colors.textSecondary }}>{meeting.time}</span>
        </div>
      )}

      {meeting.location && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          <Video size={11} color={colors.textTertiary} />
          <span style={{ fontSize: '11px', color: colors.textSecondary }}>{meeting.location}</span>
        </div>
      )}

      {meeting.description && (
        <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '8px', lineHeight: 1.5 }}>{meeting.description}</div>
      )}

      {meeting.summary && isPast && (
        <div style={{
          fontSize: '11px', color: colors.textSecondary, marginTop: '8px', lineHeight: 1.5,
          padding: '8px', borderRadius: theme.radii.sm, backgroundColor: colors.surfaceHover,
        }}>
          {meeting.summary}
        </div>
      )}

      {/* Attendees */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '4px' }}>
        <div style={{ display: 'flex' }}>
          {meeting.attendees.map((a, i) => (
            <div key={i} title={a.name} style={{
              width: '22px', height: '22px', borderRadius: '50%',
              backgroundColor: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '8px', fontWeight: 700, color: '#fff',
              border: `2px solid ${colors.surface}`, marginLeft: i > 0 ? '-6px' : '0',
              position: 'relative', zIndex: meeting.attendees.length - i,
            }}>
              {a.initials}
            </div>
          ))}
        </div>
        <span style={{ fontSize: '10px', color: colors.textTertiary, marginLeft: '4px' }}>
          {meeting.attendees.length} attendee{meeting.attendees.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Past meeting links */}
      {isPast && (meeting.hasRecording || meeting.hasTranscript) && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '8px', borderTop: `1px solid ${colors.borderLight}` }}>
          {meeting.hasRecording && (
            <button style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 8px', borderRadius: theme.radii.sm,
              border: `1px solid ${colors.border}`, backgroundColor: colors.surfaceHover,
              fontSize: '10px', fontWeight: 600, color: colors.textSecondary,
              cursor: 'pointer', fontFamily: theme.fonts.body,
            }}>
              <PlayCircle size={10} /> Recording
            </button>
          )}
          {meeting.hasTranscript && (
            <button style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 8px', borderRadius: theme.radii.sm,
              border: `1px solid ${colors.border}`, backgroundColor: colors.surfaceHover,
              fontSize: '10px', fontWeight: 600, color: colors.textSecondary,
              cursor: 'pointer', fontFamily: theme.fonts.body,
            }}>
              <FileText size={10} /> Transcript
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ flex: 1, overflow: 'auto', backgroundColor: colors.background }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: colors.text }}>Meetings</div>
          <div style={{ fontSize: '11px', color: colors.textTertiary, marginTop: '2px' }}>{upcoming.length} upcoming · {past.length} past</div>
        </div>
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 12px', borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.blue}30`, backgroundColor: theme.colors.blueMuted,
            color: theme.colors.blue, fontSize: '11px', fontWeight: 600,
            cursor: 'pointer', fontFamily: theme.fonts.body,
          }}
        >
          <Plus size={12} /> Create
        </button>
      </div>

      {/* Upcoming */}
      <div style={{ padding: '14px 16px 8px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.textTertiary, marginBottom: '8px' }}>
          Upcoming ({upcoming.length})
        </div>
        {upcoming.map(m => <MeetingCard key={m.id} meeting={m} isPast={false} />)}
      </div>

      {/* Past */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.textTertiary, marginBottom: '8px' }}>
          Past ({past.length})
        </div>
        {past.map(m => <MeetingCard key={m.id} meeting={m} isPast={true} />)}
      </div>
    </div>
  );
}

/* ═══ TICKETS PANEL ═══ */
function TicketsPanel() {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [activeFilter, setActiveFilter] = useState('all');

  const tickets = [
    {
      id: 'TKT-4821',
      title: 'Duplicate billing charge — Feb 2026',
      severity: 'HIGH',
      status: 'Open',
      assignee: 'David Kim',
      assigneeInitials: 'DK',
      created: '2 hours ago',
      sla: { label: 'SLA: 4h left', urgent: true },
      description: 'Customer reports two identical $2,400 charges on Feb 15. Transaction IDs: TXN-90281, TXN-90282.',
    },
    {
      id: 'TKT-4819',
      title: 'Invoice PDF download not working',
      severity: 'MEDIUM',
      status: 'Pending',
      assignee: 'Alex Rivera',
      assigneeInitials: 'AR',
      created: '1 day ago',
      sla: { label: 'SLA: 12h left', urgent: false },
      description: 'Customer unable to download Feb invoice from portal. Returns 404 error.',
    },
    {
      id: 'TKT-4805',
      title: 'SSO login failure after password reset',
      severity: 'MEDIUM',
      status: 'Pending',
      assignee: 'Priya Sharma',
      assigneeInitials: 'PS',
      created: '3 days ago',
      sla: { label: 'Breached', urgent: true },
      description: 'Three users unable to log in via SSO after admin-triggered password reset.',
    },
    {
      id: 'TKT-4790',
      title: 'Feature request: bulk seat assignment',
      severity: 'LOW',
      status: 'Open',
      assignee: 'Unassigned',
      assigneeInitials: 'UA',
      created: '5 days ago',
      sla: null,
      description: 'Brad requested ability to bulk-assign seats instead of one-by-one.',
    },
    {
      id: 'TKT-4775',
      title: 'API rate limit exceeded during migration',
      severity: 'HIGH',
      status: 'Resolved',
      assignee: 'David Kim',
      assigneeInitials: 'DK',
      created: '1 week ago',
      sla: null,
      description: 'Rate limits hit during data migration. Resolved by increasing quota temporarily.',
    },
  ];

  const severityConfig = {
    HIGH: { color: theme.colors.error, bg: theme.colors.errorMuted },
    MEDIUM: { color: theme.colors.warning, bg: theme.colors.warningMuted },
    LOW: { color: colors.textSecondary, bg: colors.surfaceHover },
  };

  const statusConfig = {
    Open: { color: theme.colors.blue, bg: theme.colors.blueMuted },
    Pending: { color: theme.colors.warning, bg: theme.colors.warningMuted },
    Resolved: { color: theme.colors.success, bg: theme.colors.successMuted },
  };

  const filters = [
    { id: 'all', label: 'All', count: tickets.length },
    { id: 'open', label: 'Open', count: tickets.filter(t => t.status === 'Open').length },
    { id: 'pending', label: 'Pending', count: tickets.filter(t => t.status === 'Pending').length },
    { id: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'Resolved').length },
  ];

  const filtered = activeFilter === 'all' ? tickets : tickets.filter(t => t.status.toLowerCase() === activeFilter);

  return (
    <div style={{ flex: 1, overflow: 'auto', backgroundColor: colors.background }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: colors.text }}>Tickets</div>
          <div style={{ fontSize: '11px', color: colors.textTertiary, marginTop: '2px' }}>
            {tickets.filter(t => t.status === 'Open').length} open · {tickets.filter(t => t.status === 'Pending').length} pending
          </div>
        </div>
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 12px', borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.blue}30`, backgroundColor: theme.colors.blueMuted,
            color: theme.colors.blue, fontSize: '11px', fontWeight: 600,
            cursor: 'pointer', fontFamily: theme.fonts.body,
          }}
        >
          <Plus size={12} /> Create
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        padding: '10px 16px', borderBottom: `1px solid ${colors.border}`,
        display: 'flex', gap: '4px',
      }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
            padding: '5px 10px', borderRadius: theme.radii.full,
            border: activeFilter === f.id ? `1px solid ${theme.colors.blue}30` : `1px solid transparent`,
            backgroundColor: activeFilter === f.id ? theme.colors.blueMuted : 'transparent',
            color: activeFilter === f.id ? theme.colors.blue : colors.textSecondary,
            fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            fontFamily: theme.fonts.body, display: 'flex', alignItems: 'center', gap: '4px',
            transition: theme.transitions.fast,
          }}>
            {f.label}
            <span style={{
              fontSize: '10px', fontWeight: 700,
              backgroundColor: activeFilter === f.id ? `${theme.colors.blue}20` : colors.surfaceHover,
              padding: '1px 5px', borderRadius: theme.radii.full, minWidth: '16px', textAlign: 'center',
            }}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Ticket Cards */}
      <div style={{ padding: '8px 16px' }}>
        {filtered.map(ticket => {
          const sev = severityConfig[ticket.severity];
          const stat = statusConfig[ticket.status];
          return (
            <div key={ticket.id} style={{
              padding: '12px', borderRadius: theme.radii.md, marginBottom: '8px',
              backgroundColor: colors.surface, border: `1px solid ${colors.border}`,
              transition: theme.transitions.fast, cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = theme.shadows.sm}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text, lineHeight: 1.4 }}>{ticket.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: theme.radii.full,
                      backgroundColor: sev.bg, color: sev.color,
                    }}>{ticket.severity}</span>
                    <span style={{
                      fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: theme.radii.full,
                      backgroundColor: stat.bg, color: stat.color,
                    }}>{ticket.status}</span>
                    <span style={{ fontSize: '10px', color: colors.textTertiary }}>{ticket.id}</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '8px', lineHeight: 1.45 }}>{ticket.description}</div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: `1px solid ${colors.borderLight}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: theme.colors.blueMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '8px', fontWeight: 700, color: theme.colors.blue,
                  }}>
                    {ticket.assigneeInitials}
                  </div>
                  <span style={{ fontSize: '10px', color: colors.textSecondary }}>{ticket.assignee}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: colors.textTertiary }}>{ticket.created}</span>
                  {ticket.sla && (
                    <span style={{
                      fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: theme.radii.full,
                      backgroundColor: ticket.sla.urgent ? theme.colors.errorMuted : theme.colors.successMuted,
                      color: ticket.sla.urgent ? theme.colors.error : theme.colors.success,
                    }}>{ticket.sla.label}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NextIQ Insight */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          padding: '12px', borderRadius: theme.radii.md,
          background: `linear-gradient(135deg, ${theme.colors.purple}08, ${theme.colors.blue}08)`,
          border: `1px solid ${theme.colors.purple}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Sparkles size={12} color={theme.colors.purple} />
            <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.colors.purple }}>NextIQ Insight</span>
          </div>
          <div style={{ fontSize: '12px', color: colors.text, lineHeight: 1.5 }}>
            TKT-4821 (duplicate billing) and TKT-4819 (invoice download) may be related — both involve the Feb billing cycle. Consider consolidating into a single investigation to resolve faster.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ RIGHT PANEL WRAPPER ═══ */
const RIGHT_PANEL_TABS = [
  { id: 'nextiq', icon: Sparkles, label: 'NextIQ', badgeType: 'ai' },
  { id: 'customer', icon: Users, label: 'Customer 360', badgeType: null },
  { id: 'notes', icon: FileText, label: 'Notes', badgeType: 'count', badgeValue: 3 },
  { id: 'meetings', icon: Video, label: 'Meetings', badgeType: 'count', badgeValue: 2 },
  { id: 'tickets', icon: AlertCircle, label: 'Tickets', badgeType: 'count', badgeValue: 3 },
];

function RightPanel({ conversation, autopilot, setAutopilot, liveMessages, setLiveMessages, setComposeText, setPendingDraftId, nextIQQuery, clearNextIQQuery }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const [activeTab, setActiveTab] = useState('nextiq');
  const [teamChatOpen, setTeamChatOpen] = useState(false);
  const [teamChatMsg, setTeamChatMsg] = useState('');

  useEffect(() => {
    if (nextIQQuery) setActiveTab('nextiq');
  }, [nextIQQuery]);

  const teamChatMessages = [
    { id: 1, from: 'supervisor', name: 'Priya Sharma', initials: 'PS', text: conversation?.channel === 'phone'
      ? "Emily Davis called in — her account may be inactive. Check if domain changed during Brightwave rebrand."
      : "Brad Pitt is a key account. Handle the billing issue with care — renewal is in Aug.", time: '2 min ago' },
    { id: 2, from: 'you', name: 'You', initials: 'AR', text: conversation?.channel === 'phone'
      ? "Confirmed. Old domain brightwave.io, new is brightwavecorp.io. Reactivating now."
      : "Got it. Found the duplicate charge — processing refund now.", time: '1 min ago' },
    { id: 3, from: 'supervisor', name: 'Priya Sharma', initials: 'PS', text: conversation?.channel === 'phone'
      ? "Good catch. Also mention the Spring promo — she's a good upsell candidate."
      : "Good. Keep me posted on the outcome.", time: 'Just now' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', flex: 55, minWidth: 0 }}>
      {/* Panel Content + Team Chat */}
      <div style={{
        flex: 1, minWidth: 0, borderLeft: `1px solid ${colors.border}`,
        backgroundColor: colors.background, display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Tab Content */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'nextiq' && (
            <NextIQPanel
              conversation={conversation}
              autopilot={autopilot}
              setAutopilot={setAutopilot}
              liveMessages={liveMessages}
              setLiveMessages={setLiveMessages}
              setComposeText={setComposeText}
              setPendingDraftId={setPendingDraftId}
              nextIQQuery={nextIQQuery}
              clearNextIQQuery={clearNextIQQuery}
            />
          )}
          {activeTab === 'customer' && <Customer360Panel conversation={conversation} />}
          {activeTab === 'notes' && <InternalNotesPanel />}
          {activeTab === 'meetings' && <MeetingsPanel />}
          {activeTab === 'tickets' && <TicketsPanel />}
        </div>

        {/* Team Chat Drawer */}
        <div style={{
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
          transition: 'max-height 0.3s ease, min-height 0.3s ease',
          maxHeight: teamChatOpen ? '45%' : '36px',
          minHeight: '36px',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Collapsed header bar */}
          <div
            onClick={() => setTeamChatOpen(!teamChatOpen)}
            style={{
              padding: '8px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              borderBottom: teamChatOpen ? `1px solid ${colors.border}` : 'none',
              backgroundColor: teamChatOpen ? colors.surface : 'transparent',
              flexShrink: 0,
            }}
          >
            <MessageSquare size={13} color={theme.colors.blue} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: colors.text }}>Team</span>
            <span style={{
              fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: theme.radii.full,
              backgroundColor: theme.colors.blue, color: '#fff', minWidth: '14px', textAlign: 'center',
            }}>2</span>
            <ChevronDown
              size={14} color={colors.textSecondary}
              style={{
                marginLeft: 'auto', transition: 'transform 0.2s ease',
                transform: teamChatOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            />
          </div>

          {/* Expanded chat content */}
          {teamChatOpen && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
                {teamChatMessages.map(msg => (
                  <div key={msg.id} style={{ marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: msg.from === 'you'
                        ? `linear-gradient(135deg, ${theme.colors.blue}, ${theme.colors.purple})`
                        : `linear-gradient(135deg, ${theme.colors.success}, #0D9488)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', fontWeight: 700, color: '#fff',
                    }}>
                      {msg.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: colors.text }}>{msg.name}</span>
                        <span style={{ fontSize: '10px', color: colors.textTertiary }}>{msg.time}</span>
                      </div>
                      <p style={{
                        margin: '2px 0 0', fontSize: '12px', lineHeight: 1.5, color: colors.textSecondary,
                      }}>
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Input */}
              <div style={{
                padding: '8px 12px', borderTop: `1px solid ${colors.border}`,
                display: 'flex', gap: '6px', alignItems: 'center',
              }}>
                <input
                  type="text"
                  value={teamChatMsg}
                  onChange={(e) => setTeamChatMsg(e.target.value)}
                  placeholder="Message team..."
                  style={{
                    flex: 1, border: `1px solid ${colors.border}`, borderRadius: theme.radii.md,
                    padding: '6px 10px', fontSize: '12px', fontFamily: theme.fonts.body,
                    color: colors.text, backgroundColor: colors.inputBackground, outline: 'none',
                  }}
                />
                <button style={{
                  width: '28px', height: '28px', borderRadius: theme.radii.sm,
                  border: 'none', backgroundColor: theme.colors.blue, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Send size={12} color="#fff" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vertical Tab Strip */}
      <div style={{
        width: '44px', backgroundColor: colors.surface,
        borderLeft: `1px solid ${colors.border}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: '8px', gap: '2px', flexShrink: 0,
      }}>
        {RIGHT_PANEL_TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              style={{
                width: '36px', height: '36px', borderRadius: theme.radii.sm,
                border: 'none', cursor: 'pointer', position: 'relative',
                backgroundColor: isActive ? theme.colors.blueMuted : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: theme.transitions.fast,
                borderLeft: isActive ? `2px solid ${theme.colors.blue}` : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Icon size={16} color={isActive ? theme.colors.blue : colors.textSecondary} />
              {/* Badge */}
              {tab.badgeType === 'ai' && (
                <div style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.colors.purple}, ${theme.colors.blue})`,
                  border: `1.5px solid ${colors.surface}`,
                }} />
              )}
              {tab.badgeType === 'count' && tab.badgeValue > 0 && (
                <div style={{
                  position: 'absolute', top: '2px', right: '2px',
                  minWidth: '14px', height: '14px', borderRadius: '7px',
                  backgroundColor: theme.colors.blue, color: '#fff',
                  fontSize: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 3px', border: `1.5px solid ${colors.surface}`,
                }}>
                  {tab.badgeValue}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ MAIN INBOX PAGE ═══ */
export default function InboxPage({ initialCustomerId, onConsumeInitialId }) {
  const [selectedConv, setSelectedConv] = useState(() => {
    if (initialCustomerId) {
      return inboxConversations.find(c => c.id === initialCustomerId) || inboxConversations[0];
    }
    return inboxConversations[0];
  });
  useEffect(() => {
    if (initialCustomerId) {
      const match = inboxConversations.find(c => c.id === initialCustomerId);
      if (match) setSelectedConv(match);
      if (onConsumeInitialId) onConsumeInitialId();
    }
  }, [initialCustomerId]);

  const [activeInbox, setActiveInbox] = useState('my-inbox');
  const [activeLayout, setActiveLayout] = useState('classic');
  const [autopilot, setAutopilot] = useState(false);
  const [conversationStore, setConversationStore] = useState(() => {
    const store = {};
    Object.entries(allConversations).forEach(([id, msgs]) => { store[id] = [...msgs]; });
    return store;
  });
  const liveMessages = conversationStore[selectedConv.id] || [];
  const setLiveMessages = (updater) => {
    setConversationStore(prev => ({
      ...prev,
      [selectedConv.id]: typeof updater === 'function' ? updater(prev[selectedConv.id] || []) : updater,
    }));
  };
  const [composeText, setComposeText] = useState('');
  const [pendingDraftId, setPendingDraftId] = useState(null);
  const [nextIQQuery, setNextIQQuery] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>
      {/* Main 4-panel layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <InboxSidebar activeInbox={activeInbox} setActiveInbox={setActiveInbox} />
        <ConversationList
          selected={selectedConv}
          setSelected={setSelectedConv}
          activeLayout={activeLayout}
          setActiveLayout={setActiveLayout}
        />
        <ConversationDetail
          conversation={selectedConv}
          autopilot={autopilot}
          liveMessages={liveMessages}
          setLiveMessages={setLiveMessages}
          composeText={composeText}
          setComposeText={setComposeText}
          pendingDraftId={pendingDraftId}
          setPendingDraftId={setPendingDraftId}
          onAskNextIQ={(text) => setNextIQQuery({ text, ts: Date.now() })}
        />
        <RightPanel
          conversation={selectedConv}
          autopilot={autopilot}
          setAutopilot={setAutopilot}
          liveMessages={liveMessages}
          setLiveMessages={setLiveMessages}
          setComposeText={setComposeText}
          setPendingDraftId={setPendingDraftId}
          nextIQQuery={nextIQQuery}
          clearNextIQQuery={() => setNextIQQuery(null)}
        />
      </div>
    </div>
  );
}
