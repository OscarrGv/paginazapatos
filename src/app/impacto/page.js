'use client';

import Link from 'next/link';
import { Heart, Globe, Users, TrendingUp, ShieldCheck, ChevronRight } from 'lucide-react';

export default function ImpactoSocial() {
  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--foreground)', color: 'white' }}>
      
      {/* Hero Section */}
      <section style={{
        minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px', textAlign: 'center', position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Cinematic Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img 
            src="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Artesanía Mexicana" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) sepia(0.3) hue-rotate(-10deg)' }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(10,10,10,1) 100%)' }} />
        </div>

        <div style={{ 
          maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', 
          position: 'relative', zIndex: 2
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 28px', borderRadius: '99px',
            background: 'rgba(0, 0, 0, 0.4)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', 
            border: '1px solid rgba(212,175,55,0.4)', letterSpacing: '3px', textTransform: 'uppercase', backdropFilter: 'blur(12px)'
          }}>
            <Heart size={14} /> Nuestro Compromiso
          </div>
          
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.1 }}>
            Cambiando vidas, <br/><span className="text-gradient">un par a la vez.</span>
          </h1>
          
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            En Calzado del Pueblo, no solo vendemos zapatos. Fomentamos el desarrollo económico de las comunidades artesanales en México, preservando nuestra riqueza cultural.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section style={{ padding: '80px 24px', background: 'var(--foreground)' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '80px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ background: 'rgba(212,175,55,0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Users size={30} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Comercio Directo</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                Trabajamos directamente con los artesanos, eliminando intermediarios que devalúan su trabajo. Esto garantiza que reciban un pago justo y digno por cada pieza que elaboran con sus manos.
              </p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ background: 'rgba(212,175,55,0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <ShieldCheck size={30} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Preservación Cultural</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                Las técnicas de tejido y tratamiento de piel se han transmitido de generación en generación. Al darles un mercado global, evitamos que estas tradiciones invaluables desaparezcan.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ background: 'rgba(212,175,55,0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <TrendingUp size={30} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Desarrollo Económico</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                Una porción de nuestros ingresos se destina a mejorar las herramientas y los talleres de nuestros artesanos afiliados, elevando su calidad de vida y capacidad de producción.
              </p>
            </div>
          </div>

          <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', padding: '60px 40px', textAlign: 'center', border: '1px solid rgba(212,175,55,0.3)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1595991209266-5e04278dc71f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80) center/cover', opacity: 0.15, zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Globe size={48} color="var(--primary)" style={{ margin: '0 auto 24px' }} />
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>Hecho en México, <br/>Para el Mundo</h2>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
                Cada huarache y bota lleva impregnada la esencia de Veracruz y de México. Apoya el talento local y viste con el orgullo de nuestras raíces.
              </p>
              <Link href="/productos" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px' }}>
                Comprar y Apoyar <ChevronRight size={18} />
              </Link>
            </div>
          </div>
          
        </div>
      </section>

    </div>
  );
}
