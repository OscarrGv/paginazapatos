'use client';

import Link from 'next/link';
import { Users, GraduationCap, Target, ChevronRight, HandMetal, Globe } from 'lucide-react';

export default function Nosotros() {
  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--foreground)', color: 'white' }}>
      
      {/* Hero Section */}
      <section style={{
        minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px', position: 'relative', overflow: 'hidden',
        backgroundImage: 'url(/itver.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
      }}>
        {/* Dark overlay for readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(10,10,10,1) 100%)' }} />
        
        <div className="animate-slide-right" style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            maxWidth: '900px', position: 'relative', zIndex: 2,
            background: 'rgba(20, 20, 20, 0.4)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            padding: '60px 40px', borderRadius: '32px', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
        }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 28px', borderRadius: '99px',
              background: 'rgba(212, 175, 55, 0.2)', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', 
              border: '1px solid rgba(212,175,55,0.5)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '32px'
            }}>
              <Users size={16} /> Orgullo ITVER
            </div>
            
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              El lado <span className="text-gradient">Humano</span><br/> del Diseño.
            </h1>
            
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, maxWidth: '700px', fontWeight: 500, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Somos estudiantes del Tecnológico de Veracruz con la visión de llevar el calzado artesanal mexicano hacia nuevos horizontes, dándole el valor y reconocimiento que realmente merece en el mercado global.
            </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section style={{ padding: '80px 24px', background: 'var(--foreground)' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            {/* Quiénes somos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={20} /> Origen y Misión
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>Nuestra Historia</h2>
                <p style={{ fontSize: '1.1rem', color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
                  Somos un equipo de <strong>alumnos del Tecnológico de Veracruz</strong>. A lo largo de nuestro desarrollo profesional, hemos observado con detenimiento un problema latente en nuestra cultura: mucho del increíble trabajo de los artesanos de calzado mexicano es mal aprovechado, mal pagado o carece de las plataformas adecuadas para destacar.
                </p>
                <p style={{ fontSize: '1.1rem', color: '#ccc', lineHeight: 1.8 }}>
                  Nacimos de la inquietud de cambiar esta realidad. Queremos ser el puente entre las manos que crean obras de arte y un público que valora la calidad, la autenticidad y el comercio justo.
                </p>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)', zIndex: 0 }} />
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)', textAlign: 'center' }}>
                  <img src="/itv-logo.png" alt="Instituto Tecnológico de Veracruz" style={{ width: '120px', marginBottom: '24px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--primary)', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '16px' }}>
                    Equipo de Desarrollo
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                    {['Angelo Emmanuel Flores Montes', 'Oscar Gomez Vazquez', 'Esteban Santos Angulo', 'Arath Daniel Noriega Domínguez', 'Enrique Vega Mayer'].map((name, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 500 }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)' }} />

            {/* Qué buscamos impulsar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
              <div style={{ order: 2 }}>
                <div style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={20} /> Visión
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>¿Qué Buscamos Impulsar?</h2>
                <p style={{ fontSize: '1.1rem', color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
                  Nuestro propósito es <strong>introducir la artesanía mexicana al mercado global</strong>. Queremos darle una identidad sólida y premium a estos productos para que no sean vistos simplemente como mercancía, sino como piezas de diseño que reflejan nuestras raíces.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ background: 'rgba(212,175,55,0.1)', padding: '12px', borderRadius: '12px' }}><HandMetal size={24} color="var(--primary)" /></div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Comercio Justo</h4>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.5 }}>Asegurar que el artesano reciba el valor real de su trabajo, eliminando intermediarios abusivos y fomentando el crecimiento local.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ background: 'rgba(212,175,55,0.1)', padding: '12px', borderRadius: '12px' }}><Globe size={24} color="var(--primary)" /></div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Competitividad Global</h4>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.5 }}>Vender a un precio competitivo ofreciendo servicios integrales, como el mantenimiento y reparación para extender la vida útil de cada par.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ order: 1 }}>
                 <img 
                  src="/artesana-pintando.jpg" 
                  alt="Artesana pintando pieza de madera" 
                  style={{ width: '100%', height: 'auto', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                 />
              </div>
            </div>

          </div>
          
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <Link href="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px' }}>
              Volver al Inicio <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
