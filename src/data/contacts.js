import theme from '../theme';

const e = theme;

export const contacts = [
  {
    id: 101, name: 'Anil Reddy', company: 'Nextiva', email: 'anil@nextiva.com',
    phone: '+1 (480) 555-0100', role: 'Admin',
    gradient: `linear-gradient(135deg, ${e.colors.avatarIndigo} 0%, ${e.colors.avatarIndigoDark} 100%)`,
    tags: ['Enterprise', 'VIP'],
  },
  {
    id: 102, name: 'Annie Izquierdo', company: 'Titan Solar Power', email: 'annie@titansolar.com',
    phone: '+1 (480) 555-0102', role: 'VP Operations',
    gradient: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`,
    tags: ['Enterprise', 'VIP', 'Scaling'],
  },
  {
    id: 103, name: 'Neil Patel', company: 'NP Digital', email: 'neil@npdigital.com',
    phone: '+1 (213) 555-0198', role: 'CEO',
    gradient: `linear-gradient(135deg, #10B981 0%, #059669 100%)`,
    tags: ['Enterprise'],
  },
  {
    id: 104, name: 'Sarah Johnson', company: 'Flexport', email: 'sarah@flexport.com',
    phone: '+1 (415) 555-0147', role: 'Account Manager',
    gradient: `linear-gradient(135deg, #EF4444 0%, #DC2626 100%)`,
    tags: ['Support'],
  },
  {
    id: 105, name: 'David Chen', company: 'DirectBuy', email: 'david@directbuy.com',
    phone: '+1 (312) 555-0123', role: 'CTO',
    gradient: `linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)`,
    tags: ['Enterprise', 'Scaling'],
  },
  {
    id: 106, name: 'Maria Garcia', company: 'Nothing Bundt Cakes', email: 'maria@nbc.com',
    phone: '+1 (602) 555-0189', role: 'Operations Director',
    gradient: `linear-gradient(135deg, #EC4899 0%, #DB2777 100%)`,
    tags: ['Support'],
  },
  {
    id: 107, name: 'Michael Torres', company: 'Erewhon', email: 'michael@erewhon.com',
    phone: '+1 (310) 555-0156', role: 'General Manager',
    gradient: `linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)`,
    tags: ['VIP'],
  },
  {
    id: 108, name: 'Jennifer Walsh', company: 'Summit Financial', email: 'jennifer@summit.com',
    phone: '+1 (212) 555-0134', role: 'CFO',
    gradient: `linear-gradient(135deg, #F97316 0%, #EA580C 100%)`,
    tags: ['Enterprise'],
  },
];

export const conversations = [
  {
    id: 1, name: 'Brad Pitt', company: 'Meridian Technologies',
    lastMessage: 'We were charged twice for our February invoice.',
    time: '2m', channel: 'chat', unread: true, team: 'Support',
    urgent: true, status: 'online', priority: 'high',
    gradient: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`,
    sentiment: 'negative', sentimentScore: 0.28,
    tags: ['Enterprise', 'VIP', 'At Risk'],
  },
  {
    id: 2, name: 'Michael Torres', company: 'Erewhon',
    lastMessage: 'Contract renewal terms — upgrade vs downsize?',
    time: '1h', channel: 'email', unread: true, team: 'Sales',
    status: 'away', priority: 'medium',
    gradient: contacts[6].gradient,
    sentiment: 'neutral', sentimentScore: 0.6,
    tags: ['Business Pro'],
  },
  {
    id: 3, name: 'Emily Davis', company: 'Brightwave Corp',
    lastMessage: "I've been trying to reset my password — keeps erroring out.",
    time: '3h', channel: 'phone', unread: true, team: 'Support',
    status: 'online', priority: 'high',
    gradient: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`,
    sentiment: 'negative', sentimentScore: 0.3,
    tags: [],
  },
  {
    id: 4, name: 'David Kim', company: 'DirectBuy',
    lastMessage: 'API rate limit errors during peak batch sync.',
    time: '4h', channel: 'chat', unread: false, team: 'Support',
    status: 'offline', priority: 'medium',
    gradient: contacts[4].gradient,
    sentiment: 'negative', sentimentScore: 0.35,
    tags: ['Technical'],
  },
  {
    id: 5, name: 'Tom Bradley', company: 'Titan Solar Power',
    lastMessage: 'Phone system down 45 min. 300 agents can\'t make calls.',
    time: '2d', channel: 'email', unread: true, team: 'Support',
    status: 'offline', priority: 'high',
    gradient: contacts[1].gradient,
    sentiment: 'negative', sentimentScore: 0.12,
    tags: ['VIP', 'At Risk', 'Critical'],
  },
  {
    id: 6, name: 'Amanda Foster', company: 'NP Digital',
    lastMessage: 'Multi-site expansion from 3 to 8 locations by Q3.',
    time: '3d', channel: 'chat', unread: false, team: 'Sales',
    status: 'online', priority: 'medium',
    gradient: contacts[2].gradient,
    sentiment: 'neutral', sentimentScore: 0.7,
    tags: ['Expanding'],
  },
];

export const inboxCounts = {
  personal: 3,
  sales_team: 5,
  support_team: 4,
  vip_accounts: 3,
  get total() { return this.personal + this.sales_team + this.support_team + this.vip_accounts; },
};
