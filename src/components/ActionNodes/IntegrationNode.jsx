import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

const handleStyle = { background: '#3B82F6', width: 12, height: 12, border: '2px solid white' };

export default function IntegrationNode({ data }) {
  const node = data.node;
  const nodeData = node?.data || {};
  return (
    <div
      onClick={data.onClick}
      style={{
        minWidth: '200px', padding: '14px 16px', cursor: 'pointer',
        backgroundColor: '#fff', border: '2px solid #d1d5db', borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: '0.15s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Database size={14} color="#10B981" />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{nodeData.nodeName || 'Integration'}</span>
      </div>
      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Integration</div>
      {nodeData.integrationType && (
        <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '4px', textTransform: 'capitalize' }}>
          {nodeData.integrationType.replace(/-/g, ' ')} &mdash; {nodeData.action?.replace(/-/g, ' ') || ''}
        </div>
      )}
      <Handle type="target" position={Position.Left} id="integration-input" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="integration-output" style={handleStyle} />
    </div>
  );
}
