'use client';

import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslation } from '@/lib/translations';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, language } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslation(language);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Algo salió mal');
      }

      if (isLogin || data.user) {
        login(data.user);
        setIsAuthModalOpen(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div 
        onClick={() => setIsAuthModalOpen(false)}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      />
      
      <div className="glass-card animate-fade-in-up" style={{
        position: 'relative', width: '100%', maxWidth: '450px', padding: '40px',
        zIndex: 1001
      }}>
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
          {isLogin ? t.auth.welcome : t.auth.createAccount}
        </h2>
        <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '32px' }}>
          {isLogin ? t.auth.subtitle : t.auth.subtitleRegister}
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '24px', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <input 
              type="text" placeholder={t.auth.fullName} required className="input-premium"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
          )}
          <input 
            type="email" placeholder={t.auth.email} required className="input-premium"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder={t.auth.password} required className="input-premium"
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
          />
          
          <button type="submit" className="btn-primary" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '24px', height: '24px', borderWidth: '2px' }}/> : (isLogin ? t.auth.login : t.auth.register)}
          </button>
        </form>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.auth.orContinueWith}</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
          </div>
          
          <button 
            type="button" 
            onClick={() => signIn('google')}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ opacity: 0.8 }}>
            {isLogin ? t.auth.noAccount : t.auth.hasAccount}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontWeight: 600, marginLeft: '8px', cursor: 'pointer' }}
            >
              {isLogin ? t.auth.registerHere : t.auth.loginHere}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
