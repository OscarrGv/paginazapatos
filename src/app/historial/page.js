'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ShoppingBag, Wrench, Calendar, MapPin, CreditCard, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import Link from 'next/link';

export default function HistorialPage() {
  const { user, setIsAuthModalOpen } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('compras'); // 'compras' o 'servicios'
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/history');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (id, type) => {
    const key = `${type}-${id}`;
    setExpandedOrders(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper para traducir e ilustrar estados de compras
  const getOrderStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendiente', color: '#eab308', bg: '#fef9c3', icon: <Clock size={16} /> };
      case 'processing':
        return { label: 'En Proceso', color: '#3b82f6', bg: '#dbeafe', icon: <Package size={16} /> };
      case 'shipped':
        return { label: 'Enviado', color: '#a855f7', bg: '#f3e8ff', icon: <Truck size={16} /> };
      case 'completed':
        return { label: 'Entregado', color: '#22c55e', bg: '#dcfce7', icon: <CheckCircle size={16} /> };
      default:
        return { label: status, color: '#6b7280', bg: '#f3f4f6', icon: <Clock size={16} /> };
    }
  };

  // Helper para traducir e ilustrar estados de servicios
  const getServiceStatusInfo = (status) => {
    switch (status) {
      case 'requested':
        return { label: 'Registrado', color: '#eab308', bg: '#fef9c3', icon: <Clock size={16} /> };
      case 'received':
        return { label: 'Recibido en Taller', color: '#3b82f6', bg: '#dbeafe', icon: <Package size={16} /> };
      case 'inspecting':
        return { label: 'En Diagnóstico', color: '#f97316', bg: '#ffedd5', icon: <Wrench size={16} /> };
      case 'repairing':
        return { label: 'En Reparación', color: '#a855f7', bg: '#f3e8ff', icon: <Wrench size={16} /> };
      case 'completed':
        return { label: 'Terminado', color: '#22c55e', bg: '#dcfce7', icon: <CheckCircle size={16} /> };
      default:
        return { label: status, color: '#6b7280', bg: '#f3f4f6', icon: <Clock size={16} /> };
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '120px 24px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ background: 'rgba(212,175,55,0.05)', padding: '40px', borderRadius: '24px', border: '1px solid var(--surface-border)', maxWidth: '480px' }}>
          <span style={{ fontSize: '4rem' }}>👤</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '20px 0 10px 0' }}>Mi Historial de Pedidos</h2>
          <p style={{ opacity: 0.8, marginBottom: '30px', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Inicia sesión con tu cuenta registrada de Calzado del Pueblo para revisar el estado de tus compras y solicitudes de reparación.
          </p>
          <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1.1rem' }}>
            Iniciar Sesión / Registrarse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in-up" style={{ padding: '100px 24px', minHeight: '90vh' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: 0 }}>
            Hola, <span className="text-gradient">{user.name}</span>
          </h1>
          <p style={{ opacity: 0.7, margin: '8px 0 0 0', fontSize: '1.1rem' }}>Consulta el historial y seguimiento en tiempo real de tus pedidos.</p>
        </div>
        <button onClick={fetchHistory} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.95rem' }} disabled={loading}>
          🔄 Actualizar Datos
        </button>
      </div>

      {/* Tabs selectoras */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--surface-border)', gap: '20px', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('compras')}
          style={{
            background: 'none', border: 'none', borderBottom: activeTab === 'compras' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'compras' ? 'var(--primary)' : 'var(--foreground)',
            padding: '12px 16px', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s', opacity: activeTab === 'compras' ? 1 : 0.6
          }}
        >
          <ShoppingBag size={20} /> Mis Compras ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('servicios')}
          style={{
            background: 'none', border: 'none', borderBottom: activeTab === 'servicios' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'servicios' ? 'var(--primary)' : 'var(--foreground)',
            padding: '12px 16px', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s', opacity: activeTab === 'servicios' ? 1 : 0.6
          }}
        >
          <Wrench size={20} /> Reparaciones ({services.length})
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div>
          {/* TAB 1: PRODUCTOS */}
          {activeTab === 'compras' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(0,0,0,0.01)', borderRadius: '16px', border: '1px dashed var(--surface-border)' }}>
                  <span style={{ fontSize: '3rem' }}>🛍️</span>
                  <h3 style={{ margin: '15px 0 5px 0', fontWeight: 700 }}>Aún no tienes compras</h3>
                  <p style={{ opacity: 0.6, marginBottom: '20px' }}>Visita nuestra tienda para encontrar el calzado artesanal perfecto para ti.</p>
                  <Link href="/productos" className="btn-primary" style={{ display: 'inline-block', padding: '12px 24px', textDecoration: 'none' }}>
                    Ver Productos
                  </Link>
                </div>
              ) : (
                orders.map((order) => {
                  const statusInfo = getOrderStatusInfo(order.status);
                  const isExpanded = expandedOrders[`order-${order.id}`];
                  
                  return (
                    <div key={order.id} className="glass-card" style={{ padding: '24px', transition: 'all 0.3s' }}>
                      {/* Cabecera del pedido */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1a1a1a' }}>Pedido CP-{order.id.toString().padStart(5, '0')}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px', background: statusInfo.bg, color: statusInfo.color, fontWeight: 700 }}>
                              {statusInfo.icon} {statusInfo.label}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', opacity: 0.7, marginTop: '6px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString('es-MX')}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CreditCard size={14} /> {order.payment_method === 'card' ? 'Tarjeta' : order.payment_method === 'paypal' ? 'PayPal' : 'Efectivo / OXXO'}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Monto Total:</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>${order.total.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Progreso del stepper (Visual tracker) */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0 30px 0', position: 'relative', width: '100%', maxWidth: '500px' }}>
                        <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', height: '3px', background: '#e5e7eb', zIndex: 0 }} />
                        {['pending', 'processing', 'shipped', 'completed'].map((step, idx) => {
                          const steps = ['pending', 'processing', 'shipped', 'completed'];
                          const currentIdx = steps.indexOf(order.status);
                          const stepInfo = getOrderStatusInfo(step);
                          const isActive = idx <= currentIdx;
                          return (
                            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
                              <div style={{
                                width: '22px', height: '22px', borderRadius: '50%', background: isActive ? 'var(--primary)' : '#eaeaea',
                                border: isActive ? '3px solid #fef3c7' : '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s'
                              }} />
                              <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, opacity: isActive ? 1 : 0.5, marginTop: '6px' }}>{stepInfo.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Items del pedido */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212,175,55,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.02)' }}>
                            <div>
                              <div style={{ fontWeight: 700 }}>{item.product_name}</div>
                              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Talla: {item.size} | Cantidad: {item.quantity}</div>
                            </div>
                            <div style={{ fontWeight: 700, color: '#1a1a1a' }}>${(item.product_price * item.quantity).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>

                      {/* Datos de envío */}
                      <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f9fafb', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                        <MapPin size={18} style={{ color: 'var(--primary)', marginTop: '2px' }} />
                        <div>
                          <strong style={{ color: '#1a1a1a' }}>Envío: {order.shipping_name} (${order.shipping_price.toFixed(2)})</strong>
                          <div style={{ opacity: 0.7, marginTop: '2px' }}>Los productos serán despachados a la dirección registrada en tu cuenta.</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: SERVICIOS */}
          {activeTab === 'servicios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {services.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(0,0,0,0.01)', borderRadius: '16px', border: '1px dashed var(--surface-border)' }}>
                  <span style={{ fontSize: '3rem' }}>🛠️</span>
                  <h3 style={{ margin: '15px 0 5px 0', fontWeight: 700 }}>Sin solicitudes de reparación</h3>
                  <p style={{ opacity: 0.6, marginBottom: '20px' }}>¿Tienes calzado dañado? Devuélveles la vida en manos de nuestros maestros zapateros.</p>
                  <Link href="/reparaciones" className="btn-primary" style={{ display: 'inline-block', padding: '12px 24px', textDecoration: 'none' }}>
                    Solicitar Reparación
                  </Link>
                </div>
              ) : (
                services.map((service) => {
                  const statusInfo = getServiceStatusInfo(service.status);
                  const isExpanded = expandedOrders[`service-${service.id}`];

                  return (
                    <div key={service.id} className="glass-card" style={{ padding: '24px', transition: 'all 0.3s' }}>
                      {/* Cabecera de reparación */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1a1a1a' }}>Cotización REP-{service.id.toString().padStart(5, '0')}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px', background: statusInfo.bg, color: statusInfo.color, fontWeight: 700 }}>
                              {statusInfo.icon} {statusInfo.label}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', opacity: 0.7, marginTop: '6px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(service.created_at).toLocaleDateString('es-MX')}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Costo Estimado:</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>${service.total.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Progreso del stepper (Visual tracker) */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0 30px 0', position: 'relative', width: '100%', maxWidth: '600px' }}>
                        <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', height: '3px', background: '#e5e7eb', zIndex: 0 }} />
                        {['requested', 'received', 'inspecting', 'repairing', 'completed'].map((step, idx) => {
                          const steps = ['requested', 'received', 'inspecting', 'repairing', 'completed'];
                          const currentIdx = steps.indexOf(service.status);
                          const stepInfo = getServiceStatusInfo(step);
                          const isActive = idx <= currentIdx;
                          return (
                            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
                              <div style={{
                                width: '22px', height: '22px', borderRadius: '50%', background: isActive ? 'var(--primary)' : '#eaeaea',
                                border: isActive ? '3px solid #fef3c7' : '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s'
                              }} />
                              <span style={{ fontSize: '0.72rem', fontWeight: isActive ? 700 : 500, opacity: isActive ? 1 : 0.5, marginTop: '6px' }}>{stepInfo.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detalles del servicio */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        {service.items?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(212,175,55,0.03)', padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: 600 }}>🛠️ {item.service_name}</span>
                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${item.service_price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Instrucciones de entrega / Siguientes pasos */}
                      <div style={{ padding: '16px', background: '#f3f4f6', borderRadius: '12px', borderLeft: '4px solid var(--primary)', fontSize: '0.85rem' }}>
                        <h4 style={{ margin: '0 0 6px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>📍 Próximos pasos para restauración</h4>
                        <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5 }}>
                          Para continuar, adjunta tu número de referencia <b>REP-{service.id.toString().padStart(5, '0')}</b> a tus zapatos y llévalos o envíalos a nuestro taller artesanal en <i>Avenida del Zapatero #123, Colonia Centro, Veracruz.</i>
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
