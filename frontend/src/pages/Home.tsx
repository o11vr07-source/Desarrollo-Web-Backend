import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">
          Sistema de Ventas e Inventario
        </h1>

        <p className="lead text-muted">
          Controla productos, ventas, clientes e inventario en un solo lugar.
        </p>

        <Link
          to="/login"
          className="btn btn-primary btn-lg mt-3"
        >
          Iniciar Sesión
        </Link>
      </div>


      <div className="row text-center">

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5>Inventario</h5>
              <p className="text-muted">
                Control de stock en tiempo real.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5>Ventas</h5>
              <p className="text-muted">
                Gestión de ventas online y offline.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5>Clientes</h5>
              <p className="text-muted">
                Administración de clientes y cuentas.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}