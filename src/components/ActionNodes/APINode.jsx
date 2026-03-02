import { Handle, Position } from 'reactflow';
import { Network } from 'lucide-react';

const handleStyle = { background: '#3B82F6', width: 12, height: 12, border: '2px solid white' };

const methodColors = { GET: '#10B981', POST: '#3B82F6', PUT: '#F59E0B', PATCH: '#F59E0B', DELETE: '#EF4444' };

export default function APINode({ data }) {
  const node = data.node;
  const nodeData = node?.data || {};
  const method = nodeData.method || 'GET';
  return (
    <div
      onClick={data.onClick}
      style={{
        minWidth: '200px', padding: '14px 16px', cursor: 'pointer',
        backgroundColor: '#fff', border: '2px solid #d1d5db', borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: '0.15s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Network size={14} color="#3B82F6" />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{nodeData.nodeName || 'API Call'}</span>
      </div>
      <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>API</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px',
          backgroundColor: (methodColors[method] || '#6B7280') + '18',
          color: methodColors[method] || '#6B7280',
        }}>{method}</span>
        {nodeData.url && (
          <span style={{ fontSize: '10px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
            {nodeData.url}
          </span>
        )}
      </div>
      <Handle type="target" position={Position.Left} id="api-input" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="api-output" style={handleStyle} />
    </div>
  );
}
