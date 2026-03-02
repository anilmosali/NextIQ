import { Handle, Position } from 'reactflow';
import { StopCircle } from 'lucide-react';

const handleStyle = { background: '#3B82F6', width: 12, height: 12, border: '2px solid white' };

export default function EndNode({ data }) {
  const node = data.node;
  return (
    <div
      onClick={data.onClick}
      style={{
        minWidth: '200px', padding: '14px 16px', cursor: 'pointer',
        backgroundColor: '#fff', border: '2px solid #d1d5db', borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: '0.15s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StopCircle size={14} color="#EF4444" />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{node?.label || 'End'}</span>
      </div>
      <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px' }}>Return</div>
      <div style={{ fontSize: '11px', color: '#6B7280' }}>
        Returns: {node?.data?.selectedOutputs?.length || 0} variables
      </div>
      <Handle type="target" position={Position.Left} id="end-input" style={handleStyle} />
    </div>
  );
}
