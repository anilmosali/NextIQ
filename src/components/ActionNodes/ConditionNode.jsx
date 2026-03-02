import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';

const handleStyle = { background: '#3B82F6', width: 12, height: 12, border: '2px solid white' };

export default function ConditionNode({ data }) {
  const node = data.node;
  const nodeData = node?.data || {};
  return (
    <div
      onClick={data.onClick}
      style={{
        minWidth: '200px', padding: '14px 16px', cursor: 'pointer',
        backgroundColor: '#fff', border: '2px solid #d1d5db', borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: '0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#F59E0B'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GitBranch size={14} color="#F59E0B" />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{nodeData.nodeName || 'Condition'}</span>
      </div>
      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Branch Logic</div>
      {nodeData.conditions?.length > 0 && (
        <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '4px' }}>
          {nodeData.conditions.length} condition{nodeData.conditions.length > 1 ? 's' : ''} ({nodeData.logicOperator || 'AND'})
        </div>
      )}

      <Handle type="target" position={Position.Top} id="condition-input" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="true" style={{ ...handleStyle, left: '30%', background: '#10B981' }} />
      <div style={{ position: 'absolute', bottom: '-20px', left: '20%', fontSize: '10px', color: '#10B981', fontWeight: 700 }}>TRUE</div>
      <Handle type="source" position={Position.Bottom} id="false" style={{ ...handleStyle, left: '70%', background: '#EF4444' }} />
      <div style={{ position: 'absolute', bottom: '-20px', right: '20%', fontSize: '10px', color: '#EF4444', fontWeight: 700 }}>FALSE</div>
    </div>
  );
}
