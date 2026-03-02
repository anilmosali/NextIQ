import { useState } from 'react';
import { X } from 'lucide-react';

const s = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(2,18,44,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 32px 64px rgba(2,18,44,0.2)', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #E1DEDA' },
  title: { fontSize: '18px', fontWeight: 700, color: '#02122C' },
  close: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#847D7C' },
  body: { padding: '24px', overflowY: 'auto', flex: 1 },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 24px', borderTop: '1px solid #E1DEDA', backgroundColor: '#FAFAF9' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#02122C', marginBottom: '6px' },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #E1DEDA', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #E1DEDA', borderRadius: '8px', fontSize: '12px', outline: 'none', resize: 'none', fontFamily: 'monospace', boxSizing: 'border-box' },
  btn: (v) => ({ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', backgroundColor: v === 'primary' ? '#0062B8' : 'transparent', color: v === 'primary' ? '#fff' : '#02122C' }),
};

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const methodColors = { GET: '#10B981', POST: '#3B82F6', PUT: '#F59E0B', PATCH: '#F59E0B', DELETE: '#EF4444' };

export default function APINodeConfig({ isOpen, onClose, onSave, initialData = {} }) {
  const [nodeName, setNodeName] = useState(initialData.nodeName || 'API_Node');
  const [method, setMethod] = useState(initialData.method || 'GET');
  const [url, setUrl] = useState(initialData.url || '');
  const [headers, setHeaders] = useState(initialData.headers ? Object.entries(initialData.headers).map(([k, v]) => `${k}: ${v}`).join('\n') : 'Content-Type: application/json');
  const [body, setBody] = useState(initialData.body || '');
  const [timeout, setTimeoutVal] = useState(initialData.timeout || 30);
  const [outputVariable, setOutputVariable] = useState(initialData.outputVariable || '');

  if (!isOpen) return null;

  const handleSave = () => {
    const h = {};
    headers.split('\n').forEach(line => { const [k, ...v] = line.split(':'); if (k && v.length) h[k.trim()] = v.join(':').trim(); });
    onSave({ nodeName, method, url, headers: h, body: method !== 'GET' ? body : undefined, timeout, outputVariable });
    onClose();
  };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={s.title}>API Node Configuration</span>
          <button onClick={onClose} style={s.close}><X size={18} /></button>
        </div>
        <div style={s.body}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={s.label}>Node Name</label>
              <input value={nodeName} onChange={e => setNodeName(e.target.value)} style={s.input} />
            </div>
            <div>
              <label style={s.label}>Request Method</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {METHODS.map(m => (
                  <button key={m} onClick={() => setMethod(m)} style={{
                    padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    border: method === m ? `2px solid ${methodColors[m]}` : '2px solid #E1DEDA',
                    backgroundColor: method === m ? methodColors[m] + '12' : '#fff',
                    color: method === m ? methodColors[m] : '#6B7280',
                  }}>{m}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={s.label}>URL *</label>
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder={'https://api.example.com/{{resource}}'} style={s.input} />
            </div>
            <div>
              <label style={s.label}>Headers</label>
              <textarea value={headers} onChange={e => setHeaders(e.target.value)} rows={3} placeholder="Authorization: Bearer {{token}}" style={s.textarea} />
            </div>
            {method !== 'GET' && (
              <div>
                <label style={s.label}>Body</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} placeholder={'{\n  "key": "{{value}}"\n}'} style={s.textarea} />
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={s.label}>Timeout (seconds)</label>
                <input type="number" value={timeout} onChange={e => setTimeoutVal(Number(e.target.value))} min={1} max={300} style={{ ...s.input, width: '100px' }} />
              </div>
              <div>
                <label style={s.label}>Output Variable Path</label>
                <input value={outputVariable} onChange={e => setOutputVariable(e.target.value)} placeholder="data.results" style={s.input} />
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
