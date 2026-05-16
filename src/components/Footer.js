'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useTranslation } from '@/lib/translations';
import icono from '@/icono.png';

export default function Footer() {
  const { language } = useAppContext();
  const t = useTranslation(language);

  return (
    <footer style={{ background: 'var(--foreground)', color: 'white', paddingTop: '80px', paddingBottom: '40px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '60px' }}>
          
          <div>
            <Link href="/" className="logo text-glow" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', display: 'inline-block', marginBottom: '24px' }}>
              Calzado del <span className="text-gradient">Pueblo</span>
            </Link>
            <p style={{ opacity: 0.7, lineHeight: 1.6, marginBottom: '24px' }}>
              {t.footer.desc}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontWeight: 600 }}>
              <a href="#" style={{ color: 'var(--primary)', transition: 'all 0.2s' }} className="hover-scale">
                Instagram
              </a>
              <a href="#" style={{ color: 'var(--primary)', transition: 'all 0.2s' }} className="hover-scale">
                Facebook
              </a>
              <a href="#" style={{ color: 'var(--primary)', transition: 'all 0.2s' }} className="hover-scale">
                X (Twitter)
              </a>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--primary)' }}>{t.footer.quickLinks}</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link href="/" className="footer-link">{t.nav.home}</Link></li>
              <li><Link href="/productos" className="footer-link">{t.nav.products}</Link></li>
              <li><Link href="/reparaciones" className="footer-link">{t.nav.repairs}</Link></li>
              <li><Link href="/nosotros" className="footer-link">{t.nav.about}</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--primary)' }}>{t.footer.customerService}</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link href="#" className="footer-link">{t.footer.faq}</Link></li>
              <li><Link href="#" className="footer-link">{t.footer.shippingPolicy}</Link></li>
              <li><Link href="#" className="footer-link">{t.footer.returns}</Link></li>
              <li><Link href="#" className="footer-link">{t.footer.sizeGuide}</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--primary)' }}>{t.footer.contact}</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', opacity: 0.8 }}>
                <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ lineHeight: 1.4 }}>M.A. de Quevedo 2779 col. Formando Hogar, Veracruz, Mexico, 91897</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.8 }}>
                <Phone size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>+52 (55) 1234-5678</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.8 }}>
                <Mail size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>contacto@calzadodelpueblo.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', opacity: 0.8, fontSize: '0.9rem' }}>
          <p style={{ opacity: 0.8 }}>&copy; {new Date().getFullYear()} Calzado del Pueblo. {t.footer.rights}</p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="#" style={{ opacity: 0.8 }} className="hover-scale">{t.footer.privacy}</Link>
            <Link href="#" style={{ opacity: 0.8 }} className="hover-scale">{t.footer.terms}</Link>
            <a
              href="https://github.com/OscarrGv/paginazapatos"
              target="_blank"
              rel="noopener noreferrer"
              title="Ver repositorio en GitHub"
              className="hover-scale"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212,175,55,0.3)',
                transition: 'all 0.2s ease',
                marginLeft: '4px'
              }}
            >
              <Image
                src={icono}
                alt="Repositorio de GitHub"
                width={20}
                height={20}
                style={{ objectFit: 'contain' }}
              />
            </a>
            <div style={{ display: 'flex', gap: '8px', marginLeft: '12px', paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.3)', opacity: 0.8 }}>
              <span>💳 Visa</span>
              <span>• Mastercard</span>
              <span>• Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer-link {
          opacity: 0.7;
          transition: all 0.2s;
          display: inline-block;
        }
        .footer-link:hover {
          opacity: 1;
          color: var(--primary);
          transform: translateX(5px);
        }
        .hover-scale:hover {
          transform: scale(1.1);
        }
      `}</style>
    </footer>
  );
}
