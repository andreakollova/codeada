'use client';

const s = { bg: '#111', card: '#1a1a1a', border: '#222', green: '#22c55e', text: '#fff', dim: '#666' };

export default function CalculatorPreview({ variables }: { variables: Record<string, any> }) {
  const fn = variables.first_number;
  const sn = variables.second_number;
  const op = variables.operation;
  const result = variables.result;
  const hasCalc = variables.calculate === '__function__';

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: s.text, letterSpacing: '0.1em', marginBottom: 8 }}>
        KALKULAČKA
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: 11, color: s.dim, fontWeight: 600 }}>Prvé číslo</label>
        <div style={{
          padding: '12px 16px', background: s.card, borderRadius: 10, border: `1px solid ${s.border}`,
          color: fn !== undefined ? s.text : '#333', fontSize: 18, fontWeight: 600, textAlign: 'center',
          fontFamily: 'var(--font-mono)',
        }}>
          {fn !== undefined ? fn : '—'}
        </div>

        <label style={{ fontSize: 11, color: s.dim, fontWeight: 600 }}>Operácia</label>
        {hasCalc ? (
          <div style={{ display: 'flex', gap: 6 }}>
            {['+', '-', '*', '/'].map(o => (
              <div key={o} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, textAlign: 'center', fontSize: 16, fontWeight: 700,
                background: op === o ? s.green : s.card, color: op === o ? '#000' : s.dim,
                border: `1px solid ${op === o ? s.green : s.border}`,
              }}>{o === '*' ? '×' : o === '/' ? '÷' : o}</div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '12px 16px', background: s.card, borderRadius: 10, border: `1px solid ${s.border}`,
            color: op !== undefined ? s.text : '#333', fontSize: 18, fontWeight: 600, textAlign: 'center',
          }}>
            {op !== undefined ? (op === '*' ? '×' : op === '/' ? '÷' : op) : '—'}
          </div>
        )}

        <label style={{ fontSize: 11, color: s.dim, fontWeight: 600 }}>Druhé číslo</label>
        <div style={{
          padding: '12px 16px', background: s.card, borderRadius: 10, border: `1px solid ${s.border}`,
          color: sn !== undefined ? s.text : '#333', fontSize: 18, fontWeight: 600, textAlign: 'center',
          fontFamily: 'var(--font-mono)',
        }}>
          {sn !== undefined ? sn : '—'}
        </div>
      </div>

      {/* Calculate button */}
      {hasCalc && (
        <div style={{
          padding: '14px', background: s.green, borderRadius: 10, textAlign: 'center',
          fontWeight: 700, fontSize: 14, color: '#000',
        }}>
          Vypočítať
        </div>
      )}

      {/* Result */}
      {result !== undefined && (
        <div style={{
          padding: '16px', background: '#22c55e10', borderRadius: 12, border: '1px solid #22c55e30',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: s.dim, marginBottom: 4 }}>Výsledok</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: s.green, fontFamily: 'var(--font-mono)' }}>
            {typeof result === 'string' ? result : result}
          </div>
        </div>
      )}

      {/* Empty state */}
      {fn === undefined && sn === undefined && (
        <div style={{ textAlign: 'center', padding: 20, color: '#333', fontSize: 13 }}>
          Kalkulačka sa tvorí...
        </div>
      )}
    </div>
  );
}
