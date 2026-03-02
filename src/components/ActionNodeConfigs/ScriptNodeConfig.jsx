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
  btn: (v) => ({ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: v === 'primary' ? '#0062B8' : 'transparent', color: v === 'primary' ? '#fff' : '#02122C' }),
};

const JS_TEMPLATE = `function execute(context) {
  const result = {
    processedData: context.inputData,
    timestamp: new Date().toISOString()
  };
  return result;
}`;

const PY_TEMPLATE = `def execute(context):
    result = {
        'processedData': context['inputData'],
        'timestamp': str(datetime.now())
    }
    return result`;

export default function ScriptNodeConfig({ isOpen, onClose, onSave, initialData = {} }) {
  const [nodeName, setNodeName] = useState(initialData.nodeName || 'Script_Node');
  const [language, setLanguage] = useState(initialData.language || 'javascript');
  const [code, setCode] = useState(initialData.code || JS_TEMPLATE);

  if (!isOpen) return null;

  const handleLangChange = (lang) => {
    setLanguage(lang);
    if (lang === 'javascript' && language === 'python') setCode(JS_TEMPLATE);
    if (lang === 'python' && language === 'javascript') setCode(PY_TEMPLATE);
  };
  const handleSave = () => { onSave({ nodeName, language, code }); onClose(); };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={s.title}>Script Node Configuration</span>
          <button onClick={onClose} style={s.close}><X size={18} /></button>
        </div>
        <div style={s.body}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div><label style={s.label}>Node Name</label><input value={nodeName} onChange={e => setNodeName(e.target.value)} style={s.input} /></div>
            <div>
              <label style={s.label}>Language</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                {['javascript', 'python'].map(lang => (
                  <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
                    <input type="radio" name="lang" value={lang} checked={language === lang} onChange={() => handleLangChange(lang)} style={{ accentColor: '#0062B8' }} />
                    {lang[0].toUpperCase() + lang.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={s.label}>Code *</label>
              <textarea
                value={code} onChange={e => setCode(e.target.value)} rows={16}
                style={{
                  width: '100%', padding: '12px', border: '1px solid #E1DEDA', borderRadius: '8px',
                  fontSize: '12px', fontFamily: 'monospace', outline: 'none', resize: 'vertical',
                  backgroundColor: '#FAFAF9', boxSizing: 'border-box', lineHeight: 1.5,
                }}
              />
              <div style={{ marginTop: '8px', padding: '10px', backgroundColor: 'rgba(0,98,184,0.06)', borderRadius: '8px', border: '1px solid rgba(0,98,184,0.15)' }}>
                <span style={{ fontSize: '11px', color: '#0062B8' }}><b>Note:</b> All input/output variables from previous nodes are available in the <code style={{ backgroundColor: 'rgba(0,98,184,0.1)', padding: '1px 4px', borderRadius: '3px' }}>context</code> object.</span>
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
