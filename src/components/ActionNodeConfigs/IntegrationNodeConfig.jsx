import { useState } from 'react';
import { X } from 'lucide-react';

const s = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(2,18,44,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 32px 64px rgba(2,18,44,0.2)', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #E1DEDA' },
  title: { fontSize: '18px', fontWeight: 700, color: '#02122C' },
  close: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#847D7C' },
  body: { padding: '24px', overflowY: 'auto', flex: 1 },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 24px', borderTop: '1px solid #E1DEDA', backgroundColor: '#FAFAF9' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#02122C', marginBottom: '6px' },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #E1DEDA', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '8px 12px', border: '1px solid #E1DEDA', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  btn: (v) => ({ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: v === 'primary' ? '#0062B8' : 'transparent', color: v === 'primary' ? '#fff' : '#02122C' }),
};

const INTEGRATIONS = [
  { value: 'google-calendar', label: 'Google Calendar' },
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'slack', label: 'Slack' },
  { value: 'gmail', label: 'Gmail' },
  { value: 'twilio', label: 'Twilio' },
  { value: 'stripe', label: 'Stripe' },
];

const ACTIONS_MAP = {
  'google-calendar': ['create-event', 'update-event', 'delete-event', 'get-event', 'list-events'],
  hubspot: ['create-ticket', 'update-contact', 'get-contact', 'create-deal'],
  salesforce: ['create-lead', 'update-opportunity', 'get-account'],
  slack: ['send-message', 'create-channel', 'invite-user'],
  gmail: ['send-email', 'read-email', 'search-email'],
  twilio: ['send-sms', 'make-call', 'get-call-status'],
  stripe: ['create-charge', 'create-refund', 'get-invoice', 'create-subscription'],
};

export default function IntegrationNodeConfig({ isOpen, onClose, onSave, initialData = {} }) {
  const [nodeName, setNodeName] = useState(initialData.nodeName || 'Integration_Node');
  const [integrationType, setIntegrationType] = useState(initialData.integrationType || 'google-calendar');
  const [action, setAction] = useState(initialData.action || 'create-event');
  const [authId, setAuthId] = useState(initialData.authenticationId || '');

  if (!isOpen) return null;

  const handleTypeChange = (type) => {
    setIntegrationType(type);
    setAction((ACTIONS_MAP[type] || ['default-action'])[0]);
  };
  const handleSave = () => { onSave({ nodeName, integrationType, action, authenticationId: authId || undefined, configuration: {} }); onClose(); };
  const formatAction = (a) => a.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={s.title}>{INTEGRATIONS.find(i => i.value === integrationType)?.label || 'Integration'} Configuration</span>
          <button onClick={onClose} style={s.close}><X size={18} /></button>
        </div>
        <div style={s.body}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div><label style={s.label}>Node Name</label><input value={nodeName} onChange={e => setNodeName(e.target.value)} style={s.input} /></div>
            <div>
              <label style={s.label}>Integration</label>
              <select value={integrationType} onChange={e => handleTypeChange(e.target.value)} style={s.select}>
                {INTEGRATIONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>Action</label>
              <select value={action} onChange={e => setAction(e.target.value)} style={s.select}>
                {(ACTIONS_MAP[integrationType] || []).map(a => <option key={a} value={a}>{formatAction(a)}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>Authentication</label>
              <select value={authId} onChange={e => setAuthId(e.target.value)} style={s.select}>
                <option value="">Select account...</option>
                <option value="auth-1">My Google Account (user@example.com)</option>
                <option value="auth-2">Work Account (work@company.com)</option>
              </select>
              <button style={{ fontSize: '12px', color: '#0062B8', background: 'none', border: 'none', cursor: 'pointer', marginTop: '6px', fontWeight: 600 }}>+ Add New Account</button>
            </div>
          </div>
        </div>
        <div style={s.footer}>
          <button onClick={onClose} style={s.btn('ghost')}>Cancel</button>
          <button onClick={handleSave} style={s.btn('primary')}>Save</button>
        </div>
      </div>
    </div>
  );
}
