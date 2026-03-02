import { useState, useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  addEdge, useNodesState, useEdgesState, Controls, Background, MarkerType,
  BackgroundVariant, ReactFlowProvider, useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  ArrowLeft, Save, Play, Flag, StopCircle, Sparkles, Network,
  GitBranch, Database, Code, ChevronDown,
} from 'lucide-react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';

import StartNode from './ActionNodes/StartNode';
import EndNode from './ActionNodes/EndNode';
import AIPromptNode from './ActionNodes/AIPromptNode';
import APINode from './ActionNodes/APINode';
import ConditionNode from './ActionNodes/ConditionNode';
import IntegrationNode from './ActionNodes/IntegrationNode';
import ScriptNode from './ActionNodes/ScriptNode';

import StartNodeConfig from './ActionNodeConfigs/StartNodeConfig';
import EndNodeConfig from './ActionNodeConfigs/EndNodeConfig';
import AIPromptNodeConfig from './ActionNodeConfigs/AIPromptNodeConfig';
import APINodeConfig from './ActionNodeConfigs/APINodeConfig';
import ConditionNodeConfig from './ActionNodeConfigs/ConditionNodeConfig';
import IntegrationNodeConfig from './ActionNodeConfigs/IntegrationNodeConfig';
import ScriptNodeConfig from './ActionNodeConfigs/ScriptNodeConfig';

/* ─── Pre-built workflow templates ─── */
const ACTION_TEMPLATES = {
  'fetch-account': {
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 50, y: 200 }, data: { label: 'Start', inputFields: [{ id: 'i1', name: 'customer_id', dataType: 'string', required: true, description: 'Unique customer identifier from CRM' }, { id: 'i2', name: 'include_history', dataType: 'boolean', required: false, description: 'Whether to include interaction history' }], outputFields: [{ id: 'o1', name: 'account_summary', dataType: 'string', description: 'Human-readable account summary' }, { id: 'o2', name: 'account_data', dataType: 'object', description: 'Structured account record' }] } },
      { id: 'ai-1', type: 'action-ai', position: { x: 350, y: 160 }, data: { nodeName: 'Prepare Account Query', systemPrompt: 'You are an AI agent responsible for fetching and interpreting customer account data. You have access to the Nextiva Account API. Your job is to construct the correct API request based on the input, and later summarize the response for a support agent.', userPrompt: 'Customer ID: {{customer_id}}\nInclude history: {{include_history}}\n\nConstruct the API query parameters. Return a JSON object with endpoint path and query params.', temperature: 0.2, maxTokens: 300 } },
      { id: 'api-1', type: 'api', position: { x: 700, y: 160 }, data: { nodeName: 'GET Account Details', method: 'GET', url: 'https://api.nextiva.com/v1/accounts/{{customer_id}}?includeHistory={{include_history}}', headers: { Authorization: 'Bearer {{api_token}}', 'Content-Type': 'application/json' }, timeout: 15, outputVariable: 'data.account' } },
      { id: 'ai-2', type: 'action-ai', position: { x: 1050, y: 160 }, data: { nodeName: 'Summarize Account', systemPrompt: 'You are a CRM data assistant. Summarize raw account data into a concise, agent-friendly format. Highlight key info: plan, status, tenure, LTV, risk flags, and recent activity.', userPrompt: 'Summarize this account data for a support agent:\n\n{{api_response}}\n\nProvide a structured summary with sections: Overview, Plan Details, Risk Indicators, Recent Activity.', temperature: 0.3, maxTokens: 600 } },
      { id: 'end-1', type: 'end', position: { x: 1400, y: 200 }, data: { nodeName: 'Return Account', selectedOutputs: ['account_summary', 'account_data'], transformations: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'ai-1', sourceHandle: 'start-output', targetHandle: 'ai-input' },
      { id: 'e2', source: 'ai-1', target: 'api-1', sourceHandle: 'ai-output', targetHandle: 'api-input' },
      { id: 'e3', source: 'api-1', target: 'ai-2', sourceHandle: 'api-output', targetHandle: 'ai-input' },
      { id: 'e4', source: 'ai-2', target: 'end-1', sourceHandle: 'ai-output', targetHandle: 'end-input' },
    ],
  },
  'check-subscription': {
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 50, y: 200 }, data: { label: 'Start', inputFields: [{ id: 'i1', name: 'customer_id', dataType: 'string', required: true, description: 'Customer ID' }, { id: 'i2', name: 'query_context', dataType: 'string', required: false, description: 'What the agent wants to know (e.g. renewal date, entitlements)' }], outputFields: [{ id: 'o1', name: 'subscription_summary', dataType: 'string', description: 'Agent-friendly subscription overview' }, { id: 'o2', name: 'subscription_data', dataType: 'object', description: 'Raw subscription object' }] } },
      { id: 'ai-1', type: 'action-ai', position: { x: 350, y: 160 }, data: { nodeName: 'Interpret Subscription Query', systemPrompt: 'You are an AI agent that retrieves and interprets subscription data. You understand plan tiers (Starter, Business Pro, Enterprise), billing cycles, add-ons, and entitlements. Translate the agent\'s query into an API call and later interpret the results.', userPrompt: 'Agent wants to check subscription for customer {{customer_id}}.\nContext: {{query_context}}\n\nDetermine which subscription fields are relevant and prepare the API request.', temperature: 0.2, maxTokens: 300 } },
      { id: 'api-1', type: 'api', position: { x: 700, y: 160 }, data: { nodeName: 'GET Subscription', method: 'GET', url: 'https://api.nextiva.com/v1/subscriptions/{{customer_id}}', headers: { Authorization: 'Bearer {{api_token}}', 'Content-Type': 'application/json' }, timeout: 15, outputVariable: 'data.subscription' } },
      { id: 'ai-2', type: 'action-ai', position: { x: 1050, y: 160 }, data: { nodeName: 'Summarize Subscription', systemPrompt: 'You are a subscription data analyst. Present subscription details clearly: plan name, billing cycle, renewal date, seats, add-ons, and any upcoming changes.', userPrompt: 'Subscription data:\n{{api_response}}\n\nAgent context: {{query_context}}\n\nSummarize the subscription focusing on what the agent needs to know.', temperature: 0.3, maxTokens: 500 } },
      { id: 'end-1', type: 'end', position: { x: 1400, y: 200 }, data: { nodeName: 'Return Subscription', selectedOutputs: ['subscription_summary', 'subscription_data'], transformations: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'ai-1', sourceHandle: 'start-output', targetHandle: 'ai-input' },
      { id: 'e2', source: 'ai-1', target: 'api-1', sourceHandle: 'ai-output', targetHandle: 'api-input' },
      { id: 'e3', source: 'api-1', target: 'ai-2', sourceHandle: 'api-output', targetHandle: 'ai-input' },
      { id: 'e4', source: 'ai-2', target: 'end-1', sourceHandle: 'ai-output', targetHandle: 'end-input' },
    ],
  },
  'check-usage': {
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 50, y: 200 }, data: { label: 'Start', inputFields: [{ id: 'i1', name: 'customer_id', dataType: 'string', required: true, description: 'Customer ID' }, { id: 'i2', name: 'metric_type', dataType: 'string', required: false, description: 'Specific metric: api_calls, storage, minutes, or all' }, { id: 'i3', name: 'period', dataType: 'string', required: false, description: 'Time period (last_24h, last_7d, last_30d)' }], outputFields: [{ id: 'o1', name: 'usage_report', dataType: 'string', description: 'Formatted usage report' }, { id: 'o2', name: 'is_over_limit', dataType: 'boolean', description: 'Whether any metric exceeds plan limit' }] } },
      { id: 'ai-1', type: 'action-ai', position: { x: 350, y: 140 }, data: { nodeName: 'Analyze Usage Request', systemPrompt: 'You are an AI agent that monitors and reports on customer usage metrics. You understand API rate limits, storage quotas, call minutes, and seat utilization. Build the right API query and later analyze whether usage is healthy or exceeding limits.', userPrompt: 'Check usage for customer {{customer_id}}.\nMetric: {{metric_type}}\nPeriod: {{period}}\n\nPrepare the usage API query parameters.', temperature: 0.2, maxTokens: 300 } },
      { id: 'api-1', type: 'api', position: { x: 700, y: 140 }, data: { nodeName: 'GET Usage Metrics', method: 'GET', url: 'https://api.nextiva.com/v1/usage/{{customer_id}}?metric={{metric_type}}&period={{period}}', headers: { Authorization: 'Bearer {{api_token}}' }, timeout: 20, outputVariable: 'data.usage' } },
      { id: 'ai-2', type: 'action-ai', position: { x: 1050, y: 140 }, data: { nodeName: 'Interpret Usage Data', systemPrompt: 'You are a usage analytics expert. Analyze raw usage data against plan limits. Flag any metrics that are over 80% utilization. Recommend actions if limits are being approached or exceeded (e.g., temporary increase, plan upgrade).', userPrompt: 'Usage data:\n{{api_response}}\n\nAnalyze and report:\n1. Current usage vs plan limits\n2. Any overages or risk areas\n3. Recommendations for the agent', temperature: 0.3, maxTokens: 600 } },
      { id: 'end-1', type: 'end', position: { x: 1400, y: 200 }, data: { nodeName: 'Return Usage Report', selectedOutputs: ['usage_report', 'is_over_limit'], transformations: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'ai-1', sourceHandle: 'start-output', targetHandle: 'ai-input' },
      { id: 'e2', source: 'ai-1', target: 'api-1', sourceHandle: 'ai-output', targetHandle: 'api-input' },
      { id: 'e3', source: 'api-1', target: 'ai-2', sourceHandle: 'api-output', targetHandle: 'ai-input' },
      { id: 'e4', source: 'ai-2', target: 'end-1', sourceHandle: 'ai-output', targetHandle: 'end-input' },
    ],
  },
  'modify-plan': {
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 50, y: 200 }, data: { label: 'Start', inputFields: [{ id: 'i1', name: 'user_id', dataType: 'string', required: true, description: 'Customer/User ID' }, { id: 'i2', name: 'new_plan_details', dataType: 'object', required: true, description: 'Target plan info (planId, tier, seats)' }, { id: 'i3', name: 'modify_action', dataType: 'string', required: true, description: 'Action type: upgrade, downgrade, or cancel' }], outputFields: [{ id: 'o1', name: 'success_message', dataType: 'string', description: 'Confirmation message for the agent' }, { id: 'o2', name: 'modified_plan_details', dataType: 'object', description: 'Updated plan details after modification' }] } },
      { id: 'ai-1', type: 'action-ai', position: { x: 370, y: 140 }, data: { nodeName: 'Plan Modification Agent', systemPrompt: 'You are an AI agent that analyzes user plans and executes modifications like cancel, upgrade, and downgrade. You have access to the Nextiva Subscription API. Your job is to:\n1. Validate the requested change is possible\n2. Transform the user input into the correct API payload\n3. Handle edge cases (e.g., mid-cycle prorations, contract minimums)\n\nAvailable actions: upgrade, downgrade, cancel\nAvailable plans: Starter (60 req/min), Business Pro (300 req/min), Enterprise (1000+ req/min)', userPrompt: 'User ID: {{user_id}}\nRequested action: {{modify_action}}\nNew plan details: {{new_plan_details}}\n\nValidate eligibility and prepare the API request body. Return JSON with: { "eligible": true/false, "reason": "...", "apiPayload": {...} }', temperature: 0.2, maxTokens: 500 } },
      { id: 'cond-1', type: 'condition', position: { x: 720, y: 120 }, data: { nodeName: 'Eligible?', conditions: [{ variable: 'ai_response.eligible', operator: 'equals', value: 'true' }], logicOperator: 'AND' } },
      { id: 'api-1', type: 'api', position: { x: 1000, y: 30 }, data: { nodeName: 'Execute Plan Modification', method: 'PUT', url: 'https://api.nextiva.com/v1/subscriptions/{{user_id}}/plan', headers: { Authorization: 'Bearer {{api_token}}', 'Content-Type': 'application/json' }, body: '{{ai_response.apiPayload}}', timeout: 20, outputVariable: 'data.result' } },
      { id: 'ai-2', type: 'action-ai', position: { x: 1350, y: 30 }, data: { nodeName: 'Confirm Plan Change', systemPrompt: 'You are a customer success assistant. Generate a clear, friendly confirmation message about the plan change for the support agent to share with the customer.', userPrompt: 'Plan modification result:\n{{api_response}}\n\nAction: {{modify_action}}\nGenerate a confirmation message including: what changed, effective date, any billing implications, and next steps.', temperature: 0.4, maxTokens: 400 } },
      { id: 'end-ok', type: 'end', position: { x: 1700, y: 30 }, data: { nodeName: 'Plan Modified', selectedOutputs: ['success_message', 'modified_plan_details'], transformations: [] } },
      { id: 'ai-fail', type: 'action-ai', position: { x: 1000, y: 300 }, data: { nodeName: 'Explain Ineligibility', systemPrompt: 'You are a helpful assistant. Explain to the agent why the plan modification cannot proceed and suggest alternatives.', userPrompt: 'The plan modification was rejected.\nReason: {{ai_response.reason}}\nAction: {{modify_action}}\n\nExplain why this change is not possible and suggest what the agent can do instead.', temperature: 0.4, maxTokens: 300 } },
      { id: 'end-fail', type: 'end', position: { x: 1350, y: 300 }, data: { nodeName: 'Not Eligible', selectedOutputs: ['success_message'], transformations: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'ai-1', sourceHandle: 'start-output', targetHandle: 'ai-input' },
      { id: 'e2', source: 'ai-1', target: 'cond-1', sourceHandle: 'ai-output', targetHandle: 'condition-input' },
      { id: 'e3', source: 'cond-1', target: 'api-1', sourceHandle: 'true', targetHandle: 'api-input' },
      { id: 'e4', source: 'cond-1', target: 'ai-fail', sourceHandle: 'false', targetHandle: 'ai-input' },
      { id: 'e5', source: 'api-1', target: 'ai-2', sourceHandle: 'api-output', targetHandle: 'ai-input' },
      { id: 'e6', source: 'ai-2', target: 'end-ok', sourceHandle: 'ai-output', targetHandle: 'end-input' },
      { id: 'e7', source: 'ai-fail', target: 'end-fail', sourceHandle: 'ai-output', targetHandle: 'end-input' },
    ],
  },
  'check-credit-card': {
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 50, y: 200 }, data: { label: 'Start', inputFields: [{ id: 'i1', name: 'customer_id', dataType: 'string', required: true, description: 'Customer ID' }, { id: 'i2', name: 'verification_reason', dataType: 'string', required: false, description: 'Why the card is being checked (billing issue, update, etc.)' }], outputFields: [{ id: 'o1', name: 'card_summary', dataType: 'string', description: 'Masked card details for agent' }, { id: 'o2', name: 'payment_methods', dataType: 'array', description: 'List of payment methods on file' }] } },
      { id: 'ai-1', type: 'action-ai', position: { x: 370, y: 160 }, data: { nodeName: 'Payment Data Agent', systemPrompt: 'You are an AI agent responsible for securely retrieving and presenting payment method information. You must NEVER expose full card numbers. Always mask sensitive data (show only last 4 digits). You have access to the Nextiva Billing API to fetch payment methods.', userPrompt: 'Retrieve payment methods for customer {{customer_id}}.\nReason: {{verification_reason}}\n\nPrepare the API request and specify which fields to return (masked).', temperature: 0.1, maxTokens: 200 } },
      { id: 'api-1', type: 'api', position: { x: 720, y: 160 }, data: { nodeName: 'GET Payment Methods', method: 'GET', url: 'https://api.nextiva.com/v1/billing/{{customer_id}}/payment-methods', headers: { Authorization: 'Bearer {{api_token}}', 'Content-Type': 'application/json' }, timeout: 10, outputVariable: 'data.paymentMethods' } },
      { id: 'ai-2', type: 'action-ai', position: { x: 1070, y: 160 }, data: { nodeName: 'Format Card Details', systemPrompt: 'You are a billing data formatter. Present payment method info in a secure, agent-friendly format. Always mask card numbers (****1234). Include: card type, last 4 digits, expiry, default status, and any flags (expired, about to expire).', userPrompt: 'Payment methods:\n{{api_response}}\n\nFormat these for the agent. Flag any cards that are expired or expiring within 30 days. Indicate which is the default payment method.', temperature: 0.2, maxTokens: 400 } },
      { id: 'end-1', type: 'end', position: { x: 1400, y: 200 }, data: { nodeName: 'Return Card Info', selectedOutputs: ['card_summary', 'payment_methods'], transformations: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'ai-1', sourceHandle: 'start-output', targetHandle: 'ai-input' },
      { id: 'e2', source: 'ai-1', target: 'api-1', sourceHandle: 'ai-output', targetHandle: 'api-input' },
      { id: 'e3', source: 'api-1', target: 'ai-2', sourceHandle: 'api-output', targetHandle: 'ai-input' },
      { id: 'e4', source: 'ai-2', target: 'end-1', sourceHandle: 'ai-output', targetHandle: 'end-input' },
    ],
  },
  'check-transaction': {
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 50, y: 200 }, data: { label: 'Start', inputFields: [{ id: 'i1', name: 'customer_id', dataType: 'string', required: true, description: 'Customer ID' }, { id: 'i2', name: 'transaction_id', dataType: 'string', required: false, description: 'Specific transaction ID (optional — fetches recent if blank)' }, { id: 'i3', name: 'date_range', dataType: 'string', required: false, description: 'Date range filter (e.g. 2026-02-01 to 2026-02-28)' }], outputFields: [{ id: 'o1', name: 'transaction_summary', dataType: 'string', description: 'Agent-friendly transaction summary' }, { id: 'o2', name: 'transaction_data', dataType: 'object', description: 'Raw transaction data' }] } },
      { id: 'ai-1', type: 'action-ai', position: { x: 370, y: 160 }, data: { nodeName: 'Transaction Lookup Agent', systemPrompt: 'You are an AI agent that investigates billing transactions. You can look up specific transactions by ID or search by customer and date range. You understand charge types (subscription, overage, one-time), statuses (pending, completed, failed, reversed), and can identify anomalies like duplicate charges.', userPrompt: 'Look up transaction for customer {{customer_id}}.\nTransaction ID: {{transaction_id}}\nDate range: {{date_range}}\n\nDetermine the best API query. If transaction_id is provided, fetch that specific one. Otherwise, search by customer and date range.', temperature: 0.2, maxTokens: 300 } },
      { id: 'api-1', type: 'api', position: { x: 720, y: 160 }, data: { nodeName: 'GET Transactions', method: 'GET', url: 'https://api.nextiva.com/v1/billing/{{customer_id}}/transactions?txnId={{transaction_id}}&dateRange={{date_range}}', headers: { Authorization: 'Bearer {{api_token}}', 'Content-Type': 'application/json' }, timeout: 15, outputVariable: 'data.transactions' } },
      { id: 'ai-2', type: 'action-ai', position: { x: 1070, y: 160 }, data: { nodeName: 'Analyze Transactions', systemPrompt: 'You are a billing analyst. Review transaction data and present findings clearly. Flag any anomalies: duplicate charges, failed payments, unusual amounts. Include transaction IDs, dates, amounts, and statuses.', userPrompt: 'Transaction data:\n{{api_response}}\n\nAnalyze and present:\n1. Transaction details (ID, amount, date, status)\n2. Any anomalies detected (duplicates, failures)\n3. Recommended actions if issues found', temperature: 0.3, maxTokens: 500 } },
      { id: 'end-1', type: 'end', position: { x: 1400, y: 200 }, data: { nodeName: 'Return Transactions', selectedOutputs: ['transaction_summary', 'transaction_data'], transformations: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'ai-1', sourceHandle: 'start-output', targetHandle: 'ai-input' },
      { id: 'e2', source: 'ai-1', target: 'api-1', sourceHandle: 'ai-output', targetHandle: 'api-input' },
      { id: 'e3', source: 'api-1', target: 'ai-2', sourceHandle: 'api-output', targetHandle: 'ai-input' },
      { id: 'e4', source: 'ai-2', target: 'end-1', sourceHandle: 'ai-output', targetHandle: 'end-input' },
    ],
  },
  'refund-customer': {
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 50, y: 200 }, data: { label: 'Start', inputFields: [{ id: 'i1', name: 'customer_id', dataType: 'string', required: true, description: 'Customer ID' }, { id: 'i2', name: 'transaction_id', dataType: 'string', required: true, description: 'Transaction to refund' }, { id: 'i3', name: 'refund_amount', dataType: 'number', required: false, description: 'Partial refund amount (null = full refund)' }, { id: 'i4', name: 'refund_reason', dataType: 'string', required: true, description: 'Reason for refund (duplicate charge, service issue, etc.)' }], outputFields: [{ id: 'o1', name: 'refund_confirmation', dataType: 'string', description: 'Confirmation message with refund ID and timeline' }, { id: 'o2', name: 'refund_details', dataType: 'object', description: 'Refund record details' }] } },
      { id: 'ai-1', type: 'action-ai', position: { x: 370, y: 120 }, data: { nodeName: 'Refund Eligibility Agent', systemPrompt: 'You are an AI agent that processes customer refunds. You must validate that the transaction exists, is refundable (completed status, within refund window of 90 days, not already refunded), and calculate the correct refund amount. You follow Nextiva refund policy:\n- Full refunds within 30 days: auto-approved\n- Partial refunds: auto-approved\n- Full refunds 30-90 days: requires manager approval flag\n- Beyond 90 days: not eligible', userPrompt: 'Process refund request:\nCustomer: {{customer_id}}\nTransaction: {{transaction_id}}\nAmount: {{refund_amount}}\nReason: {{refund_reason}}\n\nFirst, fetch and validate the transaction. Then prepare the refund API payload.', temperature: 0.1, maxTokens: 400 } },
      { id: 'api-1', type: 'api', position: { x: 720, y: 60 }, data: { nodeName: 'Validate Transaction', method: 'GET', url: 'https://api.nextiva.com/v1/billing/transactions/{{transaction_id}}', headers: { Authorization: 'Bearer {{api_token}}' }, timeout: 10, outputVariable: 'data.transaction' } },
      { id: 'cond-1', type: 'condition', position: { x: 1020, y: 40 }, data: { nodeName: 'Is Refundable?', conditions: [{ variable: 'transaction.status', operator: 'equals', value: 'completed' }, { variable: 'transaction.refundable', operator: 'equals', value: 'true' }], logicOperator: 'AND' } },
      { id: 'api-2', type: 'api', position: { x: 1300, y: -40 }, data: { nodeName: 'Process Refund', method: 'POST', url: 'https://api.nextiva.com/v1/billing/refunds', headers: { Authorization: 'Bearer {{api_token}}', 'Content-Type': 'application/json' }, body: '{"transactionId":"{{transaction_id}}","amount":{{refund_amount}},"reason":"{{refund_reason}}"}', timeout: 20, outputVariable: 'data.refund' } },
      { id: 'ai-2', type: 'action-ai', position: { x: 1650, y: -40 }, data: { nodeName: 'Confirm Refund', systemPrompt: 'You are a billing confirmation assistant. Generate a clear refund confirmation message including: refund ID, amount, estimated credit timeline, and what the customer should expect.', userPrompt: 'Refund processed:\n{{api_response}}\nReason: {{refund_reason}}\n\nGenerate a confirmation message for the agent to share with the customer.', temperature: 0.3, maxTokens: 300 } },
      { id: 'end-ok', type: 'end', position: { x: 2000, y: -40 }, data: { nodeName: 'Refund Complete', selectedOutputs: ['refund_confirmation', 'refund_details'], transformations: [] } },
      { id: 'ai-fail', type: 'action-ai', position: { x: 1300, y: 250 }, data: { nodeName: 'Explain Rejection', systemPrompt: 'Explain why the refund cannot be processed. Suggest alternatives (escalation, credit, goodwill gesture).', userPrompt: 'Refund rejected for transaction {{transaction_id}}.\nTransaction data: {{api_response}}\n\nExplain the rejection reason and suggest alternatives.', temperature: 0.3, maxTokens: 300 } },
      { id: 'end-fail', type: 'end', position: { x: 1650, y: 250 }, data: { nodeName: 'Not Refundable', selectedOutputs: ['refund_confirmation'], transformations: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'ai-1', sourceHandle: 'start-output', targetHandle: 'ai-input' },
      { id: 'e2', source: 'ai-1', target: 'api-1', sourceHandle: 'ai-output', targetHandle: 'api-input' },
      { id: 'e3', source: 'api-1', target: 'cond-1', sourceHandle: 'api-output', targetHandle: 'condition-input' },
      { id: 'e4', source: 'cond-1', target: 'api-2', sourceHandle: 'true', targetHandle: 'api-input' },
      { id: 'e5', source: 'cond-1', target: 'ai-fail', sourceHandle: 'false', targetHandle: 'ai-input' },
      { id: 'e6', source: 'api-2', target: 'ai-2', sourceHandle: 'api-output', targetHandle: 'ai-input' },
      { id: 'e7', source: 'ai-2', target: 'end-ok', sourceHandle: 'ai-output', targetHandle: 'end-input' },
      { id: 'e8', source: 'ai-fail', target: 'end-fail', sourceHandle: 'ai-output', targetHandle: 'end-input' },
    ],
  },
  'revert-transaction': {
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 50, y: 200 }, data: { label: 'Start', inputFields: [{ id: 'i1', name: 'transaction_id', dataType: 'string', required: true, description: 'Transaction ID to revert' }, { id: 'i2', name: 'revert_reason', dataType: 'string', required: true, description: 'Reason for reversal' }], outputFields: [{ id: 'o1', name: 'reversal_confirmation', dataType: 'string', description: 'Confirmation message' }, { id: 'o2', name: 'reversal_details', dataType: 'object', description: 'Reversal record' }] } },
      { id: 'ai-1', type: 'action-ai', position: { x: 370, y: 120 }, data: { nodeName: 'Reversal Agent', systemPrompt: 'You are an AI agent that handles transaction reversals. A reversal voids a transaction entirely (unlike a refund which credits back). You must verify the transaction is in a reversible state (not already reversed, not older than 24 hours for pending, or 7 days for completed). You have access to the Nextiva Billing API.', userPrompt: 'Revert transaction {{transaction_id}}.\nReason: {{revert_reason}}\n\nLookup the transaction first, verify it can be reversed, and prepare the reversal request.', temperature: 0.1, maxTokens: 400 } },
      { id: 'api-1', type: 'api', position: { x: 720, y: 60 }, data: { nodeName: 'Lookup Transaction', method: 'GET', url: 'https://api.nextiva.com/v1/billing/transactions/{{transaction_id}}', headers: { Authorization: 'Bearer {{api_token}}' }, timeout: 10, outputVariable: 'data.transaction' } },
      { id: 'cond-1', type: 'condition', position: { x: 1020, y: 40 }, data: { nodeName: 'Can Revert?', conditions: [{ variable: 'transaction.status', operator: 'not-equals', value: 'reversed' }], logicOperator: 'AND' } },
      { id: 'api-2', type: 'api', position: { x: 1300, y: -40 }, data: { nodeName: 'Execute Reversal', method: 'POST', url: 'https://api.nextiva.com/v1/billing/transactions/{{transaction_id}}/reverse', headers: { Authorization: 'Bearer {{api_token}}', 'Content-Type': 'application/json' }, body: '{"reason":"{{revert_reason}}"}', timeout: 20, outputVariable: 'data.reversal' } },
      { id: 'ai-2', type: 'action-ai', position: { x: 1650, y: -40 }, data: { nodeName: 'Confirm Reversal', systemPrompt: 'Generate a clear reversal confirmation. Include reversal ID, original transaction details, and expected timeline for the void to reflect.', userPrompt: 'Reversal result:\n{{api_response}}\n\nGenerate confirmation message for the agent.', temperature: 0.3, maxTokens: 300 } },
      { id: 'end-ok', type: 'end', position: { x: 2000, y: -40 }, data: { nodeName: 'Reversed', selectedOutputs: ['reversal_confirmation', 'reversal_details'], transformations: [] } },
      { id: 'end-fail', type: 'end', position: { x: 1300, y: 250 }, data: { nodeName: 'Cannot Revert', selectedOutputs: ['reversal_confirmation'], transformations: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'ai-1', sourceHandle: 'start-output', targetHandle: 'ai-input' },
      { id: 'e2', source: 'ai-1', target: 'api-1', sourceHandle: 'ai-output', targetHandle: 'api-input' },
      { id: 'e3', source: 'api-1', target: 'cond-1', sourceHandle: 'api-output', targetHandle: 'condition-input' },
      { id: 'e4', source: 'cond-1', target: 'api-2', sourceHandle: 'true', targetHandle: 'api-input' },
      { id: 'e5', source: 'cond-1', target: 'end-fail', sourceHandle: 'false', targetHandle: 'end-input' },
      { id: 'e6', source: 'api-2', target: 'ai-2', sourceHandle: 'api-output', targetHandle: 'ai-input' },
      { id: 'e7', source: 'ai-2', target: 'end-ok', sourceHandle: 'ai-output', targetHandle: 'end-input' },
    ],
  },
  'trigger-email': {
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 50, y: 200 }, data: { label: 'Start', inputFields: [{ id: 'i1', name: 'recipient_email', dataType: 'string', required: true, description: 'Recipient email address' }, { id: 'i2', name: 'email_purpose', dataType: 'string', required: true, description: 'Purpose: refund_confirmation, meeting_invite, follow_up, custom' }, { id: 'i3', name: 'context_data', dataType: 'object', required: false, description: 'Context variables (customer name, amounts, dates, etc.)' }], outputFields: [{ id: 'o1', name: 'send_confirmation', dataType: 'string', description: 'Email send confirmation' }, { id: 'o2', name: 'message_id', dataType: 'string', description: 'Sent message ID for tracking' }] } },
      { id: 'ai-1', type: 'action-ai', position: { x: 370, y: 140 }, data: { nodeName: 'Email Composer Agent', systemPrompt: 'You are a professional email composer for Nextiva customer communications. You write clear, concise, on-brand emails. You adapt tone based on purpose:\n- Refund confirmation: empathetic, reassuring\n- Meeting invite: professional, action-oriented\n- Follow-up: friendly, helpful\n- Custom: match the context\n\nAlways include: greeting, body, clear next steps, and professional closing. Use the customer\'s name. Keep emails under 200 words.', userPrompt: 'Compose an email:\nRecipient: {{recipient_email}}\nPurpose: {{email_purpose}}\nContext: {{context_data}}\n\nGenerate the email subject line and body. Format as JSON: { "subject": "...", "body": "..." }', temperature: 0.5, maxTokens: 600 } },
      { id: 'api-1', type: 'api', position: { x: 720, y: 160 }, data: { nodeName: 'Send Email via API', method: 'POST', url: 'https://api.nextiva.com/v1/messaging/email/send', headers: { Authorization: 'Bearer {{api_token}}', 'Content-Type': 'application/json' }, body: '{"to":"{{recipient_email}}","subject":"{{ai_response.subject}}","body":"{{ai_response.body}}","from":"support@nextiva.com"}', timeout: 15, outputVariable: 'data.emailResult' } },
      { id: 'ai-2', type: 'action-ai', position: { x: 1070, y: 160 }, data: { nodeName: 'Confirm Send', systemPrompt: 'Generate a brief confirmation message for the agent confirming the email was sent.', userPrompt: 'Email sent successfully.\nResult: {{api_response}}\nRecipient: {{recipient_email}}\nPurpose: {{email_purpose}}\n\nConfirm to the agent that the email was sent.', temperature: 0.3, maxTokens: 200 } },
      { id: 'end-1', type: 'end', position: { x: 1400, y: 200 }, data: { nodeName: 'Email Sent', selectedOutputs: ['send_confirmation', 'message_id'], transformations: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'ai-1', sourceHandle: 'start-output', targetHandle: 'ai-input' },
      { id: 'e2', source: 'ai-1', target: 'api-1', sourceHandle: 'ai-output', targetHandle: 'api-input' },
      { id: 'e3', source: 'api-1', target: 'ai-2', sourceHandle: 'api-output', targetHandle: 'ai-input' },
      { id: 'e4', source: 'ai-2', target: 'end-1', sourceHandle: 'ai-output', targetHandle: 'end-input' },
    ],
  },
  'schedule-calendar': {
    nodes: [
      { id: 'start-1', type: 'start', position: { x: 50, y: 200 }, data: { label: 'Start', inputFields: [{ id: 'i1', name: 'meeting_title', dataType: 'string', required: true, description: 'Meeting title/subject' }, { id: 'i2', name: 'preferred_datetime', dataType: 'string', required: true, description: 'Preferred date/time (natural language OK)' }, { id: 'i3', name: 'duration_minutes', dataType: 'number', required: true, description: 'Duration in minutes' }, { id: 'i4', name: 'attendee_emails', dataType: 'array', required: true, description: 'List of attendee email addresses' }, { id: 'i5', name: 'meeting_description', dataType: 'string', required: false, description: 'Agenda or description' }, { id: 'i6', name: 'modify_action', dataType: 'string', required: false, description: 'create, update, or cancel (default: create)' }], outputFields: [{ id: 'o1', name: 'calendar_confirmation', dataType: 'string', description: 'Confirmation with meeting link and details' }, { id: 'o2', name: 'event_id', dataType: 'string', description: 'Calendar event ID' }] } },
      { id: 'ai-1', type: 'action-ai', position: { x: 370, y: 140 }, data: { nodeName: 'Calendar Scheduling Agent', systemPrompt: 'You are an AI agent that manages calendar events. You can create, update, and cancel meetings via the Google Calendar API. You understand:\n- Natural language date/time parsing ("Thursday at 2 PM" -> ISO datetime)\n- Timezone handling (default PST)\n- Availability checking\n- Meeting link generation (Zoom/Google Meet)\n\nYour job is to parse the input, format it for the calendar API, and handle edge cases (past dates, conflicts).', userPrompt: 'Schedule meeting:\nTitle: {{meeting_title}}\nPreferred time: {{preferred_datetime}}\nDuration: {{duration_minutes}} minutes\nAttendees: {{attendee_emails}}\nDescription: {{meeting_description}}\nAction: {{modify_action}}\n\nParse the date/time, validate it\'s in the future, and prepare the calendar API payload. Return JSON with: { "startTime": "ISO", "endTime": "ISO", "timezone": "...", "payload": {...} }', temperature: 0.2, maxTokens: 500 } },
      { id: 'api-1', type: 'api', position: { x: 720, y: 160 }, data: { nodeName: 'Calendar API', method: 'POST', url: 'https://api.nextiva.com/v1/calendar/events', headers: { Authorization: 'Bearer {{api_token}}', 'Content-Type': 'application/json' }, body: '{{ai_response.payload}}', timeout: 15, outputVariable: 'data.event' } },
      { id: 'ai-2', type: 'action-ai', position: { x: 1070, y: 160 }, data: { nodeName: 'Confirm Scheduling', systemPrompt: 'Generate a confirmation message with all meeting details: title, date/time with timezone, duration, attendees, and meeting link. Keep it concise and professional.', userPrompt: 'Meeting scheduled:\n{{api_response}}\n\nGenerate a confirmation message the agent can share with the customer. Include the meeting link.', temperature: 0.3, maxTokens: 300 } },
      { id: 'end-1', type: 'end', position: { x: 1400, y: 200 }, data: { nodeName: 'Meeting Confirmed', selectedOutputs: ['calendar_confirmation', 'event_id'], transformations: [] } },
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'ai-1', sourceHandle: 'start-output', targetHandle: 'ai-input' },
      { id: 'e2', source: 'ai-1', target: 'api-1', sourceHandle: 'ai-output', targetHandle: 'api-input' },
      { id: 'e3', source: 'api-1', target: 'ai-2', sourceHandle: 'api-output', targetHandle: 'ai-input' },
      { id: 'e4', source: 'ai-2', target: 'end-1', sourceHandle: 'ai-output', targetHandle: 'end-input' },
    ],
  },
};

/* ─── Default node data factory ─── */
function getDefaultNodeData(type) {
  switch (type) {
    case 'start': return { label: 'Start', inputFields: [], outputFields: [] };
    case 'end': return { nodeName: 'End', selectedOutputs: [], transformations: [] };
    case 'action-ai': return { nodeName: 'AI Action', systemPrompt: '', userPrompt: '', temperature: 0.7, maxTokens: 1000 };
    case 'api': return { nodeName: 'API Call', method: 'GET', url: '', headers: { 'Content-Type': 'application/json' }, timeout: 30, outputVariable: '' };
    case 'condition': return { nodeName: 'Condition', conditions: [{ variable: '', operator: 'equals', value: '' }], logicOperator: 'AND' };
    case 'integration': return { nodeName: 'Integration', integrationType: 'google-calendar', action: 'create-event' };
    case 'script': return { nodeName: 'Script', language: 'javascript', code: 'function execute(ctx) { return ctx; }' };
    default: return {};
  }
}

/* ─── Sidebar Draggable Node ─── */
function DraggableNode({ type, label, icon: Icon, iconColor, bgColor }) {
  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
        backgroundColor: '#fff', border: '1px solid #E1DEDA', borderRadius: '8px',
        cursor: 'grab', transition: '0.15s ease', marginBottom: '6px',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = iconColor; e.currentTarget.style.backgroundColor = bgColor; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E1DEDA'; e.currentTarget.style.backgroundColor = '#fff'; }}
    >
      <Icon size={16} color={iconColor} />
      <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{label}</span>
    </div>
  );
}

/* ─── Sidebar ─── */
function CanvasSidebar() {
  const [expanded, setExpanded] = useState({ 'start-end': true, actions: true, logic: true });
  const toggle = (k) => setExpanded(p => ({ ...p, [k]: !p[k] }));

  const categories = [
    {
      id: 'start-end', title: 'START & END', items: [
        { type: 'start', label: 'Start', icon: Flag, color: '#3B82F6', bg: '#EFF6FF' },
        { type: 'end', label: 'End', icon: StopCircle, color: '#EF4444', bg: '#FEF2F2' },
      ],
    },
    {
      id: 'actions', title: 'ACTIONS', items: [
        { type: 'action-ai', label: 'AI Action', icon: Sparkles, color: '#8B5CF6', bg: '#F5F3FF' },
        { type: 'api', label: 'API', icon: Network, color: '#3B82F6', bg: '#EFF6FF' },
        { type: 'integration', label: 'Integration', icon: Database, color: '#10B981', bg: '#ECFDF5' },
        { type: 'script', label: 'Script', icon: Code, color: '#6366F1', bg: '#EEF2FF' },
      ],
    },
    {
      id: 'logic', title: 'LOGIC', items: [
        { type: 'condition', label: 'Condition', icon: GitBranch, color: '#F59E0B', bg: '#FFFBEB' },
      ],
    },
  ];

  return (
    <div style={{ width: '240px', backgroundColor: '#FAFAF9', borderRight: '1px solid #E1DEDA', overflowY: 'auto', flexShrink: 0 }}>
      <div style={{ padding: '18px 16px 8px', fontSize: '14px', fontWeight: 700, color: '#02122C' }}>Node Library</div>
      {categories.map(cat => (
        <div key={cat.id} style={{ borderBottom: '1px solid #EEEDEB' }}>
          <button onClick={() => toggle(cat.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat.title}</span>
            <ChevronDown size={14} color="#9CA3AF" style={{ transform: expanded[cat.id] ? 'rotate(0)' : 'rotate(-90deg)', transition: '0.15s ease' }} />
          </button>
          {expanded[cat.id] && (
            <div style={{ padding: '0 12px 10px' }}>
              {cat.items.map(item => (
                <DraggableNode key={item.type} type={item.type} label={item.label} icon={item.icon} iconColor={item.color} bgColor={item.bg} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Inner Canvas (needs ReactFlowProvider wrapper) ─── */
function CanvasInner({ action, onBack }) {
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const reactFlowWrapper = useRef(null);
  const reactFlow = useReactFlow();

  const nodeTypes = useMemo(() => ({
    start: StartNode,
    end: EndNode,
    'action-ai': AIPromptNode,
    api: APINode,
    condition: ConditionNode,
    integration: IntegrationNode,
    script: ScriptNode,
  }), []);

  const template = ACTION_TEMPLATES[action.id];
  const initialNodes = (template?.nodes || []).map(n => ({
    id: n.id, type: n.type, position: n.position,
    data: { ...n.data, label: n.data?.label || n.data?.nodeName, node: n, onClick: () => openConfig(n.id, n.type) },
  }));
  const initialEdges = (template?.edges || []).map(e => ({
    ...e, animated: false, markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
    style: { stroke: '#3B82F6', strokeWidth: 2 },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [configModal, setConfigModal] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const openConfig = useCallback((nodeId, nodeType) => {
    setSelectedNodeId(nodeId);
    setConfigModal(nodeType);
  }, []);

  // Rebuild node onClick handlers when nodes change
  const nodesWithHandlers = useMemo(() => nodes.map(n => ({
    ...n, data: { ...n.data, onClick: () => openConfig(n.id, n.type) },
  })), [nodes, openConfig]);

  const isValidConnection = useCallback((connection) => {
    if (connection.source === connection.target) return false;
    const targetNode = nodes.find(n => n.id === connection.target);
    if (targetNode?.type === 'start') return false;
    const sourceNode = nodes.find(n => n.id === connection.source);
    if (sourceNode?.type === 'end') return false;
    return true;
  }, [nodes]);

  const onConnect = useCallback((params) => {
    setEdges(eds => addEdge({
      ...params, animated: false,
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
      style: { stroke: '#3B82F6', strokeWidth: 2 },
    }, eds));
  }, [setEdges]);

  const onDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type) return;
    const position = reactFlow.screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const newId = `${type}-${Date.now()}`;
    const data = getDefaultNodeData(type);
    const newNode = {
      id: newId, type, position,
      data: { ...data, label: data.label || data.nodeName, node: { id: newId, type, data, label: data.label || data.nodeName }, onClick: () => openConfig(newId, type) },
    };
    setNodes(nds => [...nds, newNode]);
  }, [reactFlow, setNodes, openConfig]);

  const handleConfigSave = useCallback((nodeType, configData) => {
    setNodes(nds => nds.map(n => {
      if (n.id !== selectedNodeId) return n;
      const updatedData = nodeType === 'start'
        ? { ...n.data, node: { ...n.data.node, data: { ...n.data.node.data, inputFields: configData[0], outputFields: configData[1] } } }
        : { ...n.data, node: { ...n.data.node, data: { ...n.data.node.data, ...configData } } };
      return { ...n, data: updatedData };
    }));
  }, [selectedNodeId, setNodes]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedNodeData = selectedNode?.data?.node?.data || {};

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 20px',
        borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.surface, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
          border: `1px solid ${colors.border}`, borderRadius: '8px', backgroundColor: 'transparent',
          cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: colors.text,
        }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: colors.text }}>{action.name || 'Untitled Action'}</div>
          {action.description && <div style={{ fontSize: '12px', color: colors.textSecondary }}>{action.description}</div>}
        </div>
        {action.category && (
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '9999px',
            backgroundColor: (action.categoryColor || '#0062B8') + '12',
            color: action.categoryColor || '#0062B8',
          }}>{action.category}</span>
        )}
        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px',
          border: 'none', borderRadius: '8px', backgroundColor: '#10B981', color: '#fff',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        }}><Play size={14} /> Test</button>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px',
          border: 'none', borderRadius: '8px', backgroundColor: '#0062B8', color: '#fff',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        }}><Save size={14} /> Save</button>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <CanvasSidebar />
        <div ref={reactFlowWrapper} style={{ flex: 1 }}>
          <ReactFlow
            nodes={nodesWithHandlers}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            isValidConnection={isValidConnection}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.25}
            maxZoom={2}
            deleteKeyCode="Delete"
            connectionLineStyle={{ stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '5,5' }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#D1D0CE" />
            <Controls showInteractive={false} style={{ borderRadius: '8px', border: '1px solid #E1DEDA' }} />
          </ReactFlow>
        </div>
      </div>

      {/* Config Modals — key forces re-mount so useState picks up new initialData */}
      <StartNodeConfig
        key={`start-${selectedNodeId}`}
        isOpen={configModal === 'start'}
        onClose={() => setConfigModal(null)}
        onSave={(inputs, outputs) => handleConfigSave('start', [inputs, outputs])}
        initialInputs={selectedNodeData.inputFields || []}
        initialOutputs={selectedNodeData.outputFields || []}
      />
      <EndNodeConfig
        key={`end-${selectedNodeId}`}
        isOpen={configModal === 'end'}
        onClose={() => setConfigModal(null)}
        onSave={(data) => handleConfigSave('end', data)}
        initialData={selectedNodeData}
      />
      <AIPromptNodeConfig
        key={`ai-${selectedNodeId}`}
        isOpen={configModal === 'action-ai'}
        onClose={() => setConfigModal(null)}
        onSave={(data) => handleConfigSave('action-ai', data)}
        initialData={selectedNodeData}
      />
      <APINodeConfig
        key={`api-${selectedNodeId}`}
        isOpen={configModal === 'api'}
        onClose={() => setConfigModal(null)}
        onSave={(data) => handleConfigSave('api', data)}
        initialData={selectedNodeData}
      />
      <ConditionNodeConfig
        key={`cond-${selectedNodeId}`}
        isOpen={configModal === 'condition'}
        onClose={() => setConfigModal(null)}
        onSave={(data) => handleConfigSave('condition', data)}
        initialData={selectedNodeData}
      />
      <IntegrationNodeConfig
        key={`int-${selectedNodeId}`}
        isOpen={configModal === 'integration'}
        onClose={() => setConfigModal(null)}
        onSave={(data) => handleConfigSave('integration', data)}
        initialData={selectedNodeData}
      />
      <ScriptNodeConfig
        key={`script-${selectedNodeId}`}
        isOpen={configModal === 'script'}
        onClose={() => setConfigModal(null)}
        onSave={(data) => handleConfigSave('script', data)}
        initialData={selectedNodeData}
      />
    </div>
  );
}

/* ─── Wrapped export ─── */
export default function ActionCanvas({ action, onBack }) {
  return (
    <ReactFlowProvider>
      <CanvasInner action={action} onBack={onBack} />
    </ReactFlowProvider>
  );
}
