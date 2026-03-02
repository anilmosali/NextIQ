import { useState } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import {
  Video, Plus, Calendar, Clock, Users, Search,
  ChevronLeft, ChevronRight, Monitor, Mic, MicOff,
  VideoOff, PhoneOff, MoreHorizontal, MessageSquare,
} from 'lucide-react';

const upcomingMeetings = [
  { id: 1, title: 'Team Standup', time: '8:00 AM - 8:30 AM', status: 'live', type: 'internal', participants: ['Sarah Kim', 'David Chen', 'Anil Reddy'], description: 'Daily sync with engineering team' },
  { id: 2, title: 'Customer Success Review', time: '9:00 AM - 10:00 AM', status: 'upcoming', type: 'internal', participants: ['Jennifer Walsh', 'Michael Torres'], description: 'Weekly metrics discussion' },
  { id: 3, title: 'Titan Solar Power', time: '10:00 AM - 11:00 AM', status: 'upcoming', type: 'external', participants: ['Annie Izquierdo', 'Anil Reddy'], description: 'Scaling discussion with Annie' },
  { id: 4, title: 'Sales Pipeline Review', time: '11:00 AM - 12:00 PM', status: 'upcoming', type: 'internal', participants: ['Neil Patel', 'Maria Garcia'], description: 'Q1 forecast analysis' },
  { id: 5, title: 'Product Demo - DirectBuy', time: '2:00 PM - 3:00 PM', status: 'upcoming', type: 'external', participants: ['David Chen'], description: 'New feature walkthrough' },
];

const pastMeetings = [
  { id: 6, title: 'Weekly Sales Review', time: 'Yesterday, 3:00 PM', duration: '45 min', participants: ['Neil Patel'], hasRecording: true, hasTranscript: true },
  { id: 7, title: 'Meridian Onboarding Kickoff', time: 'Yesterday, 1:00 PM', duration: '1 hr', participants: ['Sarah Johnson'], hasRecording: true, hasTranscript: true },
  { id: 8, title: 'NP Digital Onboarding', time: 'Mon, 11:00 AM', duration: '30 min', participants: ['Neil Patel'], hasRecording: false, hasTranscript: true },
];

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [hovered, setHovered] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>
            Meetings
          </h1>
          <p style={{ fontSize: '15px', color: colors.textSecondary, margin: 0 }}>Schedule, join, and manage your video meetings</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" size="md" icon={<Calendar size={16} />}>Schedule</Button>
          <Button variant="primary" size="md" icon={<Video size={16} />}>Instant Meeting</Button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: `1px solid ${colors.border}` }}>
        {[
          { id: 'upcoming', label: 'Upcoming', count: upcomingMeetings.length },
          { id: 'past', label: 'Past Meetings', count: pastMeetings.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px', border: 'none', borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.blue}` : '2px solid transparent',
              backgroundColor: 'transparent', color: activeTab === tab.id ? theme.colors.blue : colors.textSecondary,
              fontSize: '14px', fontWeight: 600, fontFamily: theme.fonts.body, cursor: 'pointer',
              transition: theme.transitions.fast, display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {tab.label}
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '1px 7px', borderRadius: theme.radii.full,
              backgroundColor: activeTab === tab.id ? theme.colors.blueMuted : colors.surfaceHover,
              color: activeTab === tab.id ? theme.colors.blue : colors.textSecondary,
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {upcomingMeetings.map((meeting, i) => (
            <Card
              key={meeting.id}
              onClick={() => setActiveMeeting(meeting)}
              style={{
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: '20px',
                animation: `staggerFadeIn 0.4s ease ${i * 0.05}s both`,
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: theme.radii.lg,
                backgroundColor: meeting.status === 'live' ? theme.colors.successMuted : theme.colors.blueMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Video size={20} color={meeting.status === 'live' ? theme.colors.success : theme.colors.blue} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: colors.text }}>{meeting.title}</span>
                  {meeting.status === 'live' && (
                    <span style={{
                      fontSize: '11px', fontWeight: 700, color: theme.colors.success,
                      backgroundColor: theme.colors.successMuted, padding: '2px 8px',
                      borderRadius: theme.radii.full, display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.colors.success, animation: 'pulse 2s infinite' }} />
                      Live
                    </span>
                  )}
                  <span style={{
                    fontSize: '11px', fontWeight: 500, color: colors.textSecondary,
                    padding: '2px 8px', borderRadius: theme.radii.full,
                    backgroundColor: colors.surfaceHover,
                  }}>{meeting.type === 'external' ? 'External' : 'Internal'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {meeting.time}
                  </span>
                  <span style={{ fontSize: '13px', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} /> {meeting.participants.length} participants
                  </span>
                </div>
              </div>
              {meeting.status === 'live' ? (
                <Button variant="primary" size="sm" icon={<Video size={14} />}>Join Now</Button>
              ) : (
                <Button variant="secondary" size="sm">Details</Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'past' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pastMeetings.map((meeting, i) => (
            <Card key={meeting.id} style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: theme.radii.lg,
                backgroundColor: colors.surfaceHover, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Video size={20} color={colors.textSecondary} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: colors.text, display: 'block', marginBottom: '4px' }}>{meeting.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', color: colors.textSecondary }}>{meeting.time}</span>
                  <span style={{ fontSize: '13px', color: colors.textSecondary }}>{meeting.duration}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {meeting.hasRecording && <Button variant="ghost" size="sm">Recording</Button>}
                {meeting.hasTranscript && <Button variant="ghost" size="sm">Transcript</Button>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
