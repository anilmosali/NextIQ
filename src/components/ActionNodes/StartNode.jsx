import { Handle, Position } from 'reactflow';
import { Flag } from 'lucide-react';

const handleStyle = { background: '#3B82F6', width: 12, height: 12, border: '2px solid white' };

export default function StartNode({ data }) {
  const node = data.node;
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
          <Flag size={14} color="#3B82F6" />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{node?.label || 'Start'}</span>
      </div>
      <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px' }}>Trigger</div>
      <div style={{ fontSize: '11px', color: '#6B7280' }}>
        <div>Inputs: {node?.data?.inputFields?.length || 0}</div>
        <div>Outputs: {node?.data?.outputFields?.length || 0}</div>
      </div>
      <Handle type="source" position={Position.Right} id="start-output" style={handleStyle} />
    </div>
  );
}
