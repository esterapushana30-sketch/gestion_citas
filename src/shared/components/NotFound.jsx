import { Link } from "react-router-dom";
import { Home, ArrowLeft, Heart, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="auth-page-pro">
      <div className="auth-container-pro">
        <div className="auth-brand-pro">
          <div className="auth-brand-content">
            <div className="auth-logo-pro">
              <Heart size={40} strokeWidth={2} />
            </div>
            <h1 className="auth-brand-title">SENA Bienestar</h1>
            <p className="auth-brand-subtitle">
              Sistema de Gestión de Citas
            </p>
          </div>
        </div>

        <div className="auth-form-side-pro">
          <div className="auth-card-pro" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--sena-green) 0%, #2d8a00 100%)', borderRadius: '50%', marginBottom: '1rem' }}>
                <Search size={40} color="white" />
              </div>
            </div>

            <h2 style={{ fontSize: '4rem', fontWeight: '800', color: 'var(--sena-green)', margin: '0 0 0.5rem 0', lineHeight: '1' }}>
              404
            </h2>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a1a1a', margin: '0 0 0.75rem 0' }}>
              Página no encontrada
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 2rem 0', lineHeight: '1.5' }}>
              Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/" className="btn-submit-pro" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                <Home size={18} />
                Volver al Inicio
              </Link>
              <button 
                onClick={() => window.history.back()} 
                className="auth-link-pro secondary" 
                style={{ textDecoration: 'none', cursor: 'pointer', border: '2px solid #e5e7eb', background: 'white' }}
              >
                <ArrowLeft size={16} />
                Volver Atrás
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
