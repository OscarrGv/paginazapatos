'use client';

import Link from 'next/link';
import { Users, GraduationCap, Target, ChevronRight, HandMetal, Globe } from 'lucide-react';

export default function Nosotros() {
  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--foreground)', color: 'white' }}>
      
      {/* Hero Section */}
      <section style={{
        minHeight: '70vh', display: 'flex', alignItems: 'center',
        padding: '120px 5%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--foreground) 0%, #0a0a0a 100%)'
      }}>
        {/* Subtle decorative grid/glow */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px', width: '100%', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          <div className="animate-slide-right" style={{ flex: '1 1 500px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 28px', borderRadius: '99px',
              background: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', 
              border: '1px solid rgba(212,175,55,0.4)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px'
            }}>
              <Users size={14} /> Sobre Nosotros
            </div>
            
            <h1 style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px' }}>
              El lado <br/><span className="text-gradient">Humano</span> del Diseño.
            </h1>
            
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '500px' }}>
              Somos estudiantes con la visión de llevar el calzado artesanal mexicano hacia nuevos horizontes, dándole el valor y reconocimiento que realmente merece en el mercado global.
            </p>
          </div>

          <div className="animate-slide-left" style={{ flex: '1 1 400px', position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '110%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
              <img 
                src="/huarache-clasico.png" 
                alt="Calzado Artesanal" 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.2) contrast(1.1)' }} 
              />
              <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(212,175,55,0.3)', borderRadius: '24px', transform: 'scale(0.95)' }} />
            </div>
            <div className="animate-bounce-slow" style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--surface-border)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>ITV</div>
              <div style={{ fontSize: '0.9rem', color: '#aaa', fontWeight: 600 }}>Tecnológico de Veracruz</div>
            </div>
          </div>
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
                  src="https://images.unsplash.com/photo-1595991209266-5e04278dc71f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Manos artesanas" 
                  style={{ width: '100%', height: 'auto', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', filter: 'sepia(0.2) contrast(1.1)' }}
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
