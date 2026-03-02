import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const s = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(2,18,44,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 32px 64px rgba(2,18,44,0.2)', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #E1DEDA' },
  title: { fontSize: '18px', fontWeight: 700, color: '#02122C' },
  close: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#847D7C' },
  body: { padding: '24px', overflowY: 'auto', flex: 1 },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 24px', borderTop: '1px solid #E1DEDA', backgroundColor: '#FAFAF9' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '4px' },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #E1DEDA', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '8px 12px', border: '1px solid #E1DEDA', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  btn: (v) => ({ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: v === 'primary' ? '#0062B8' : 'transparent', color: v === 'primary' ? '#fff' : '#02122C' }),
};

const OPERATORS = [
  { value: 'equals', label: 'equals (=)' },
  { value: 'not-equals', label: 'not equals' },
  { value: 'greater-than', label: 'greater than (>)' },
  { value: 'less-than', label: 'less than (<)' },
  { value: 'contains', label: 'contains' },
  { value: 'starts-with', label: 'starts with' },
  { value: 'ends-with', label: 'ends with' },
  { value: 'is-empty', label: 'is empty' },
  { value: 'is-not-empty', label: 'is not empty' },
];

export default function ConditionNodeConfig({ isOpen, onClose, onSave, initialData = {} }) {
  const [nodeName, setNodeName] = useState(initialData.nodeName || 'Condition');
  const [conditions, setConditions] = useState(initialData.conditions || [{ variable: '', operator: 'equals', value: '' }]);
  const [logicOperator, setLogicOperator] = useState(initialData.logicOperator || 'AND');

  if (!isOpen) return null;

  const update = (i, u) => setConditions(prev => prev.map((c, idx) => idx === i ? { ...c, ...u } : c));
  const remove = (i) => setConditions(prev => prev.filter((_, idx) => idx !== i));
  const add = (op) => { setConditions(prev => [...prev, { variable: '', operator: 'equals', value: '' }]); setLogicOperator(op); };
  const handleSave = () => { onSave({ nodeName, conditions, logicOperator }); onClose(); };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={s.title}>Condition Node Configuration</span>
          <button onClick={onClose} style={s.close}><X size={18} /></button>
        </div>
        <div style={s.body}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ ...s.label, fontSize: '13px', fontWeight: 600, color: '#02122C' }}>Node Name</label>
            <input value={nodeName} onChange={e => setNodeName(e.target.value)} style={s.input} />
          </div>
          <label style={{ ...s.label, fontSize: '13px', fontWeight: 600, color: '#02122C', marginBottom: '10px' }}>IF Condition</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {conditions.map((c, i) => (
              <div key={i}>
                {i > 0 && (
                  <div style={{ textAlign: 'center', padding: '4px 0' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#F5F4F2', padding: '2px 10px', borderRadius: '4px', color: '#6B7280' }}>{logicOperator}</span>
                  </div>
                )}
                <div style={{ padding: '14px', backgroundColor: '#FAFAF9', border: '1px solid #EEEDEB', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Condition {i + 1}</span>
                    {conditions.length > 1 && <button onClick={() => remove(i)} style={{ ...s.close, color: '#EF4444' }}><X size={14} /></button>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div><label style={s.label}>Variable</label><input value={c.variable} onChange={e => update(i, { variable: e.target.value })} placeholder="e.g. response.status" style={s.input} /></div>
                    <div><label style={s.label}>Operator</label><select value={c.operator} onChange={e => update(i, { operator: e.target.value })} style={s.select}>{OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                    {c.operator !== 'is-empty' && c.operator !== 'is-not-empty' && (
                      <div><label style={s.label}>Value</label><input value={c.value} onChange={e => update(i, { value: e.target.value })} placeholder="e.g. success" style={s.input} /></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button onClick={() => add('AND')} style={{ ...s.btn(), display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#F5F4F2' }}><Plus size={14} /> AND</button>
            <button onClick={() => add('OR')} style={{ ...s.btn(), display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#F5F4F2' }}><Plus size={14} /> OR</button>
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
