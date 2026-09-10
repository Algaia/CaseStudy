import { useState } from 'react';
import { Button, Icon } from '../components/ui';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function submit(event) {
    event.preventDefault();
    if (email.trim() && password.trim()) onLogin(email.trim(), password);
  }

  return (
    <main className="login-page">
      <section className="login-intro">
        <div className="login-brand"><div className="brand-mark"><span>WB</span></div><div><strong>WalangBrownout</strong><small>Appliances</small></div></div>
        <div className="intro-copy">
          <p className="eyebrow">REAL-TIME INVENTORY CONTROL</p>
          <h1>Stock clarity,<br /><em>right when it matters.</em></h1>
          <p>Keep every shipment, pick, batch, and reorder decision synchronized from the warehouse floor to purchasing.</p>
        </div>
        <div className="problem-points">
          <div><span className="point-icon"><Icon name="refresh" /></span><p><strong>Live stock movement</strong><small>Records update at the point of action.</small></p></div>
          <div><span className="point-icon"><Icon name="check" /></span><p><strong>FEFO guided picking</strong><small>Use the earliest-expiring lot first.</small></p></div>
          <div><span className="point-icon"><Icon name="trend" /></span><p><strong>Season-aware reordering</strong><small>Plan for summer without winter overstock.</small></p></div>
        </div>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <div className="login-card-heading"><span className="lock-icon">⌁</span><p className="eyebrow">SECURE ACCESS</p><h2>Welcome back</h2><p>Sign in to continue to inventory control.</p></div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@warehouse.com" autoComplete="username" />
          <label htmlFor="password">Password</label>
          <div className="password-wrap"><input id="password" value={password} type={showPassword ? 'text' : 'password'} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>
          <div className="login-options"><label className="check-label"><input type="checkbox" defaultChecked /> <span>Keep me signed in</span></label><button type="button" title="Not available in this demo">Forgot password?</button></div>
          <Button type="submit" className="login-submit">Sign in to workspace <Icon name="arrow" size={17} /></Button>
        </form>
      </section>
    </main>
  );
}
