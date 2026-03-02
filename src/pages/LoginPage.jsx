import { useState } from 'react';
import theme from '../theme';
import { NextivaXLogo } from '../components/NextivaLogo';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Shield,
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hoverSignIn, setHoverSignIn] = useState(false);
  const [hoverSSO, setHoverSSO] = useState(false);

  const stats = [
    { value: '23%', label: 'More deals closed' },
    { value: '4hrs', label: 'Saved weekly' },
    { value: '99.9%', label: 'Uptime SLA' },
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: theme.fonts.body,
    }}>
      {/* Left side - Login form */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        backgroundColor: theme.colors.white,
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
          }}>
            <NextivaXLogo size={20} />
            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme.colors.navy,
            }}>Nextiva App</span>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '48px',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: theme.colors.blue,
              backgroundColor: theme.colors.blueMuted,
              padding: '2px 8px',
              borderRadius: theme.radii.full,
            }}>Development</span>
            <span style={{
              fontSize: '13px',
              color: theme.colors.gray500,
            }}>English</span>
          </div>

          {/* Welcome */}
          <h1 style={{
            fontFamily: theme.fonts.heading,
            fontSize: '36px',
            fontWeight: 700,
            color: theme.colors.navy,
            margin: '0 0 8px',
          }}>Welcome.</h1>
          <p style={{
            fontSize: '16px',
            color: theme.colors.gray500,
            margin: '0 0 32px',
          }}>Sign in to manage your conversations.</p>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: theme.colors.gray600,
              marginBottom: '6px',
            }}>Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color={theme.colors.gray400}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  fontSize: '14px',
                  fontFamily: theme.fonts.body,
                  border: `1px solid ${theme.colors.gray200}`,
                  borderRadius: theme.radii.md,
                  color: theme.colors.navy,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: `border-color ${theme.transitions.fast}`,
                }}
                onFocus={(e) => e.target.style.borderColor = theme.colors.blue}
                onBlur={(e) => e.target.style.borderColor = theme.colors.gray200}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: theme.colors.gray600,
              marginBottom: '6px',
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color={theme.colors.gray400}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  fontSize: '14px',
                  fontFamily: theme.fonts.body,
                  border: `1px solid ${theme.colors.gray200}`,
                  borderRadius: theme.radii.md,
                  color: theme.colors.navy,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: `border-color ${theme.transitions.fast}`,
                }}
                onFocus={(e) => e.target.style.borderColor = theme.colors.blue}
                onBlur={(e) => e.target.style.borderColor = theme.colors.gray200}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                {showPassword
                  ? <EyeOff size={18} color={theme.colors.gray400} />
                  : <Eye size={18} color={theme.colors.gray400} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <a href="#" style={{
              fontSize: '13px',
              color: theme.colors.blue,
              textDecoration: 'none',
            }}>Forgot password?</a>
          </div>

          {/* Sign In button */}
          <button
            onClick={onLogin}
            onMouseEnter={() => setHoverSignIn(true)}
            onMouseLeave={() => setHoverSignIn(false)}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: hoverSignIn ? '#0056A0' : theme.colors.blue,
              color: theme.colors.white,
              border: 'none',
              borderRadius: theme.radii.md,
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: theme.fonts.body,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: `all ${theme.transitions.fast}`,
              boxShadow: hoverSignIn
                ? '0 4px 12px rgba(0, 98, 184, 0.4)'
                : '0 2px 8px rgba(0, 98, 184, 0.25)',
              transform: hoverSignIn ? 'translateY(-1px)' : 'none',
            }}
          >
            Sign in
            <ArrowRight size={18} />
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.gray200 }} />
            <span style={{ fontSize: '13px', color: theme.colors.gray400 }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.gray200 }} />
          </div>

          {/* SSO */}
          <button
            onMouseEnter={() => setHoverSSO(true)}
            onMouseLeave={() => setHoverSSO(false)}
            onClick={onLogin}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: hoverSSO ? theme.colors.gray50 : theme.colors.white,
              color: theme.colors.navy,
              border: `1px solid ${theme.colors.gray200}`,
              borderRadius: theme.radii.md,
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: theme.fonts.body,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: `all ${theme.transitions.fast}`,
            }}
          >
            <Shield size={18} />
            Sign in with SSO
          </button>

          {/* Footer */}
          <div style={{
            marginTop: '48px',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '8px',
              flexWrap: 'wrap',
            }}>
              {['Privacy Policy', 'Legal', 'Security Policy'].map((text, i) => (
                <a key={i} href="#" style={{
                  fontSize: '12px',
                  color: theme.colors.gray400,
                  textDecoration: 'none',
                }}>{text}</a>
              ))}
            </div>
            <p style={{
              fontSize: '11px',
              color: theme.colors.gray400,
              margin: '0 0 4px',
            }}>Copyright © 2026 Nextiva, All Rights Reserved</p>
            <p style={{
              fontSize: '11px',
              color: theme.colors.gray400,
              margin: 0,
            }}>Powered by <strong>XBert AI</strong></p>
          </div>
        </div>
      </div>

      {/* Right side - Marketing */}
      <div style={{
        flex: '0 0 50%',
        background: `linear-gradient(160deg, ${theme.colors.navy} 0%, #0a1a3a 50%, #0b2444 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative gradients */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(0,98,184,0.15) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
          <h2 style={{
            fontFamily: theme.fonts.heading,
            fontSize: '40px',
            fontWeight: 700,
            color: theme.colors.white,
            lineHeight: 1.2,
            margin: '0 0 16px',
          }}>
            AI that listens.<br />Humans who care.
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6,
            margin: '0 0 40px',
          }}>
            Your AI receptionist handles calls, books appointments, and routes customers—24/7.
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '24px',
            marginBottom: '48px',
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{
                padding: '16px 20px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: theme.radii.lg,
                border: '1px solid rgba(255,255,255,0.08)',
                flex: 1,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: theme.colors.white,
                  marginBottom: '4px',
                }}>{stat.value}</div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 500,
                }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a href="#" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: theme.colors.blue,
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '48px',
          }}>
            Learn more about XBert
            <ArrowRight size={16} />
          </a>

          {/* Testimonial */}
          <div style={{
            padding: '24px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: theme.radii.xl,
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '32px',
          }}>
            <p style={{
              fontFamily: theme.fonts.heading,
              fontSize: '15px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.7,
              margin: '0 0 16px',
              fontStyle: 'italic',
            }}>
              "Nextiva transformed how we communicate across our global operations. The unified platform handles everything—calls, video, messaging—and the AI features save our team hours every day."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.colors.blue} 0%, ${theme.colors.purple} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                color: '#fff',
              }}>RP</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.white }}>
                  Ryan Petersen
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  CEO · Flexport
                </div>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                display: 'flex',
              }}>
                {['E', 'F', 'G'].map((letter, i) => (
                  <div key={i} style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: i === 0 ? theme.colors.purple : i === 1 ? theme.colors.blue : theme.colors.success,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#fff',
                    border: '2px solid rgba(2,18,44,0.8)',
                    marginLeft: i > 0 ? '-8px' : 0,
                  }}>{letter}</div>
                ))}
              </div>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.7)',
              }}>100,000+ businesses</span>
            </div>
            <div style={{
              padding: '4px 12px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: theme.radii.full,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>4.8★ on G2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
