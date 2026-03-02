import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import {
  Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, PhoneOff,
  Voicemail, Clock, Search, Filter, Download,
  MoreHorizontal, Play, ChevronDown,
} from 'lucide-react';

const callLogs = [
  { id: 1, name: 'Annie Izquierdo', company: 'Titan Solar Power', phone: '+1 (480) 555-0102', type: 'inbound', status: 'answered', duration: '12:34', time: '10:15 AM', date: 'Today', hasRecording: true, hasTranscript: true, gradient: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)` },
  { id: 2, name: 'Neil Patel', company: 'NP Digital', phone: '+1 (213) 555-0198', type: 'outbound', status: 'answered', duration: '8:22', time: '9:45 AM', date: 'Today', hasRecording: true, hasTranscript: false, gradient: `linear-gradient(135deg, #10B981 0%, #059669 100%)` },
  { id: 3, name: 'Unknown Caller', company: '', phone: '+1 (555) 123-4567', type: 'inbound', status: 'missed', duration: '', time: '9:12 AM', date: 'Today', hasRecording: false, hasTranscript: false, gradient: `linear-gradient(135deg, #6B7280 0%, #4B5563 100%)` },
  { id: 4, name: 'David Chen', company: 'DirectBuy', phone: '+1 (312) 555-0123', type: 'outbound', status: 'answered', duration: '25:17', time: '4:30 PM', date: 'Yesterday', hasRecording: true, hasTranscript: true, gradient: `linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)` },
  { id: 5, name: 'Jennifer Walsh', company: 'Summit Financial', phone: '+1 (212) 555-0134', type: 'inbound', status: 'answered', duration: '5:45', time: '2:15 PM', date: 'Yesterday', hasRecording: true, hasTranscript: true, gradient: `linear-gradient(135deg, #F97316 0%, #EA580C 100%)` },
  { id: 6, name: 'Maria Garcia', company: 'Nothing Bundt Cakes', phone: '+1 (602) 555-0189', type: 'inbound', status: 'voicemail', duration: '1:23', time: '11:00 AM', date: 'Yesterday', hasRecording: true, hasTranscript: false, gradient: `linear-gradient(135deg, #EC4899 0%, #DB2777 100%)` },
];

const filters = [
  { id: 'all', label: 'All Calls' },
  { id: 'inbound', label: 'Inbound' },
  { id: 'outbound', label: 'Outbound' },
  { id: 'missed', label: 'Missed' },
  { id: 'voicemail', label: 'Voicemail' },
];

export default function CallsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [hovered, setHovered] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  const getCallIcon = (type, status) => {
    if (status === 'missed') return { Icon: PhoneMissed, color: theme.colors.error };
    if (status === 'voicemail') return { Icon: Voicemail, color: theme.colors.purple };
    if (type === 'inbound') return { Icon: PhoneIncoming, color: theme.colors.success };
    return { Icon: PhoneOutgoing, color: theme.colors.blue };
  };

  const filtered = callLogs.filter((c) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'inbound') return c.type === 'inbound' && c.status !== 'missed' && c.status !== 'voicemail';
    if (activeFilter === 'outbound') return c.type === 'outbound';
    if (activeFilter === 'missed') return c.status === 'missed';
    if (activeFilter === 'voicemail') return c.status === 'voicemail';
    return true;
  });

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>Calls</h1>
          <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>View your call history and recordings</p>
        </div>
        <Button variant="primary" size="md" icon={<Phone size={16} />}>New Call</Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Inbound Calls', value: '127', icon: PhoneIncoming, color: theme.colors.success },
          { label: 'Total Outbound Calls', value: '89', icon: PhoneOutgoing, color: theme.colors.blue },
          { label: 'Total Dropped Calls', value: '12', icon: PhoneMissed, color: theme.colors.error },
          { label: 'Avg Inbound Duration', value: '4:32', icon: Clock, color: theme.colors.purple },
        ].map((stat, i) => (
          <Card key={i} style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: theme.radii.md, backgroundColor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={18} color={stat.color} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: colors.text, marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: colors.textSecondary }}>{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: '8px 16px', borderRadius: theme.radii.md, border: 'none',
              backgroundColor: activeFilter === f.id ? theme.colors.blueMuted : 'transparent',
              color: activeFilter === f.id ? theme.colors.blue : colors.textSecondary,
              fontSize: '13px', fontWeight: 600, fontFamily: theme.fonts.body, cursor: 'pointer',
              transition: theme.transitions.fast,
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Call log */}
      <Card hover={false} style={{ overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
          padding: '12px 24px', backgroundColor: colors.surfaceHover,
          borderBottom: `1px solid ${colors.border}`,
        }}>
          {['Contact', 'Type', 'Duration', 'Time', 'Date', ''].map((h, i) => (
            <span key={i} style={{ fontSize: '11px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
          ))}
        </div>
        {filtered.map((call, i) => {
          const { Icon, color } = getCallIcon(call.type, call.status);
          return (
            <div
              key={call.id}
              onMouseEnter={() => setHovered(call.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                padding: '16px 24px', alignItems: 'center',
                borderBottom: `1px solid ${colors.divider}`,
                backgroundColor: hovered === call.id ? colors.surfaceHover : 'transparent',
                cursor: 'pointer', transition: theme.transitions.fast,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar name={call.name} size={36} gradient={call.gradient} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: colors.text }}>{call.name}</div>
                  {call.company && <div style={{ fontSize: '12px', color: colors.textSecondary }}>{call.company}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={14} color={color} />
                <span style={{ fontSize: '13px', color: colors.textSecondary, textTransform: 'capitalize' }}>{call.status === 'voicemail' ? 'Voicemail' : call.type}</span>
              </div>
              <span style={{ fontSize: '13px', color: call.status === 'missed' ? theme.colors.error : colors.text, fontWeight: call.status === 'missed' ? 600 : 400 }}>
                {call.duration || 'Missed'}
              </span>
              <span style={{ fontSize: '13px', color: colors.textSecondary }}>{call.time}</span>
              <span style={{ fontSize: '13px', color: colors.textSecondary }}>{call.date}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {call.hasRecording && (
                  <button style={{ width: '28px', height: '28px', borderRadius: theme.radii.sm, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={14} color={colors.textSecondary} />
                  </button>
                )}
                <button style={{ width: '28px', height: '28px', borderRadius: theme.radii.sm, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={14} color={colors.textSecondary} />
                </button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
