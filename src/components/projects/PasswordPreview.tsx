'use client';

const s = { bg: '#111', card: '#1a1a1a', border: '#222', purple: '#8b5cf6', text: '#fff', dim: '#666' };

export default function PasswordPreview({ variables }: { variables: Record<string, any> }) {
  const length = variables.length;
  const uppercase = typeof variables.uppercase === 'string';
  const lowercase = typeof variables.lowercase === 'string';
  const numbers = typeof variables.numbers === 'string';
  const symbols = typeof variables.symbols === 'string';
  const characters = typeof variables.characters === 'string';
  const charCount = typeof variables.characters === 'string' ? variables.characters.length : 0;
  const password = variables.password;
  const hasGenFn = variables.generate_password === '__function__';

  const checks = [
    { label: 'Veľké písmená', active: uppercase },
    { label: 'Malé písmená', active: lowercase },
    { label: 'Číslice', active: numbers },
    { label: 'Symboly', active: symbols },
  ];

  // Password strength
  const getStrength = (pw: string) => {
    if (!pw) return { label: '', color: '#333', width: 0 };
    if (pw.length < 8) return { label: 'Weak', color: '#ef4444', width: 25 };
    if (pw.length < 12) return { label: 'Medium', color: '#f59e0b', width: 50 };
    if (pw.length < 16) return { label: 'Strong', color: '#22c55e', width: 75 };
    return { label: 'Very Strong', color: '#22c55e', width: 100 };
  };

  const strength = getStrength(password);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: s.text, letterSpacing: '0.1em', marginBottom: 4 }}>
        PASSWORD GENERATOR
      </div>

      {/* Length slider visual */}
      {length !== undefined && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: s.dim }}>Dĺžka hesla</span>
            <span style={{ fontSize: 13, color: s.purple, fontWeight: 700 }}>{length}</span>
          </div>
          <div style={{ height: 6, background: s.card, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (length / 32) * 100)}%`, height: '100%',
              background: s.purple, borderRadius: 3, transition: 'width 0.3s',
            }} />
          </div>
        </div>
      )}

      {/* Checkboxes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {checks.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: c.active ? s.purple : 'transparent', border: `2px solid ${c.active ? s.purple : '#333'}`,
              transition: 'all 0.2s',
            }}>
              {c.active && <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</span>}
            </div>
            <span style={{ color: c.active ? s.text : '#444' }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Available chars count */}
      {charCount > 0 && (
        <div style={{ fontSize: 12, color: s.dim, textAlign: 'center' }}>
          Dostupné znaky: <span style={{ color: s.purple, fontWeight: 600 }}>{charCount}</span>
        </div>
      )}

      {/* Generate button */}
      {(characters || hasGenFn) && (
        <div style={{
          padding: '14px', background: s.purple, borderRadius: 10, textAlign: 'center',
          fontWeight: 700, fontSize: 14, color: '#fff',
        }}>
          Generate Password
        </div>
      )}

      {/* Password display */}
      {password && (
        <div style={{
          padding: '16px', background: '#0a0a0a', borderRadius: 12, border: '1px solid #222',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 18, fontWeight: 700, color: s.text, fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em', wordBreak: 'break-all', marginBottom: 12,
          }}>
            {password}
          </div>
          {/* Strength bar */}
          <div style={{ height: 4, background: s.card, borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ width: `${strength.width}%`, height: '100%', background: strength.color, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</div>
        </div>
      )}

      {/* Empty state */}
      {!length && !password && (
        <div style={{ textAlign: 'center', padding: 20, color: '#333', fontSize: 13 }}>
          Generátor sa pripravuje...
        </div>
      )}
    </div>
  );
}
