import { useAuth } from "../auth/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCarrito();

  return (
    <nav className="navbar navbar-dark bg-dark px-3">

      <span className="navbar-brand">
        Sistema de Ventas
      </span>

      <div className="text-white">

        <span className="me-3">
          {user?.username}
        </span>

        <span className="me-3">
          {user?.rol}
        </span>
        <button
          className="btn btn-danger btn-sm"
          onClick={logout}
        >
          Cerrar Sesión
        </button>
        <button>
          <Link to="/carrito" className="btn btn-outline-light position-relative">
            🛒 Carrito
            {totalItems > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="btn btn-outline-light ms-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#miniCarrito"
          >
            🛒
          </button>
        </button>
      </div>

    </nav>
  );
}