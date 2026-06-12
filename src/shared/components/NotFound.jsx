import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1>Página no encontrada</h1>
        <p>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            <Home size={18} />
            Volver al inicio
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft size={18} />
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}
