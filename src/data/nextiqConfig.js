export const NEXTIQ_ENGINE = {
  systemPrompt: `You are NextIQ, an AI co-pilot embedded in the human agent's workspace within the Nextiva NEXT platform. Your role is to assist — not replace — the human agent by:

1. Surfacing relevant knowledge base responses when the customer's question matches a known topic
2. Suggesting Next Best Actions (NBAs) that the agent can accept, modify, or dismiss
3. Executing tool calls (Actions) when the agent explicitly approves them
4. Providing contextual analysis after tool responses to help the agent understand the result

You delegate to specialized sub-agents (Goals) based on the customer's intent. Each sub-agent has its own knowledge scope, available actions, and behavioral instructions. When no sub-agent matches the conversation intent, fall back to general knowledge retrieval.

You never communicate directly with the customer. All your outputs are suggestions to the human agent.`,
  adminPrompt: `Always greet the customer by name in the first response.
Never make pricing commitments without checking the customer's current plan details first.
When customer sentiment is negative, prioritize empathy over efficiency.
All credits above $200 require supervisor approval.
If the customer mentions a competitor, do not disparage — focus on our strengths.`,
  maxNBAsPerTurn: 2,
  fallbackBehavior: 'kb_only',
};

export const ALL_INBOXES = [
  {
    id: 'inbox-support',
    name: 'Support Team',
    description: 'Handles all inbound customer support inquiries across channels',
    members: 12,
    channels: ['email', 'chat', 'phone'],
    skills: ['Technical Support', 'Billing', 'English', 'Spanish'],
    agents: ['Anil Reddy', 'Jamie Chen', 'Priya Patel', 'Marcus Brown', 'Sophia Wang'],
  },
  {
    id: 'inbox-general',
    name: 'General Inbox',
    description: 'Catch-all inbox for unrouted conversations',
    members: 8,
    channels: ['email', 'chat'],
    skills: ['English'],
    agents: ['Anil Reddy', 'Jamie Chen'],
  },
  {
    id: 'inbox-sales',
    name: 'Sales Team',
    description: 'Inbound and outbound sales conversations',
    members: 5,
    channels: ['email', 'phone'],
    skills: ['Sales', 'English'],
    agents: ['Marcus Brown'],
  },
  {
    id: 'inbox-vip',
    name: 'VIP Accounts',
    description: 'Dedicated queue for high-value customer accounts',
    members: 3,
    channels: ['email', 'phone'],
    skills: ['VIP Accounts', 'Billing', 'English'],
    agents: ['Anil Reddy', 'Priya Patel'],
  },
  {
    id: 'inbox-escalation',
    name: 'Escalation Queue',
    description: 'Supervisor-level escalations from Tier 1 agents',
    members: 4,
    channels: ['email', 'chat', 'phone'],
    skills: ['Technical Support', 'Billing', 'English', 'Spanish'],
    agents: ['Jamie Chen', 'Sophia Wang'],
  },
  {
    id: 'inbox-afterhours',
    name: 'After Hours',
    description: 'Conversations received outside of business hours',
    members: 2,
    channels: ['email', 'chat'],
    skills: ['English'],
    agents: ['Priya Patel'],
  },
];

export const AUTOPILOT_CONFIG = {
  enabled: true,
  mappings: [
    { inboxId: 'inbox-support', allowedActions: ['Get_Account_Details', 'Verify_Identity', 'Send_Password_Reset', 'Lookup_Invoice', 'Get_Usage_Breakdown', 'Set_Usage_Alert'], enabled: true },
    { inboxId: 'inbox-general', allowedActions: ['Get_Account_Details', 'Lookup_Invoice'], enabled: false },
  ],
};

export const ALL_ACTIONS = [
  { id: 'Get_Account_Details', name: 'Get_Account_Details', category: 'Account Management' },
  { id: 'Verify_Identity', name: 'Verify_Identity', category: 'Account Management' },
  { id: 'Update_Account_Email', name: 'Update_Account_Email', category: 'Account Management' },
  { id: 'Send_Password_Reset', name: 'Send_Password_Reset', category: 'Account Management' },
  { id: 'Reset_MFA', name: 'Reset_MFA', category: 'Account Management' },
  { id: 'Lookup_Invoice', name: 'Lookup_Invoice', category: 'Billing & Payments' },
  { id: 'Get_Usage_Breakdown', name: 'Get_Usage_Breakdown', category: 'Billing & Payments' },
  { id: 'Set_Usage_Alert', name: 'Set_Usage_Alert', category: 'Communication' },
  { id: 'Apply_Billing_Credit', name: 'Apply_Billing_Credit', category: 'Billing & Payments' },
  { id: 'Check_API_Status', name: 'Check_API_Status', category: 'Technical' },
  { id: 'Review_Error_Logs', name: 'Review_Error_Logs', category: 'Technical' },
];

export const NEXTIQ_GOALS = [
  {
    id: 'goal-pw-reset',
    name: 'Password Reset & Account Recovery',
    description: 'Handles password resets, email updates, identity verification, and MFA recovery flows for customers who cannot access their account.',
    status: 'active',
    activationPatterns: ['password reset', 'locked out', "can't log in", 'forgot password', 'MFA code', 'verification code', 'account access'],
    knowledge: [
      { id: 'kb-pw', name: 'KB_PasswordReset.pdf', category: 'Account Access' },
      { id: 'kb-sec', name: 'KB_AccountSecurity.pdf', category: 'Security' },
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
    prompt: `You are the Password Reset & Account Recovery specialist.

When activated:
1. First identify WHY the reset failed (email mismatch, account lockout, MFA issue) before suggesting fixes
2. If the registered email doesn't match session context, surface the mismatch to the agent immediately
3. Always verify identity (2 of 5 factors) before any account-modifying action
4. After email update, guide the agent through the confirmation → reset → MFA recovery sequence
5. If MFA reset is needed and identity was already verified in this session, skip re-verification

Keep KB responses customer-facing — never include internal process steps (Admin Console paths, etc.) in suggested responses.`,
    activity: [
      { time: '12 min ago', agent: 'Anil R.', customer: 'Emily Carter', action: 'Verify_Identity → Update_Email → Send_Reset', nbasAccepted: 4, nbasTotal: 5 },
      { time: '1 hr ago', agent: 'Jamie C.', customer: 'Robert Chen', action: 'Send_Password_Reset', nbasAccepted: 2, nbasTotal: 2 },
      { time: '2 hr ago', agent: 'Priya P.', customer: 'Lisa Wang', action: 'Reset_MFA', nbasAccepted: 3, nbasTotal: 4 },
      { time: '3 hr ago', agent: 'Marcus B.', customer: 'David Kim', action: 'Verify_Identity → Send_Reset', nbasAccepted: 3, nbasTotal: 3 },
      { time: '5 hr ago', agent: 'Sophia W.', customer: 'Alex Turner', action: 'Get_Account_Details only (no reset needed)', nbasAccepted: 1, nbasTotal: 2 },
    ],
  },
  {
    id: 'goal-billing',
    name: 'Billing Inquiry & Dispute Resolution',
    description: 'Handles invoice questions, overage explanations, credits, refunds, and plan optimization for customers with billing concerns.',
    status: 'active',
    activationPatterns: ['invoice', 'billing', 'charge', 'overage', 'refund', 'credit', 'payment', 'subscription', 'plan change'],
    knowledge: [
      { id: 'kb-billing', name: 'KB_BillingInvoicing.pdf', category: 'Billing' },
      { id: 'kb-plans', name: 'KB_Plans.pdf', category: 'Product' },
    ],
    actions: [
      { id: 'act-lookup-inv', name: 'Lookup_Invoice', category: 'Billing & Payments' },
      { id: 'act-usage-bd', name: 'Get_Usage_Breakdown', category: 'Billing & Payments' },
      { id: 'act-set-alert', name: 'Set_Usage_Alert', category: 'Communication' },
      { id: 'act-apply-credit', name: 'Apply_Billing_Credit', category: 'Billing & Payments' },
    ],
    guardrails: ['GR-001', 'GR-002', 'GR-003'],
    metrics: { sessions: 518, nbaAcceptance: 91, agentRating: 4.0 },
    prompt: `You are the Billing Inquiry & Dispute Resolution specialist.

When activated:
1. Always pull invoice details before explaining charges — never guess at amounts
2. Break down charges into plain language: what the charge is, why it appeared, and how much
3. When presenting per-agent usage, highlight the top consumers and explain Manual vs Autopilot impact
4. For credit requests: agent authority is up to $200 without approval; above $200 flag for supervisor
5. Proactively suggest usage alerts if the customer didn't have them configured
6. When discussing plan changes, always show the math — current cost vs. projected cost

Frame overages positively (high usage = high value delivered) but acknowledge the surprise factor.`,
    activity: [
      { time: '25 min ago', agent: 'Anil R.', customer: 'James Morrison', action: 'Lookup_Invoice → Get_Usage_Breakdown → Apply_Credit', nbasAccepted: 6, nbasTotal: 7 },
      { time: '2 hr ago', agent: 'Marcus B.', customer: 'Sarah Kim', action: 'Lookup_Invoice → Set_Usage_Alert', nbasAccepted: 3, nbasTotal: 4 },
      { time: '4 hr ago', agent: 'Jamie C.', customer: 'Tom Bradley', action: 'Get_Usage_Breakdown', nbasAccepted: 2, nbasTotal: 2 },
    ],
  },
  {
    id: 'goal-tech-support',
    name: 'Technical Support',
    description: 'Handles API errors, integration issues, rate limiting, and platform troubleshooting for technical customers.',
    status: 'paused',
    activationPatterns: ['API error', 'rate limit', '429', 'integration', 'webhook', 'technical issue', 'endpoint', 'timeout'],
    knowledge: [
      { id: 'kb-tech', name: 'KB_TechnicalSupport.pdf', category: 'Technical' },
    ],
    actions: [
      { id: 'act-api-status', name: 'Check_API_Status', category: 'Account Management' },
      { id: 'act-error-logs', name: 'Review_Error_Logs', category: 'Account Management' },
    ],
    guardrails: ['GR-003'],
    metrics: { sessions: 0, nbaAcceptance: 0, agentRating: '-' },
    prompt: `You are the Technical Support specialist.

When activated:
1. Ask for the specific error code or message before suggesting solutions
2. Check API status and error logs to determine if the issue is systemic or account-specific
3. For rate limit (429) errors, explain the current limits and suggest optimization strategies
4. For integration issues, verify the webhook URL and authentication credentials are correct
5. Escalate to Tier 2 engineering if the issue persists after standard troubleshooting`,
    activity: [],
  },
];

export const NEXTIQ_GUARDRAILS = [
  {
    id: 'GR-001',
    name: 'Identity Verification Required',
    description: 'Identity must be verified before any account-modifying action is executed.',
    severity: 'critical',
    status: 'active',
    condition: 'When an ACTION NBA involves account modification (email update, MFA reset, plan change)',
    constraint: 'Block the action and nudge the agent if Verify_Identity has not been executed in the current session',
    applicableGoals: ['goal-pw-reset', 'goal-billing'],
  },
  {
    id: 'GR-002',
    name: 'Credit Authorization Limit',
    description: 'Credits above $200 require supervisor approval before processing.',
    severity: 'critical',
    status: 'active',
    condition: 'When Apply_Billing_Credit action is triggered with amount > $200',
    constraint: 'Block auto-execution, surface supervisor approval prompt to agent',
    applicableGoals: ['goal-billing'],
  },
  {
    id: 'GR-003',
    name: 'No PII in Suggested Responses',
    description: 'Never include full email addresses, card numbers, SSN, or phone numbers in KB responses or NBA text shown to the agent.',
    severity: 'warning',
    status: 'active',
    condition: 'On every KB Response and NBA text generation',
    constraint: 'Mask or redact PII patterns before surfacing to the agent. Show only last 4 digits for cards, masked format for emails.',
    applicableGoals: ['goal-pw-reset', 'goal-billing', 'goal-tech-support'],
  },
  {
    id: 'GR-004',
    name: 'Compliance Mode on Legal Keywords',
    description: 'When a customer mentions legal action, restrict NextIQ to safe responses only.',
    severity: 'critical',
    status: 'active',
    condition: 'Customer message contains: "lawyer", "attorney", "legal action", "sue", "litigation"',
    constraint: 'Restrict to REPLY-only NBAs. Disable all ACTION NBAs. Notify supervisor. Log all messages for legal review.',
    applicableGoals: ['goal-pw-reset', 'goal-billing', 'goal-tech-support'],
  },
  {
    id: 'GR-005',
    name: 'No Auto-Refunds in Autopilot',
    description: 'Financial actions (refunds, credits, plan changes) must never auto-execute in Autopilot mode.',
    severity: 'critical',
    status: 'active',
    condition: 'Autopilot mode is active AND action category is "financial"',
    constraint: 'Always require explicit agent click for financial actions, even in Autopilot',
    applicableGoals: ['goal-billing'],
  },
];
