'use client';

import { useAppContext } from '@/context/AppContext';
import { X, Trash2, Plus, Minus, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, user, setIsAuthModalOpen } = useAppContext();
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (isCartOpen && shippingOptions.length === 0) {
      fetch('/api/shipping')
        .then(res => res.json())
        .then(data => {
          setShippingOptions(data);
          setSelectedShipping(data[0]);
        });
    }
  }, [isCartOpen]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingPrice = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal > 0 ? subtotal + shippingPrice : 0;

  const handleGoToPayment = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          userInfo: user,
          shippingMethod: selectedShipping,
          total: total
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Error iniciando el pago seguro');
        setIsCheckingOut(false);
      }
    } catch (err) {
      alert('Error de conexión con la pasarela de pago');
      setIsCheckingOut(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)', zIndex: 100
        }}
      />

      <div
        className="glass"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '100%', maxWidth: '420px', zIndex: 101,
          display: 'flex', flexDirection: 'column',
          background: 'rgba(255,255,255,0.95)',
          color: 'var(--foreground)',
          boxShadow: '-10px 0 30px rgba(212, 175, 55, 0.15)',
          animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>Tu Carrito</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', opacity: 0.6, marginTop: '40px' }}>
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', background: 'rgba(212,175,55,0.05)', border: '1px solid var(--surface-border)', padding: '12px', borderRadius: '12px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.name}</h4>
                      <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '8px' }}>Talla: {item.size} | ${item.price}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--background)', borderRadius: '6px', padding: '4px' }}>
                          <button onClick={() => updateQuantity(item.id, item.size, -1)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}><Minus size={16}/></button>
                          <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, 1)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}><Plus size={16}/></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.size)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={18} color="var(--primary)" /> Método de Envío
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {shippingOptions.map(opt => (
                    <label key={opt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: selectedShipping?.id === opt.id ? '2px solid var(--primary)' : '1px solid var(--surface-border)', borderRadius: '8px', cursor: 'pointer', background: selectedShipping?.id === opt.id ? 'rgba(212,175,55,0.05)' : 'transparent' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input type="radio" name="shipping" checked={selectedShipping?.id === opt.id} onChange={() => setSelectedShipping(opt)} style={{ accentColor: 'var(--primary)' }} />
                        <span style={{ fontWeight: selectedShipping?.id === opt.id ? 700 : 500 }}>{opt.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${opt.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--surface-border)', background: 'var(--background)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ opacity: 0.8, fontWeight: 500 }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ opacity: 0.8, fontWeight: 500 }}>Envío ({selectedShipping?.name || '...'})</span>
              <span style={{ fontWeight: 600 }}>${shippingPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.3rem', fontWeight: 800 }}>
              <span>Total</span>
              <span className="text-gradient">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleGoToPayment}
              disabled={isCheckingOut}
              className="btn-primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px', opacity: isCheckingOut ? 0.7 : 1 }}
            >
              {isCheckingOut ? 'Redirigiendo...' : 'Proceder al Pago'}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
