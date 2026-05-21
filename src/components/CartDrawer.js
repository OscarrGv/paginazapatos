'use client';

import { useAppContext } from '@/context/AppContext';
import { X, Trash2, Plus, Minus, Truck, ArrowLeft, CreditCard, Wallet, QrCode, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/translations';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, user, setIsAuthModalOpen, language } = useAppContext();
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Flujo de pasos: 'cart', 'payment-method', 'card-details', 'processing', 'confirmed'
  const [step, setStep] = useState('cart');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('Procesando pago seguro...');

  const t = useTranslation(language);

  // Cargar métodos de envío
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

  // Resetear estados al abrir/cerrar drawer
  useEffect(() => {
    if (!isCartOpen) {
      setStep('cart');
      setCardData({ number: '', name: '', expiry: '', cvv: '' });
      setIsCvvFocused(false);
      setConfirmedOrderId(null);
      setIsCheckingOut(false);
    }
  }, [isCartOpen]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingPrice = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal > 0 ? subtotal + shippingPrice : 0;

  // Formateadores de Tarjeta
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardData(prev => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardData(prev => ({ ...prev, expiry: value }));
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardData(prev => ({ ...prev, cvv: value }));
  };

  // Manejo de Navegación de Pasos
  const handleStartCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setStep('payment-method');
  };

  const handlePaymentMethodSubmit = () => {
    if (paymentMethod === 'card') {
      setStep('card-details');
    } else {
      // Para PayPal y OXXO procedemos directo a procesar
      handleProcessPayment();
    }
  };

  const handleProcessPayment = async () => {
    // Validar tarjeta si corresponde
    if (paymentMethod === 'card') {
      if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
        alert('Por favor, ingresa un número de tarjeta válido de 16 dígitos.');
        return;
      }
      if (!cardData.name || cardData.name.trim().length < 3) {
        alert('Por favor, ingresa el nombre del titular.');
        return;
      }
      if (!cardData.expiry || cardData.expiry.length < 5) {
        alert('Por favor, ingresa la fecha de vencimiento (MM/YY).');
        return;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        alert('Por favor, ingresa un CVV válido.');
        return;
      }
    }

    setStep('processing');
    setIsCheckingOut(true);
    
    // Simular retraso de carga con mensajes dinámicos premium
    setLoadingMessage('Validando información bancaria...');
    setTimeout(() => {
      setLoadingMessage('Verificando fondos disponibles...');
      setTimeout(() => {
        setLoadingMessage('Enviando correo de confirmación de pedido...');
      }, 1000);
    }, 1000);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          userInfo: user,
          shippingMethod: selectedShipping,
          total: total,
          paymentMethod: paymentMethod,
          cardInfo: paymentMethod === 'card' ? {
            last4: cardData.number.slice(-4),
            holder: cardData.name
          } : null
        })
      });

      // Asegurar que la pantalla de carga dure al menos 2.5s para apreciar la simulación
      await new Promise(resolve => setTimeout(resolve, 2500));

      const data = await res.json();
      setIsCheckingOut(false);

      if (data.success) {
        setConfirmedOrderId(data.orderId);
        setStep('confirmed');
        clearCart();
      } else {
        alert(data.error || 'Error al procesar el pago.');
        setStep(paymentMethod === 'card' ? 'card-details' : 'payment-method');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con la pasarela de pago');
      setIsCheckingOut(false);
      setStep(paymentMethod === 'card' ? 'card-details' : 'payment-method');
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => {
          if (!isCheckingOut && step !== 'confirmed') {
            setIsCartOpen(false);
          }
        }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 100
        }}
      />

      {/* Drawer */}
      <div
        className="glass"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '420px',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255,255,255,0.98)',
          color: 'var(--foreground)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.15)',
          animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
        }}
      >
        {/* Cabecera del Drawer */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {step !== 'cart' && step !== 'processing' && step !== 'confirmed' && (
              <button 
                onClick={() => {
                  if (step === 'payment-method') setStep('cart');
                  if (step === 'card-details') setStep('payment-method');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
              {step === 'cart' && t.cart.title}
              {step === 'payment-method' && 'Método de Pago'}
              {step === 'card-details' && 'Datos de la Tarjeta'}
              {step === 'processing' && 'Simulando Pago'}
              {step === 'confirmed' && '¡Pedido Recibido!'}
            </h2>
          </div>
          <button 
            disabled={isCheckingOut} 
            onClick={() => setIsCartOpen(false)} 
            style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer', opacity: isCheckingOut ? 0.3 : 1 }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido según el paso */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* PASO 1: Carrito de Compras */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.6, marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '3rem' }}>🛒</span>
                  <p>{t.cart.empty}</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {cart.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '16px', background: 'rgba(212,175,55,0.04)', border: '1px solid var(--surface-border)', padding: '12px', borderRadius: '12px', transition: 'all 0.2s' }}>
                        <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' }}>{item.name}</h4>
                          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '8px' }}>{t.productsPage.size} {item.size} | ${item.price}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: '6px', padding: '4px 8px' }}>
                              <button onClick={() => updateQuantity(item.id, item.size, -1)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}><Minus size={14}/></button>
                              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.size, 1)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}><Plus size={14}/></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id, item.size)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '4px' }}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1a1a' }}>
                      <Truck size={18} color="var(--primary)" /> {t.cart.shippingMethod}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {shippingOptions.map(opt => (
                        <label key={opt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: selectedShipping?.id === opt.id ? '2px solid var(--primary)' : '1px solid var(--surface-border)', borderRadius: '8px', cursor: 'pointer', background: selectedShipping?.id === opt.id ? 'rgba(212,175,55,0.03)' : 'transparent', transition: 'border-color 0.2s' }}>
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
            </>
          )}

          {/* PASO 2: Selección de Método de Pago */}
          {step === 'payment-method' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Selecciona cómo deseas realizar el pago simulado para tu pedido:</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Opción Tarjeta */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                    border: paymentMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--surface-border)', 
                    borderRadius: '12px', cursor: 'pointer', background: paymentMethod === 'card' ? 'rgba(212,175,55,0.03)' : 'transparent'
                  }}
                >
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '8px' }}>
                    <CreditCard size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>Tarjeta de Crédito / Débito</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Visa, Mastercard, American Express</p>
                  </div>
                  <input type="radio" checked={paymentMethod === 'card'} onChange={() => {}} style={{ accentColor: 'var(--primary)' }} />
                </div>

                {/* Opción PayPal */}
                <div 
                  onClick={() => setPaymentMethod('paypal')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                    border: paymentMethod === 'paypal' ? '2px solid var(--primary)' : '1px solid var(--surface-border)', 
                    borderRadius: '12px', cursor: 'pointer', background: paymentMethod === 'paypal' ? 'rgba(212,175,55,0.03)' : 'transparent'
                  }}
                >
                  <div style={{ background: '#003087', color: 'white', padding: '10px', borderRadius: '8px' }}>
                    <Wallet size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>PayPal</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Paga de forma segura con tu saldo de PayPal</p>
                  </div>
                  <input type="radio" checked={paymentMethod === 'paypal'} onChange={() => {}} style={{ accentColor: 'var(--primary)' }} />
                </div>

                {/* Opción OXXO / Transferencia */}
                <div 
                  onClick={() => setPaymentMethod('oxxo')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                    border: paymentMethod === 'oxxo' ? '2px solid var(--primary)' : '1px solid var(--surface-border)', 
                    borderRadius: '12px', cursor: 'pointer', background: paymentMethod === 'oxxo' ? 'rgba(212,175,55,0.03)' : 'transparent'
                  }}
                >
                  <div style={{ background: '#E01A22', color: 'white', padding: '10px', borderRadius: '8px' }}>
                    <QrCode size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>Efectivo OXXO / SPEI</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Obtén una ficha y deposita en efectivo</p>
                  </div>
                  <input type="radio" checked={paymentMethod === 'oxxo'} onChange={() => {}} style={{ accentColor: 'var(--primary)' }} />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Formulario e Interactividad de Tarjeta */}
          {step === 'card-details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Tarjeta de Crédito 3D/Glassmorphism Simulada */}
              <div style={{ perspective: '1000px', width: '100%', height: '190px' }}>
                <div style={{
                  position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 0.6s',
                  transform: isCvvFocused ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}>
                  {/* Frente */}
                  <div style={{
                    position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #1e1b4b, #4338ca, #3b82f6)', color: 'white',
                    borderRadius: '16px', padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>Calzado del Pueblo</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, fontStyle: 'italic' }}>
                        {cardData.number.startsWith('4') ? 'VISA' : cardData.number.startsWith('5') ? 'Mastercard' : 'CARD'}
                      </span>
                    </div>
                    
                    {/* Chip y Contactless */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', opacity: 0.8 }}>
                      <div style={{ width: '36px', height: '26px', background: 'linear-gradient(135deg, #fcd34d, #d97706)', borderRadius: '6px' }} />
                      <span style={{ fontSize: '14px' }}>📟</span>
                    </div>

                    <div style={{ fontSize: '1.4rem', letterSpacing: '3px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace' }}>
                      {cardData.number || '•••• •••• •••• ••••'}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.9 }}>
                      <div>
                        <div style={{ fontSize: '0.55rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '2px' }}>Titular</div>
                        <div style={{ textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                          {cardData.name || 'Nombre del Titular'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.55rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '2px' }}>Expira</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{cardData.expiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Reverso */}
                  <div style={{
                    position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #1f2937, #111827)', color: 'white',
                    borderRadius: '16px', transform: 'rotateY(180deg)', padding: '24px 0', boxSizing: 'border-box',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{ width: '100%', height: '40px', background: '#000' }} />
                    
                    <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <div style={{ marginRight: '8px', fontSize: '0.6rem', textTransform: 'uppercase', textAlign: 'right', opacity: 0.7 }}>Código CVV</div>
                      <div style={{ background: '#fff', color: '#000', padding: '6px 12px', fontSize: '1rem', fontStyle: 'italic', borderRadius: '4px', letterSpacing: '1px', width: '45px', textAlign: 'center', fontWeight: 'bold' }}>
                        {cardData.cvv || '•••'}
                      </div>
                    </div>

                    <div style={{ padding: '0 24px', fontSize: '0.6rem', opacity: 0.5, lineHeight: 1.4 }}>
                      Esta tarjeta se utiliza para fines de simulación de pago en Calzado del Pueblo. Ningún cargo real será realizado.
                    </div>
                  </div>
                </div>
              </div>

              {/* Campos del Formulario */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', opacity: 0.8 }}>Nombre del Titular</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Juan Pérez" 
                    value={cardData.name}
                    onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--surface-border)', borderRadius: '8px', background: 'transparent', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', opacity: 0.8 }}>Número de Tarjeta</label>
                  <input 
                    type="text" 
                    placeholder="4000 1234 5678 9010" 
                    value={cardData.number}
                    onChange={handleCardNumberChange}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--surface-border)', borderRadius: '8px', background: 'transparent', outline: 'none', fontFamily: 'monospace' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', opacity: 0.8 }}>Fecha Vencimiento</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      value={cardData.expiry}
                      onChange={handleExpiryChange}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--surface-border)', borderRadius: '8px', background: 'transparent', outline: 'none', textAlign: 'center' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', opacity: 0.8 }}>CVV</label>
                    <input 
                      type="password" 
                      placeholder="123" 
                      value={cardData.cvv}
                      onChange={handleCvvChange}
                      onFocus={() => setIsCvvFocused(true)}
                      onBlur={() => setIsCvvFocused(false)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--surface-border)', borderRadius: '8px', background: 'transparent', outline: 'none', textAlign: 'center' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: Procesamiento del Pago (Simulación de Carga) */}
          {step === 'processing' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', minHeight: '300px', textAlign: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Loader2 size={60} color="var(--primary)" className="spinner" style={{ animation: 'spin 1.2s linear infinite' }} />
                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.2rem' }}>🔒</span>
              </div>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem' }}>Procesando Pago Seguro</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7, maxWidth: '280px' }}>{loadingMessage}</p>
              <div style={{ width: '100%', maxWidth: '200px', background: '#eaeaea', height: '6px', borderRadius: '3px', overflow: 'hidden', marginTop: '10px' }}>
                <div style={{
                  height: '100%', background: 'var(--primary)', width: '60%', borderRadius: '3px',
                  animation: 'loadProgress 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                }} />
              </div>
            </div>
          )}

          {/* PASO 5: Confirmado (Success) */}
          {step === 'confirmed' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '10px 0', textAlign: 'center' }}>
              
              {/* Checkmark Animado */}
              <div style={{ color: '#22c55e', animation: 'scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
                <CheckCircle2 size={70} strokeWidth={2.5} />
              </div>

              <div>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.4rem', color: '#1a1a1a' }}>¡Pedido Confirmado!</h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', opacity: 0.8, lineHeight: '1.5' }}>
                  Tu pago ha sido procesado exitosamente. Hemos enviado una confirmación a:
                  <br/>
                  <strong style={{ color: 'var(--primary)' }}>{user?.email}</strong>
                </p>
              </div>

              {/* Tarjeta de Resumen */}
              <div style={{ width: '100%', background: 'rgba(212,175,55,0.05)', border: '1px solid var(--surface-border)', borderRadius: '12px', padding: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>Referencia:</span>
                  <strong style={{ color: '#1a1a1a' }}>CP-{confirmedOrderId?.toString().padStart(5, '0')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>Método de Pago:</span>
                  <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                    {paymentMethod === 'card' && '💳 Tarjeta'}
                    {paymentMethod === 'paypal' && '🅿️ PayPal'}
                    {paymentMethod === 'oxxo' && '🏦 OXXO / SPEI'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>Entrega:</span>
                  <span style={{ fontWeight: 600 }}>{selectedShipping?.name}</span>
                </div>
                <hr style={{ border: 0, borderTop: '1px solid var(--surface-border)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700 }}>
                  <span>Total Pagado:</span>
                  <span className="text-gradient">${total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', width: '100%', fontWeight: 500 }}>
                💡 En consola local de Node.js podrás encontrar la vista previa HTML de Ethereal Mail para este pedido.
              </div>
            </div>
          )}
        </div>

        {/* Footer del Drawer */}
        {cart.length > 0 && step !== 'processing' && step !== 'confirmed' && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--surface-border)', background: 'var(--background)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ opacity: 0.8, fontWeight: 500 }}>{t.cart.subtotal}</span>
              <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ opacity: 0.8, fontWeight: 500 }}>{t.cart.shipping} ({selectedShipping?.name || '...'})</span>
              <span style={{ fontWeight: 600 }}>${shippingPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.3rem', fontWeight: 800 }}>
              <span>{t.cart.total}</span>
              <span className="text-gradient">${total.toFixed(2)}</span>
            </div>
            
            {/* Botón Principal Dinámico */}
            {step === 'cart' && (
              <button
                onClick={handleStartCheckout}
                className="btn-primary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px' }}
              >
                {t.cart.checkout}
              </button>
            )}

            {step === 'payment-method' && (
              <button
                onClick={handlePaymentMethodSubmit}
                className="btn-primary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px' }}
              >
                Continuar
              </button>
            )}

            {step === 'card-details' && (
              <button
                onClick={handleProcessPayment}
                className="btn-primary"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px' }}
              >
                Pagar y Confirmar Pedido (${total.toFixed(2)})
              </button>
            )}
          </div>
        )}

        {/* Footer Confirmado */}
        {step === 'confirmed' && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--surface-border)', background: 'var(--background)' }}>
            <button
              onClick={() => setIsCartOpen(false)}
              className="btn-primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px' }}
            >
              Seguir Comprando
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes loadProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </>
  );
}
