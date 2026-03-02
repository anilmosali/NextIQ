import { useState } from 'react';
import { X } from 'lucide-react';

const s = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(2,18,44,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 32px 64px rgba(2,18,44,0.2)', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #E1DEDA' },
  title: { fontSize: '18px', fontWeight: 700, color: '#02122C' },
  close: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#847D7C' },
  body: { padding: '24px', overflowY: 'auto', flex: 1 },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 24px', borderTop: '1px solid #E1DEDA', backgroundColor: '#FAFAF9' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#02122C', marginBottom: '6px' },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #E1DEDA', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #E1DEDA', borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  btn: (v) => ({ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: v === 'primary' ? '#0062B8' : 'transparent', color: v === 'primary' ? '#fff' : '#02122C' }),
};

export default function AIPromptNodeConfig({ isOpen, onClose, onSave, initialData = {} }) {
  const [nodeName, setNodeName] = useState(initialData.nodeName || 'AI_Prompt');
  const [systemPrompt, setSystemPrompt] = useState(initialData.systemPrompt || '');
  const [userPrompt, setUserPrompt] = useState(initialData.userPrompt || '');
  const [temperature, setTemperature] = useState(initialData.temperature ?? 0.7);
  const [maxTokens, setMaxTokens] = useState(initialData.maxTokens ?? 1000);

  if (!isOpen) return null;

  const handleSave = () => { onSave({ nodeName, systemPrompt, userPrompt, temperature, maxTokens }); onClose(); };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={s.title}>AI Action Configuration</span>
          <button onClick={onClose} style={s.close}><X size={18} /></button>
        </div>
        <div style={{ padding: '10px 24px', backgroundColor: 'rgba(0,98,184,0.04)', borderBottom: '1px solid rgba(0,98,184,0.1)', fontSize: '12px', color: '#374151' }}>
          Define a prompt for the LLM. Use {'{{variable}}'} syntax to reference context variables.
        </div>
        <div style={s.body}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={s.label}>Node Name *</label>
              <input value={nodeName} onChange={e => setNodeName(e.target.value)} style={s.input} />
            </div>
            <div>
              <label style={s.label}>System Prompt</label>
              <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={3} placeholder="You are a helpful AI assistant..." style={s.textarea} />
            </div>
            <div>
              <label style={s.label}>User Prompt *</label>
              <textarea value={userPrompt} onChange={e => setUserPrompt(e.target.value)} rows={5} placeholder={'Analyze: {{input_text}}'} style={s.textarea} />
              <p style={{ fontSize: '11px', color: '#847D7C', marginTop: '4px' }}>
                Variables: {'{{user_name}}'}, {'{{input_text}}'}, {'{{conversation_history}}'}, etc.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={s.label}>Temperature</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="range" min={0} max={1} step={0.01} value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: '#0062B8' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#02122C', minWidth: '36px' }}>{temperature}</span>
                </div>
              </div>
              <div>
                <label style={s.label}>Max Tokens</label>
                <input type="number" value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value) || 0)} min={1} max={4000} style={{ ...s.input, width: '120px' }} />
              </div>
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
