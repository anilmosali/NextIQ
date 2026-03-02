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
  btn: (v) => ({ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: v === 'primary' ? '#0062B8' : 'transparent', color: v === 'primary' ? '#fff' : '#02122C' }),
};

export default function EndNodeConfig({ isOpen, onClose, onSave, initialData = {} }) {
  const [nodeName, setNodeName] = useState(initialData.nodeName || 'End');
  const [selectedOutputs, setSelectedOutputs] = useState(initialData.selectedOutputs || []);
  const [customVar, setCustomVar] = useState('');

  if (!isOpen) return null;

  const allVars = [...new Set([...selectedOutputs])];
  const toggle = (v) => setSelectedOutputs(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const addCustom = () => {
    const v = customVar.trim();
    if (v && !selectedOutputs.includes(v)) setSelectedOutputs(prev => [...prev, v]);
    setCustomVar('');
  };
  const removeVar = (v) => setSelectedOutputs(prev => prev.filter(x => x !== v));
  const handleSave = () => { onSave({ nodeName, selectedOutputs, transformations: [] }); onClose(); };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={s.title}>End Node Configuration</span>
          <button onClick={onClose} style={s.close}><X size={18} /></button>
        </div>
        <div style={s.body}>
          <div style={{ marginBottom: '20px' }}>
            <label style={s.label}>Node Name</label>
            <input value={nodeName} onChange={e => setNodeName(e.target.value)} style={s.input} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={s.label}>Output Variables</label>
            <p style={{ fontSize: '12px', color: '#847D7C', marginBottom: '10px' }}>Variables returned to the NextIQ engine when this action completes:</p>
            <div style={{ padding: '12px', backgroundColor: '#FAFAF9', border: '1px solid #EEEDEB', borderRadius: '8px' }}>
              {allVars.length === 0 && <p style={{ fontSize: '12px', color: '#847D7C', margin: 0 }}>No output variables configured. Add one below.</p>}
              {allVars.map(v => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px', borderBottom: '1px solid #EEEDEB' }}>
                  <span style={{ fontSize: '13px', color: '#374151', fontFamily: 'monospace' }}>{v}</span>
                  <button onClick={() => removeVar(v)} style={{ ...s.close, color: '#EF4444' }}><X size={14} /></button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                <input value={customVar} onChange={e => setCustomVar(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustom()} placeholder="Add variable name..." style={{ ...s.input, flex: 1 }} />
                <button onClick={addCustom} disabled={!customVar.trim()} style={{ ...s.btn('primary'), opacity: customVar.trim() ? 1 : 0.5, padding: '8px 14px' }}>Add</button>
              </div>
            </div>
          </div>
          {selectedOutputs.length > 0 && (
            <div>
              <label style={s.label}>Return Format Preview</label>
              <div style={{ padding: '12px', backgroundColor: '#1F2937', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', color: '#34D399' }}>
                <pre style={{ margin: 0 }}>{'{\n' + selectedOutputs.map(v => `  "${v}": {{${v}}}`).join(',\n') + '\n}'}</pre>
              </div>
            </div>
          )}
        </div>
        <div style={s.footer}>
          <button onClick={onClose} style={s.btn('ghost')}>Cancel</button>
          <button onClick={handleSave} style={s.btn('primary')}>Save</button>
        </div>
      </div>
    </div>
  );
}
