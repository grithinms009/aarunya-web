import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Blush card with an email capture. Validates inline; swaps to a thank-you on success.
 *  Wire the submit to your email provider before launch — nothing is sent today. */
export function Newsletter() {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setErr(true);
      return;
    }
    setDone(true);
  };

  return (
    <section data-fade style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(56px,8vw,100px) clamp(16px,4vw,40px) clamp(56px,8vw,96px)' }}>
      <div
        style={{
          background: '#FBEFEF', borderRadius: 24,
          padding: 'clamp(32px,6vw,64px) clamp(20px,5vw,64px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14,
        }}
      >
        <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 'clamp(28px,3.6vw,40px)', lineHeight: 1.1, textWrap: 'balance' }}>
          Something lovely, once in a while.
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: '#756964', maxWidth: '28em', lineHeight: 1.6 }}>
          New pieces and little offers, straight to your inbox.
        </p>

        {!done && (
          <>
            <form onSubmit={subscribe} noValidate style={{ display: 'flex', flexWrap: 'wrap', gap: 10, width: '100%', maxWidth: 460, marginTop: 8 }}>
              <label htmlFor="nl-email" className="sr-only">
                Email address
              </label>
              <input
                id="nl-email"
                type="email"
                autoComplete="email"
                placeholder="Your email address"
                value={email}
                aria-invalid={err || undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErr(false);
                }}
                style={{
                  flex: '1 1 220px', minWidth: 0, height: 52, padding: '0 20px', borderRadius: 999,
                  border: `1px solid ${err ? '#8D3545' : '#E3CFC8'}`, background: '#FFFFFF',
                  fontSize: 16, color: '#302722', outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  flex: '1 0 auto', height: 52, padding: '0 28px', borderRadius: 999, border: 'none',
                  background: '#8D3545', color: 'var(--bg)', fontSize: 14, letterSpacing: '.06em',
                  cursor: 'pointer', transition: 'background .25s',
                }}
              >
                Subscribe
              </button>
            </form>
            {err && (
              <span role="alert" style={{ fontSize: 12.5, color: '#8D3545' }}>
                Please enter a valid email address.
              </span>
            )}
          </>
        )}

        {done && (
          <p role="status" style={{ margin: '8px 0 0', fontFamily: "'Jost',sans-serif", fontStyle: 'italic', fontSize: 16, color: '#8D3545', fontWeight: 500 }}>
            Thank you, we’ll write soon ♡
          </p>
        )}
      </div>
    </section>
  );
}
