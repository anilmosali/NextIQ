import { useState, useRef } from 'react';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles, Send, Search, Plus, Mic, ChevronUp,
  MessageSquare, Edit3,
} from 'lucide-react';

const CHAT_HISTORY = [
  { section: 'TODAY', items: [
    { id: 'c1', title: 'Escalated accounts needing follow-up' },
  ]},
  { section: 'YESTERDAY', items: [
    { id: 'c2', title: 'CSAT score trends by segment' },
  ]},
  { section: 'PREVIOUS 7 DAYS', items: [
    { id: 'c3', title: 'Titan Solar Power sentiment analysis' },
    { id: 'c4', title: 'Agent performance this month' },
    { id: 'c5', title: 'Customer effort score analysis' },
    { id: 'c6', title: 'Resolution time by ticket category' },
  ]},
  { section: 'PREVIOUS 30 DAYS', items: [
    { id: 'c7', title: 'Voice of customer themes Q4' },
    { id: 'c8', title: 'At-risk renewal conversations' },
  ]},
];

const SUGGESTED_QUESTIONS = [
  'Which accounts have the lowest health scores and need immediate attention?',
  'What are the most common themes in negative customer conversations this week?',
  'How has our average CSAT score trended over the past 30 days?',
  'Which customers are at risk of churn based on recent interactions?',
];

export default function NextIQPage() {
  const [message, setMessage] = useState('');
  const [searchChats, setSearchChats] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const { theme: themeMode } = useTheme();
  const colors = theme.themes[themeMode];
  const inputRef = useRef(null);

  const filteredHistory = searchChats.trim()
    ? CHAT_HISTORY.map(section => ({
        ...section,
        items: section.items.filter(i => i.title.toLowerCase().includes(searchChats.toLowerCase())),
      })).filter(s => s.items.length > 0)
    : CHAT_HISTORY;

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: colors.background }}>
      {/* ─── Left Sidebar: Chat History ─── */}
      <div style={{
        width: '240px', minWidth: '240px', borderRight: `1px solid ${colors.border}`,
        display: 'flex', flexDirection: 'column', backgroundColor: colors.surface,
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: `linear-gradient(135deg, ${theme.colors.purple}, ${theme.colors.blue})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={13} color="#fff" fill="#fff" strokeWidth={0} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: colors.text, fontFamily: theme.fonts.heading }}>
              Copilot
            </span>
          </div>
          <button
            onClick={() => setSelectedChat(null)}
            style={{
              width: '28px', height: '28px', borderRadius: '6px', border: 'none',
              backgroundColor: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: theme.transitions.fast,
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            title="New chat"
          >
            <Edit3 size={15} color={colors.textSecondary} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '10px 12px 6px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '7px 10px', borderRadius: theme.radii.md,
            border: `1px solid ${colors.border}`, backgroundColor: colors.inputBackground,
          }}>
            <Search size={13} color={colors.textTertiary} />
            <input
              type="text"
              value={searchChats}
              onChange={(e) => setSearchChats(e.target.value)}
              placeholder="Search chats"
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: '12.5px',
                fontFamily: theme.fonts.body, color: colors.text, backgroundColor: 'transparent',
              }}
            />
          </div>
        </div>

        {/* Chat list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {filteredHistory.map((section) => (
            <div key={section.section}>
              <div style={{
                padding: '10px 16px 4px', fontSize: '10px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.6px',
                color: colors.textTertiary,
              }}>
                {section.section}
              </div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedChat(item.id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 16px', border: 'none', cursor: 'pointer',
                    backgroundColor: selectedChat === item.id ? colors.surfaceHover : 'transparent',
                    color: selectedChat === item.id ? colors.text : colors.textSecondary,
                    fontSize: '13px', lineHeight: 1.4, fontFamily: theme.fonts.body,
                    transition: theme.transitions.fast,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (selectedChat !== item.id) e.currentTarget.style.backgroundColor = `${colors.surfaceHover}80`; }}
                  onMouseLeave={e => { if (selectedChat !== item.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', position: 'relative',
      }}>
        {/* Centered welcome */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          maxWidth: '640px', width: '100%',
        }}>
          <h1 style={{
            fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 700,
            color: colors.text, margin: '0 0 28px', textAlign: 'center',
          }}>
            What can I help with?
          </h1>

          {/* Input bar */}
          <div style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '16px',
            border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.inputBackground,
            boxShadow: `0 2px 12px rgba(0,0,0,0.04)`,
          }}>
            <button style={{
              width: '32px', height: '32px', borderRadius: '50%', border: 'none',
              backgroundColor: colors.surfaceHover, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: theme.transitions.fast,
            }}>
              <Plus size={16} color={colors.textSecondary} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && message.trim()) setMessage(''); }}
              placeholder="Ask anything about your customers, accounts, or insights..."
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: '14px',
                fontFamily: theme.fonts.body, color: colors.text, backgroundColor: 'transparent',
                lineHeight: 1.5,
              }}
            />
            <button style={{
              width: '32px', height: '32px', borderRadius: '50%', border: 'none',
              backgroundColor: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Mic size={16} color={colors.textTertiary} />
            </button>
            <button style={{
              width: '32px', height: '32px', borderRadius: '50%', border: 'none',
              backgroundColor: message.trim() ? theme.colors.blue : colors.surfaceHover,
              cursor: message.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: theme.transitions.fast,
            }}>
              <ChevronUp size={16} color={message.trim() ? '#fff' : colors.textTertiary} />
            </button>
          </div>

          {/* Suggested questions */}
          <div style={{
            marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            width: '100%',
          }}>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => { setMessage(q); inputRef.current?.focus(); }}
                style={{
                  padding: '8px 16px', border: 'none', cursor: 'pointer',
                  backgroundColor: 'transparent', color: colors.textSecondary,
                  fontSize: '13px', lineHeight: 1.5, fontFamily: theme.fonts.body,
                  borderRadius: theme.radii.md, transition: theme.transitions.fast,
                  textAlign: 'center', maxWidth: '100%',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.surfaceHover; e.currentTarget.style.color = colors.text; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = colors.textSecondary; }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
