import { useState } from 'react';
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const DATA_TYPES = ['string', 'number', 'boolean', 'date', 'array', 'object'];

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
  select: { width: '100%', padding: '8px 12px', border: '1px solid #E1DEDA', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  fieldCard: { padding: '14px', backgroundColor: '#FAFAF9', border: '1px solid #EEEDEB', borderRadius: '8px', marginBottom: '10px' },
  btn: (variant) => ({
    padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none',
    backgroundColor: variant === 'primary' ? '#0062B8' : variant === 'ghost' ? 'transparent' : '#F5F4F2',
    color: variant === 'primary' ? '#fff' : '#02122C',
  }),
  sectionBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 600, color: '#02122C', padding: '0 0 10px', width: '100%' },
};

export default function StartNodeConfig({ isOpen, onClose, onSave, initialInputs = [], initialOutputs = [] }) {
  const [inputFields, setInputFields] = useState(initialInputs);
  const [outputFields, setOutputFields] = useState(initialOutputs);
  const [inputsExpanded, setInputsExpanded] = useState(true);
  const [outputsExpanded, setOutputsExpanded] = useState(true);

  if (!isOpen) return null;

  const addField = (setter) => {
    setter(prev => [...prev, { id: `f-${Date.now()}`, name: '', dataType: 'string', required: false, description: '' }]);
  };
  const removeField = (setter, id) => setter(prev => prev.filter(f => f.id !== id));
  const updateField = (setter, id, updates) => setter(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));

  const handleSave = () => { onSave(inputFields, outputFields); onClose(); };

  const renderFields = (fields, setter, label) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {fields.map((field, i) => (
        <div key={field.id} style={s.fieldCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>{label} {i + 1}</span>
            <button onClick={() => removeField(setter, field.id)} style={{ ...s.close, color: '#EF4444' }}><X size={14} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <div>
              <label style={s.label}>Name</label>
              <input value={field.name} onChange={e => updateField(setter, field.id, { name: e.target.value })} placeholder="e.g. customerId" style={s.input} />
            </div>
            <div>
              <label style={s.label}>Type</label>
              <select value={field.dataType} onChange={e => updateField(setter, field.id, { dataType: e.target.value })} style={s.select}>
                {DATA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label style={s.label}>Description</label>
            <input value={field.description} onChange={e => updateField(setter, field.id, { description: e.target.value })} placeholder="Field description" style={s.input} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', cursor: 'pointer' }}>
            <input type="checkbox" checked={field.required} onChange={e => updateField(setter, field.id, { required: e.target.checked })} /> Required
          </label>
        </div>
      ))}
      <button onClick={() => addField(setter)} style={{ ...s.btn(), display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
        <Plus size={14} /> Add {label}
      </button>
    </div>
  );

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={s.title}>Start Node Configuration</span>
          <button onClick={onClose} style={s.close}><X size={18} /></button>
        </div>
        <div style={s.body}>
          <div style={{ marginBottom: '24px' }}>
            <button onClick={() => setInputsExpanded(!inputsExpanded)} style={s.sectionBtn}>
              {inputsExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />} Input Fields
            </button>
            {inputsExpanded && renderFields(inputFields, setInputFields, 'Input')}
          </div>
          <div>
            <button onClick={() => setOutputsExpanded(!outputsExpanded)} style={s.sectionBtn}>
              {outputsExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />} Output Fields
            </button>
            {outputsExpanded && renderFields(outputFields, setOutputFields, 'Output')}
          </div>
          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'rgba(0,98,184,0.06)', borderRadius: '8px', border: '1px solid rgba(0,98,184,0.15)' }}>
            <span style={{ fontSize: '12px', color: '#0062B8' }}><b>Data Types:</b> string, number, boolean, date, array, object</span>
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
