'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Shield, ShoppingBag, Wrench, Calendar, Mail, TrendingUp, Search, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('compras'); // 'compras' o 'servicios'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [actionMessage, setActionMessage] = useState(null);

  // Verificar si es administrador
  const email = user?.email?.toLowerCase() || '';
  const isAdmin = email.includes('admin') || email === 'oscar@calzadodelpueblo.com';

  useEffect(() => {
    if (user && isAdmin) {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [ordersRes, servicesRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/services')
      ]);

      const ordersData = await ordersRes.json();
      const servicesData = await servicesRes.json();

      if (ordersData.success) setOrders(ordersData.orders || []);
      if (servicesData.success) setServices(servicesData.services || []);
    } catch (err) {
      console.error('Error loading admin statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        triggerToast(`Orden CP-${orderId.toString().padStart(5, '0')} actualizada a '${newStatus}'`);
      } else {
        alert(data.error || 'Error al actualizar orden');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  const handleUpdateServiceStatus = async (serviceId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: newStatus } : s));
        triggerToast(`Servicio REP-${serviceId.toString().padStart(5, '0')} actualizado a '${newStatus}'`);
      } else {
        alert(data.error || 'Error al actualizar servicio');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  const triggerToast = (msg) => {
    setActionMessage(msg);
    setTimeout(() => {
      setActionMessage(null);
    }, 4000);
  };

  // Cálculo de estadísticas básicas
  const totalSales = orders.reduce((sum, o) => sum + (o.status === 'completed' || o.status === 'shipped' || o.status === 'processing' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'completed').length;
  const activeServicesCount = services.filter(s => s.status !== 'completed').length;

  // Filtrado de búsquedas
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.user_email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          `cp-${o.id}`.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredServices = services.filter(s => {
    const matchesSearch = s.user_email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          `rep-${s.id}`.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!user || !isAdmin) {
    return (
      <div className="container" style={{ padding: '120px 24px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ background: '#fef2f2', padding: '40px', borderRadius: '24px', border: '1px solid #fee2e2', maxWidth: '480px' }}>
          <Shield size={60} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', margin: '0 0 10px 0' }}>Acceso Restringido</h2>
          <p style={{ opacity: 0.8, marginBottom: '30px', fontSize: '1.05rem', lineHeight: '1.6', color: '#7f1d1d' }}>
            Esta sección es de uso exclusivo para los administradores y gestores de Calzado del Pueblo.
          </p>
          <Link href="/" className="btn-primary" style={{ display: 'inline-block', padding: '12px 24px', textDecoration: 'none' }}>
            Volver a la Página Principal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in-up" style={{ padding: '100px 24px', minHeight: '95vh' }}>
      
      {/* Toast Alert */}
      {actionMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', background: '#1e293b', color: '#fff',
          padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 1000, animation: 'slideIn 0.3s ease-out'
        }}>
          <CheckCircle size={20} color="#22c55e" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{actionMessage}</span>
        </div>
      )}

      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🛡️</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>Panel de Control Administrador</h1>
          </div>
          <p style={{ opacity: 0.7, margin: '6px 0 0 0', fontSize: '1.1rem' }}>Gestión centralizada de compras y pedidos de restauración artesanal.</p>
        </div>
        <button onClick={loadAdminData} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
          <RefreshCw size={16} /> Recargar Datos
        </button>
      </div>

      {/* Tarjetas de Métricas Premium */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #22c55e' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>Ventas Totales (Aprobadas)</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={24} /> ${totalSales.toFixed(2)}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>Pedidos de Calzado Activos</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3b82f6', marginTop: '8px' }}>
            {activeOrdersCount}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #eab308' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>Taller de Reparación Activos</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#eab308', marginTop: '8px' }}>
            {activeServicesCount}
          </div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div style={{ background: '#f8fafc', border: '1px solid var(--surface-border)', padding: '16px 20px', borderRadius: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Buscar por referencia (ej: cp-1, rep-1) o correo de cliente..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid var(--surface-border)', borderRadius: '10px', background: '#fff', outline: 'none' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Filtrar Estado:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 16px', border: '1px solid var(--surface-border)', borderRadius: '10px', background: '#fff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="todos">Todos los Estados</option>
            {activeTab === 'compras' ? (
              <>
                <option value="pending">Pendiente</option>
                <option value="processing">En Proceso</option>
                <option value="shipped">Enviado</option>
                <option value="completed">Entregado</option>
              </>
            ) : (
              <>
                <option value="requested">Registrado</option>
                <option value="received">Recibido en Taller</option>
                <option value="inspecting">En Diagnóstico</option>
                <option value="repairing">En Reparación</option>
                <option value="completed">Terminado</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Tabs Selectoras */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--surface-border)', gap: '20px', marginBottom: '30px' }}>
        <button 
          onClick={() => { setActiveTab('compras'); setStatusFilter('todos'); }}
          style={{
            background: 'none', border: 'none', borderBottom: activeTab === 'compras' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'compras' ? 'var(--primary)' : 'var(--foreground)',
            padding: '12px 16px', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s', opacity: activeTab === 'compras' ? 1 : 0.6
          }}
        >
          <ShoppingBag size={20} /> Pedidos de Productos ({filteredOrders.length})
        </button>
        <button 
          onClick={() => { setActiveTab('servicios'); setStatusFilter('todos'); }}
          style={{
            background: 'none', border: 'none', borderBottom: activeTab === 'servicios' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'servicios' ? 'var(--primary)' : 'var(--foreground)',
            padding: '12px 16px', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s', opacity: activeTab === 'servicios' ? 1 : 0.6
          }}
        >
          <Wrench size={20} /> Solicitudes de Taller ({filteredServices.length})
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
              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>No se encontraron órdenes que coincidan con la búsqueda.</div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>CP-{order.id.toString().padStart(5, '0')}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: '#e2e8f0', fontWeight: 700 }}>
                          📅 {new Date(order.created_at).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                      
                      {/* Cliente info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: 0.8, marginTop: '8px' }}>
                        <Mail size={14} /> {order.user_email}
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.02)', padding: '6px 10px', borderRadius: '6px', width: 'fit-content' }}>
                            • <b>{item.product_name}</b> (Talla {item.size}) x{item.quantity} - <span style={{ opacity: 0.7 }}>${item.product_price}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '10px' }}>
                        Método: {order.shipping_name} | Pago: {order.payment_method === 'card' ? '💳 Tarjeta' : order.payment_method === 'paypal' ? '🅿️ Paypal' : '🏦 OXXO/SPEI'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '180px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Total del Pedido:</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${order.total.toFixed(2)}</div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px', opacity: 0.7 }}>Cambiar Estado:</label>
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          style={{
                            padding: '8px 12px', border: '1px solid var(--surface-border)', borderRadius: '8px', background: '#fff',
                            fontWeight: 700, cursor: 'pointer', outline: 'none',
                            color: order.status === 'completed' ? '#16a34a' : order.status === 'shipped' ? '#9333ea' : order.status === 'processing' ? '#2563eb' : '#ca8a04'
                          }}
                        >
                          <option value="pending">🟡 Pendiente</option>
                          <option value="processing">🔵 En Proceso</option>
                          <option value="shipped">🟣 Enviado</option>
                          <option value="completed">🟢 Entregado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SERVICIOS */}
          {activeTab === 'servicios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredServices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>No se encontraron cotizaciones de restauración.</div>
              ) : (
                filteredServices.map(service => (
                  <div key={service.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>REP-{service.id.toString().padStart(5, '0')}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: '#e2e8f0', fontWeight: 700 }}>
                          📅 {new Date(service.created_at).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                      
                      {/* Cliente info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: 0.8, marginTop: '8px' }}>
                        <Mail size={14} /> {service.user_email}
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                        {service.items?.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.02)', padding: '6px 10px', borderRadius: '6px', width: 'fit-content' }}>
                            🛠️ <b>{item.service_name}</b> - <span style={{ opacity: 0.7 }}>Estimado: ${item.service_price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '180px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Total Estimado:</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${service.total.toFixed(2)}</div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px', opacity: 0.7 }}>Cambiar Estado:</label>
                        <select 
                          value={service.status}
                          onChange={(e) => handleUpdateServiceStatus(service.id, e.target.value)}
                          style={{
                            padding: '8px 12px', border: '1px solid var(--surface-border)', borderRadius: '8px', background: '#fff',
                            fontWeight: 700, cursor: 'pointer', outline: 'none',
                            color: service.status === 'completed' ? '#16a34a' : service.status === 'repairing' ? '#9333ea' : service.status === 'inspecting' ? '#ea580c' : service.status === 'received' ? '#2563eb' : '#ca8a04'
                          }}
                        >
                          <option value="requested">🟡 Registrado</option>
                          <option value="received">🔵 Recibido en Taller</option>
                          <option value="inspecting">🟠 En Diagnóstico</option>
                          <option value="repairing">🟣 En Reparación</option>
                          <option value="completed">🟢 Terminado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
