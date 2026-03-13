// ─── NextIQ Configuration — Velocity Commerce (Demo Tenant) ─────────────────
// 320 agents · 5 teams · 45,000 conversations/month · US / Canada / UK

export const NEXTIQ_ENGINE = {
  systemPrompt: `You are NextIQ, an AI co-pilot embedded in the human agent's workspace within the Nextiva NEXT platform. Your role is to assist — not replace — the human agent by:

1. Surfacing relevant knowledge base responses when the customer's question matches a known topic
2. Suggesting Next Best Actions (NBAs) that the agent can accept, modify, or dismiss
3. Executing tool calls (Actions) when the agent explicitly approves them
4. Providing contextual analysis after tool responses to help the agent understand the result

You delegate to specialized sub-agents (Goals) based on the customer's intent. Each sub-agent has its own knowledge scope, available actions, and behavioral instructions. When no sub-agent matches the conversation intent, fall back to general knowledge retrieval.

You never communicate directly with the customer. All your outputs are suggestions to the human agent.`,

  adminPrompt: `Always greet the merchant by their first name in the first response.
Never make pricing commitments without checking the merchant's current plan details first.
When customer sentiment is negative, prioritize empathy and acknowledgment over efficiency.
All credits above $500 require supervisor approval — flag for review, do not auto-process.
If the merchant mentions a competitor, do not disparage — focus on Velocity Commerce strengths.
For UK merchants, apply GDPR data handling rules — limit PII surfacing and add consent language.
Never quote internal pricing tiers — always direct pricing questions to the merchant's account manager.
When recommending a plan upgrade, always show the math: current cost vs. projected cost at current usage.`,

  maxNBAsPerTurn: 2,
  fallbackBehavior: 'kb_and_nba',
};

// ─── INBOXES — Velocity Commerce teams ──────────────────────────────────────

export const ALL_INBOXES = [
  {
    id: 'inbox-general-support',
    name: 'General Support',
    description: 'Handles all inbound merchant support inquiries across channels',
    members: 48,
    channels: ['chat', 'email', 'phone'],
    skills: ['General Support', 'English', 'Spanish', 'French'],
    agents: ['Priya Sharma', 'Jake Thompson', 'Sofia Martinez', 'Ahmed Hassan', 'Lily Chen'],
  },
  {
    id: 'inbox-billing',
    name: 'Billing & Payments',
    description: 'Handles invoice disputes, overage inquiries, credits, refunds, and plan changes',
    members: 35,
    channels: ['chat', 'email', 'phone'],
    skills: ['Billing', 'Payments', 'English', 'Spanish'],
    agents: ['Priya Sharma', 'Marcus Rivera', 'Daniel Lee', 'Emma Wilson'],
  },
  {
    id: 'inbox-vip-merchants',
    name: 'VIP Merchants',
    description: 'Dedicated queue for high-value merchant accounts — always human-driven, high-touch',
    members: 12,
    channels: ['chat', 'phone'],
    skills: ['VIP Accounts', 'Billing', 'Technical', 'English'],
    agents: ['Priya Sharma', 'Daniel Lee'],
  },
  {
    id: 'inbox-onboarding',
    name: 'Merchant Onboarding',
    description: 'Guides new merchants through store setup, payment gateway, and first transaction',
    members: 22,
    channels: ['chat', 'email'],
    skills: ['Onboarding', 'Technical', 'English', 'Spanish'],
    agents: ['Jake Thompson', 'Sofia Martinez', 'Lily Chen'],
  },
  {
    id: 'inbox-technical',
    name: 'Technical Integrations',
    description: 'API troubleshooting, webhook errors, rate limits, and SDK issues',
    members: 18,
    channels: ['chat', 'email'],
    skills: ['API Support', 'Webhooks', 'Technical', 'English'],
    agents: ['Ahmed Hassan', 'Lily Chen', 'Marcus Rivera'],
  },
  {
    id: 'inbox-escalation',
    name: 'Escalation Queue',
    description: 'Supervisor-level escalations from Tier 1 agents',
    members: 8,
    channels: ['chat', 'email', 'phone'],
    skills: ['All Skills', 'English', 'Spanish'],
    agents: ['David Chen', 'Rachel Torres'],
  },
];

// ─── AUTOPILOT — per-inbox configuration ────────────────────────────────────

export const AUTOPILOT_CONFIG = {
  enabled: true,
  mappings: [
    {
      inboxId: 'inbox-general-support',
      enabled: true,
      allowedActions: [
        'Get_Account_Details', 'Verify_Identity', 'Lookup_Invoice',
        'Get_Usage_Breakdown', 'Check_API_Status', 'Get_Onboarding_Progress',
      ],
    },
    {
      inboxId: 'inbox-billing',
      enabled: true,
      allowedActions: ['Lookup_Invoice', 'Get_Usage_Breakdown'],
    },
    {
      inboxId: 'inbox-vip-merchants',
      enabled: false,
      allowedActions: [],
    },
    {
      inboxId: 'inbox-onboarding',
      enabled: true,
      allowedActions: ['Get_Onboarding_Progress', 'Check_API_Status'],
    },
  ],
};

// ─── ACTIONS — all available tool definitions ───────────────────────────────

export const ALL_ACTIONS = [
  // Account Management
  { id: 'Get_Account_Details', name: 'Get Account Details', category: 'Account Management', type: 'READ', description: 'Retrieve merchant account profile, plan, and contact details' },
  { id: 'Verify_Identity', name: 'Verify Identity', category: 'Account Management', type: 'READ', description: 'Verify merchant identity via security factors (card last 4, email, security question)' },
  { id: 'Update_Account_Email', name: 'Update Account Email', category: 'Account Management', type: 'WRITE', description: 'Update the registered email address for the merchant account' },
  { id: 'Send_Password_Reset', name: 'Send Password Reset', category: 'Account Management', type: 'WRITE', description: 'Send a password reset link to the merchant\'s registered email' },
  { id: 'Reset_MFA', name: 'Reset MFA', category: 'Account Management', type: 'WRITE', description: 'Reset multi-factor authentication and generate new backup codes' },

  // Billing & Payments
  { id: 'Lookup_Invoice', name: 'Lookup Invoice', category: 'Billing & Payments', type: 'READ', description: 'Retrieve invoice details by account ID and billing period' },
  { id: 'Get_Usage_Breakdown', name: 'Get Usage Breakdown', category: 'Billing & Payments', type: 'READ', description: 'Fetch detailed API usage breakdown by integration and time period' },
  { id: 'Apply_Billing_Credit', name: 'Apply Billing Credit', category: 'Billing & Payments', type: 'WRITE', description: 'Apply a credit to the merchant\'s account (guardrail-governed)' },
  { id: 'Set_Usage_Alert', name: 'Set Usage Alert', category: 'Billing & Payments', type: 'WRITE', description: 'Configure usage threshold alerts at 50%, 75%, 90% of plan limit' },

  // Onboarding
  { id: 'Get_Onboarding_Progress', name: 'Get Onboarding Progress', category: 'Onboarding', type: 'READ', description: 'Fetch the merchant\'s onboarding checklist status and completion %' },
  { id: 'Check_API_Status', name: 'Check API Status', category: 'Onboarding', type: 'READ', description: 'Verify API connectivity, webhook reachability, and key validity' },
  { id: 'Validate_Stripe_Config', name: 'Validate Stripe Config', category: 'Onboarding', type: 'READ', description: 'Deep validation of Stripe API key, webhook endpoint, and event subscriptions' },
  { id: 'Update_Webhook_URL', name: 'Update Webhook URL', category: 'Onboarding', type: 'WRITE', description: 'Update the merchant\'s webhook endpoint URL in the platform' },
  { id: 'Trigger_Test_Transaction', name: 'Trigger Test Transaction', category: 'Onboarding', type: 'WRITE', description: 'Fire a $0.00 test transaction through the merchant\'s payment gateway' },

  // Technical
  { id: 'Review_Error_Logs', name: 'Review Error Logs', category: 'Technical', type: 'READ', description: 'Retrieve recent error logs for the merchant\'s API integrations' },
  { id: 'Check_Rate_Limits', name: 'Check Rate Limits', category: 'Technical', type: 'READ', description: 'Show current rate limit allocation, usage, and remaining capacity' },
  { id: 'Validate_Webhook_Endpoint', name: 'Validate Webhook Endpoint', category: 'Technical', type: 'READ', description: 'Send a test ping to the merchant\'s webhook URL and verify response' },
  { id: 'Rotate_API_Key', name: 'Rotate API Key', category: 'Technical', type: 'WRITE', description: 'Generate a new API key and deprecate the old one (with grace period)' },

  // System
  { id: 'Escalate_To_Supervisor', name: 'Escalate to Supervisor', category: 'System', type: 'SYSTEM', description: 'Flag conversation for supervisor review with context summary' },
  { id: 'Create_Support_Ticket', name: 'Create Support Ticket', category: 'System', type: 'SYSTEM', description: 'Escalate to Tier 2 engineering with full diagnostic bundle' },
];

// ─── GOALS — 5 specialized sub-agents ───────────────────────────────────────

export const NEXTIQ_GOALS = [
  {
    id: 'goal-chargeback',
    name: 'Chargeback & Dispute Resolution',
    description: 'Handles merchant fee disputes, unexpected overage charges, credit requests, and chargeback evidence submission. Routes through billing verification, usage analysis, and credit authorization workflows.',
    status: 'active',
    activationPatterns: [
      'chargeback', 'dispute', 'unexpected charge', 'overage',
      'charged too much', 'billing error', 'wrong amount',
      'refund', 'credit request', 'I never agreed',
    ],
    knowledge: [
      { id: 'kb-billing', name: 'KB_BillingInvoicing.pdf', category: 'Billing' },
      { id: 'kb-plans', name: 'KB_PlansAndPricing.pdf', category: 'Product' },
      { id: 'kb-overage', name: 'KB_OveragePolicy.pdf', category: 'Billing' },
      { id: 'kb-credits', name: 'KB_CreditAndRefundPolicy.pdf', category: 'Finance' },
    ],
    actions: [
      { id: 'act-lookup-inv', name: 'Lookup_Invoice', category: 'Billing & Payments' },
      { id: 'act-usage-bd', name: 'Get_Usage_Breakdown', category: 'Billing & Payments' },
      { id: 'act-apply-credit', name: 'Apply_Billing_Credit', category: 'Billing & Payments' },
      { id: 'act-set-alert', name: 'Set_Usage_Alert', category: 'Billing & Payments' },
      { id: 'act-verify', name: 'Verify_Identity', category: 'Account Management' },
      { id: 'act-escalate', name: 'Escalate_To_Supervisor', category: 'System' },
    ],
    guardrails: ['GR-001', 'GR-002', 'GR-003', 'GR-004', 'GR-005'],
    metrics: { sessions: 487, nbaAcceptance: 91, agentRating: 4.3 },
    prompt: `You are the Chargeback & Dispute Resolution specialist for Velocity Commerce merchants.

When activated:
1. Always pull invoice details BEFORE explaining charges — never guess at amounts or line items
2. Drill into usage breakdown to identify the root cause (which integration, what spike, when)
3. Frame overages constructively (high usage = high value) but acknowledge the surprise factor
4. For credit requests: check if this is the merchant's first overage. First overage with no alerts → courtesy credit is appropriate
5. Agent authority for credits is up to $500 without supervisor approval
6. Always proactively suggest usage alerts if the merchant didn't have them configured
7. When discussing plan changes, show the math: current cost vs. projected cost at current usage
8. If the merchant mentions legal action ("lawyer", "attorney"), DO NOT engage legally — let the Compliance Mode guardrail handle it

Post-resolution, identify if a plan upgrade would prevent future overages and surface it as a proactive suggestion.`,
    activity: [
      { time: '18 min ago', agent: 'Priya S.', customer: 'Marcus Rivera (UrbanGear)', action: 'Lookup_Invoice → Get_Usage → Apply_Credit → Set_Alert', nbasAccepted: 7, nbasTotal: 8 },
      { time: '1 hr ago', agent: 'Daniel L.', customer: 'Sarah Kim (FreshBake)', action: 'Lookup_Invoice → Get_Usage', nbasAccepted: 3, nbasTotal: 4 },
      { time: '2 hr ago', agent: 'Emma W.', customer: 'Tom Chen (GadgetHub)', action: 'Lookup_Invoice → Escalate_To_Supervisor', nbasAccepted: 4, nbasTotal: 5 },
      { time: '4 hr ago', agent: 'Priya S.', customer: 'Amir Patel (SpiceRoute)', action: 'Lookup_Invoice → Apply_Credit', nbasAccepted: 5, nbasTotal: 5 },
      { time: '6 hr ago', agent: 'Marcus R.', customer: 'Lisa Wong (ThreadCraft)', action: 'Get_Usage → Set_Usage_Alert', nbasAccepted: 3, nbasTotal: 3 },
    ],
  },
  {
    id: 'goal-account-security',
    name: 'Account Access & Security',
    description: 'Handles password resets, email updates, identity verification, and MFA recovery flows for merchants who cannot access their dashboard.',
    status: 'active',
    activationPatterns: [
      'password reset', 'locked out', "can't log in", 'forgot password',
      'MFA code', 'verification code', 'account access', 'two-factor',
      'email change', 'account recovery', "can't sign in",
    ],
    knowledge: [
      { id: 'kb-pw', name: 'KB_PasswordReset.pdf', category: 'Account Access' },
      { id: 'kb-sec', name: 'KB_AccountSecurity.pdf', category: 'Security' },
      { id: 'kb-mfa', name: 'KB_MFARecovery.pdf', category: 'Security' },
    ],
    actions: [
      { id: 'act-get-account', name: 'Get_Account_Details', category: 'Account Management' },
      { id: 'act-verify', name: 'Verify_Identity', category: 'Account Management' },
      { id: 'act-update-email', name: 'Update_Account_Email', category: 'Account Management' },
      { id: 'act-send-reset', name: 'Send_Password_Reset', category: 'Account Management' },
      { id: 'act-reset-mfa', name: 'Reset_MFA', category: 'Account Management' },
    ],
    guardrails: ['GR-001', 'GR-003'],
    metrics: { sessions: 342, nbaAcceptance: 87, agentRating: 4.2 },
    prompt: `You are the Account Access & Security specialist for Velocity Commerce.

When activated:
1. First identify WHY the reset failed (email mismatch, account lockout, MFA issue) before suggesting fixes
2. Proactively check the account details — the registered email may not match what the merchant is using
3. If the registered email doesn't match session context, surface the mismatch to the agent immediately
4. Always verify identity (2 of 5 factors) before any account-modifying action (email update, MFA reset)
5. After email update, guide the agent through: confirmation email → password reset → MFA recovery sequence
6. If MFA reset is needed and identity was already verified in this session, skip re-verification

Keep KB responses customer-facing — never include internal process steps (Admin Console paths, etc.) in suggested responses.`,
    activity: [
      { time: '12 min ago', agent: 'Jake T.', customer: 'Emily Carter (TechSpark)', action: 'Get_Account → Verify_Identity → Update_Email → Send_Reset', nbasAccepted: 6, nbasTotal: 7 },
      { time: '1 hr ago', agent: 'Sofia M.', customer: 'Robert Chen (SwiftShip)', action: 'Send_Password_Reset', nbasAccepted: 2, nbasTotal: 2 },
      { time: '3 hr ago', agent: 'Jake T.', customer: 'Lisa Wang (CraftBox)', action: 'Reset_MFA', nbasAccepted: 3, nbasTotal: 4 },
      { time: '5 hr ago', agent: 'Ahmed H.', customer: 'David Kim (CloudNine)', action: 'Verify_Identity → Send_Reset', nbasAccepted: 3, nbasTotal: 3 },
    ],
  },
  {
    id: 'goal-billing-plan',
    name: 'Billing & Plan Management',
    description: 'Handles routine invoice inquiries, plan comparisons, usage questions, and plan upgrade/downgrade requests. Non-dispute billing conversations.',
    status: 'active',
    activationPatterns: [
      'invoice', 'billing', 'my plan', 'plan upgrade', 'downgrade',
      'usage', 'how much', 'payment failed', 'subscription',
      'pricing', 'what plan', 'change plan',
    ],
    knowledge: [
      { id: 'kb-billing-inv', name: 'KB_BillingInvoicing.pdf', category: 'Billing' },
      { id: 'kb-plans', name: 'KB_PlansAndPricing.pdf', category: 'Product' },
      { id: 'kb-usage', name: 'KB_UsageAndOverages.pdf', category: 'Billing' },
    ],
    actions: [
      { id: 'act-lookup-inv', name: 'Lookup_Invoice', category: 'Billing & Payments' },
      { id: 'act-usage-bd', name: 'Get_Usage_Breakdown', category: 'Billing & Payments' },
      { id: 'act-set-alert', name: 'Set_Usage_Alert', category: 'Billing & Payments' },
      { id: 'act-get-account', name: 'Get_Account_Details', category: 'Account Management' },
    ],
    guardrails: ['GR-003', 'GR-005'],
    metrics: { sessions: 518, nbaAcceptance: 89, agentRating: 4.0 },
    prompt: `You are the Billing & Plan Management specialist for Velocity Commerce.

When activated:
1. Always pull invoice details before explaining charges — never guess at amounts
2. Break down charges into plain language: what the charge is, why it appeared, and how much
3. When presenting per-integration usage, highlight the top consumers and explain the correlation
4. For plan comparison requests, always show the math — current cost vs. projected cost at current usage
5. Proactively suggest usage alerts if the merchant doesn't have them configured
6. For payment failures, check the payment method status and suggest re-authorization steps

This goal handles ROUTINE billing — disputes and angry merchants are routed to the Chargeback & Dispute goal.`,
    activity: [
      { time: '25 min ago', agent: 'Daniel L.', customer: 'James Morrison (PetPals)', action: 'Lookup_Invoice → Get_Usage', nbasAccepted: 4, nbasTotal: 4 },
      { time: '2 hr ago', agent: 'Emma W.', customer: 'Anna Park (StyleHive)', action: 'Get_Account_Details → Lookup_Invoice', nbasAccepted: 3, nbasTotal: 3 },
      { time: '5 hr ago', agent: 'Priya S.', customer: 'Tom Bradley (FitGear)', action: 'Get_Usage → Set_Usage_Alert', nbasAccepted: 2, nbasTotal: 3 },
    ],
  },
  {
    id: 'goal-onboarding',
    name: 'Merchant Onboarding',
    description: 'Guides new merchants through store setup, payment gateway configuration (Stripe, PayPal), first product listing, shipping profiles, and first-transaction verification.',
    status: 'active',
    activationPatterns: [
      'just signed up', 'new merchant', 'setup', 'onboarding',
      'connect stripe', 'payment gateway', 'gateway error', 'first product',
      'how do I start', 'getting started', 'configure', 'webhook',
      'test transaction', 'go live',
    ],
    knowledge: [
      { id: 'kb-onboard', name: 'KB_MerchantOnboarding.pdf', category: 'Onboarding' },
      { id: 'kb-stripe', name: 'KB_StripeIntegration.pdf', category: 'Integration' },
      { id: 'kb-paypal', name: 'KB_PayPalIntegration.pdf', category: 'Integration' },
      { id: 'kb-products', name: 'KB_ProductListing.pdf', category: 'Commerce' },
      { id: 'kb-shipping', name: 'KB_ShippingProfiles.pdf', category: 'Commerce' },
    ],
    actions: [
      { id: 'act-onboard-progress', name: 'Get_Onboarding_Progress', category: 'Onboarding' },
      { id: 'act-api-status', name: 'Check_API_Status', category: 'Onboarding' },
      { id: 'act-validate-stripe', name: 'Validate_Stripe_Config', category: 'Onboarding' },
      { id: 'act-update-webhook', name: 'Update_Webhook_URL', category: 'Onboarding' },
      { id: 'act-test-txn', name: 'Trigger_Test_Transaction', category: 'Onboarding' },
      { id: 'act-create-ticket', name: 'Create_Support_Ticket', category: 'System' },
    ],
    guardrails: ['GR-003'],
    metrics: { sessions: 276, nbaAcceptance: 93, agentRating: 4.5 },
    prompt: `You are the Merchant Onboarding specialist for Velocity Commerce.

When activated:
1. Check the merchant's onboarding progress first — know which steps are complete, in-progress, or blocked
2. For gateway errors, check API status and key validity before asking the merchant to troubleshoot manually
3. Provide step-by-step instructions — many merchants are non-technical. Use simple language with exact navigation paths
4. For Stripe integration: always verify API key type (test vs. live), webhook URL, event subscriptions, and signing secret
5. After configuration changes, run validation and a test transaction to confirm end-to-end flow
6. For product listing guidance, include conversion tips (3+ images, 100+ word descriptions)
7. Proactively surface the next step in the onboarding checklist after resolving each issue

Remember: this goal often handles conversations from brand-new agents. Your suggestions should be detailed enough that a Day 1 agent can follow them.`,
    activity: [
      { time: '8 min ago', agent: 'Jake T.', customer: 'Aisha Patel (BrightLeaf Organics)', action: 'Get_Onboarding → Check_API → Update_Webhook → Validate_Stripe → Test_Txn', nbasAccepted: 9, nbasTotal: 10 },
      { time: '45 min ago', agent: 'Sofia M.', customer: 'Chris Yang (NeonSnap)', action: 'Get_Onboarding → Check_API', nbasAccepted: 4, nbasTotal: 4 },
      { time: '3 hr ago', agent: 'Lily C.', customer: 'Maria Santos (FloraVida)', action: 'Get_Onboarding → Validate_Stripe → Test_Txn', nbasAccepted: 6, nbasTotal: 7 },
      { time: '5 hr ago', agent: 'Jake T.', customer: 'Raj Kapoor (SpiceMart)', action: 'Get_Onboarding → Update_Webhook', nbasAccepted: 3, nbasTotal: 3 },
      { time: '8 hr ago', agent: 'Sofia M.', customer: 'Ben Taylor (ArtFrame)', action: 'Get_Onboarding → Create_Support_Ticket', nbasAccepted: 2, nbasTotal: 3 },
    ],
  },
  {
    id: 'goal-api-integration',
    name: 'API & Integration Support',
    description: 'Handles webhook errors, rate limiting, API authentication failures, SDK troubleshooting, and advanced integration issues for technical merchants.',
    status: 'paused',
    activationPatterns: [
      'API error', 'rate limit', '429', '401', '403', '500',
      'webhook error', 'timeout', 'SDK', 'endpoint',
      'authentication failed', 'invalid token', 'CORS',
    ],
    knowledge: [
      { id: 'kb-api', name: 'KB_APIDocs.pdf', category: 'Technical' },
      { id: 'kb-webhooks', name: 'KB_WebhookGuide.pdf', category: 'Technical' },
      { id: 'kb-ratelimit', name: 'KB_RateLimiting.pdf', category: 'Technical' },
      { id: 'kb-sdk', name: 'KB_SDKReference.pdf', category: 'Technical' },
    ],
    actions: [
      { id: 'act-api-check', name: 'Check_API_Status', category: 'Technical' },
      { id: 'act-error-logs', name: 'Review_Error_Logs', category: 'Technical' },
      { id: 'act-rate-limits', name: 'Check_Rate_Limits', category: 'Technical' },
      { id: 'act-validate-wh', name: 'Validate_Webhook_Endpoint', category: 'Technical' },
      { id: 'act-rotate-key', name: 'Rotate_API_Key', category: 'Technical' },
      { id: 'act-create-ticket', name: 'Create_Support_Ticket', category: 'System' },
    ],
    guardrails: ['GR-003'],
    metrics: { sessions: 0, nbaAcceptance: 0, agentRating: '-' },
    prompt: `You are the API & Integration Support specialist for Velocity Commerce.

When activated:
1. Ask for the specific error code or message before suggesting solutions
2. Check API status and error logs to determine if the issue is systemic or account-specific
3. For rate limit (429) errors, show current limits, usage, and suggest optimization strategies
4. For authentication errors (401/403), verify API key validity and check if it was recently rotated
5. For webhook issues, validate the endpoint reachability and check event subscription configuration
6. For SDK issues, confirm the SDK version and check for known compatibility issues
7. Escalate to Tier 2 engineering (Create_Support_Ticket) if the issue persists after standard troubleshooting

NOTE: This goal is currently PAUSED — planned for Phase 2 activation.`,
    activity: [],
  },
];

// ─── GUARDRAILS — governance rules ──────────────────────────────────────────

export const NEXTIQ_GUARDRAILS = [
  {
    id: 'GR-001',
    name: 'Identity Verification Required',
    description: 'Merchant identity must be verified before any account-modifying action is executed (email changes, MFA resets, credit applications).',
    severity: 'critical',
    status: 'active',
    condition: 'When an ACTION NBA involves account modification (email update, MFA reset, password reset, credit application) AND Verify_Identity has not been executed in the current session',
    constraint: 'Block the action. Surface Verify_Identity as the required first step. Nudge the agent: "Identity verification required before this action can proceed."',
    applicableGoals: ['goal-chargeback', 'goal-account-security', 'goal-billing-plan'],
  },
  {
    id: 'GR-002',
    name: 'Credit Authorization Limit',
    description: 'Credits above $500 require supervisor approval before processing. Credits up to $500 can be applied by the agent directly.',
    severity: 'critical',
    status: 'active',
    condition: 'When Apply_Billing_Credit action is triggered with amount > $500',
    constraint: 'Block auto-execution. Surface supervisor approval prompt to agent. Log the credit request with amount, reason, and merchant details for supervisor review.',
    applicableGoals: ['goal-chargeback'],
  },
  {
    id: 'GR-003',
    name: 'PII Masking in Responses',
    description: 'Never include full email addresses, card numbers, SSN, or phone numbers in KB responses or NBA text shown to the agent.',
    severity: 'warning',
    status: 'active',
    condition: 'On every KB Response and NBA text generation across all goals',
    constraint: 'Regex scan for PII patterns (email, card numbers, SSN, phone). Mask to partial format: j***@domain.com, ****4891, ***-**-1234. Source data from tool responses can show full PII to agent — masking applies to AI-generated text only.',
    applicableGoals: ['goal-chargeback', 'goal-account-security', 'goal-billing-plan', 'goal-onboarding', 'goal-api-integration'],
  },
  {
    id: 'GR-004',
    name: 'Compliance Mode on Legal Keywords',
    description: 'When a merchant mentions legal action, restrict NextIQ to safe responses only and notify supervisor immediately.',
    severity: 'critical',
    status: 'active',
    condition: 'Customer message contains: "lawyer", "attorney", "legal action", "sue", "litigation", "legal team", "court"',
    constraint: 'Switch to REPLY-only mode — disable all ACTION NBAs. Notify supervisor via Escalate_To_Supervisor. Log all messages for legal review. Compliance mode remains active until supervisor explicitly clears it.',
    applicableGoals: ['goal-chargeback', 'goal-account-security', 'goal-billing-plan'],
  },
  {
    id: 'GR-005',
    name: 'No Auto-Refunds in Autopilot',
    description: 'Financial actions (credits, refunds, plan changes) must never auto-execute in Autopilot mode, regardless of inbox configuration.',
    severity: 'critical',
    status: 'active',
    condition: 'Autopilot mode is active AND action category is financial (Apply_Billing_Credit, plan modification, refund processing)',
    constraint: 'Always require explicit agent click for financial actions, even if the inbox has Autopilot enabled and the action is in the allowed list. Surface as a manual NBA with a prominent "Requires Agent Approval" badge.',
    applicableGoals: ['goal-chargeback', 'goal-billing-plan'],
  },
  {
    id: 'GR-006',
    name: 'GDPR Data Handling (UK Merchants)',
    description: 'For merchants in the UK geography, restrict PII surfacing and add consent language to data-related actions.',
    severity: 'warning',
    status: 'active',
    condition: 'Merchant account geography is "UK" OR conversation inbox is tagged with UK region',
    constraint: 'Limit data surfacing in KB responses to non-PII fields. Add GDPR consent language to any action that accesses or modifies personal data. Log all data access actions with GDPR compliance tag.',
    applicableGoals: ['goal-chargeback', 'goal-account-security', 'goal-billing-plan', 'goal-onboarding'],
  },
];
