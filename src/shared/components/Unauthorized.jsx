import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Home } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="auth-page-pro">
      <div className="auth-container-pro">
        <div className="auth-brand-pro">
          <div className="auth-brand-content">
            <div className="auth-logo-pro">
              <Shield size={40} strokeWidth={2} />
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
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: '#fee2e2', borderRadius: '50%', marginBottom: '1rem' }}>
                <Shield size={40} color="#ef4444" />
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a', margin: '0 0 0.5rem 0' }}>
              403
            </h2>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a1a1a', margin: '0 0 0.75rem 0' }}>
              Acceso Denegado
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 2rem 0', lineHeight: '1.5' }}>
              No tienes permisos para acceder a esta página. 
              Si crees que esto es un error, contacta al administrador.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/" className="btn-submit-pro" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                <Home size={18} />
                Volver al Inicio
              </Link>
              <Link to="/login" className="auth-link-pro secondary" style={{ textDecoration: 'none' }}>
                <ArrowLeft size={16} />
                Ir al Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
